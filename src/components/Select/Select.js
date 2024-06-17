// modules
import React, { useState } from "react";
import styled from "styled-components";
import { useHistory } from 'react-router-dom';

// react components
import Header from '@components/Common/Header';
import ChickenSelector from "./ChickenSelector";
import PrimaryButton, { SupportButtons, LargeButtons } from '@components/Common/PrimaryButton';

// styled css components
const ButtonCtn = styled.div`
    display: grid;
    align-items: center;
    justify-content: center;
    gap: 10px;
`;

const Select = ({
    passRandomNumbers
}) => {
    const history = useHistory();

    // helpers
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // handlers
    const handleBuyTicket = async () => {
        console.log("handleBuyTicket called")
        /*
            -collect ticket data
            -submit all required data to callback function
        */
        // console.log("randomNumbers pushed to checkout state:", randomNumbers)
        const dummy = "12345";
        history.push('/checkout');
    }
    const handleToSettings = () => {
        history.push('/wallet');
    };
    const handleToHowToPlay = () => {
        history.push('/how');
    }
    
    return (
        <>
            <Header />
            <ChickenSelector 
                passRandomNumbers={passRandomNumbers}/>
            <ButtonCtn>
                <PrimaryButton onClick={() => handleBuyTicket()}>Buy Ticket</PrimaryButton>
                <LargeButtons />                
            </ButtonCtn>
        </>
    )
}

export default Select;