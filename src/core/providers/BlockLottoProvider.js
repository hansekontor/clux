// @ts-check
import React from 'react';
import { AuthProvider } from '../context/Auth';
import { CashTabProvider } from '../context/CashTab';
import DefaultLoading from '../components/Loading';
import DefaultNotification from '../components/Notification/DefaultNotification';
import { NotificationsProvider } from '../context/Notifications';
import { AppProvider } from '../context/App';
import { CheckoutProvider } from '../context/Checkout';
import { OnBoardingProvider } from '../context/OnBoarding';
import { CashoutProvider } from '../context/Cashout';
import { ResultProvider } from '../context/Result';
import { WaitingRoomProvider } from '../context/WaitingRoom';

export default function BlockLottoProvider({
    children,
    Loading = DefaultLoading,
    Notification = DefaultNotification
}) {
    return (
        <AuthProvider>
            <CashTabProvider Loading={Loading}>
                <NotificationsProvider Notification={Notification}>
                    <AppProvider Loading={Loading}>
                        <OnBoardingProvider>
                            <CheckoutProvider>
                                {/* <CashoutProvider> */}
                                    {/* <ResultProvider> */}
                                    {/* <WaitingRoomProvider> */}
                                        {children}
                                    {/* </WaitingRoomProvider> */}
                                    {/* </ResultProvider> */}
                                {/* </CashoutProvider> */}
                            </CheckoutProvider>
                        </OnBoardingProvider>
                    </AppProvider>
                </NotificationsProvider>
            </CashTabProvider>
        </AuthProvider>
    )
}
