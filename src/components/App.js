// node modules
import React, { useState, Suspense, lazy, useEffect, useContext } from 'react';
import {
    Route,
    Switch,
    Redirect,
    useHistory
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
import { LoadingAnimation } from '@components/Common/CustomLoader';
import { CashLoadingIcon, LoadingBlock } from '@components/Common/CustomIcons';
import PrimaryButton from '@components/Common/PrimaryButton';
import { bcrypto } from '@hansekontor/checkout-components';

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

const Input = styled.input`
    border-radius: 12px;
    background-color: #F6F6F6;
    color: #00000;
    font-family: "Inter-Semibold", Helvetica;
    font-size: 16px;
    font-weight: 500;
    height: 52px;
    cursor: pointer;
    width: 90%;
    border: ${props => props.error ? "1px solid red" : "none"};
	text-indent: 12px;
    margin-bottom: 24px;
`;

const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

const App = () => {
    const history = useHistory();
	const { createWallet } = useWallet();
    const ContextValue = useContext(WalletContext);
    const { wallet, loading } = ContextValue;
    const codeSplitLoader = <LoadingBlock>{CashLoadingIcon}</LoadingBlock>;
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [loader, setLoader] = useState(true);
    const [playerNumbers, setPlayerNumbers] = useState(false);
    const [activeTicket, setActiveTicket] = useState(false);
    const [payout, setPayout] = useState(false);
    const [isProtected, setIsProtected] = useState(true);


	// console.log("App.js wallet state", wallet.state);

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
		console.log("APP loading", loading);
		console.log("APP wallet", wallet);
		if (loading) {
			console.log("APP.JS still loading")
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

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        const password = e.target.password.value;
        const passwordBuf = Buffer.from(password, 'utf-8');
        const hashedPassword = bcrypto.SHA256.digest(passwordBuf).toString('hex');
        
        const expectedHash = "615da616fc5a5bcd93bc21237807c08eeacbe120ca60e0c3e228712be644596d";

        const verified = hashedPassword === expectedHash;
        console.log("pw verified", verified);
        setIsProtected(!verified);
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                    <CustomApp>
                        <WalletBody>
                            <WalletCtn>
                                {isProtected ?
                                    <form onSubmit={(e) => handlePasswordSubmit(e)}>
                                        <Input 
                                            name="password"
                                            type="text"
                                            placeholder="Password"
                                            required={true}
                                        />               
                                        <PrimaryButton type="submit">Log In</PrimaryButton>                         
                                    </form>
                                : 
                                    <Suspense fallback={codeSplitLoader}>
                                        {loader && 
                                            <>
                                                <LoadingAnimation loadingStatus={loadingStatus}/>
                                            </>
                                        }
                                        {wallet && isValidStoredWallet(wallet) ? (
                                            <Switch>
                                                <Route path="/select">
                                                    <Select
                                                        passRandomNumbers={setPlayerNumbers}
                                                        passLoadingStatus={setLoadingStatus}
                                                    />
                                                </Route>
                                                <Route path="/checkout">
                                                    <Checkout 
                                                        passLoadingStatus={setLoadingStatus}
                                                        playerNumbers={playerNumbers}
                                                        passPurchasedTicket={setActiveTicket}
                                                    />
                                                </Route>
                                                <Route path="/backup">
                                                    <Backup 
                                                        purchasedTicket={activeTicket}
                                                        passLoadingStatus={setLoadingStatus}
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
                                                    />
                                                </Route>
                                                <Route path="/waitingroom">
                                                    <WaitingRoom 
                                                        passLoadingStatus={setLoadingStatus}
                                                        activeTicket={activeTicket}
                                                        playerNumbers={playerNumbers}
                                                    />
                                                </Route>
                                                <Route path="/wallet">
                                                    <Wallet 
                                                        passLoadingStatus={setLoadingStatus} 
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
                                        ) : (
                                            <>
                                                <LoadingAnimation loadingStatus={"LOADING WALLET"}/>
                                            </>
                                        )}

                                    </Suspense> 
                                }
                            </WalletCtn>
                        </WalletBody>
                    </CustomApp>
            </ThemeProvider>        
        </>

    );
};

export default App;
