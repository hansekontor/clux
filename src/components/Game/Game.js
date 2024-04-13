// node modules
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { AnimateCC } from 'react-adobe-animate';

// react components
import RingPng from '@assets/ring.png';
import PrimaryButton from '@components/Common/PrimaryButton';
import Header from '@components/Common/Header';

// styled css components 
const Background = styled.img`
    position: relative;
    height: 100vh;
    z-index: -4;
    object-fit: cover;
    filter: grayscale: 0.6;
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

    // helpers
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(async () => {
        // manually disable loader after ticket redemption
        passAnimationKey("clux_norris_A")
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
    }

    const handlePlayAgain = () => {
        history.push('/select');
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
                                    animationName={"ENTRANCE"}
                                    composition={"9CD376263DCA47A78074CFD07FB36864"}
                                    getAnimationObject={getAnimationObject}
                                    paused={paused}
                                />                                           
                            </EntranceCtn>
                        }

                        <FightCtn active={animationStage === "fight"}>
                            <AnimateCC 
                                animationName={"FIGHT_A"}
                                composition={"B5519D86C55F4C62952ECF014A22F68C"}
                                getAnimationObject={getAnimationObject}
                                paused={animationStage !== "fight"}
                            />                                           
                        </FightCtn>

                        {animationStage !== 'entrance' &&
                            <CelebrationCtn active={animationStage === "celebration"}>
                                <AnimateCC 
                                    animationName={"CELEBRATION_A"}
                                    composition={"830FD01C9AAF40688B384230187B5C33"}
                                    getAnimationObject={getAnimationObject}
                                    paused={animationStage === "celebration"}
                                />                                        
                            </CelebrationCtn>                        
                        }

                    {animationStage === 'entrance' ? (
                        <PlayButton onClick={() => handlePlay()}>Play</PlayButton>
                    ) : (
                        <PlayButton onClick={() => setAnimationStage("celebration")}>See Result</PlayButton>
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