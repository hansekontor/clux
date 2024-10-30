// node modules
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import bcash from '@hansekontor/checkout-components';
const { Hash256 } = bcash.bcrypto;
import { U64 } from 'n64';
import { Flash } from 'react-ruffle';

// react components
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

const calculatePayout = (ttxHashString, blockHashString, playerChoiceBytes, maxPayoutBufBE) => {
    console.log("calculatePayout", ttxHashString, blockHashString, playerChoiceBytes, maxPayoutBufBE);
    const ttxHash = Buffer.from(ttxHashString, 'hex');
    const blockHash = Buffer.from(blockHashString, 'hex');

    console.log("ttxhash", ttxHash.toString('hex'));
    console.log("blockhash", blockHash.toString('hex'));
    const combineHashes = Buffer.concat([ttxHash, blockHash]);
    console.log("combinedHashes", combineHashes.toString('hex'));
    const randomNumber = Hash256.digest(combineHashes);
    console.log("randomnumber", randomNumber.toString('hex'));
    let payoutNum = parseInt(U64.fromBE(maxPayoutBufBE).toString());

    let modSum = 0;

    let modArray = [];
    let resultingNumbers = new Array(4);

    for (let i = 0; i < playerChoiceBytes.length; i++) {
        
        const pOffset = 3 - i
        console.log("calculatePayout() pOffset,", pOffset);
        const playerByte = playerChoiceBytes.slice(pOffset, pOffset + 1)
        console.log("calculatePayout() playerByte", playerByte)
        const offset = 31 - i
        console.log("calculatePayout(), offset", offset);
        const randomByte = randomNumber.slice(offset, offset + 1)
        console.log("calculatePayout() randomByte", randomByte)
        const numBuf = Buffer.concat([randomByte, playerByte])
        console.log("calculatePayout() numBuf", numBuf);
        const number = numBuf.readInt16LE(0);
        resultingNumbers[i] = number % (4*playerChoiceBytes.length);
        console.log("calcuPayout number", number);
        modSum += number % (4 * playerChoiceBytes.length);
    }

    // Paytable zero index pays max amount, the rest divide by) 2 and greater than final pays zero
    const playerWinningsTier = [
        { threshold: 0, multiplier: 16},
        { threshold: 4, multiplier: 8},
        { threshold: 6, multiplier: 4},
        { threshold: 15, multiplier: 2},
        { threshold: 35, multiplier: 1},
    ];
    const paytable = playerWinningsTier.map(obj => obj.threshold);
    let tier = 5;
    for (let i = 0; i < paytable.length; i++) {
        if (modSum > paytable[i]) {
            if (i === paytable.length - 1) {
                payoutNum = 0;
                tier = 0;
            } else {
                payoutNum = payoutNum / 2;
                tier = tier - 1;
            }
        }
    }

    const actualPayout = U64.fromInt(payoutNum);
    const actualPayoutBE = actualPayout.toBE(Buffer);

    return {actualPayoutBE, payoutNum, tier, resultingNumbers};
}

const playerChoiceArray = [33, 102, 90, 22];
const mockTicket = {
    block: "0000000000000000137234656324a4539f1f986bc0ac72c74e4080d0f150abf5",
    hash: "361198ada49c1928e107dd93ab7bac53acbef208b0c0e8e65b4e33c3a02a32b6",
    maxPayout: "0000000000027100",
    // playerChoiceBytesString: "34204n67",
    playerChoiceBytesString: Buffer.from([playerChoiceArray], 'hex').toString('hex'),
    playerChoiceBytes: Buffer.from(playerChoiceArray, 'hex')
}

const Game = ({
    passLoadingStatus,
    passAnimationKey,
    ticket
}) => {

    const history = useHistory();

    const [animationStage, setAnimationStage] = useState("faceoff");
    const [payoutAmount, setPayoutAmount] = useState(20); // !hardcoded demo value
    const [labels, setLabels] = useState(false);
    const [payoutData, setPayoutData] = useState(false);
    const [fightStarted, setFightStarted] = useState(false);
    const [versus, setVersus] = useState(false);
    const [fadeOutVersus, setFadeOutVersus] = useState(false);

    if (!payoutData) {
        const playerChoiceBytes = Buffer.from(ticket.playerChoice, 'hex');
        const { actualPayoutBE, payoutNum, tier, resultingNumbers } = calculatePayout(ticket.id, ticket.blockHash, playerChoiceBytes, ticket.maxPayout);
        setPayoutData({
            actualPayoutBE, 
            payoutNum, 
            tier, 
            resultingNumbers
        });
    }

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // load labels and manually stop loading screen
    useEffect(() => {    
        if (!labels){
            const tier = payoutData.tier;
            const win = tier != 0;
            const winner = win ? "A" : "B";

            setLabels({ 
                faceoff: animationLabels.CLUX.NORRIS.FACEOFF, 
                fight: animationLabels.CLUX.NORRIS[winner].FIGHT,
                celebration: win ? animationLabels.CLUX.NORRIS.A.CELEBRATIONS[tier] : animationLabels.CLUX.NORRIS.B.CELEBRATION    
            })
        }
        passLoadingStatus(false)
    }, [labels]);

    // slide-in and fadeout animation for versus
    useEffect(async() => {
        await sleep(1000);
        setVersus(true);
    }, [])   
    useEffect(async() => {
        await sleep(5000);
        setFadeOutVersus(true);
    })

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
            await sleep(5000);
            history.push({pathname: "/result", state: {payoutAmount}});
        }
    }, [animationStage])

    const handlePlay = async () => {
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
                {payoutData.resultingNumbers &&
                    <ResultingNumbers 
                        numberArray={payoutData.resultingNumbers}
                        active={fightStarted}
                    />                
                }
                <PrimaryButton onClick={handlePlay}>
                    {playButtonText}
                </PrimaryButton>
            </FooterCtn>
        </>
    )
}

export default Game;