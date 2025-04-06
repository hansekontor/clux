// node modules
import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { Flash } from 'react-ruffle';

// assets
import RingPng from '@assets/images/ring_on_beach.png';

// core functions
import { useSelect } from "@core/context/Select";

// util
import animationLabels from '@utils/animations.js';
import sleep from '@utils/sleep';

// react components
import Header from '@components/Header';
import JackpotCarousel from '@components/Jackpot';
import Footer from '@components/Footer';
import { Scrollable } from '@components/Common';
import FadeOut from "./components/FadeOut";
import AnimationContainer from "./components/AnimationContainer";
import BackgroundContainer from "./components/BackgroundContainer";
import Background from "./components/Background";
import FlashContainer from "./components/FlashContainer";
import PlayerNumbers from "./components/PlayerNumbers";


const Select = () => {
    const { geoTicketAccess } = useSelect();
    const [fadeOut, setFadeOut] = useState(false);
    const history = useHistory();

    // DOM contents
    // const playButtonText = "Play Now - $10";
    const playButtonText = geoTicketAccess ? "Play Now - $10 - DEMO" : "Affiliate Something";
    const animationName = animationLabels.CLUX.IDLE.DYNAMIC;
    const animationPath = animationLabels.PUBLICPATH + animationName;

    const handleBuyTicket = async () => {
        setFadeOut(true);
        await sleep(300);

        history.push('/checkout');
    }

    return (
        <FadeOut $fadeOut={fadeOut}>
            <Header $transparent={true} />
            <Scrollable>
                <JackpotCarousel />
                <AnimationContainer>
                    <BackgroundContainer>
                        <Background src={RingPng} />
                    </BackgroundContainer>
                    <FlashContainer>
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
                                wmode: "transparent",
                                preferredRenderer: "canvas"
                            }}
                            id={animationName}
                        >
                            <div></div>
                        </Flash>
                    </FlashContainer>
                </AnimationContainer>
            </Scrollable>
            {geoTicketAccess && (
                <PlayerNumbers background={'#1A1826'} />
            )}
            <Footer
                origin={"/select"}
                buttonOnClick={handleBuyTicket}
                buttonText={playButtonText}
            />
        </FadeOut>
    )
}

export default Select;