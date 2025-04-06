import React from "react";
import { StyledBalance } from './Balance.styles';

import { useBlockLotto } from "@core/context/BlockLotto";

export default function Balance() {
    const { balance } = useBlockLotto();

    return (
        <StyledBalance>{balance}</StyledBalance>
    )
}
