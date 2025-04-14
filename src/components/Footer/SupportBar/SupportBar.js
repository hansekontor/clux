import React from 'react';
import { CnmiIcon } from '@components/Icons';
import { WalletButton, HelpButton, CashoutButton } from '@components/Button';
import { StyledSupportBar } from './SupportBar.styles';
import Balance from '../Balance';

import { useCashTab } from '@core/context/CashTab';

export default function SupportBar({ returnTo }) {
    const { unredeemedTickets } = useCashTab();

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
