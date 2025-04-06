// node modules
import React, { useState, useEffect } from 'react';

// react components
import Button from '@components/Button';
import Header from '@components/Header';
import Footer from '@components/Footer';
import { ResultingNumbers } from '@components/PlayerNumbers';

import * as S from './components/Styled';

// assets and other
import VersusPng from '@assets/images/versus.png';
import RingPng from '@assets/images/ring_on_beach.png';

// util
import animationLabels from '@utils/animations';
import sleep from '@utils/sleep';

// core functions
import { useGame } from '@core/context/Game';
import { useApp } from '@core/context/App';

const Game = () => {
	const { isWinner, resultingNumbers, handleResultRedirect } = useGame();
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

	const playButtonText = "Fight";
	const folder = animationLabels.PUBLICPATH;

	return (
		<>
			<S.Background src={RingPng} />
			<Header $transparent={true} />
			{resultingNumbers && (
				<>
					<S.FlexGrow>
						<S.SlideIn>
							{versus &&
								<S.FadeOut $fadeOut={fadeOutVersus}>
									<S.Versus src={VersusPng} />
								</S.FadeOut>
							}

						</S.SlideIn>
						{labels && (
							<>
								<S.Animation $hidden={animationStage !== "faceoff"}>
									<S.CustomFlash
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
										style={S.faceoffAnimationStyle}
									>
										<div></div>
									</S.CustomFlash>
								</S.Animation>
								<S.Animation $hidden={animationStage !== "fight"}>
									<S.CustomFlash
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
										style={S.animationStyle}
									>
										<div></div>
									</S.CustomFlash>
								</S.Animation>
								<S.Animation $hidden={animationStage !== "celebration"}>
									<S.CustomFlash
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
										style={S.animationStyle}
									>
										<div></div>
									</S.CustomFlash>
								</S.Animation>
							</>
						)}
					</S.FlexGrow>
					<Footer variant="empty">
						<ResultingNumbers
							numberArray={resultingNumbers}
							active={fightStarted}
						/>
						<Button onClick={handlePlay} grey={fightStarted} disabled={fightStarted}>
							{playButtonText}
						</Button>
					</Footer>
				</>
			)}
		</>
	)
}

export default Game;