// node modules
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { AnimateCC } from 'react-adobe-animate';
import bcash from '@hansekontor/checkout-components';
const { Hash256 } = bcash.bcrypto;
import { U64 } from 'n64';

// react components
import RingPng from '@assets/ring.png';
import PrimaryButton from '@components/Common/PrimaryButton';
import Header from '@components/Common/Header';

// other
import compositions from '@utils/compositions';
    

// styled css components 
const Background = styled.img`
    position: relative;
    height: 100vh;
    z-index: -4;
    object-fit: cover;
    filter: grayscale(0.6);
`;
const Overlay = styled.div`
    background-color: rgba(255,255,255,0.9);
    position: absolute;
    width: inherit;
    height: inherit;
    z-index: -3;
    display: block;
    top: 0;
    left: 0; 
`;
const PlayButton = styled(PrimaryButton)`
    position: absolute;
    top: 80%;
`;
const Result = styled.div`
    position: absolute;
    color: black;
    padding: 20px;
    border-radius: 40px;
    top: 30%;
    height: fit-content;    
`;
    // background-color: rgba(248, 247, 216, 0.9);
    // opacity: 90%;

const ResultTitle = styled.div`
    font-family: "Seymour One", Helvetica;
    font-size: 45px;
    transform: rotate(-2.2deg);
`;
const ResultSubtitle = styled.div`
    font-family: Helvetica;
    font-size: 24px;
`;
const ResultPayout = styled(ResultTitle)`
`;
const EntranceCtn = styled.div`
    top: 20%;
    position: absolute;
    margin-left: -130px;
    background-color: transparent;
    visibility: ${props => props.active ? 'show' : 'hidden'};
    overflow: visible;
`;
const FightCtn = styled.div`
    top: 20%;
    position: absolute;
    margin-left: -175px;
    background-color: transparent;
    visibility: ${props => props.active ? 'show' : 'hidden'}
    overflow: visible;
`;
const CelebrationCtn = styled.div`
    top: 20%;
    position: absolute;
    margin-top: -10px;
    margin-left: -175px;
    background-color: transparent;
    visibility: ${props => props.active ? 'show' : 'hidden'};
    overflow: visible;
`;


const Game = ({
    passLoadingStatus,
    passAnimationKey,
    ticket
}) => {
    const history = useHistory();

    // states
    const [result, setResult] = useState(false);
    const [gameRunning, setGameRunning] = useState(false);

    const [paused, setPaused] = useState(false);
    const [animationObject, getAnimationObject] = useState(null);
    const [animationStage, setAnimationStage] = useState("entrance");
    const [entrancePaused, setEntrancePaused] = useState(false);
    const [fightPaused, setFightPaused] = useState(true);
    const [celebrationPaused, setCelebrationPaused] = useState(true);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [payoutAmount, setPayoutAmount] = useState(false);
    const [displayResult, setDisplayResult] = useState(false);
    const [labels, setLabels] = useState({});

    // helpers
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(async () => {
        // manually disable loader after ticket redemption
        console.log("useeffect to load scripts outer")
        if (!scriptLoaded){
            const ttxHashString = ticket.hash;
            const blockHashString = ticket.block;
            const ttxHashBuf = Buffer.from(ttxHashString, 'hex');
            const blockHashBuf = Buffer.from(blockHashString, 'hex');
            const maxPayoutString = ticket.maxPayout;
            const maxPayoutBuf = Buffer.from(maxPayoutString, 'hex');        
            // const playerChoiceString = "34204n67";
            // const playerChoiceBytes = Buffer.from(playerChoiceString, 'hex');
            const playerChoiceBytes = ticket.playerChoiceBytes;
            console.log("playerchoicebytes", playerChoiceBytes);
            console.log("ttxhashbuf", ttxHashBuf, "blockhashbuf", blockHashBuf);
            
            const {payoutNum, tier} = calculatePayout(ttxHashBuf, blockHashBuf, playerChoiceBytes, maxPayoutBuf);
            // const tier = 5;
            setPayoutAmount(payoutNum)
            const win = tier !== 0;
            console.log("GAME.JS payoiut tier", tier);
            
            // console.log("useEffect to load scripts inner")
            const fightLabel = "clux-norris";
            const winner = win ? "A" : "B";
            const key = win ? `${fightLabel}_A_${tier}` : `${fightLabel}_B`;
            passAnimationKey(key)
            console.log("winner", winner, "tier", String(tier))
            setLabels({
                animationName: {
                    entrance: "CLUX_NORRIS_ENTRANCE",
                    fight: `CLUX_NORRIS_FIGHT_${winner}`,
                    celebration: `CLUX_NORRIS_CELEBRATION_${winner}${win ? "_"+String(tier) : ""}`
                },
                compositionId: { 
                    entrance: compositions.CLUX.NORRIS.ENTRANCE, 
                    fight: compositions.CLUX.NORRIS[winner].FIGHT,
                    celebration: win ? compositions.CLUX.NORRIS.A.CELEBRATION[tier] : compositions.CLUX.NORRIS.B.CELEBRATION
                }
            })
            await sleep(2000);
            passLoadingStatus(false)
            setScriptLoaded(true);
        }
    }, []);


    // handlers
    const handlePlay = async () => {
        setAnimationStage("fight");
        setFightPaused(false);
        console.log("handlePlay called")
    }

    const handleResult = async () => {
        setAnimationStage("celebration");
        setCelebrationPaused(false);

        await sleep(5000);
        setDisplayResult(true);
    }

    const handleReturnAfterResult = () => {
        history.push('/select');
    }


    const calculatePayout = (ttxHash, blockHash, playerChoiceBytes, maxPayoutBufBE) => {
    
        console.log("ttxhash", ttxHash.toString('hex'));
        console.log("blockhash", blockHash.toString('hex'));
        const combineHashes = Buffer.concat([ttxHash, blockHash]);
        console.log("combinedHashes", combineHashes.toString('hex'));
        const randomNumber = Hash256.digest(combineHashes);
        console.log("randomnumber", randomNumber.toString('hex'));
        let payoutNum = parseInt(U64.fromBE(maxPayoutBufBE).toString());
    
        let modSum = 0;
    
    
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
            console.log("calcuPayout number", number);
            modSum += number % (4 * playerChoiceBytes.length)
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

        return {actualPayoutBE, payoutNum, tier};
    }

    return (
        <>
            <Background src={RingPng} />
            {displayResult && <Overlay />}
            <Header />
            {scriptLoaded &&
                <>
                        {animationStage !== 'celebration' &&
                            <EntranceCtn active={animationStage === "entrance"}>
                                <AnimateCC 
                                    animationName={labels.animationName.entrance}
                                    composition={labels.compositionId.entrance}
                                    getAnimationObject={getAnimationObject}
                                    paused={paused}
                                    canvasStyle={{width: 1920/2.5+"px", height: 1080/2.5+"px"}}
                                />                                           
                            </EntranceCtn>
                        }

                        <FightCtn active={animationStage === "fight"}>
                            <AnimateCC 
                                animationName={labels.animationName.fight}
                                composition={labels.compositionId.fight}
                                getAnimationObject={getAnimationObject}
                                paused={fightPaused}
                                canvasStyle={{width: 1920/2.5+"px", height: 1080/2.5+"px"}}
                            />                                           
                        </FightCtn>

                        {/* {animationStage !== 'entrance' && */}
                            <> 
                                <CelebrationCtn active={animationStage === "celebration"}>
                                    <AnimateCC 
                                        animationName={labels.animationName.celebration}
                                        composition={labels.compositionId.celebration}
                                        getAnimationObject={getAnimationObject}
                                        paused={celebrationPaused}
                                        canvasStyle={{width: 1920/2.5+"px", height: 1080/2.5+"px"}}
                                    />                                        
                                </CelebrationCtn>              
                                     
                                {displayResult && (
                                    <Result>
                                        <ResultTitle>WINNER!</ResultTitle>
                                        <ResultSubtitle>CONGRATULATIONS!</ResultSubtitle>
                                        <ResultPayout>{(payoutAmount/1000).toFixed(0)} CREDITS</ResultPayout>
                                    </Result>
                                )}
                            </>
                        {/* } */}

                    {animationStage === 'entrance' ? (
                        <PlayButton onClick={() => handlePlay()}>Fight</PlayButton>
                    ) : (
                        <>
                            {!displayResult ? ( 
                                <PlayButton onClick={() => handleResult()}>See Result</PlayButton>
                            ) : (
                                <PlayButton onClick={() => handleReturnAfterResult()}>Return</PlayButton>
                            )}
                        </>
                    )}

                </>
            }
        </>
    )
}

export default Game;