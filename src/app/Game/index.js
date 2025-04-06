// node modules
import React, { useState, useEffect } from 'react';

// assets and other
import VersusPng from '@assets/images/versus.png';
import RingPng from '@assets/images/ring_on_beach.png';

// util
import animationLabels from '@utils/animations';
import sleep from '@utils/sleep';

// core functions
import { useGame } from '@core/context/Game';
import { useApp } from '@core/context/App';;

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
	const { isWinner, tier, resultingNumbers, handleResultRedirect } = useGame();
	const { setLoadingStatus } = useApp();

	const winner = isWinner ? "A" : "B";
	const labels = {
		faceoff: animationLabels.CLUX.NORRIS.FACEOFF,
		fight: animationLabels.CLUX.NORRIS[winner].FIGHT,
		celebration: isWinner ? animationLabels.CLUX.NORRIS.A.CELEBRATIONS[tier] : animationLabels.CLUX.NORRIS.B.CELEBRATION
	}

	const [animationStage, setAnimationStage] = useState("faceoff");
	const [fightStarted, setFightStarted] = useState(false);
	const [versus, setVersus] = useState(false);
	const [fadeOutVersus, setFadeOutVersus] = useState(false);

	// slide-in and fadeout animation for versus
	useEffect(async () => {
		await sleep(1000);
		setVersus(true);
	}, [])

	// switch from fight to celebration animation
	useEffect(async () => {
		if (animationStage === "fight") {
			await sleep(4000);
			setAnimationStage("celebration");
			document.getElementById(labels.celebration).startCelebrationAnimation();
		}
	}, [animationStage])

	// go to result page automatically
	useEffect(async () => {
		if (animationStage === "celebration") {
			await sleep(3000);
			setLoadingStatus("LOADING RESULT");
			handleResultRedirect();
		}
	}, [animationStage])

	const handlePlay = async () => {
		setFadeOutVersus(true);
		setAnimationStage("fight");
		document.getElementById(labels.fight).startFightAnimation();
		setFightStarted(true);
	}

	const folder = animationLabels.PUBLICPATH;

	return (
		<>
			<Background src={RingPng} />
			<Header $transparent={true} />
			{resultingNumbers && (
				<>
					<FlexGrow>
						<SlideIn>
							{versus &&
								<FadeOut $fadeOut={fadeOutVersus}>
									<Versus src={VersusPng} />
								</FadeOut>
							}

						</SlideIn>
						{labels && (
							<>
								<Animation $hidden={animationStage !== "faceoff"}>
									<CustomFlash
										src={folder + labels.faceoff}
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
										id={labels.faceoff}
										style={{
											width: "960px", height: "600px", position: "absolute", marginLeft: "15%"
										}}
									>
										<div></div>
									</CustomFlash>
								</Animation>
								<Animation $hidden={animationStage !== "fight"}>
									<CustomFlash
										src={folder + labels.fight}
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
										id={labels.fight}
										style={{ width: "960px", height: "600px" }}
									>
										<div></div>
									</CustomFlash>
								</Animation>
								<Animation $hidden={animationStage !== "celebration"}>
									<CustomFlash
										src={folder + labels.celebration}
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
										id={labels.celebration}
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
							numberArray={resultingNumbers}
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