// node modules
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import bcash from '@hansekontor/checkout-components';
const { Hash256 } = bcash.bcrypto;
import { U64 } from 'n64';
import { Flash } from 'react-ruffle';

// react components
import { WalletContext } from '@utils/context';
import { getWalletState } from '@utils/cashMethods'
import PrimaryButton from '@components/Common/PrimaryButton';
import Header from '@components/Common/Header';
import { FooterCtn } from '@components/Common/Footer';
import { ResultingNumbers } from '@components/Common/RandomNumbers';
import { SlideInAnimation, FadeOutAnimationShort } from '@components/Common/CssAnimations';

// assets and other
import VersusPng from '@assets/versus.png';
import RingPng from '@assets/ring_on_beach.png';

// util
import animationLabels from '@utils/animations';

// styled css components 
const Background = styled.img`
    position: absolute;
    bottom: 128px;
    margin-left: auto;
    margin-right: auto;
    height: 100vh;
    z-index: -4;
`;
const FlexGrow = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    position: relative;
`;
const Animation = styled.div`
    width: inherit;
    position: absolute; 
    display: ${props => props.hidden ? 'none' : 'flex'};
    justify-content: center;
    align-items: center;
`;
const CustomFlash = styled(Flash)`
    position: absolute;
    visibility: ${props => props.hidden ? "hidden" : "visible"};
`;
const SlideIn = styled.div`
    position: absolute;
    z-index: 200;
    top: 0;
    animation: slide-in-from-top 0.5s cubic-bezier(0.24, 0.48, 0.47, 0.95);

    ${SlideInAnimation};
`;
const FadeOut = styled.div`
    ${FadeOutAnimationShort};
`;
const Versus = styled.img`
    width: 70%;
`;
const animationStyle = { width: "960px", height: "600px" };
const faceoffAnimationStyle = { width: "960px", height: "600px", position: "absolute", marginLeft: "15%" };

const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}


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

    // load labels and manually stop loading screen
    useEffect(() => {    
		console.log("GAME useEffect redeem Hash", redeemHash)
        if (redeemHash) {
			console.log("redeemHash", redeemHash);
			const ticketFromState = tickets.find(ticket => ticket.redeemTx?.hash === redeemHash)
			console.log("GAME ticketFromState", ticketFromState)
			if (!ticketFromState) {
				passLoadingStatus("TICKET NOT FOUND");
				sleep(3000);
				history.push("/select");
			} else if (!ticketFromState.details.game) {
				// wait and try again
				console.log("GAME DATA NOT FOUND")
			} else {
				console.log("GAME WORKED")

				console.log("GAME resulting Numbers", ticketFromState.details.game.resultingNumbers);
				const tier = ticketFromState.details.game.tier;
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
            <Background src={RingPng} />
            <Header />
			{ticket?.details?.game?.resultingNumbers && (
				<>
					<FlexGrow>    
						<SlideIn>
							{versus && 
								<FadeOut fadeOut={fadeOutVersus}>
									<Versus src={VersusPng}/>
								</FadeOut>                    
							}

						</SlideIn>
						{labels && (
							<>
								<Animation hidden={animationStage !== "faceoff"}>
									<CustomFlash 
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
										style={faceoffAnimationStyle}
									>
										<div>FACEOFF PLACEHOLDER</div>   
									</CustomFlash>
								</Animation>
								<Animation hidden={animationStage !== "fight"}>
									<CustomFlash 
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
										style={animationStyle}
									>       
										<div>FIGHT PLACEHOLDER</div>   
									</CustomFlash>             
								</Animation>
								<Animation hidden={animationStage !== "celebration"}>
									<CustomFlash 
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
										style={animationStyle}
									>        
										<div>CELEBRATION PLACEHOLDER</div>   
									</CustomFlash>            
								</Animation>                    
							</>
						)}
					</FlexGrow>
					<FooterCtn>
						<ResultingNumbers 
							numberArray={ticket?.details?.game?.resultingNumbers}
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