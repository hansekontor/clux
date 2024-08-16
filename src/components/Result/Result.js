import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

// custom react components
import Header from '@components/Common/Header';
import Footer from '@components/Common/Footer'
import { PayoutAmount } from '@components/Common/Jackpot';
import TicketOptions from './TicketOptions';
import { WalletContext } from '@utils/context';
import { getWalletState } from '@utils/cashMethods'


// assets
import Placeholder from '@assets/ring_on_beach.png';

const ChickenZoomIn = styled.img`
    border-radius: 12px;
    width: 90%;
    height: 40%;
    flex-grow: 1;
    min-height: 300px;
`;
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
    gap: 16px;
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
                <PayoutAmount amount={location.state?.payoutAmount || 40}/>
                <TicketOptions ticket={ticket}/>
            </Scrollable>

            <Footer
                origin={"/result"}
                buttonOnClick={handlePlayAgain}
                buttonText={playButtonText}
                randomNumbers={ticket?.numbers || [4,1,13,7]}
                ticketIndicator={unredeemedTickets.length}
            />
        </>
    )
}

export default Result;