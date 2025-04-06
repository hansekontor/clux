import React from 'react';
import { CnmiIcon } from '@components/Icons';
import { WalletButton, HelpButton, CashoutButton } from '@components/Button';
import { StyledSupportBar } from './SupportBar.styles';
import Balance from '../Balance';

import { useBlockLotto } from "@core/context/BlockLotto";

export default function SupportBar({ returnTo }) {
    const { unredeemedTickets } = useBlockLotto();

    const handleCnmiRedirect = () => {
        window.location.href = "https://example.com";
    }

    return (
        <StyledSupportBar>
            <WalletButton returnTo={returnTo} indicator={unredeemedTickets} />
            <HelpButton />
            <Balance />
            <CashoutButton returnTo={returnTo} />
            <CnmiIcon onClick={() => handleCnmiRedirect()} />
        </StyledSupportBar>
    )
}
