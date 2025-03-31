// node modules
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import bcash from '@hansekontor/checkout-components';
const { Hash256 } = bcash.bcrypto;

// react components
import { WalletContext } from '@utils/context';
import { getWalletState } from '@utils/cashMethods'
import PrimaryButton from '@components/PrimaryButton';
import Header from '@components/Header';
import { FooterCtn } from '@components/Footer';
import { ResultingNumbers } from '@components/RandomNumbers';

import * as S from './components/Styled';

// assets and other
import VersusPng from '@assets/images/versus.png';
import RingPng from '@assets/images/ring_on_beach.png';

// util
import animationLabels from '@utils/animations';
import sleep from '@utils/sleep';

const Game = ({
    passLoadingStatus,
}) => {

    const history = useHistory();
	const location = useLocation();
    const ContextValue = useContext(WalletContext);
    const { 
		wallet, 
	} = ContextValue;
    const walletState = getWalletState(wallet)
    const { tickets } = walletState;
	const [redeemHash, ] = useState(location.state?.redeemHash || false);
    const [animationStage, setAnimationStage] = useState("faceoff");
    const [labels, setLabels] = useState(false);
    const [fightStarted, setFightStarted] = useState(false);
    const [versus, setVersus] = useState(false);
    const [fadeOutVersus, setFadeOutVersus] = useState(false);
	const [ticket, setTicket] = useState(false);

	useEffect(async () => {
		if (!redeemHash) {
			passLoadingStatus("NO TICKET SELECTED");
			await sleep(2000);
			history.push("/select");
		}
	},[])

    // load labels
    useEffect(async () => {    
		console.log("GAME useEffect redeem Hash", redeemHash)
        if (redeemHash) {
			console.log("redeemHash", redeemHash);
			const ticketFromState = tickets.find(ticket => ticket.redeemTx?.hash === redeemHash)
			console.log("GAME ticketFromState", ticketFromState)
			if (!ticketFromState) {
				passLoadingStatus("TICKET NOT FOUND");
				sleep(3000);
				history.push("/select");
			} else if (!ticketFromState.details.redemption) {
				// wait and try again
				console.log("GAME DATA NOT FOUND")
			} else {
				console.log("GAME WORKED")

				console.log("GAME resulting Numbers", ticketFromState.details.redemption.resultingNumbers);
				const tier = ticketFromState.details.redemption.tier;
				console.log("GAME tier", tier);
				const win = tier != 0;
				const winner = win ? "A" : "B";
				
				setTicket(ticketFromState);
				setLabels({ 
					faceoff: animationLabels.CLUX.NORRIS.FACEOFF, 
					fight: animationLabels.CLUX.NORRIS[winner].FIGHT,
					celebration: win ? animationLabels.CLUX.NORRIS.A.CELEBRATIONS[tier] : animationLabels.CLUX.NORRIS.B.CELEBRATION    
				})
				
				passLoadingStatus(false);
			}
        }
    }, [redeemHash]);

    // slide-in and fadeout animation for versus
    useEffect(async() => {
        await sleep(1000);
        setVersus(true);
    }, [])   

    // switch from fight to celebration animation
    useEffect(async() => {
        if (animationStage === "fight") {
            await sleep(4000);
            setAnimationStage("celebration");
            document.getElementById(labels.celebration).startCelebrationAnimation();
        }
    }, [animationStage]) 
    
    // go to result page automatically
    useEffect(async() => {
        if (animationStage === "celebration") {
            await sleep(3000);
			passLoadingStatus("LOADING RESULT");
            history.push({
				pathname: "/result", 
				state: { 
					ticket
				}
			});
        }
    }, [animationStage])

    const handlePlay = async () => {
		setFadeOutVersus(true);
        setAnimationStage("fight");
        document.getElementById(labels.fight).startFightAnimation();
        setFightStarted(true);
    }

    const playButtonText = "Fight";
    const folder = animationLabels.PUBLICPATH;

    return (
        <>
            <S.Background src={RingPng} />
            <Header $transparent={true} />
			{ticket?.details?.redemption?.resultingNumbers && (
				<>
					<S.FlexGrow>    
						<S.SlideIn>
							{versus && 
								<S.FadeOut $fadeOut={fadeOutVersus}>
									<S.Versus src={VersusPng}/>
								</S.FadeOut>                    
							}

						</S.SlideIn>
						{labels && (
							<>
								<S.Animation $hidden={animationStage !== "faceoff"}>
									<S.CustomFlash 
										src={folder + labels.faceoff}
										config={{
											autoplay: "on",
											unmuteOverlay: "hidden",
											splashScreen: false,
											contextMenu: "off",
											allowScriptAccess: true,
											forceScale: true,
											scale: "exactFit",
											wmode: "transparent",
											preferredRenderer: "canvas"                                    
										}}
										id={labels.faceoff}
										style={S.faceoffAnimationStyle}
									>
										<div></div>   
									</S.CustomFlash>
								</S.Animation>
								<S.Animation $hidden={animationStage !== "fight"}>
									<S.CustomFlash 
										src={folder + labels.fight}
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
										id={labels.fight}
										style={S.animationStyle}
									>       
										<div></div>   
									</S.CustomFlash>             
								</S.Animation>
								<S.Animation $hidden={animationStage !== "celebration"}>
									<S.CustomFlash 
										src={folder + labels.celebration}
										config={{
											autoplay: "on",
											unmuteOverlay: "hidden",
											splashScreen: false,
											contextMenu: "off",
											allowScriptAccess: true,
											forceScale: true,
											scale: "exactFit",
											wmode: "transparent",
											preferredRenderer: "canvas"                                    
										}}
										id={labels.celebration}
										style={S.animationStyle}
									>        
										<div></div>   
									</S.CustomFlash>            
								</S.Animation>                    
							</>
						)}
					</S.FlexGrow>
					<FooterCtn>
						<ResultingNumbers 
							numberArray={ticket?.details?.redemption?.resultingNumbers}
							active={fightStarted}
						/>                
						<PrimaryButton onClick={handlePlay} grey={fightStarted} disabled={fightStarted}>
							{playButtonText}
						</PrimaryButton>
					</FooterCtn>
				</>
			)}
        </>
    )
}

export default Game;