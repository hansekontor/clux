// node modules
import React, { useState, Suspense, lazy, useEffect, useContext } from 'react';
import {
    Route,
    Switch,
    Redirect,
    useHistory,
	useLocation
} from 'react-router-dom';

// css components
import { ThemeProvider } from "styled-components";
import '../index.css';
import * as Styled from "@components/styles";
import { theme } from '../assets/styles/theme';


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
import { LoadingAnimation } from '@components/Common/Loader';
import { CashLoadingIcon, LoadingBlock } from '@components/Common/Icons';

// util
import { WalletContext } from '@utils/context';
import { isValidStoredWallet } from '@utils/cashMethods';

const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

const App = () => {
    const history = useHistory();
	const location = useLocation();

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

	
	useEffect(() => {
		if (location.state?.repeatOnboarding) {
			setProtection(true);
            window.history.replaceState({}, '')
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
                <Styled.GlobalStyle />
                    <Styled.App>
                        <Styled.AppBody>
                            <Styled.AppCtn>
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
                                                    passLoadingStatus={setLoadingStatus}
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
                            </Styled.AppCtn>
                        </Styled.AppBody>
                    </Styled.App>
            </ThemeProvider>        
        </>

    );
};

export default App;
