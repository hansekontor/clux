import React from 'react';
import { CnmiIcon } from '@components/Icons';
import { WalletButton, HelpButton, CashoutButton } from '@components/Button';
import { StyledSupportBar } from './SupportBar.styles';
import Balance from '../Balance';

import { useApp } from 'blocklotto-sdk';

export default function SupportBar({ returnTo }) {
    const { unredeemedTickets } = useApp();

    const unredeemedTicketsCount = unredeemedTickets.length

    const handleCnmiRedirect = () => {
        window.location.href = "https://example.com";
    }

    return (
        <StyledSupportBar>
            <WalletButton returnTo={returnTo} indicator={unredeemedTicketsCount} />
            <HelpButton />
            <Balance />
            <CashoutButton returnTo={returnTo} />
            <CnmiIcon onClick={() => handleCnmiRedirect()} />
        </StyledSupportBar>
    )
}
