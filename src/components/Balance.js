import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import BigNumber from 'bignumber.js';


const BalanceCtn = styled.div`
    width: 112px;
    height: 40px;
    border-radius: 12px;
    background: ${props => props.theme.balance.background};
    color: ${props => props.theme.balance.color};
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Helvetica;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 2px;
`;


const Balance = ({
    slpBalances
}) => {

    const [displayAmount, setDisplayAmount] = useState("000000");

    useEffect(() => {
        if (slpBalances) {
            console.log("Balance.js slpBalances", slpBalances);
            if (slpBalances.tokens?.length > 0) {
                const token = slpBalances.tokens[0];
                if ("balance" in token) {
                    const balance = new BigNumber({...token.balance, _isBigNumber: true}).toNumber();
                    const decimals = token.info.decimals;
                    const formattedBalance = balance / (10** decimals);
                    const amountString = String(formattedBalance);
                    const digits = amountString.length;
                    const fillupDigitsString = String(0).repeat(6-digits);
                    const displayAmountString = fillupDigitsString.concat(amountString);

                    setDisplayAmount(displayAmountString);                
                }
            }             
        }

    }, [])

    return (
        <BalanceCtn>
            {displayAmount}
        </BalanceCtn>
    )
}

export default Balance;