// modules
import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { AnimateCC } from 'react-adobe-animate';
import styled from 'styled-components';

// react components
import Header from '@components/Common/Header';
import JackpotCarousel from '@components/Common/Jackpot';
import RandomNumbers from '@components/Common/RandomNumbers';
import Footer from '@components/Common/Footer';

// assets
import RingPng from '@assets/ring_on_beach.png';

// other
import compositions from '@utils/compositions';

// styled css components
const ChickenCtn = styled.div`
    background-color: #fefffe;
    border-radius: 24px;
    border-style: none;
    width: 88%;
    margin-top: 9px;
    margin-bottom: 9px;
    height: 60%;
    overflow: hidden;
    position: relative;
    min-height: 300px;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const OuterBackgroundCtn = styled.div`
    position: relative;
    bottom: 40%;
`;
const Background = styled.img`
    position: relative;
    left: 40px;
`;
const IdleChicken = styled.div`
    z-index: 100;
    position: absolute;
    overflow: visible;
    top: 10%;
`;
const canvasStyle = {
    height: "100%",
    margin: "auto",
}
const Scrollable = styled.div`
    width: 100%;
    height: 55%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow-y: scroll;
    z-index: 1;
    flex-grow: 1;
`;
const StickyRandomNumbers = styled(RandomNumbers)`
    z-index: 1;
`;

const Select = ({
    passRandomNumbers,
    passLoadingStatus,
    passAnimationKey
}) => {
    const [labels, setLabels] = useState({});
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [animationObject, getAnimationObject] = useState(null);


    const history = useHistory();

    // helpers
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(async () => {
        if (!scriptLoaded) {
            console.log("Select.js starting script loading sequence");
            passLoadingStatus("LOADING")
            const key = "idle_clux";
            passAnimationKey(key);
            console.log("passedAnimationKey", key);
            await sleep (5000);
            passLoadingStatus(false)
            setScriptLoaded(true);
        }
    }, [])
    
    // handlers
    const handleBuyTicket = async () => {
        console.log("handleBuyTicket called")
        /*
            -collect ticket data
            -submit all required data to callback function
        */
        // console.log("randomNumbers pushed to checkout state:", randomNumbers)
        history.push('/checkout');
    }
    const handleToSettings = () => {
        history.push('/wallet');
    };
    const handleToHowToPlay = () => {
        history.push('/how');
    }
    
    // html contents
    const playButtonText = "Play Now - $10";

    return (
        <>
            <Header />
            <Scrollable>
                <JackpotCarousel />
                <ChickenCtn>
                    <OuterBackgroundCtn>
                        {/* <InnerBackgroundCtn> */}
                            <Background src={RingPng} />
                        {/* </InnerBackgroundCtn>                         */}
                    </OuterBackgroundCtn>

                    {scriptLoaded && 
                        <IdleChicken> 
                            <AnimateCC 
                                animationName={"CLUX_IDLE_DYNAMIC"}
                                composition={compositions.CLUX.IDLE.DYNAMIC}
                                getAnimationObject={getAnimationObject}
                                paused={false}
                                canvasStyle={canvasStyle}
                            />
                        </IdleChicken>                     
                    }
                </ChickenCtn>
            </Scrollable>                
            <StickyRandomNumbers passRandomNumbers={passRandomNumbers}/>
            <Footer
                origin={"/select"}
                buttonOnClick={handleBuyTicket}
                buttonText={playButtonText}           
            />
        </>
    )
}

export default Select;