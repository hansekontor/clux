// node modules
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Flash } from 'react-ruffle';

// custom react components
import Header from '@components/Common/Header';
import Footer from '@components/Common/Footer'
import { TicketResult } from '@components/Common/Jackpot';
import RandomNumbers from '@components/Common/RandomNumbers';
import { WhiteCashoutButton, WhiteTicketButton } from '@components/Common/PrimaryButton';

// util
import { WalletContext } from '@utils/context';
import { getWalletState } from '@utils/cashMethods'
import animationLabels from '@utils/animations';

// assets
import ChickenBackgroundPng from '@assets/ResultBackground.png';

// styled css components
const FlashCtn = styled.div`
    border-radius: 12px;
    width: 90%;
    height: 40%;
    flex-grow: 1;
	background-image: url(${ChickenBackgroundPng});
	position: relative;
	display: flex;
	justify-content:center;
	overflow: hidden;
`;
const StyledFlash = styled(Flash)`
	position: absolute;
	bottom: 0;
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
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding-bottom: 16px;
`;

const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}


const Result = ({
    passLoadingStatus,
}) => {
    const history = useHistory();
	const location = useLocation();
    const ContextValue = useContext(WalletContext);
    const { wallet } = ContextValue;
    const walletState = getWalletState(wallet)
    const { tickets } = walletState;
    const unredeemedIndicator = tickets.filter(ticket => !ticket.redeemTx).length;
	const [ticket,] = useState(location.state?.ticket || false);
	console.log("RESULT ticket", ticket?.details?.redemption)

    // manually stop loading screen
    useEffect(async () => {
		if (ticket)
	        passLoadingStatus(false);
		else {
			passLoadingStatus("NO TICKET SELECTED");
			await sleep(2000);
			history.push("/select")
		}
    }, [ticket]);

    // handlers
    const handlePlayAgain = () => {
        history.push('/select');
    }

    // DOM variables
    const playButtonText = "Play Again";
	const displayAmount = ticket?.details?.redemption?.actualPayoutNum / 100;

    const animationName = ticket?.details?.redemption?.actualPayoutNum > 0 ? animationLabels.CLUX.IDLE.WIN : animationLabels.CLUX.IDLE.LOSE;
    const animationPath = animationLabels.PUBLICPATH + animationName;

    return (
        <>
            <Header />
            <Scrollable>
					<FlashCtn>             
						{animationLabels && 
							<StyledFlash                
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
							</StyledFlash> 							
						}   
		
					</FlashCtn>

                <Ticket>
					{ticket && (
						<>
							<TicketResult 
								amount={displayAmount}
							/>			
							<RandomNumbers 
								fixedRandomNumbers={ticket.details.redemption.resultingNumbers}
								background={"#1A1826"}
							/>  						
						</>
					)}
                </Ticket>
                <ButtonCtn>
                    <WhiteCashoutButton />
                    <WhiteTicketButton />
                </ButtonCtn>
            </Scrollable>
            <Footer
                origin={"/result"}
                buttonOnClick={handlePlayAgain}
                buttonText={playButtonText}
                ticketIndicator={unredeemedIndicator}
            />
        </>
    )
}

export default Result;