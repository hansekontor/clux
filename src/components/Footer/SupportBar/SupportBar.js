import React from 'react';
import { CnmiIcon } from '@components/Icons';
import { WalletButton, HelpButton, CashoutButton } from '@components/Button';
import { StyledSupportBar } from './SupportBar.styles';
import Balance from '../Balance';

export default function SupportBar({
    returnTo,
    ticketIndicator,
	slpBalances
}) {
    
    const handleCnmiRedirect = () => {
        window.location.href = "https://example.com";        
    }

    return (
        <StyledSupportBar>
            <WalletButton returnTo={returnTo} indicator={ticketIndicator} />
            <HelpButton />
            <Balance slpBalances={slpBalances} />
            <CashoutButton returnTo={returnTo} />
            <CnmiIcon onClick={() => handleCnmiRedirect()} />
        </StyledSupportBar>
    )
}
