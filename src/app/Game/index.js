// node modules
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// assets and other
import VersusPng from '@assets/images/versus.png';
import RingPng from '@assets/images/ring_on_beach.png';

// util
import animationLabels from '@utils/animations';
import sleep from '@utils/sleep';

// core functions
import { useApp } from 'blocklotto-sdk';;

// react components
import Button from '@components/Button';
import Header from '@components/Header';
import Footer from '@components/Footer';
import { ResultingNumbers } from '@components/PlayerNumbers';
import Background from './components/Background'
import FlexGrow from './components/FlexGrow';
import CustomFlash from './components/CustomFlash';
import Animation from './components/Animation';
import FadeOut from './components/FadeOut';
import SlideIn from './components/SlideIn';
import Versus from './components/Versus';

const Game = () => {
	const { setLoadingStatus, gameTickets } = useApp();
	const history = useHistory();

	const [animationStage, setAnimationStage] = useState("faceoff");
	const [fightStarted, setFightStarted] = useState(false);
	const [versus, setVersus] = useState(false);
	const [fadeOutVersus, setFadeOutVersus] = useState(false);
	const [gameSettings, setGameSettings] = useState(false);

	// redirect if either activeTicket or its required data is unavailable 
	useEffect(() => {
		const activeTicket = gameTickets[0];
		console.log("Game activeTicket:", activeTicket);
		if (!activeTicket) {
			console.error("/game: No active ticket was found.")
			setLoadingStatus("TICKET NOT FOUND");
			sleep(1000);
			history.push("/select");
		} else if (!activeTicket.parsed?.resultingNumbers) {
			console.error("/game: active ticket is not parsed");
			setLoadingStatus("TICKET DATA NOT FOUND");
			sleep(3000);
			history.push("/select");
		} else {
			const resultingNumbers = activeTicket.parsed.resultingNumbers;
			const tier = activeTicket.parsed.tier;
			const isWinner = tier !== 0;
			const winnerLabel = isWinner ? "A" : "B";
			const labels = {
				faceoff: animationLabels.CLUX.NORRIS.FACEOFF,
				fight: animationLabels.CLUX.NORRIS[winnerLabel].FIGHT,
				celebration: isWinner ? animationLabels.CLUX.NORRIS.A.CELEBRATIONS[tier] : animationLabels.CLUX.NORRIS.B.CELEBRATION
			};
			const settings = {
				resultingNumbers,
				tier,
				labels
			};
			setGameSettings(settings);
			setLoadingStatus(false);
		}
	}, [])

	// slide-in and fadeout animation for versus
	useEffect(() => {
		const handleVersus = async () => {
			await sleep(1000);
			setVersus(true);
		};
		handleVersus();
	}, [])

	// switch from fight to celebration animation
	useEffect(() => {
		const handleAnimationStage = async () => {
			if (animationStage === "fight") {
				await sleep(4000);
				setAnimationStage("celebration");
				document.getElementById(gameSettings.labels.celebration).startCelebrationAnimation();
			}
		};
		handleAnimationStage();
	}, [animationStage])

	// go to result page automatically
	useEffect(() => {
		const handleCelebration = async () => {
			if (animationStage === "celebration") {
				await sleep(3000);
				setLoadingStatus("LOADING RESULT");
				handleResultRedirect();
			}
		};
		handleCelebration();
	}, [animationStage])

	const handlePlay = async () => {
		setFadeOutVersus(true);
		setAnimationStage("fight");
		document.getElementById(gameSettings.labels.fight).startFightAnimation();
		setFightStarted(true);
    }

	const handleResultRedirect = () => {
        history.push("/result");
    }

	const folder = animationLabels.PUBLICPATH;

	return (
		<>
			<Background src={RingPng} />
			<Header $transparent={true} />
			{gameSettings.resultingNumbers && (
				<>
					<FlexGrow>
						<SlideIn>
							{versus &&
								<FadeOut $fadeOut={fadeOutVersus}>
									<Versus src={VersusPng} />
								</FadeOut>
							}

						</SlideIn>
						{gameSettings.labels && (
							<>
								<Animation $hidden={animationStage !== "faceoff"}>
									<CustomFlash
										src={folder + gameSettings.labels.faceoff}
										config={{
											autoplay: "on",
											unmuteOverlay: "hidden",
											splashScreen: false,
											contextMenu: "off",
											allowScriptAccess: true,
											forceScale: true,
											scale: "exactFit",
											wmode: "transparent",
											preferredRenderer: "canvas"
										}}
										id={gameSettings.labels.faceoff}
										style={{
											width: "960px", height: "600px", position: "absolute", marginLeft: "15%"
										}}
									>
										<div></div>
									</CustomFlash>
								</Animation>
								<Animation $hidden={animationStage !== "fight"}>
									<CustomFlash
										src={folder + gameSettings.labels.fight}
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
										id={gameSettings.labels.fight}
										style={{ width: "960px", height: "600px" }}
									>
										<div></div>
									</CustomFlash>
								</Animation>
								<Animation $hidden={animationStage !== "celebration"}>
									<CustomFlash
										src={folder +gameSettings.labels.celebration}
										config={{
											autoplay: "on",
											unmuteOverlay: "hidden",
											splashScreen: false,
											contextMenu: "off",
											allowScriptAccess: true,
											forceScale: true,
											scale: "exactFit",
											wmode: "transparent",
											preferredRenderer: "canvas"
										}}
										id={gameSettings.labels.celebration}
										style={{ width: "960px", height: "600px" }}
									>
										<div></div>
									</CustomFlash>
								</Animation>
							</>
						)}
					</FlexGrow>
					<Footer variant="empty">
						<ResultingNumbers
							numberArray={gameSettings.resultingNumbers}
							active={fightStarted}
						/>
						<Button onClick={handlePlay} grey={fightStarted} disabled={fightStarted}>
							Fight
						</Button>
					</Footer>
				</>
			)}
		</>
	)
}

export default Game;