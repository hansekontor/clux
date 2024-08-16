// node modules
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { AnimateCC } from 'react-adobe-animate';
import bcash from '@hansekontor/checkout-components';
const { Hash256 } = bcash.bcrypto;
import { U64 } from 'n64';
import PropTypes from 'prop-types'
import { Flash } from 'react-ruffle';

// react components
import RingPng from '@assets/ring_on_beach.png';
import PrimaryButton from '@components/Common/PrimaryButton';
import Header from '@components/Common/Header';
import { FooterCtn } from '@components/Common/Footer';
import { ResultingNumbers } from '@components/Common/RandomNumbers';
import { WalletCtn } from '@components/App';
import { FadeOutAnimationShort } from '@components/Common/CssAnimations';

// other
import compositions from '@utils/compositions';

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
const FadeOut = styled(WalletCtn)`
    box-shadow: none;
    animate: fade-out 1s ease-out both;
    ${FadeOutAnimationShort}    
`;

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
    let resultingNumbers = [];

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
        resultingNumbers.push(number % (4*playerChoiceBytes.length));
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

    // states
    const [animationStage, setAnimationStage] = useState("entrance");
    const [payoutAmount, setPayoutAmount] = useState(20); // !hardcoded demo value
    const [labels, setLabels] = useState({});
    const [payoutData, setPayoutData] = useState(false);
    const [fightStarted, setFightStarted] = useState(false);

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

    // helpers
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // useEffect(async () => {
    //     // manually disable loader after ticket redemption
    //     if (!scriptLoaded){
    //         const fightLabel = "clux-norris";            
    //         const tier = payoutData.tier;
    //         const win = tier != 0;
    //         const winner = win ? "A" : "B";
    //         const key = win ? `${fightLabel}_A_${tier}` : `${fightLabel}_${winner}`;
    //         passAnimationKey(key)
    //         // console.log("winner", winner, "tier", String(tier))
    //         setLabels({
    //             animationName: {
    //                 entrance: "CLUX_NORRIS_ENTRANCE",
    //                 fight: `CLUX_NORRIS_FIGHT_${winner}`,
    //                 celebration: `CLUX_NORRIS_CELEBRATION_${winner}${win ? "_"+String(tier) : ""}`
    //             },
    //             compositionId: { 
    //                 entrance: compositions.CLUX.NORRIS.ENTRANCE, 
    //                 fight: compositions.CLUX.NORRIS[winner].FIGHT,
    //                 celebration: win ? compositions.CLUX.NORRIS.A.CELEBRATION[tier] : compositions.CLUX.NORRIS.B.CELEBRATION
    //             }
    //         })
    //     }
    // }, []);

    // useEffect(async()=> {
    //     if (labels.animationName?.entrance) {
    //         await sleep(4000);
    //         passLoadingStatus(false);
    //         setScriptLoaded(true);
    //     }
    // }, [labels])

    useEffect(async() => {
        passLoadingStatus(false);
    }, []);

    // switch to celebration loop for demo
    useEffect(async() => {
        if (animationStage === "fight") {
            await sleep(5000);
            setAnimationStage("celebration");
        }
    }, [animationStage])

    // end animations for demo
    useEffect(async() => {
        if (animationStage === "celebration") {
            await sleep(5000);
            history.push({pathname: "/result", state: {payoutAmount}});
        }
    }, [animationStage])

    // useEffect(async() => {
    //     if (!celebrationPaused) {
    //         await sleep(16000);
    //         setFadeOut(true);
    //     }
    // }, [celebrationPaused])

    // useEffect(async() => {
    //     if(fadeOut){
    //         await sleep(300);
    //         passAnimationKey(false);            
    //         passLoadingStatus("LOADING RESULTS");
    //         console.log("pushed to /result with payoutAmount", payoutAmount);
    //         history.push({pathname: "/result", state: { payoutAmount }})
    //     }
    // }, [fadeOut])

    // handlers
    const handlePlay = async () => {
        setAnimationStage("fight");
        setFightStarted(true);
    }

    const playButtonText = "Fight";
    const folder = "./animations/"
    const entranceAnimation = folder + "Clux_3_Face_Off.swf";
    const fightAnimation = folder + "Clux_4_Fight_Clux_Wins.swf";
    const celebrationAnimation = folder + "Clux_5_Celebration_5.swf";    

    return (
        <>
            <Background src={RingPng} />
            <Header />
            <FlexGrow>    
                <Animation hidden={animationStage !== "entrance"}>
                    <CustomFlash 
                        src={entranceAnimation}
                        config={{
                            autoplay: "on",
                            unmuteOverlay: "hidden",
                            splashScreen: false,
                            contextMenu: "off",
                            allowScriptAccess: true,
                            forceScale: true,
                            scale: "noBorder",
                            wmode: "transparent"                                    
                        }}
                    >
                        <div>FACEOFF PLACEHOLDER</div>   
                    </CustomFlash>
                </Animation>
                <Animation hidden={animationStage !== "fight"}>
                    <CustomFlash 
                        src={fightAnimation}
                        config={{
                            autoplay: "on",
                            unmuteOverlay: "hidden",
                            splashScreen: false,
                            contextMenu: "off",
                            allowScriptAccess: true,
                            forceScale: true,
                            scale: "noBorder",
                            wmode: "transparent"                                    
                        }}
                    >       
                        <div>FIGHT PLACEHOLDER</div>   
                    </CustomFlash>             
                </Animation>
                <Animation hidden={animationStage !== "celebration"}>
                    <CustomFlash 
                        src={celebrationAnimation}
                        config={{
                            autoplay: "on",
                            unmuteOverlay: "hidden",
                            splashScreen: false,
                            contextMenu: "off",
                            allowScriptAccess: true,
                            forceScale: true,
                            scale: "noBorder",
                            wmode: "transparent"                                    
                        }}
                    >        
                        <div>CELEBRATION PLACEHOLDER</div>   
                    </CustomFlash>            
                </Animation>
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