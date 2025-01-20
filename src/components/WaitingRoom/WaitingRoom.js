// node modules
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Modal } from 'antd';
import { Flash } from 'react-ruffle';
import bcurl from 'bcurl';
import { 
	TX, 
	Script, 
	KeyRing,
	Coin
} from '@hansekontor/checkout-components';
import { U64 } from 'n64';

// react components
import { WalletContext } from '@utils/context';
import Header from '@components/Common/Header';
import { FooterCtn, SupportBar } from '@components/Common/Footer';
import RandomNumbers from '@components/Common/RandomNumbers';
import PrimaryButton from '@components/Common/PrimaryButton';
import { getWalletState } from '@utils/cashMethods'
import { successNotification } from '@components/Common/Notifications';
import { schrodingerOutscript, readTicketAuthCode, calculatePayout } from '@utils/ticket';
import TXUtil from '@utils/txutil';
import useBCH from '@hooks/useBCH';
import useWallet from '@hooks/useWallet';


// util
import animationLabels from '@utils/animations';

// assets
import LockerPng from '@assets/locker.png';

// styled css components 
const Background = styled.img`
    position: absolute;
    top: 0;
    margin-left: auto;
    margin-right: auto;
    height: 85vh;
    z-index: -4;
    object-fit: cover;
`;
const FlexGrow = styled.div`
    flex-grow: 1;
    display: flex; 
    flex-direction: column;
    justify-content: flex-end;
`;

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const lottoApiClient = bcurl.client({
    url: "https://lsbx.nmrai.com",
    timeout: 20000
});

const WaitingRoom = ({
    passLoadingStatus, 
	playerNumbers
}) => {

    const history = useHistory();
	const location = useLocation();
    const ContextValue = useContext(WalletContext);
    const { 
		wallet, 
		addMinedTicketToStorage, 
		addRedeemTxToStorage
	} = ContextValue;
    const walletState = getWalletState(wallet)
    const { tickets, slpBalancesAndUtxos } = walletState;
	// otherwise the indicator is showing the number of unconfirmed issuetx, this is an exception, showing only redeemable tx
    const unredeemedIndicator = tickets.filter(ticket => ticket.issueTx.height > 0 && !ticket.redeemTx).length;

    // states
	console.log("state from location", location.state);
	const [activeTicket, setActiveTicket ] = useState(location.state?.ticketToRedeem || false);
	const [isRedeemed, setIsRedeemed] = useState(false);
	const [hasRequested, setHasRequested] = useState(false);
	const [apiError, setApiError] = useState(false);
	const [modal, modalHolder] = Modal.useModal();
	const [isAlternativeTicket, setIsAlternativeTicket] = useState(false);

	const { broadcastTx } = useBCH();

	useEffect(async () => {
		if (apiError) {
			passLoadingStatus("AN ERROR OCCURRED");
			await sleep(3000);
			history.push("/wallet");
		}
	}, [apiError])

	// if active ticket is set: redeem ticket
	useEffect(async () => {
		console.log("activeTicket", activeTicket);
		if (activeTicket)  {
			console.log("activeTicket true", activeTicket.issueTx.hash);
			passLoadingStatus(false);

			let minedTicket = activeTicket.details.minedTicket;
			console.log("minedTicket pre", minedTicket);
			if (!minedTicket) {
				// const minedTicket = await lottoApiClient.get(`v1/ticket/${activeTicket.issueTx.id}`);
				const ticketRes = await fetch(`https://lsbx.nmrai.com/v1/ticket/${activeTicket.issueTx.hash}`, {
					method: "GET", 
					headers: new Headers({
						'Accept': "application/json",
						'Content-Type': "application/json"}),
					mode: "cors",
					signal: AbortSignal.timeout(20000),
				});
				if (ticketRes.status !== 200) 
					setApiError(true);
				minedTicket = await ticketRes.json();		
				setHasRequested(true);
				// if signed, store before attempting redeem tx
				if (minedTicket.lottoSignature)
					await addMinedTicketToStorage(activeTicket.issueTx.hash, minedTicket);
			}
			console.log("mined ticket post", minedTicket);

			if (minedTicket.lottoSignature) {
				// make it a function	
			
				const ttx = TX.fromRaw(minedTicket.hex, 'hex');

				// Stamp comes from Authorizer address 
				const authPubkey = ttx.inputs[0].script.getData(1);
		
				// Shrodinger
				const outScript = schrodingerOutscript(authPubkey);
				
				// Build payout tx
				const ptx = new TXUtil();
		
				// Add ticket input
				const pcoin = Coin.fromTX(ttx, 1, -1);
				ptx.addCoin(pcoin);
		
				// Add outputs from ttx OP_RETURN
				const ttxOpreturnAuthBuf = ttx.outputs[0].script.code[1].data;
				const parsedticketAuthCode = readTicketAuthCode(ttxOpreturnAuthBuf);
		
				// We also need the block header and block auth sig
				const blockAuthSig = Buffer.from(minedTicket.lottoSignature, 'hex')
		
				// todo: put this somewhere else
				const playerWinningsTier = [
					{ threshold: 0, multiplier: 16},
					{ threshold: 4, multiplier: 8},
					{ threshold: 6, multiplier: 4},
					{ threshold: 11, multiplier: 2},
					{ threshold: 35, multiplier: 1},
				];

				const maxPayout = parsedticketAuthCode.txOutputs[0].script.toRaw().slice(-8)
				const { actualPayoutBE, tier, opponentNumbers, resultingNumbers } = calculatePayout(
					ttx.hash(), 
					Buffer.from(minedTicket.block, 'hex').reverse(), 
					parsedticketAuthCode.minterNumbers, 
					maxPayout, 
					playerWinningsTier.map(obj => obj.threshold)
				);
		
				console.log("actualPayout", actualPayoutBE);
				console.log('actualPayoutNum', U64.fromBE(actualPayoutBE).toNumber())
		
				// Set the actual payout
				parsedticketAuthCode.txOutputs[0].script = Script.fromRaw(Buffer.concat([
					parsedticketAuthCode.txOutputs[0].script.toRaw().slice(0, -8),
					actualPayoutBE
				]))
				
				ptx.outputs = parsedticketAuthCode.txOutputs
		
				// Do signature
				const sigHashType = Script.hashType.ALL | Script.hashType.SIGHASH_FORKID;
				const flags = Script.flags.STANDARD_VERIFY_FLAGS;
				const playerKeyring = KeyRing.fromSecret(wallet.Path1899.fundingWif);
				ptx.template(playerKeyring); // prepares the template
				const sig = ptx.signature(0, outScript, pcoin.value, playerKeyring.privateKey, sigHashType, flags);
				const preimage = ptx.getPreimage(0, outScript, pcoin.value, sigHashType, false);
				// console.log('preimage length: ', Buffer.from(preimage.toString('hex'), 'hex').length)
		
				const items = [
					sig,
					playerKeyring.getPublicKey(),
					blockAuthSig, // block auth signature
					Buffer.from(preimage.toString('hex'), 'hex'),
					Buffer.from(minedTicket.header, 'hex'),
					ttx.toRaw(),
					outScript.toRaw()
				];
				ptx.inputs[0].script.fromItems(items);
				// console.log("sigScript length", ptx.inputs[0].script.toRaw().length)
		
				console.log(ptx)
				const ptxHex = ptx.toRaw().toString('hex')
				// console.log(ptxHex)
		
				console.log('verify', ptx.verify())
		
				try {
					const ptxBroadcast = await broadcastTx(ptxHex)
					console.log('ptxBroadcast', ptxBroadcast)					

					if (ptxBroadcast.success) {
						console.log('ptx id', ptx.txid())

						const redeemData = {
							actualPayoutNum: U64.fromBE(actualPayoutBE).toNumber(),
							tier, 
							opponentNumbers,
							resultingNumbers
						}
						await addRedeemTxToStorage(ptx, redeemData);

						successNotification("You can redeem your ticket now!")
						setIsRedeemed(ptx.txid());
					} else {
						// todo: try again
						passLoadingStatus("API ERROR. TRY AGAIN");
						await sleep(3000);
						history.push("/wallet");			
					}
				} catch(err) {
					console.error(err);
					passLoadingStatus("FAILED TO BROADCAST");
					await sleep(3000);
					history.push("/select");
				}

			} else {
				modal.info(requestFailedInfoConfig);
				setActiveTicket(false);
			}
		} 
	}, [activeTicket])

	// handle case when user arrives here after payment 
	useEffect(async () => {
		await sleep(2000);
		if (!activeTicket && !hasRequested) {
			passLoadingStatus(false);
			modal.info(waitingInfoConfig);

			// if (unredeemedIndicator > 0) {
			// 	const unredeemedTicket = tickets.filter(ticket => ticket.issueTx.height > 0 && !ticket.redeemTx);
			// 	setActiveTicket(unredeemedTicket); 
			// 	setIsAlternativeTicket(true);
			// }
		}
	}, [activeTicket])

    // variables in DOM
	const waitingTime = `Broadcast Time: ${new Date().toLocaleDateString()}, Estimated Wait: 10 minutes `;
    const waitingInfoConfig = {
        content: <div>
					<p>Your ticket has been broadcast. Your ticket may be redeemed after its block is finalized.</p>
					<p>{waitingTime}</p>
					<p>You will be notified	via email.</p>
				</div>,
		key: 0
    }
	const requestFailedText = "Your ticket has not been broadcasted yet. Please try again later. Average time between blocks is 10 minutes."
	const requestFailedInfoConfig = {
        content: <p>{requestFailedText}</p>,
		key: 1
    }


    const animationName = animationLabels.CLUX.IDLE.SHADOWBOX;
    const animationPath = animationLabels.PUBLICPATH + animationName;
	
	const redeemButtonText = isAlternativeTicket ? "Redeem Previous Ticket" : "Redeem Ticket";

    // handlers
    const handleButtonClick = async () => {

		if (activeTicket && !apiError) {
			if (isRedeemed) {
				passLoadingStatus("LOADING GAME");
				// todo: only push forward if updated ticket from storage is available
				const redeemHash = isRedeemed;
				history.push({
					pathname: '/game',
					state: { redeemHash: redeemHash }
				});						
			} else {

			}
		} else {
			history.push('/select');
		}
    };

    return (
        <>  
			{modalHolder}
            <Background src={LockerPng} />
            <Header />
            <FlexGrow>
                <Flash                
                    src={animationPath}
                    config={{
                        autoplay: "on",
                        unmuteOverlay: "hidden",
                        splashScreen: false,
                        contextMenu: "off",
                        allowScriptAccess: true,
                        scale: "exactFit",
                        wmode: "transparent",
                        preferredRenderer: "canvas"                                      
                    }}
                    id={animationName}
                >
                        <div></div>
                </Flash>                    
            </FlexGrow>
			<FooterCtn>
				<RandomNumbers fixedRandomNumbers={activeTicket ? activeTicket.details.playerNumbers : playerNumbers} />
				<PrimaryButton onClick={handleButtonClick}>
					{activeTicket ? (
						<>	
							{isRedeemed ? redeemButtonText : "Wait..."}							
						</>
					) : (
						<> 
							{"Back To Home"}	
						</>
					)}
				</PrimaryButton>  
				<SupportBar ticketIndicator={unredeemedIndicator} slpBalances={slpBalancesAndUtxos}/>
			</FooterCtn>
        </>

    )
}

export default WaitingRoom;
