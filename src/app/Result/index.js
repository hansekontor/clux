// node modules
import React from 'react';

// util
import animationLabels from '@utils/animations';

// core functions
import { useResult } from '@core/context/Result';

// custom react components
import Header from '@components/Header';
import Footer from '@components/Footer';
import { TicketResult } from '@components/Jackpot';
import PlayerNumbers from '@components/PlayerNumbers';
import { WhiteCashoutButton, WhiteTicketButton } from '@components/Button';
import Scrollable from './components/Scrollable';
import FlashContainer from './components/FlashContainer';
import StyledFlash from './components/StyledFlash';
import Ticket from './components/Ticket';
import ButtonContainer from './components/ButtonContainer';


const Result = () => {
    const { amount, hasTicket, nextTicket, isWinner, resultingNumbers, handleRedirect } = useResult();

    // DOM variables
    const buttonText = nextTicket ? "Redeem Next Ticket" : "Play Again";

    const animationName = isWinner ? animationLabels.CLUX.IDLE.WIN : animationLabels.CLUX.IDLE.LOSE;
    const animationPath = animationLabels.PUBLICPATH + animationName;

    return (
        <>
            <Header $transparent={true} />
            <Scrollable>
                <FlashContainer>
                    {animationLabels &&
                        <StyledFlash
                            src={animationPath}
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
                            id={animationName}
                        >
                            <div></div>
                        </StyledFlash>
                    }

                </FlashContainer>

                <Ticket>
                    {hasTicket && (
                        <>
                            <TicketResult
                                amount={amount}
                            />
                            <PlayerNumbers
                                overrideNumbers={resultingNumbers}
                                background={"#1A1826"}
                            />
                        </>
                    )}
                </Ticket>
                <ButtonContainer>
                    <WhiteCashoutButton />
                    <WhiteTicketButton />
                </ButtonContainer>
            </Scrollable>
            <Footer
                // directly go to select from result because result can not displayed correctly afterwards
                origin={"/select"}
                buttonOnClick={handleRedirect}
                buttonText={buttonText}
            />
        </>
    )
}

export default Result;