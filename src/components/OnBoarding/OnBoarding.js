import React, { useState, useEffect } from 'react';
import { WalletContext } from '@utils/context';



const OnBoarding = ({
    passLoadingStatus
}) => {
    console.log("ONBOARDING CALLED")
    const ContextValue = React.useContext(WalletContext);
    const { createWallet, wallet, forceWalletUpdate } = ContextValue;
    const [walletCreated, setWalletCreated] = useState(false);

    useEffect(async () => {            
        passLoadingStatus("LOADING WALLET")
        if (!walletCreated && !wallet) {
            // await sleep(1000);
            console.log("ONBOARDING entered creation clause")
            await createWallet();
            setWalletCreated(true);
        }            
        passLoadingStatus(false);
    }, []);

    return null;
};

export default OnBoarding;