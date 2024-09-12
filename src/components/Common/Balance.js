import React from "react";
import styled from 'styled-components';
import PropTypes from 'prop-types';

const BalanceCtn = styled.div`
    width: 112px;
    height: 40px;
    border-radius: 12px;
    background: #1A2131;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Helvetica;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 2px;
`;


const Balance = ({
    amount
}) => {

    const amountString = String(amount);
    const digits = amountString.length;
    const fillupDigitsString = String(0).repeat(6-digits);
    const displayAmountString = fillupDigitsString.concat(amountString);
    return (
        <BalanceCtn>
            {displayAmountString}
        </BalanceCtn>
    )
}
// demo placeholder
Balance.defaultProps = {
    amount: 333,
}
Balance.propTypes = {
    amount: PropTypes.number,
}


export default Balance;