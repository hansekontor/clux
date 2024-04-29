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
const PlayButton = styled(PrimaryButton)`
    position: absolute;
    top: 80%;
`;
const CenterDemo = styled.div`
    position: relative;
    background-color: white;
    color: black;
    padding: 20px;
`;
const GameDemo = styled.div`
    position: absolute;
    top: 50%;
    width: 100%;
`;
const EntranceCtn = styled.div`
    top: 20%;
    position: absolute;
    margin-left: 55px;
    background-color: transparent;
    visibility: ${props => props.active ? 'show' : 'hidden'};
    overflow: visible;
`;
const FightCtn = styled.div`
    top: 20%;
    position: absolute;
    margin: auto;
    background-color: transparent;
    visibility: ${props => props.active ? 'show' : 'hidden'}
    overflow: visible;
`;
const CelebrationCtn = styled.div`
    top: 20%;
    position: absolute;
    margin-left: -15px;
    background-color: transparent;
    visibility: ${props => props.active ? 'show' : 'hidden'};
    overflow: visible;
`;
const ChickenDemoLeft = styled.div` 
    position: absolute;
    left: 0;
    background-color: white;
    color: black;
    padding: 20px;
`;
const ChickenDemoRight = styled.div` 
    position: absolute;
    right: 0;
    background-color: white;
    color: black;
    padding: 20px;
`;
// const html = "<h1>TEST</h1>";


const Game = ({
    passLoadingStatus,
    passAnimationKey
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

    // helpers
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(async () => {
        // manually disable loader after ticket redemption
        const fightLabel = "clux-norris";
        const winner = "A";
        const tier = 1;
        const key = `${fightLabel}_${winner}_${tier}`;
        passAnimationKey(key)
        await sleep(2000);
        passLoadingStatus(false)
        setScriptLoaded(true);
    }, []);


    // handlers
    const handlePlay = async () => {
        setAnimationStage("fight");
        setFightPaused(false);
    }

    const handleResult = async () => {
        setAnimationStage("celebration");
        setCelebrationPaused(false);

        const ttxHashString = "361198ada49c1928e107dd93ab7bac53acbef208b0c0e8e65b4e33c3a02a32b6";
        const blockHashString = "0000000000000000137234656324a4539f1f986bc0ac72c74e4080d0f150abf5";
        const ttxHashBuf = Buffer.from(ttxHashString, 'hex');
        const blockHashBuf = Buffer.from(blockHashString, 'hex');
        const maxPayoutString = "0000000000027100";
        const maxPayoutBuf = Buffer.from(maxPayoutString, 'hex');        
        const playerChoiceString = "34204n67";
        const playerChoiceBytes = Buffer.from(playerChoiceString, 'hex');
        console.log("playerchoicebytes", playerChoiceBytes);
        console.log("ttxhashbuf", ttxHashBuf, "blockhashbuf", blockHashBuf);
        
        const {payoutNum} = calculatePayout(ttxHashBuf, blockHashBuf, playerChoiceBytes, maxPayoutBuf);
        setPayoutAmount(payoutNum);
        await sleep(5000);
        setDisplayResult(true);
    }

    const handlePlayAgain = () => {
        history.push('/select');
    }




    const calculatePayout = (ttxHash, blockHash, playerChoiceBytes, maxPayoutBufBE) => {
    
        const combineHashes = Buffer.concat([ttxHash, blockHash]);
        const randomNumber = Hash256.digest(combineHashes);
        console.log("calcPayoyut, randomNumbers", randomNumber);
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
                if (i === paytable.length - 1)
                    payoutNum = 0;
                else {
                    payoutNum = payoutNum / 2;
                    tier - 1;
                }
            }
        }
    
        const actualPayout = U64.fromInt(payoutNum);
        const actualPayoutBE = actualPayout.toBE(Buffer);

        return {actualPayoutBE, payoutNum, tier};
    }

    return (
        <>
            <Background src={RingPng}/>
            <Header />
            {scriptLoaded &&
                <>
                        {animationStage !== 'celebration' &&
                            <EntranceCtn active={animationStage === "entrance"}>
                                <AnimateCC 
                                    animationName={"CLUX_NORRIS_ENTRANCE"}
                                    composition={compositions.clux.norris.entrance}
                                    getAnimationObject={getAnimationObject}
                                    paused={paused}
                                    canvasStyle={{width: 1920/2.5+"px", height: 1080/2.5+"px"}}
                                />                                           
                            </EntranceCtn>
                        }

                        <FightCtn active={animationStage === "fight"}>
                            <AnimateCC 
                                animationName={"CLUX_NORRIS_FIGHT_A"}
                                composition={compositions.clux.norris.A.fight}
                                getAnimationObject={getAnimationObject}
                                paused={fightPaused}
                                canvasStyle={{width: 1920/2.5+"px", height: 1080/2.5+"px"}}
                            />                                           
                        </FightCtn>

                        {animationStage !== 'entrance' &&
                            <> 
                                <CelebrationCtn active={animationStage === "celebration"}>
                                    <AnimateCC 
                                        animationName={"CLUX_NORRIS_CELEBRATION_A_1"}
                                        composition={compositions.clux.norris.A.celebration_1}
                                        getAnimationObject={getAnimationObject}
                                        paused={celebrationPaused}
                                        canvasStyle={{width: 1920/2.5+"px", height: 1080/2.5+"px"}}
                                    />                                        
                                </CelebrationCtn>              
                                     
                                {displayResult && (
                                    <div>
                                        YOUR PAYOUT: {payoutAmount}
                                    </div>
                                )}
                            </>
                        }

                    {animationStage === 'entrance' ? (
                        <PlayButton onClick={() => handlePlay()}>Play</PlayButton>
                    ) : (
                        <PlayButton onClick={() => handleResult()}>See Result</PlayButton>
                    )}

                </>
            }
            {/* {!result ? (
                <>
                    {gameRunning ? (
                        <GameDemo>
                            <CenterDemo>
                                Chickens fighting
                            </CenterDemo>
                        </GameDemo>
                    ) : (
                        <GameDemo>
                            <ChickenDemoLeft>Player Chicken</ChickenDemoLeft>
                            <ChickenDemoRight>Enemy Chicken</ChickenDemoRight>
                        </GameDemo>                        
                    )}

                    <PlayButton onClick={() => handlePlay()}>Play</PlayButton>
                </>
            ) : (
                <>  
                    <GameDemo>
                        <CenterDemo>Congratulations, you have won ${result.win}</CenterDemo>
                    </GameDemo>
                    <PlayButton onClick={() => handlePlayAgain()}>Play again</PlayButton>
                </>
            )} */}
        </>
    )
}

export default Game;