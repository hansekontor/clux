// node modules
import React, { useState, Suspense, lazy, useEffect, useContext } from 'react';
import {
    Route,
    Switch,
    Redirect,
    useLocation, 
    useHistory
} from 'react-router-dom';
// import 'antd/dist/antd.less';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

// css components
import { theme } from '../assets/styles/theme';
// import './App.css';
import '../index.css';

// react components
import { WalletContext } from '@utils/context';
const Select = lazy(() => import('./Select/Select'));
const Checkout = lazy(() => import('./Send/Checkout'));
const Backup = lazy(() => import('./Backup/Backup'));
const WaitingRoom = lazy(() => import('./Game/WaitingRoom'));
const Game = lazy(() => import('./Game/Game'));
const Result = lazy(() => import('./Result/Result'));
const Wallet = lazy(() => import('./Wallet/Wallet'));
const Payout = lazy(() => import('./Payout/Payout'));
const TicketDetails = lazy(() => import('./Result/TicketDetails'))
const NotFound = lazy(() => import('./NotFound'));
import { LoadingAnimation } from '@components/Common/CustomLoader';
import { CashLoadingIcon, LoadingBlock } from '@components/Common/CustomIcons';
import { isValidStoredWallet } from '@utils/cashMethods';


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
    overlap: scroll;
    background: #f6f6f6;
    flex-direction: column;
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


const App = () => {
    const history = useHistory();
    const ContextValue = useContext(WalletContext);
    const { wallet, loading, createWallet } = ContextValue;
    const codeSplitLoader = <LoadingBlock>{CashLoadingIcon}</LoadingBlock>;
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [loader, setLoader] = useState(true);
    const [playerChoice, setPlayerChoice] = useState(false);
    const [activeTicket, setActiveTicket] = useState(false);
    const [payout, setPayout] = useState(false);

    const validWallet = isValidStoredWallet(wallet);

    const [animationKey, setAnimationKey] = useState(false);

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // activates the loading screen on change of loadingStatus
    useEffect(async () => { 
        if (loadingStatus && !loader) {
            setLoader(true);
        } else if (!loadingStatus && loader) {
            // await sleep(500);
            setLoader(false);
        }
    }, [loadingStatus]);

    useEffect(async () => {
        if (!loading && (!wallet || (wallet && !validWallet))) {
            await createWallet();
            setLoadingStatus(false);
        } else if (loading) {
            setLoadingStatus("LOADING WALLET");
        } else {
            setLoadingStatus(false);
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
                                    <Switch>
                                        <Route path="/select">
                                            <Select
                                                passRandomNumbers={setPlayerChoice}
                                                passLoadingStatus={setLoadingStatus}
                                                passAnimationKey={setAnimationKey}
                                            />
                                        </Route>
                                        <Route path="/checkout">
                                            <Checkout 
                                                passLoadingStatus={setLoadingStatus}
                                                playerChoiceArray={playerChoice}
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
                                                passAnimationKey={setAnimationKey}
                                                ticket={activeTicket}
                                            />
                                        </Route>
                                        <Route path="/result">
                                            <Result 
                                                passLoadingStatus={setLoadingStatus}
                                                payout={payout}
                                                passAnimationKey={setAnimationKey}
                                                ticket={activeTicket}
                                            />
                                        </Route>
                                        <Route path="/waitingroom">
                                            <WaitingRoom 
                                                passLoadingStatus={setLoadingStatus}
                                                activeTicket={activeTicket}
                                                passAnimationKey={setAnimationKey}
                                                updateActiveTicket={setActiveTicket}
                                            />
                                        </Route>
                                        <Route path="/wallet">
                                            <Wallet 
                                                passLoadingStatus={setLoadingStatus} 
                                                passSelectedTicket={setActiveTicket}
                                            />
                                        </Route>
                                        <Route path="/ticketdetails">
                                            <TicketDetails 
                                                ticket={activeTicket}
                                            />
                                        </Route>
                                        <Route path="/payout">
                                            <Payout />
                                        </Route>
                                        <Redirect exact from="/" to="/select" />
                                        <Route component={NotFound} />
                                    </Switch>
                                </Suspense> 
                            </WalletCtn>
                        </WalletBody>
                    </CustomApp>
            </ThemeProvider>        
        </>

    );
};

export default App;
