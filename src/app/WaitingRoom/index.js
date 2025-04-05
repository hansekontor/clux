// node modules
import React, { useState, useEffect } from 'react';
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
import Header from '@components/Header';
import Footer, { SupportBar } from '@components/Footer';
import PlayerNumbers from '@components/PlayerNumbers';
import Button from '@components/Button';

import * as S from './components/Styled';

// core functions
import { useWalletGlobal } from '@core/context/WalletGlobal';
import useBCH from '@core/hooks/useBCH';
import { getWalletState } from '@core/utils/cashMethods'
import TXUtil from '@core/utils/txutil';
import { schrodingerOutscript, readTicketAuthCode, calculatePayout } from '@core/utils/ticket';
import sleep from '@core/utils/sleep';
import { useNotifications } from '@core/context/Notifications';

// util
import animationLabels from '@utils/animations';

// assets
import LockerPng from '@assets/images/locker.png';

const WaitingRoom = ({
    passLoadingStatus, 
	playerNumbers,
	user
}) => {

    const history = useHistory();
	const location = useLocation();
	const notify = useNotifications();

    const { 
		wallet, 
		addMinedTicketToStorage, 
		addRedeemTxToStorage
	} = useWalletGlobal();

    const walletState = getWalletState(wallet)
    const { tickets, slpBalancesAndUtxos } = walletState;
	// otherwise the indicator is showing the number of unconfirmed issuetx, this is an exception, showing only redeemable tx
    const unredeemedIndicator = tickets.filter(ticket => ticket.issueTx.height > 0 && !ticket.redeemTx).length;

    // states
	const [activeTicket, setActiveTicket ] = useState(location.state?.ticketToRedeem || false);
	const [hasRequested, setHasRequested] = useState(false);
	const [apiError, setApiError] = useState(false);
	const [modal, modalHolder] = Modal.useModal();
	const [isAlternativeTicket, setIsAlternativeTicket] = useState(false);
	const [isRedeemable, setIsRedeemable] = useState(false);

	const { 
		broadcastTx, 
		getTxBcash 
	} = useBCH();

	useEffect(async () => {
		if (apiError) {
			passLoadingStatus("AN ERROR OCCURRED");
			await sleep(3000);
			history.push("/wallet");
		}
	}, [apiError])

	// check if ticket is redeemable and if not check again until it is
	useEffect(async () => {
		const issueHashFromCheckout = location.state?.issueHash;
		if (activeTicket) {
			console.log("activeTicket", activeTicket);
			passLoadingStatus(false);

			const lottoSig = activeTicket.details?.minedTicket?.lottoSignature;

			if (lottoSig) {
				console.log("lottoSig already available", lottoSig);
				setIsRedeemable(true);
			} else if (activeTicket.issueTx.height > -1) {
				console.log("ticket is already broadcast!")
				setIsRedeemable(true);
			} else {
				// check if ticket has been mined
				const issueTxFromNode = await getTxBcash(activeTicket.issueTx.hash);
				console.log("issueTxFromNode", issueTxFromNode);
				let isMined = issueTxFromNode.height > -1;		
				passLoadingStatus(false);

				if (isMined) {
					setIsRedeemable(true);
				} else {
					const timeBetweenPolling = 2*60*1000;
					
					// poll indexer every 2 min
					while(!isMined) {
						console.log("started waiting time");
						await sleep(timeBetweenPolling);
						const issueTxFromNode = await getTxBcash(activeTicket.issueTx.hash);
						console.log("issueTxFromNode", issueTxFromNode);
						isMined = issueTxFromNode.height > -1;	
						console.log("isMined", isMined);
						if (!isMined) {
							notify({message: "Please wait...", type: "info"});
						} else {
							notify({message: "You can redeem your ticket now!", type: "success"});
							setIsRedeemable(true);	
						}
					} 
				}
			}
		} else if (issueHashFromCheckout) {
			console.log("try finding checkout ticket", issueHashFromCheckout);
			console.log("search in", tickets);
			const ticketFromCheckout = tickets.find(ticket => ticket.issueTx.hash === issueHashFromCheckout);
			console.log("checkout ticket", ticketFromCheckout);
			if (ticketFromCheckout) {
				// let user know that they will have to wait
				modal.info(waitingInfoConfig);
				setActiveTicket(ticketFromCheckout);
			} else {
				history.push("/select");
			}
		}
	}, [activeTicket]);

	// get signature for redeemable ticket
	useEffect(async () => {
		console.log("isRedeemable?", isRedeemable);
		if (isRedeemable) {
			const minedTicket = await getMinedTicket(activeTicket.issueTx.hash);
			console.log("minedTicket from backend", minedTicket);
			await addMinedTicketToStorage(activeTicket.issueTx.hash, minedTicket);
			console.log("mined ticket post", minedTicket);

			let newActiveTicket = activeTicket;
			newActiveTicket.details.minedTicket = minedTicket;
			setActiveTicket(newActiveTicket);							
		}
	}, [isRedeemable]);

	const getMinedTicket = async (hash) => {
		const ticketRes = await fetch(`https://lsbx.nmrai.com/v1/ticket/${hash}`, {
			method: "GET", 
			headers: new Headers({
				'Accept': "application/json",
				'Content-Type': "application/json"}),
			mode: "cors",
			signal: AbortSignal.timeout(20000),
		});
		if (ticketRes.status !== 200) 
			setApiError(true);
		const minedTicket = await ticketRes.json();		
		setHasRequested(true);
		return minedTicket;
	}

	const redeemTicket = async (minedTicket) => {
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

				const redeemHash = ptx.txid();

				return redeemHash;
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
	}

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
		if (activeTicket.details?.minedTicket?.lottoSignature) {
			passLoadingStatus("REDEEMING TICKET");
			const redeemHash = await redeemTicket(activeTicket.details?.minedTicket);
			await sleep(1000);
			history.push({
				pathname: '/game',
				state: { redeemHash }
			});
		} else {
			if (user.kyc_token === null) {
				history.push({
					pathname: '/select',
					state: { repeatOnboarding: true }
				});
			} else {
				history.push("/select");
			}
		}
    };

    return (
        <>  
			{modalHolder}
            <S.Background src={LockerPng} />
            <Header $transparent={true} />
            <S.FlexGrow>
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
            </S.FlexGrow>
			<Footer variant="empty">
				<PlayerNumbers fixedRandomNumbers={activeTicket ? activeTicket.details.playerNumbers : playerNumbers} />
				<Button onClick={handleButtonClick}>
					{activeTicket ? (
						<>	
							{activeTicket.details?.minedTicket?.lottoSignature ? redeemButtonText : "Wait..."}							
						</>
					) : (
						<> 
							{"Back To Home"}	
						</>
					)}
				</Button>  
				<SupportBar ticketIndicator={unredeemedIndicator} slpBalances={slpBalancesAndUtxos}/>
			</Footer>
        </>

    )
}

export default WaitingRoom;
