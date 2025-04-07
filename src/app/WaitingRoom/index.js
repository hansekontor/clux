// node modules
import React from 'react';
import { Flash } from 'react-ruffle';

// react components
import Header from '@components/Header';
import Footer, { SupportBar } from '@components/Footer';
import PlayerNumbers from '@components/PlayerNumbers';
import Button from '@components/Button';
import Background from './components/Background';
import FlexGrow from './components/FlexGrow';
 
// core functions
import { useWaitingRoom } from '@core/context/WaitingRoom';
import { useApp } from '@core/context/App';

// util
import animationLabels from '@utils/animations';

// assets
import LockerPng from '@assets/images/locker.png';


const WaitingRoom = () => {
	const { playerNumbers } = useApp();
	const { activeTicket, isAlternativeTicket, modalHolder, handleButtonClick } = useWaitingRoom();

	const animationName = animationLabels.CLUX.IDLE.SHADOWBOX;
	const animationPath = animationLabels.PUBLICPATH + animationName;

	const redeemButtonText = isAlternativeTicket ? "Redeem Previous Ticket" : "Redeem Ticket";

	return (
		<>
			{modalHolder}
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
				<PlayerNumbers overrideNumbers={activeTicket ? activeTicket.details.playerNumbers : playerNumbers} />
				<Button onClick={handleButtonClick}>
					{activeTicket ? (
						<>
							{activeTicket.details?.minedTicket?.lottoSignature ? redeemButtonText : "Wait..."}
						</>
					) : (
						<>
							{"Back To Home"}
						</>
					)}
				</Button>
				<SupportBar />
			</Footer>
		</>

	)
}

export default WaitingRoom;
