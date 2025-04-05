import React, { useState, useEffect } from "react";
import { StyledBalance } from './Balance.styles';
import BigNumber from 'bignumber.js';

export default function Balance({
    slpBalances
}) {
    const [displayAmount, setDisplayAmount] = useState("000000");

    useEffect(() => {
        if (slpBalances) {
            console.log("Balance.js slpBalances", slpBalances);
            if (slpBalances.tokens?.length > 0) {
                const token = slpBalances.tokens[0];
                if ("balance" in token) {
                    const balance = new BigNumber({ ...token.balance, _isBigNumber: true }).toNumber();
                    const decimals = token.info.decimals;
                    const formattedBalance = balance / (10 ** decimals);
                    const amountString = String(formattedBalance);
                    const digits = amountString.length;
                    const fillupDigitsString = String(0).repeat(6 - digits);
                    const displayAmountString = fillupDigitsString.concat(amountString);

                    setDisplayAmount(displayAmountString);
                }
            }
        }

    }, [])

    return (
        <StyledBalance>{displayAmount}</StyledBalance>
    )
}
