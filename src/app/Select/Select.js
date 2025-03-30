// node modules
import React, { useState, useEffect, useContext } from "react";
import { useHistory } from 'react-router-dom';
import { Flash } from 'react-ruffle';
import PropTypes from 'prop-types';

// react components
import Header from '@components/Header';
import JackpotCarousel from '@components/Jackpot';
import Footer from '@components/Footer';
import { Scrollable } from '@components/Container';

// util
import animationLabels from '@utils/animations.js';
import { WalletContext } from '@utils/context';
import { getWalletState } from '@utils/cashMethods'

// assets
import RingPng from '@assets/ring_on_beach.png';

import * as Styled from "./styles";


const Select = ({
    passRandomNumbers,
    passLoadingStatus,
	user
}) => {
    const history = useHistory();

    const ContextValue = useContext(WalletContext);
    const { wallet } = ContextValue;
    const { tickets, slpBalancesAndUtxos } = getWalletState(wallet);
    const unredeemedIndicator = tickets.filter(ticket => !ticket.redeemTx).length;

    const [fadeOut, setFadeOut] = useState(false);

	console.log("wif", wallet.Path1899.fundingWif);

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

	const handleButtonClick = () => {
		if (user.ipGeo.ticketPurchase)
			return handleBuyTicket();
		else 
			console.log("Affiliate Placeholder")
	}

    // manually turn off loading after error redirects...
    // check if this interferes with initial wallet loading 
    useEffect(async () => {
        passLoadingStatus(false);
    });

    const handleBuyTicket = async () => {
        setFadeOut(true);
        await sleep(300);

        history.push('/checkout');
    }
    
    // DOM contents
	// const playButtonText = "Play Now - $10";
	const playButtonText = user.ipGeo.ticketPurchase ? "Play Now - $10 - DEMO" : "Affiliate Something";
    const animationName = animationLabels.CLUX.IDLE.DYNAMIC;
    const animationPath = animationLabels.PUBLICPATH + animationName;


    return (
        <Styled.FadeOut $fadeOut={fadeOut}>
            <Header $transparent={true}/>
            <Scrollable>
                <JackpotCarousel />
                <Styled.AnimationCtn>
                    <Styled.BackgroundCtn>
                        <Styled.Background src={RingPng} />
                    </Styled.BackgroundCtn>
                        <Styled.FlashCtn> 
                            <Flash 
                                src={animationPath}
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
                                id={animationName}
                            >
                                <div></div>
                            </Flash>
                        </Styled.FlashCtn>                     
                </Styled.AnimationCtn>
            </Scrollable>       
			{user.ipGeo.ticketPurchase && (
				<Styled.StickyRandomNumbers 
					passRandomNumbers={passRandomNumbers} 
					background={'#1A1826'}
				/>				
			)}         
            <Footer
                origin={"/select"}
                buttonOnClick={handleButtonClick}
                buttonText={playButtonText}    
                ticketIndicator={unredeemedIndicator}
				slpBalances={slpBalancesAndUtxos}
            />
        </Styled.FadeOut>
    )
}

Select.propTypes = {
	passPlayerNumbers: PropTypes.func, 
	passLoadingStatus: PropTypes.func
}

export default Select;