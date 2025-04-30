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
 
// core functions
import { useApp } from 'blocklotto-sdk';

// util
import animationLabels from '@utils/animations';
import sleep from '@utils/sleep';

// assets
import LockerPng from '@assets/images/locker.png';


const WaitingRoom = () => {
	const { playerNumbers, ticketsToRedeem, setGameTickets, checkRedeemability, redeemTicket } = useApp();
	const history = useHistory();

	// states
	const [isRedeemable, setIsRedeemable] = useState(false);
	const [activeTicket, setActiveTicket] = useState({});

	// set active ticket to state
	useEffect(() => {
		setActiveTicket(ticketsToRedeem[0]);
	}, []);

	// wait until ticket is redeemable
	// useEffect(async () => {
	// 	if (Object.keys(activeTicket).length > 0) {
	// 		const isRedeemableTicket = await checkRedeemability(activeTicket, true);
	// 		if (isRedeemableTicket) {
	// 			setIsRedeemable(true);
	// 		} else {
	// 			setIsRedeemable(false);
	// 		}
	// 	} else {
	// 		setIsRedeemable(false);
	// 	}
	// }, [activeTicket])

	// handlers
	const handleButtonClick = async () => {
		if (isRedeemable) {
			await redeemTicket(activeTicket);
			setGameTickets([activeTicket]);
			await sleep(1000);
			history.push("/game");
		}
	}

	const playerNumbersFromTicket = activeTicket?.parsed?.playerNumbers;
	const animationName = animationLabels.CLUX.IDLE.SHADOWBOX;
	const animationPath = animationLabels.PUBLICPATH + animationName;
	const buttonText = isRedeemable ? "Redeem Ticket" : "Wait...";

	return (
		<>
			<Background src={LockerPng} />
			<Header $transparent={true} />
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
					<div></div>
				</Flash>
			</FlexGrow>
			<Footer variant="empty">
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
