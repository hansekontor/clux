// node modules
import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Modal } from 'antd';
import { Flash } from 'react-ruffle';

// react components
import { WalletContext } from '@utils/context';
import Header from '@components/Common/Header';
import Footer from '@components/Common/Footer';
import { getWalletState } from '@utils/cashMethods'
import { successNotification } from '@components/Common/Notifications';

// util
import animationLabels from '@utils/animations';

// assets
import LockerPng from '@assets/locker.png';

// styled css components 
const Background = styled.img`
    position: absolute;
    top: 0;
    margin-left: auto;
    margin-right: auto;
    height: 85vh;
    z-index: -4;
    object-fit: cover;
`;
const FlexGrow = styled.div`
    flex-grow: 1;
    display: flex; 
    flex-direction: column;
    justify-content: flex-end;
`;

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const WaitingRoom = ({
    passLoadingStatus, 
    activeTicket, 
    updateActiveTicket
}) => {
    const history = useHistory();
    const ContextValue = useContext(WalletContext);
    const { wallet } = ContextValue;
    const walletState = getWalletState(wallet)
    const { tickets } = walletState;
    const unredeemedTickets = tickets.filter((ticket) => !ticket.payout);

    // states
    const [gameEnabled, setGameEnabled] = useState(false);
    const [waitingInfoModal, waitingInfoHolder] = Modal.useModal();
    const [ticketData, setTicketData] = useState(false);

    // hooks
    useEffect(async () => {
        // manually turn off loading screen
        passLoadingStatus(false);
    }, [])
    useEffect(async () => { 
        // find active ticket data in tickets from wallet state
        if (activeTicket) {
            const activeTicketData = tickets.find((ticket) => ticket.id === activeTicket.id);
            if (!activeTicketData) {
                console.log("Error: TICKET NOT FOUND");
            } else {
                updateActiveTicket(activeTicketData);
                setTicketData(activeTicketData)
            }
        }
    }, []);
    useEffect(async () => {
        // simulate waiting time for block --- remove later
        await sleep (1000);
        successNotification("You can redeem your Ticket now");
        setGameEnabled(true);       
    }, [])

    // variables in DOM
    const waitingInfoText = "Your ticket has been broadcasted but its block was not finalized yet. After that, your ticket can be redeemed. Average time between blocks is 10 minutes."
    const waitingInfoConfig = {
        content: <p>{waitingInfoText}</p>
    }
    const animationName = animationLabels.CLUX.SHADOWBOX;
    const animationPath = animationLabels.PUBLICPATH + animationName;

    // handlers
    const handleToGame = async () => {
        if (gameEnabled) {
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
            <Background src={LockerPng} />
            <Header />
            <FlexGrow>
                <Flash                
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
                        <div>FLASH PLACEHOLDER</div>
                </Flash>                    
            </FlexGrow>
            <Footer 
                origin={"/waitingroom"}
                randomNumbers={activeTicket.playerChoice || ticketData.playerChoice}
                buttonOnClick={handleToGame}
                buttonText={buttonText}
                ticketIndicator={unredeemedTickets.length}
            />
        </>

    )
}

export default WaitingRoom;
