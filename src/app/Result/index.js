// node modules
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// util
import animationLabels from '@utils/animations';

// core functions
import { useApp } from 'blocklotto-sdk';

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
    const { gameTickets, setGameTickets, ticketsToRedeem } = useApp();
    const history = useHistory();
    const activeTicket = gameTickets[0];
    const redemptionsOutstanding = ticketsToRedeem.length > 0;
    console.log("Result outstanding redemptions", ticketsToRedeem);

    // redirect if ticket data missing
    useEffect(() => {
        if (!activeTicket) {
            sleep(1000);
            history.push("/select");
        } else if (!activeTicket.parsed) {
            sleep(1000);
            history.push("/select");
        }
    },[])

    // DOM variables
    const amount = activeTicket.parsed?.payoutAmountNum / 100;
    const resultingNumbers = activeTicket.parsed?.resultingNumbers;
    const buttonText = redemptionsOutstanding ? "Redeem Next Ticket" : "Play Again";
    const isWinner = amount > 0;
    const animationName = isWinner ? animationLabels.CLUX.IDLE.WIN : animationLabels.CLUX.IDLE.LOSE;
    const animationPath = animationLabels.PUBLICPATH + animationName;

    // handlers
    const handleRedirect = () => {
        setGameTickets([]);
        if (ticketsToRedeem.length > 0) {
            console.log("tickets available: go to waiting room");
            history.push('/waitingroom');
        } else {
            console.log("no more tickets: go to select");
            history.push('/select');
        }
    }

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
                    {(amount >= 0 && resultingNumbers?.length === 4) && (
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