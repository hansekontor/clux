// node modules
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Flash } from 'react-ruffle';

// react components
import Header from '@components/Header';
import Footer, { SupportBar } from '@components/Footer';
import PlayerNumbers from '@components/PlayerNumbers';
import Button from '@components/Button';
import Background from './components/Background';
import FlexGrow from './components/FlexGrow';
import Backup from './components/Backup';
import InfoText from './components/InfoText';

// core functions
import { useApp, useNotifications, getWalletState } from 'blocklotto-sdk';

// util
import animationLabels from '@utils/animations';
import sleep from '@utils/sleep';

// assets
import LockerPng from '@assets/images/locker.png';


const WaitingRoom = () => {
	const { playerNumbers, wallet, ticketsToRedeem, setGameTickets, gameTickets, checkRedeemability, redeemTicket, isFirstTicket, setLoadingStatus } = useApp();
	const history = useHistory();
	const notify = useNotifications();

	// states
	const [isRedeemable, setIsRedeemable] = useState(false);
	const [activeTicket, setActiveTicket] = useState({});
	const [showBackup, setShowBackup] = useState(isFirstTicket);
	const [redeemHashes, setRedeemHashes] = useState(false);

	// set active ticket to state
	useEffect(() => {
		if (ticketsToRedeem.length > 0) {
			setActiveTicket(ticketsToRedeem[0]);
		} else {
			console.error("No ticket in ticketsToRedeem");
			history.push("/select");
		}
	}, []);

	// wait until ticket is redeemable
	useEffect(() => {
		const checkTicketRedeemability = async () => {
			console.log("checkTicketRedeemability");
			if (activeTicket.redeemTx?.hash) {
				notify({ type: "error", message: "Ticket has already been redeemed."});
				history.push("/select");
				setIsRedeemable(false);
			} else if (activeTicket.issueTx?.height > 0) {
				console.log("issueTx is already mined");
				setIsRedeemable(true);
			} else if (activeTicket.issueTx?.hash) {
				console.log("check if ticket is mined");
				const isRedeemableTicket = await checkRedeemability(activeTicket, true);
				if (isRedeemableTicket) {
					setIsRedeemable(true);
				} else {
					setIsRedeemable(false);
				}
			} else {
				setIsRedeemable(false);
			}
		};

		if (activeTicket) {
			checkTicketRedeemability();
		}
	}, [activeTicket]);

	// prepare tickets for game when ticket was redeemed
	useEffect(() => {
		if (redeemHashes) {
			console.log("WaitingRoom: redeemHash available", redeemHashes);
			const walletState = getWalletState(wallet);
			const { tickets } = walletState;
			console.log("tickets", tickets);
			const redeemedTicket = tickets.find(ticket => ticket.redeemTx?.hash === redeemHashes[0]);
			console.log("found redeemedTicket", redeemedTicket);
			if (redeemedTicket) {
				setGameTickets([redeemedTicket]);
				console.log("gameTickets was set");				
			}
		}
	});

	// move to /game section when gameTickets are available
	useEffect(() => {
		if (gameTickets.length > 0) {
			console.log("gameTickets are available: go to /game");
			history.push("/game");
		}		
	}, [gameTickets]);

	// handlers
	const handleButtonClick = async () => {
		if (isRedeemable) {
			setLoadingStatus("REDEEMING TICKET")
			const newRedeemHash = await redeemTicket(activeTicket);
			setRedeemHashes([newRedeemHash]);
		} else {
			history.push("/select");
		}
	}

	const handleCloseBackup = () => {
		setShowBackup(false);
	}

	const playerNumbersFromTicket = activeTicket?.parsed?.playerNumbers;
	const animationName = animationLabels.CLUX.IDLE.SHADOWBOX;
	const animationPath = animationLabels.PUBLICPATH + animationName;
	const buttonText = isRedeemable ? "Redeem Ticket" : "Purchase another Ticket";

	return (
		<>	

			<Background src={LockerPng} />
			<Header $transparent={true} />
			<FlexGrow>			
				
				{showBackup ? (
					<Backup 
						close={handleCloseBackup}
					/>
				) : (
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
						<div></div>
					</Flash>					
				)}

			</FlexGrow>
			<Footer variant="empty">
				{!isRedeemable && 
					<InfoText>Expected waiting time for your ticket is 10 minutes. You can either wait here or redeem at a later time.</InfoText>
				}
				<br></br>
				<PlayerNumbers overrideNumbers={playerNumbersFromTicket ? playerNumbersFromTicket : playerNumbers} />
				<Button onClick={handleButtonClick}>
					{buttonText}
				</Button>
				<SupportBar />
			</Footer>
		</>

	)
}

export default WaitingRoom;
