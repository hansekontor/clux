// node modules
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Flash } from 'react-ruffle';

// custom react components
import Header from '@components/Header';
import Footer from '@components/Footer'
import { TicketResult } from '@components/Jackpot';
import RandomNumbers from '@components/RandomNumbers';
import { WhiteCashoutButton, WhiteTicketButton } from '@components/PrimaryButton';

import * as S from './components/Styled';

// util
import animationLabels from '@animations/animations';

// core functions
import { useWallet } from '@core/context/Wallet';
import { getWalletState } from '@core/utils/cashMethods'
import sleep from '@core/utils/sleep';


const Result = ({
    passLoadingStatus,
    redeemAll
}) => {
    const history = useHistory();
	const location = useLocation();
    const { wallet } = useWallet();
    const walletState = getWalletState(wallet)
    const { tickets, slpBalancesAndUtxos } = walletState;
    const unredeemedTickets = tickets.filter(ticket => !ticket.redeemTx);
    const unredeemedIndicator = unredeemedTickets.length;
    const redeemableTickets = tickets.filter(ticket => ticket.issueTx.height > 0 && !ticket.redeemTx);
    const availableTickets = tickets.filter(ticket => !ticket.redeemTx);
	const [ticket,] = useState(location.state?.ticket || false);
    const [nextTicket, setNextTicket] = useState(false);

    // manually stop loading screen
    useEffect(async () => {
		if (ticket) {
	        passLoadingStatus(false);
            if (redeemAll) {
                let nextTicket;
                if (redeemableTickets.length > 0) {
                    nextTicket = redeemableTickets.find(newTicket => newTicket.issueTx.hash !== ticket.issueTx.hash);
                } else if (availableTickets.length > 0) {
                    nextTicket = availableTickets.find(newTicket => newTicket.issueTx.hash !== ticket.issueTx.hash);
                }
                
                if (nextTicket)     
                    setNextTicket(nextTicket);
            }
		} else {
			passLoadingStatus("NO TICKET SELECTED");
			await sleep(2000);
			history.push("/select")
		}
    }, [ticket]);

    // handlers
    const handleButtonClick = () => {
        if (nextTicket) {
            history.push({
                pathname: '/waitingroom', 
                state: {
                    ticketToRedeem: nextTicket
                }
            });
        } else {
            history.push('/select');
        }
    }

    // DOM variables
    const buttonText = nextTicket ? "Redeem Next Ticket" : "Play Again";
	const displayAmount = ticket?.details?.redemption?.actualPayoutNum / 100;

    const animationName = ticket?.details?.redemption?.actualPayoutNum > 0 ? animationLabels.CLUX.IDLE.WIN : animationLabels.CLUX.IDLE.LOSE;
    const animationPath = animationLabels.PUBLICPATH + animationName;

    return (
        <>
            <Header $transparent={true} />
            <S.Scrollable>
					<S.FlashCtn>             
						{animationLabels && 
							<S.StyledFlash                
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
							</S.StyledFlash> 							
						}   
		
					</S.FlashCtn>

                <S.Ticket>
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
                </S.Ticket>
                <S.ButtonCtn>
                    <WhiteCashoutButton />
                    <WhiteTicketButton />
                </S.ButtonCtn>
            </S.Scrollable>
            <Footer
				// directly go to select from result because result can not displayed correctly afterwards
                origin={"/select"}
                buttonOnClick={handleButtonClick}
                buttonText={buttonText}
                ticketIndicator={unredeemedIndicator}
                slpBalances={slpBalancesAndUtxos}
            />
        </>
    )
}

export default Result;