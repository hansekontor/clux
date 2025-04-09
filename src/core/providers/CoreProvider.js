// @ts-check
import React from 'react';
import { AuthProvider } from '../context/Auth';
import { BlockLottoProvider } from '../context/BlockLotto';
import { CashTabProvider } from '../context/CashTab';
// import { AuthenticationProvider } from '../context/Authentication';

export default function BlockLottoCoreProvider({ children }) {
    return (
        <AuthProvider>
            <CashTabProvider>
                {children}
            </CashTabProvider>
        </AuthProvider>
    )
}
