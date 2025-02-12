// node modules
import React, { useState, Suspense, lazy, useEffect, useContext } from 'react';
import {
    Route,
    Switch,
    Redirect,
    useHistory,
	useLocation
} from 'react-router-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

// css components
import { theme } from '../assets/styles/theme';
// import './App.css';
import '../index.css';

// react components
const Select = lazy(() => import('./Select/Select'));
const Checkout = lazy(() => import('./Checkout/Checkout'));
const Backup = lazy(() => import('./Backup/Backup'));
const WaitingRoom = lazy(() => import('./WaitingRoom/WaitingRoom'));
const Game = lazy(() => import('./Game/Game'));
const Result = lazy(() => import('./Result/Result'));
const Wallet = lazy(() => import('./Wallet/Wallet'));
const Cashout = lazy(() => import('./Cashout/Cashout'));
const NotFound = lazy(() => import('./NotFound'));
const OnBoarding = lazy(() => import('./OnBoarding/OnBoarding'))
import { LoadingAnimation } from '@components/Common/CustomLoader';
import { CashLoadingIcon, LoadingBlock } from '@components/Common/CustomIcons';

import useWallet from '@hooks/useWallet';

// util
import { WalletContext } from '@utils/context';
import { isValidStoredWallet } from '@utils/cashMethods';

// styled css components
const GlobalStyle = createGlobalStyle`    
    .ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-btns > button, .ant-modal > button, .ant-modal-confirm-btns > button, .ant-modal-footer > button, #cropControlsConfirm {
        border-radius: 8px;
        background-color: ${props => props.theme.modals.buttons.background};
        color: ${props => props.theme.wallet.text.primary};
        font-weight: bold;
    }    
    
    .ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-btns > button:hover,.ant-modal-confirm-btns > button:hover, .ant-modal-footer > button:hover, #cropControlsConfirm:hover {
        color: ${props => props.theme.primary};
        transition: color 0.3s;
        background-color: ${props => props.theme.modals.buttons.background};
    }
    
    .ant-spin-text {
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: bold;
        margin-top: 40px;
        font-size: 16px;
        color: ${props => props.theme.wallet.text.secondary};
    }
    .cashLoadingIcon {
        color: #000000 !important;
        font-size: 48px !important;
    }
    table {
        border: 1px solid black;
        border-collapse: collapse;
    }
    th {
        border: 1px solid black;
        border-collapse: collapse;
    }
    td {
        border: 1px solid black;
        border-collapse: collapse;
    }
    .ant-carousel {
        width: 90%;
    }
    .ant-radio-checked {
        background-color: #48445c;
        border-color: #48445c;
    }
        
`;
const CustomApp = styled.div`
    text-align: center;
    font-family: 'Inter-Medium', Helvetica;
    background-color: ${theme.app.background};
`;
export const WalletBody = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    top: 0;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background: #f6f6f6;
    flex-direction: column;
	position: fixed;
	overflow: hidden;
`;
export const WalletCtn = styled.div`
    width: 480px;
    height: 100%;
    background-color: #1A1826;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    position: fixed;
    top: 0;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1), 0px 3px 6px rgba(0, 0, 0, 0.05);
    margin-bottom: 0px;
    overflow: hidden;

    @media (max-width: 480px) {
        width: 100%;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
    }
`;

const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

const App = () => {
    const history = useHistory();
	const location = useLocation();

	const { createWallet } = useWallet();
    const ContextValue = useContext(WalletContext);
    const { wallet, loading } = ContextValue;
    const codeSplitLoader = <LoadingBlock>{CashLoadingIcon}</LoadingBlock>;
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [loader, setLoader] = useState(true);
    const [playerNumbers, setPlayerNumbers] = useState(false);
    const [activeTicket, setActiveTicket] = useState(false);
    const [payout, setPayout] = useState(false);
    const [protection, setProtection] = useState(true);
    const [redeemAll, setRedeemAll] = useState(false);
	const [user, setUser] = useState(false);
	const [repeatOnboarding, setRepeatOnboarding] = useState(false);

	
	useEffect(() => {
		if (repeatOnboarding) {
			setProtection(true);
			setRepeatOnboarding(false);
		}
	}, [location.state])

    // activates the loading screen on change of loadingStatus for loading within routes
    useEffect(async () => { 
        if (loadingStatus && !loader) {
            setLoader(true);
        } else if (!loadingStatus && loader) {
            // await sleep(500);
            setLoader(false);
        }
    }, [loadingStatus]);

	// initial wallet loading or creation
    useEffect(async () => {
		console.log("APP wallet", wallet);
		if (loading) {
			setLoadingStatus("LOADING WALLET");
		} else {
			setLoader(false);
		}
    }, [loading]);

    // handle query parameters
    useEffect(() => {
        const ticketIdFromQuery = new URLSearchParams(location?.search).get("ticket");
        const hasCorrectLength = ticketIdFromQuery?.length === 64;
        if (ticketIdFromQuery && hasCorrectLength) {
            setActiveTicket({id: ticketIdFromQuery});
            history.push("/waitingroom");
        }
    }, []);


    return (
        <>
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                    <CustomApp>
                        <WalletBody>
                            <WalletCtn>
                                <Suspense fallback={codeSplitLoader}>
									{loader && 
										<>
											<LoadingAnimation loadingStatus={loadingStatus}/>
										</>
									}

									{wallet && isValidStoredWallet(wallet) ? (
										<>
											{protection ?
												<OnBoarding 
													passProtection={setProtection}
													passUser={setUser}
												/>
											: 
												<>
													<Switch>
														<Route path="/select">
															<Select
																passRandomNumbers={setPlayerNumbers}
																passLoadingStatus={setLoadingStatus}
																user={user}
															/>
														</Route>
														<Route path="/checkout">
															<Checkout 
																passLoadingStatus={setLoadingStatus}
																playerNumbers={playerNumbers}
																passPurchasedTicket={setActiveTicket}
																user={user}
															/>
														</Route>
														<Route path="/waitingroom">
															<WaitingRoom 
																passLoadingStatus={setLoadingStatus}
																activeTicket={activeTicket}
																playerNumbers={playerNumbers}
																user={user}
															/>
														</Route>
														<Route path="/game">
															<Game 
																passLoadingStatus={setLoadingStatus}
																ticket={activeTicket}
															/>
														</Route>														
														
														<Route path="/result">
															<Result 
																passLoadingStatus={setLoadingStatus}
																payout={payout}
																ticket={activeTicket}
																redeemAll={redeemAll}
															/>
														</Route>															
														<Route path="/backup">
															<Backup 
																purchasedTicket={activeTicket}
																passLoadingStatus={setLoadingStatus}
															/>
														</Route>
														<Route path="/wallet">
															<Wallet 
																passLoadingStatus={setLoadingStatus} 
																passRedeemAll={setRedeemAll}
																user={user}
															/>
														</Route>
														<Route path="/cashout">
															<Cashout 
																passLoadingStatus={setLoadingStatus}
															/>
														</Route>
														<Redirect exact from="/" to="/select" />
														<Route component={NotFound} />
													</Switch>
												</>
											}
										</>
									) : (
										<>
											<LoadingAnimation loadingStatus={"LOADING WALLET"}/>
										</>
									)}      
                                    
                                </Suspense> 
                            </WalletCtn>
                        </WalletBody>
                    </CustomApp>
            </ThemeProvider>        
        </>

    );
};

export default App;
