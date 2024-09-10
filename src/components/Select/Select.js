// modules
import React, { useState, useEffect, useContext } from "react";
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Flash } from 'react-ruffle';

// react components
import Header from '@components/Common/Header';
import JackpotCarousel from '@components/Common/Jackpot';
import RandomNumbers from '@components/Common/RandomNumbers';
import Footer from '@components/Common/Footer';
import { FadeOutAnimationShort } from '@components/Common/CssAnimations';
import { WalletCtn } from '@components/App';
import { WalletContext } from '@utils/context';
import { getWalletState } from '@utils/cashMethods'

// util
import animationLabels from '@utils/animations.js';


// assets
import RingPng from '@assets/ring_on_beach.png';


// styled css components
const ChickenCtn = styled.div`
    background-color: #fefffe;
    border-radius: 24px;
    border-style: none;
    width: 90%;
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
    width: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
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
const FadeOut = styled(WalletCtn)`
    box-shadow: none;
    animate: fade-out 1s ease-out both;
    ${FadeOutAnimationShort}    
`;


const Select = ({
    passRandomNumbers,
    passLoadingStatus,
    passAnimationKey
}) => {
    const [labels, setLabels] = useState({});
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [animationObject, getAnimationObject] = useState(null);
    const [fadeOut, setFadeOut] = useState(false);


    const history = useHistory();

    // find ticket indicator
    const ContextValue = useContext(WalletContext);
    const { wallet } = ContextValue;
    const { tickets } = getWalletState(wallet);
    const unredeemedTickets = tickets.filter((ticket) => !ticket.payout);
 
    // helpers
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // handlers
    const handleBuyTicket = async () => {
        setFadeOut(true);
        await sleep(300);

        history.push('/checkout');
    }
    
    // html contents
    const playButtonText = "Play Now - $10";
    const animationName = animationLabels.CLUX.IDLE.DYNAMIC;
    const animationPath = animationLabels.PUBLICPATH + animationName;


    return (
        <FadeOut fadeOut={fadeOut}>
            <Header />
            <Scrollable>
                <JackpotCarousel />
                <ChickenCtn>
                    <OuterBackgroundCtn>
                        <Background src={RingPng} />
                    </OuterBackgroundCtn>

                        <IdleChicken> 
                            <Flash 
                                src={animationPath}
                                config={{
                                    autoplay: "on",
                                    unmuteOverlay: "hidden",
                                    splashScreen: false,
                                    contextMenu: "off",
                                    allowScriptAccess: true,
                                    forceScale: true,
                                    scale: "exactFit",
                                    wmode: "transparent"                                    
                                }}
                                id={animationName}
                            >
                                <div>PLACEHOLDER</div>
                            </Flash>
                        </IdleChicken>                     
                    
                </ChickenCtn>
            </Scrollable>                
            <StickyRandomNumbers passRandomNumbers={passRandomNumbers} background={'#1A1826'}/>
            <Footer
                origin={"/select"}
                buttonOnClick={handleBuyTicket}
                buttonText={playButtonText}    
                ticketIndicator={unredeemedTickets.length}
            />
        </FadeOut>
    )
}

export default Select;