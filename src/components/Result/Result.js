import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

// custom react components
import Header from '@components/Common/Header';
import Footer from '@components/Common/Footer'
import TicketOptions from './TicketOptions';
import { WalletContext } from '@utils/context';
import { getWalletState } from '@utils/cashMethods'
import { TicketResult } from '@components/Common/Jackpot';
import RandomNumbers from '@components/Common/RandomNumbers';

// assets
import Placeholder from '@assets/ring_on_beach.png';

const ChickenZoomIn = styled.img`
    border-radius: 12px;
    width: 90%;
    height: 40%;
    flex-grow: 1;
`;
const Scrollable = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow-y: scroll;
    z-index: 1;
    flex-grow: 1;
    gap: 16px;
    height: 70%;
`;
const Ticket = styled.div`
    width: 100%;
    display: flex; 
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;



const Result = ({
    passLoadingStatus,
    ticket,
    passAnimationKey
}) => {
    // hooks
    const history = useHistory();
    const ContextValue = useContext(WalletContext);
    const { wallet } = ContextValue;
    const walletState = getWalletState(wallet)
    const { tickets } = walletState;
    const unredeemedTickets = tickets.filter((ticket) => !ticket.payout);


    useEffect(()=>{
        passLoadingStatus(false);
        passAnimationKey(false);
    });

    // handlers
    const handlePlayAgain = () => {
        history.push('/select');
    }

    // DOM variables
    const playButtonText = "Play Again";


    return (
        <>
            <Header />
            <Scrollable>
                <ChickenZoomIn src={Placeholder}/>
                <Ticket>
                    <TicketResult 
                        amount={location.state?.payoutAmount || 20}
                    />
                    <RandomNumbers 
                        fixedRandomNumbers={ticket.numbers || [4,1,13,7]}
                        background={"#1A1826"}
                    />                  
                </Ticket>
                <TicketOptions ticket={ticket}/>
            </Scrollable>


            <Footer
                origin={"/result"}
                buttonOnClick={handlePlayAgain}
                buttonText={playButtonText}
                ticketIndicator={unredeemedTickets.length}
            />
        </>
    )
}

export default Result;