// node modules
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Modal } from 'antd';

// react modules
import { WalletContext } from '@utils/context';
import PrimaryButton, { SupportButtons } from '../Common/PrimaryButton';
import RingPng from '@assets/ring.png';
import ChickenPng from '@assets/chicken_placeholder.png';
import Header from '@components/Common/Header';
import { infoNotification } from '@components/Common/Notifications';

// styled css components 
const Background = styled.img`
    position: relative;
    height: 100vh;
    z-index: -4;
    object-fit: cover;
    filter: grayscale(1);
`;
const PlayButton = styled(PrimaryButton)`
    z-index: 1;
    position: absolute;
    top: 80%;
    background-color: ${props => props.active ? '#ffffff' : '#d9dadb'};
    cursor: ${props => props.active ? 'pointer' : 'wait'};
    font-weight: 300;
`;
const Chicken = styled.img`
    z-index: -3;
    position: absolute;
    top: 25%;
    left: 28%;
    height: 400px;
    width: auto;
`;
const InfoBar = styled.div`
    background-color: #ededed;
    padding: 8px 16px;
`;

const WaitingRoom = ({
    passLoadingStatus, 
    passTicket,
    purchasedTicket
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
        infoNotification("Your ticket's block has not been finalized yet. Please wait.")
        // manually turn off loading
        passLoadingStatus(false);

        if (tickets?.length > 0) {
            const ticketsAwaitingBlock = tickets.filter(ticket => !ticket.block);
            const ticketsToBeRedeemed = tickets.filter(ticket => ticket.block && !ticket.payout)

            setUnconfirmedTickets(ticketsAwaitingBlock);
            setOpenTickets(ticketsToBeRedeemed);
        }

        // simulate waiting time for block --- remove later
        await sleep (7000);
        infoNotification("Your ticket can be redeemed.");
        setGameEnabled(true);
    }, [tickets]);

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
            await sleep(3000);
            passLoadingStatus(false);
            history.push('/game');
        } else 
            waitingInfoModal.info(waitingInfoConfig);
    };


    return (
        <>  
            {waitingInfoHolder}
            {/* {returnInfoHolder} */}
            <Background src={RingPng} />
            <Chicken src={ChickenPng}/>
            <Header />
            <PlayButton onClick={() => handleToGame()} active={gameEnabled}>Redeem</PlayButton>
            <SupportButtons prev="/waitingroom" types={["help" ]} />
        </>

    )
}

export default WaitingRoom;