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
const OnBoarding = lazy(() => import('./OnBoarding/OnBoarding'));
const Checkout = lazy(() => import('./Send/Checkout'));
const Backup = lazy(() => import('./Backup/Backup'));
const WaitingRoom = lazy(() => import('./Game/WaitingRoom'));
const Game = lazy(() => import('./Game/Game'));
const Wallet = lazy(() => import('./Wallet/Wallet'));
const HowToPlay = lazy(() => import('./How/HowToPlay'));
const NotFound = lazy(() => import('./NotFound'));
import Footer from '@components/Common/Footer';
import { LoaderCtn, Loader, LoadingAnimation, LoadingText } from '@components/Common/CustomLoader';
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
    height: 100vh;
    background-color: #ffffff;
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

const AnimationScript = ({animationKey}) => {
    console.log("AnimationScript called with animationKey:", animationKey)
    useEffect(() => {
        console.log("AnimationScript hook called")
        if (typeof animationKey === 'string') {
            const animationFolder = animationKey.split("_")[0];
            const winner = animationKey.split("_")[1];
            const tier = animationKey.split("_")[2];
            console.log("LOADED SCRIPTS FOR winner", winner, "tier", tier);

            // add script for entrance animation
            const entranceScript = document.createElement('script');
            entranceScript.src = `https://dev.cert.cash:3001/${animationFolder}/entrance.js`;
            entranceScript.type = "text/javascript";
            document.body.appendChild(entranceScript);

            // add script for fight animation
            const fightScript = document.createElement('script');
            fightScript.src = `https://dev.cert.cash:3001/${animationFolder}/${winner}/fight.js`;
            fightScript.type = "text/javascript";
            document.body.appendChild(fightScript);

            // add script for celebration animation
            const celebrationScript = document.createElement('script');
            celebrationScript.src = `https://dev.cert.cash:3001/${animationFolder}/${winner}/celebration_${tier}.js`;
            celebrationScript.type = "text/javascript";
            document.body.appendChild(celebrationScript);


        }

        return () => {
            document.body.removeChild(entranceScript);
            document.body.removeChild(fightScript);
            document.body.removeChild(celebrationScript);
        }
    }, []);        

    return <></>;
}

const App = () => {
    const ContextValue = useContext(WalletContext);
    const { wallet, loading, createWallet, forceWalletUpdate } = ContextValue;
    const codeSplitLoader = <LoadingBlock>{CashLoadingIcon}</LoadingBlock>;
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [loader, setLoader] = useState(false);
    const [playerChoice, setPlayerChoice] = useState(false);

    const validWallet = isValidStoredWallet(wallet);
    // console.log("App wallet", wallet);

    const [animationKey, setAnimationKey] = useState(false);

    // helpers 
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

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

    
    return (
        <>
            {animationKey &&
                <AnimationScript animationKey={animationKey}/>
            }
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                    <CustomApp>
                        <WalletBody>
                            <WalletCtn>
                            {/* {scriptLoaded &&
                                <>
                                    <AnimateCC 
                                        animationName="CLUX_SC01_HTML5"
                                        composition={"9CD376263DCA47A78074CFD07FB36864"}
                                        getAnimationObject={getAnimationObject}
                                        paused={paused}
                                    />                                       
                                </>
                            } */}
                                <Suspense fallback={codeSplitLoader}>
                                    {loader && 
                                        <>  
                                            <LoaderCtn>
                                                <Loader>
                                                    <LoadingAnimation />
                                                    <LoadingText>{typeof loadingStatus==='string' ? loadingStatus : ""}</LoadingText>
                                                </Loader>
                                            </LoaderCtn>
                                        </> 
                                    } 
                                    <Switch>
                                        <Route path="/select">
                                            <Select
                                                passRandomNumbers={setPlayerChoice}
                                            />
                                        </Route>
                                        <Route path="/checkout">
                                            <Checkout 
                                                passLoadingStatus={setLoadingStatus}
                                                playerChoiceArray={playerChoice}
                                            />
                                        </Route>
                                        <Route path="/backup">
                                            <Backup />
                                        </Route>
                                        <Route path="/game">
                                            <Game 
                                                passLoadingStatus={setLoadingStatus}
                                                passAnimationKey={setAnimationKey}
                                            />
                                        </Route>
                                        <Route path="/waitingroom">
                                            <WaitingRoom 
                                                passLoadingStatus={setLoadingStatus}
                                            />
                                        </Route>
                                        <Route path="/wallet">
                                            <Wallet 
                                                passLoadingStatus={setLoadingStatus} 
                                            />
                                        </Route>
                                        <Route path="/how">
                                            <HowToPlay />
                                        </Route>
                                        <Redirect exact from="/" to="/select" />
                                        <Route component={NotFound} />
                                    </Switch>
                                </Suspense> 
                                <Footer />
                            </WalletCtn>
                        </WalletBody>
                    </CustomApp>
            </ThemeProvider>        
        </>

    );
};

export default App;
