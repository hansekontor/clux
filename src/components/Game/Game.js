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
const WalkInCtn = styled.div`
    position: absolute;
    top: 15%;
    position: absolute;
    margin-left: 60px;
    width: 200%
    height: 150%;
    background-color: transparent;
    visibility: ${props => props.active ? 'show' : 'hidden'}
`;
const FightCtn = styled.div`
    position: absolute;
    top: 15%;
    position: absolute;
    margin-left: 10px;
    width: 200%
    height: 150%;
    background-color: transparent;
    visibility: ${props => props.active ? 'show' : 'hidden'}
`;
const CelebrationCtn = styled.div`
    position: absolute;
    top: 15%;
    position: absolute;
    margin-left: 60px;
    width: 200%
    height: 150%;
    background-color: transparent;
    visibility: ${props => props.active ? 'show' : 'hidden'}
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
    // passAnimationSettings
}) => {
    const history = useHistory();

    // states
    const [result, setResult] = useState(false);
    const [gameRunning, setGameRunning] = useState(false);

    const [paused, setPaused] = useState(false);
    const [animationName, setAnimationName] = useState("CLUX_SC01_HTML5");
    const [animationObject, getAnimationObject] = useState(null);
    const [animationStage, setAnimationStage] = useState("walkin");
    const [fightPaused, setFightPaused] = useState(true);
    const [celebrationPaused, setCelebrationPaused] = useState(true);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const onClick = () => setPaused(!paused);
    // console.log("animationObject", animationObject);

    // helpers
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(async () => {
        // manually disable loader after ticket redemption
        // passAnimationSettings(   )
        passLoadingStatus(false)
        await sleep(1000);
        setScriptLoaded(true);
    }, []);

    useEffect(async () => {
        if (animationStage === "fight") {
            // await sleep(8000);
            // setAnimationStage("celebration")
        }
    }, [animationStage])
    // handlers
    const handlePlay = async () => {
        console.log("GAME handlePlay()")
        // const mockResult = {
        //     bracket: 5,
        //     win: 20
        // };
        // setGameRunning(true);
        // await sleep(3000);
        // setGameRunning(false);
        // setResult(mockResult);
        setAnimationStage("fight");
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
                    {!result ? (
                        <>
                            {/* <GameCtn> */}
                                <WalkInCtn active={animationStage === "walkin"}>
                                    <AnimateCC 
                                        animationName={"CLUX_SC01_HTML5"}
                                        composition={"9CD376263DCA47A78074CFD07FB36864"}
                                        getAnimationObject={getAnimationObject}
                                        paused={paused}
                                    />                                           
                                </WalkInCtn>
                                <FightCtn active={animationStage === "fight"}>
                                    <AnimateCC 
                                        animationName={"CLUX_SC02_HTML5"}
                                        composition={"B5519D86C55F4C62952ECF014A22F68C"}
                                        getAnimationObject={getAnimationObject}
                                        paused={animationStage !== "fight"}
                                    />                                           
                                </FightCtn>
                                <CelebrationCtn active={animationStage === "celebration"}>
                                    <AnimateCC 
                                        animationName={"CLUX_SC03_HTML5"}
                                        composition={"830FD01C9AAF40688B384230187B5C33"}
                                        getAnimationObject={getAnimationObject}
                                        paused={animationStage === "celebration"}
                                    />                                        
                                </CelebrationCtn>
                            {/* </GameCtn>                */}
                            <PlayButton onClick={() => handlePlay()}>Play</PlayButton>     
                        </>
                    ) : (
                        <p>RESULT</p>
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