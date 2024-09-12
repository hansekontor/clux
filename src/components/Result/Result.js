// node modules
import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

// custom react components
import Header from '@components/Common/Header';
import Footer from '@components/Common/Footer'
import { TicketResult } from '@components/Common/Jackpot';
import RandomNumbers from '@components/Common/RandomNumbers';
import { WhiteCashoutButton, WhiteTicketButton } from '@components/Common/PrimaryButton';

// util
import { WalletContext } from '@utils/context';
import { getWalletState } from '@utils/cashMethods'

// assets
import Placeholder from '@assets/ring_on_beach.png';

// styled css components
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
const ButtonCtn = styled.div`
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding-bottom:16px;
`;

const Result = ({
    passLoadingStatus,
    ticket,
}) => {
    const history = useHistory();
    const ContextValue = useContext(WalletContext);
    const { wallet } = ContextValue;
    const walletState = getWalletState(wallet)
    const { tickets } = walletState;
    const unredeemedTickets = tickets.filter((ticket) => !ticket.payout);

    // manually stop loading screen
    useEffect(()=>{
        passLoadingStatus(false);
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
                <ButtonCtn>
                    <WhiteCashoutButton />
                    <WhiteTicketButton id={ticket.id}/>
                </ButtonCtn>
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