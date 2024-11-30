// node modules
import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
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
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding-bottom:16px;
`;

const Result = ({
    passLoadingStatus,
    ticket,
}) => {
    const history = useHistory();
    const ContextValue = useContext(WalletContext);
    const { wallet } = ContextValue;
    const walletState = getWalletState(wallet)
    const { tickets } = walletState;
    const unredeemedTickets = tickets.filter((ticket) => !ticket.payout);

    // manually stop loading screen
    useEffect(()=>{
        passLoadingStatus(false);
    });

    // handlers
    const handlePlayAgain = () => {
        history.push('/select');
    }

    // DOM variables
    const playButtonText = "Play Again";

	const payoutAmount = 20;
    const animationName = payoutAmount > 0 ? animationLabels.CLUX.IDLE.WIN : animationLabels.CLUX.IDLE.LOSE;
    const animationPath = animationLabels.PUBLICPATH + animationName;

    return (
        <>
            <Header />
            <Scrollable>
					<FlashCtn>                
						{/* <Background src={ChickenBackgroundPng}/> */}
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
					</FlashCtn>

                <Ticket>
                    <TicketResult 
                        amount={location.state?.payoutAmount || 20}
                    />
                    <RandomNumbers 
                        fixedRandomNumbers={ticket.numbers || [4,1,13,7]}
                        background={"#1A1826"}
                    />                  
                </Ticket>
                <ButtonCtn>
                    <WhiteCashoutButton />
                    <WhiteTicketButton id={ticket.id}/>
                </ButtonCtn>
            </Scrollable>
            <Footer
                origin={"/result"}
                buttonOnClick={handlePlayAgain}
                buttonText={playButtonText}
                ticketIndicator={unredeemedTickets.length}
            />
        </>
    )
}

export default Result;