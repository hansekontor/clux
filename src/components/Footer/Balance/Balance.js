import React from "react";
import { StyledBalance } from './Balance.styles';

import { useCashTab } from '@core/context/CashTab';

export default function Balance() {
    const { balance } = useCashTab();

    return (
        <StyledBalance>{balance}</StyledBalance>
    )
}
