// node modules
import React, { useState, Suspense, lazy, useEffect, useContext } from 'react';
import {
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
// import 'antd/dist/antd.less';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { AnimateCC } from 'react-adobe-animate';

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
const Result = lazy(() => import('./Game/Result'));
const Wallet = lazy(() => import('./Wallet/Wallet'));
const Payout = lazy(() => import('./Payout/Payout'));
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
        width: 88%;
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

const AnimationScriptProvider = ({animationKey}) => {
    const baseUrl = "https://dev.cert.cash:3001";
    // const baseUrl = "http://localhost:8000";
    const type = "text/javascript";

    useEffect(() => {
        if (typeof animationKey === 'string') {
            try {

                const animationFolder = animationKey.split("_")[0];
                
                // create all possible scripts
                const idleScript = document.createElement('script');
                const entranceScript = document.createElement('script');
                const fightScript = document.createElement('script');
                const celebrationScript = document.createElement('script');
                console.log("ASP idleScript initial", idleScript)
            
                if (animationKey === "idle_clux") {
                    // add script for dynamic idle chicken on /select
                    idleScript.src = `${baseUrl}/chicken/clux/idle_dynamic.js`;
                    idleScript.type = type;                
                    console.log("ASP idleScript settings", idleScript);
                    document.body.appendChild(idleScript);
                } else {
                    const winner = animationKey.split("_")[1];
                    const tier = animationKey.split("_")[2];
                    console.log("LOADED SCRIPTS FOR winner", winner, "tier", tier);  

                    // add script for entrance animation
                    // const entranceScript = document.createElement('script');
                    entranceScript.src = `${baseUrl}/${animationFolder}/entrance.js`;
                    entranceScript.type = type;

                    // add script for fight animation
                    // const fightScript = document.createElement('script');
                    fightScript.src = `${baseUrl}/${animationFolder}/${winner}/fight.js`;
                    fightScript.type = type;

                    // add script for celebration animation
                    // const celebrationScript = document.createElement('script');
                    // console.log(`https://dev.cert.cash:3001/${animationFolder}/${winner}/celebration${winner === "A" ? "_"+tier : ""}.js`)
                    celebrationScript.src = `${baseUrl}/${animationFolder}/${winner}/celebration${winner === "A" ? "_"+tier : ""}.js`;
                    celebrationScript.type = type;

                    // add all scripts to body even if empty
                    document.body.appendChild(entranceScript);
                    document.body.appendChild(fightScript);
                    document.body.appendChild(celebrationScript);
                }
            } catch(err) {
                console.error(err);
            }
        }

        // return () => {     
        //     console.log("ASP clean up function called during key", animationKey)   
        //     if (typeof animationKey === "string") {
        //         console.log("animationKey clean up is String!")
        //         if (animationKey === "idle_clux")
        //             document.body.removeChild(idleScript);
        //         else {
        //             document.body.removeChild(entranceScript);
        //             document.body.removeChild(fightScript);
        //             document.body.removeChild(celebrationScript);            
        //         }
        //     } 
        // }
    }, []);        

    return <></>;
}


const App = () => {
    const ContextValue = useContext(WalletContext);
    const { wallet, loading, createWallet, forceWalletUpdate } = ContextValue;
    const codeSplitLoader = <LoadingBlock>{CashLoadingIcon}</LoadingBlock>;
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [loader, setLoader] = useState(true);
    const [playerChoice, setPlayerChoice] = useState(false);
    const [ticketToRedeem, setTicketToRedeem] = useState(false);
    const [purchasedTicket, setPurchasedTicket] = useState(false);
    const [payout, setPayout] = useState(false);

    const validWallet = isValidStoredWallet(wallet);

    const [animationKey, setAnimationKey] = useState(false);

    // activates the loading screen on change of loadingStatus
    useEffect(async () => { 
        console.log("1st")
        if (loadingStatus && !loader) {
            console.log("1st if")
            setLoader(true);
        } else if (!loadingStatus && loader) {
            console.log("1st else if")
            setLoader(false);
            console.log("App turned off loader")
        }
    }, [loadingStatus]);

    useEffect(async () => {
        console.log("3rd");
        if (!loading && (!wallet || (wallet && !validWallet))) {
            console.log("3rd if clause");
            await createWallet();
            setLoadingStatus(false);
        } else if (loading) {
            setLoadingStatus("LOADING WALLET");
        } else {
            console.log("3rd else clause")
            setLoadingStatus(false);
        }
    }, [loading]);

    console.log("APP animationKey", animationKey);

    return (
        <>
            {animationKey &&
                <AnimationScriptProvider animationKey={animationKey}/>
            }
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
                                                passPurchasedTicket={setPurchasedTicket}
                                            />
                                        </Route>
                                        <Route path="/backup">
                                            <Backup 
                                                purchasedTicket={purchasedTicket}
                                                passLoadingStatus={setLoadingStatus}
                                            />
                                        </Route>
                                        <Route path="/game">
                                            <Game 
                                                passLoadingStatus={setLoadingStatus}
                                                passAnimationKey={setAnimationKey}
                                                ticket={purchasedTicket}
                                            />
                                        </Route>
                                        <Route path="/result">
                                            <Result 
                                                passLoadingStatus={setLoadingStatus}
                                                payout={payout}
                                                passAnimationKey={setAnimationKey}
                                            />
                                        </Route>
                                        <Route path="/waitingroom">
                                            <WaitingRoom 
                                                passLoadingStatus={setLoadingStatus}
                                                passTicket={setTicketToRedeem}
                                                purchasedTicket={purchasedTicket}
                                                playerChoice={playerChoice}
                                                passAnimationKey={setAnimationKey}
                                            />
                                        </Route>
                                        <Route path="/wallet">
                                            <Wallet 
                                                passLoadingStatus={setLoadingStatus} 
                                                passTicket={setTicketToRedeem}
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
