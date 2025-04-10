import React from 'react';
import { CheckoutProvider } from '@core/context/Checkout';
import { OnBoardingProvider } from '@core/context/OnBoarding';
import { BackupProvider } from '@core/context/Backup';
import { CashoutProvider } from '@core/context/Cashout';
import { GameProvider } from '@core/context/Game';
import { ResultProvider } from '@core/context/Result';
import { SelectProvider } from '@core/context/Select';
import { WaitingRoomProvider } from '@core/context/WaitingRoom';

export default function BlockLottoFunctionsProvider({ children }) {
    return (
        <OnBoardingProvider>
            <SelectProvider>
                <CheckoutProvider>
                    <BackupProvider>
                        <CashoutProvider>
                            <GameProvider>
                                {/* <ResultProvider> */}
                                <WaitingRoomProvider>
                                    {children}
                                </WaitingRoomProvider>
                                {/* </ResultProvider> */}
                            </GameProvider>
                        </CashoutProvider>
                    </BackupProvider>
                </CheckoutProvider>
            </SelectProvider>
        </OnBoardingProvider>
    )
}
