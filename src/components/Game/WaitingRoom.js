// node modules
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Modal } from 'antd';

// react modules
import { WalletContext } from '@utils/context';
import PrimaryButton from '../Common/PrimaryButton';
import RingPng from '@assets/ring_on_beach.png';
import ChickenPng from '@assets/chicken_placeholder.png';
import Header from '@components/Common/Header';
import Notification from '@components/Common/Notifications';
import Footer from '@components/Common/Footer';


// styled css components 
const Background = styled.img`
    position: absolute;
    top: 0;
    margin-left: auto;
    margin-right: auto;
    height: 100vh;
    z-index: -4;
    object-fit: cover;
`;
const Scrollable = styled.div`
    flex-grow: 1;
    overflow-y: auto;
`;

const WaitingRoom = ({
    passLoadingStatus, 
    passTicket,
    purchasedTicket,
    playerChoice,
    passAnimationKey
}) => {
    console.log("purchasedTicket", purchasedTicket);
    const history = useHistory();
    const ContextValue = useContext(WalletContext);
    const { wallet } = ContextValue;
    const { tickets } = wallet;
    console.log("WaitingRoom wallet", wallet);
    console.log("WaitingRoom tickets", tickets);

    // states
    const [gameEnabled, setGameEnabled] = useState(false);
    const [waitingInfoModal, waitingInfoHolder] = Modal.useModal();
    const [unconfirmedTickets, setUnconfirmedTickets] = useState(false);
    const [openTickets, setOpenTickets] = useState(false);

    // helpers
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // hooks
    useEffect(async () => {
        // manually turn off loading
        passLoadingStatus(false);
        passAnimationKey(false);
    }, [])

    useEffect(async () => { 
        // infoNotification("Your ticket's block has not been finalized yet. Please wait.")


        if (tickets?.length > 0) {
            const ticketsAwaitingBlock = tickets.filter(ticket => !ticket.block);
            const ticketsToBeRedeemed = tickets.filter(ticket => ticket.block && !ticket.payout)

            setUnconfirmedTickets(ticketsAwaitingBlock);
            setOpenTickets(ticketsToBeRedeemed);
        }
    }, [tickets]);

    useEffect(async () => {
        // simulate waiting time for block --- remove later
        await sleep (7000);
        // infoNotification("Your ticket can be redeemed.");
        setGameEnabled(true);       
    }, [])

    // variables in DOM
    const waitingInfoText = "Your ticket has been broadcasted but its block was not finalized yet. After that, your ticket can be redeemed. Average time between blocks is 10 minutes."
    const waitingInfoConfig = {
        content: <p>{waitingInfoText}</p>
    }

    // handlers
    const handleToGame = async () => {
        if (gameEnabled) {
            passTicket(purchasedTicket);
            passLoadingStatus("FETCHING TICKET DATA")
            await sleep(2000);
            passLoadingStatus("REDEEMING TICKET")
            await sleep(2000);
            passLoadingStatus("TICKET REDEEMED");
            await sleep(2000);
            passLoadingStatus(false);
            history.push('/game');
        } else 
            waitingInfoModal.info(waitingInfoConfig);
    };

    const buttonText = "Redeem Ticket";

    return (
        <>  
            {waitingInfoHolder}
            {/* {returnInfoHolder} */}
            {gameEnabled && 
                <Notification type="success" message="You can redeem your Ticket now" />
            }
            <Background src={RingPng} />
            {/* <Chicken src={ChickenPng}/> */}
            <Header />
            <Scrollable></Scrollable>
            <Footer 
                origin={"/waitingroom"}
                randomNumbers={playerChoice}
                buttonOnClick={handleToGame}
                buttonText={buttonText}
                activeButton={!gameEnabled}
            />
        </>

    )
}

export default WaitingRoom;