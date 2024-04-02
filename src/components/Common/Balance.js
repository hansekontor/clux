import React from "react";
import styled from 'styled-components';
import PropTypes from 'prop-types';

// styled css components
const BalanceCtn = styled.div`
    width: fit-content;
    height: 41px;
    border-radius: 41px;
    background: #ededed;
    color: #000000;
    position: relative;
    display: flex;
    align-items: flex-end;
    gap: 5px;
`;
const Amount = styled.div`
height: 35px;
    text-align: end;
    font-family: "Sequel 100 Wide 95", Helvetica;
    font-size: 32px;
font-style: normal;
    font-weight: 400;
    padding-left: 20px;
    margin-bottom: 7px;
`;
const Currency = styled.div`
    font-family: "Inter-Medium", Helvetica;
    font-size: 11px;
font-style: normal;
    font-weight: 550;
    line-height: normal;
    letter-spacing: 0.12px; 
    padding-right: 10px;
    margin-bottom: 4px;
`;

const Balance = ({
    amount, 
    currency
}) => {
    return (
        <BalanceCtn>
            <Amount>{amount}</Amount>
            <Currency>{"CREDITS"}</Currency>
        </BalanceCtn>
    )
}
// dev remove
Balance.defaultProps = {
    amount: 333,
    currency: "CREDITS"
}
Balance.propTypes = {
    amount: PropTypes.number,
    currency: PropTypes.currency
}


export default Balance;