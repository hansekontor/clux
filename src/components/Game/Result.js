import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

// custom react components
import Header from '@components/Common/Header';
import Footer from '@components/Common/Footer'
import { PayoutAmount } from '@components/Common/Jackpot';
import TicketOptions from './TicketOptions';

// assets
import Placeholder from '@assets/ring_on_beach.png';

const ChickenZoomIn = styled.img`
    border-radius: 12px;
    width: 88%;
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
                <TicketOptions />
            </Scrollable>

            <Footer
                origin={"/result"}
                buttonOnClick={handlePlayAgain}
                buttonText={playButtonText}
                randomNumbers={ticket?.numbers || [4,1,13,4]}
            />
        </>
    )
}

export default Result;