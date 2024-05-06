// modules
import React, { useState } from "react";
import styled from "styled-components";
import { useHistory } from 'react-router-dom';

// react components
import Header from '@components/Common/Header';
import ChickenSelector from "./ChickenSelector";
import PrimaryButton, { SettingsButton } from '@components/Common/PrimaryButton';

// styled css components
const ButtonCtn = styled.div`
    position: absolute;
    display: grid;
    align-items: center;
    justify-content: center;
    bottom: 3%;
    gap: 10px;
`;
const SupportButtonsCtn = styled.div`
    height: 40px;
    width: 100%;
    gap: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Link = styled.a`
    text-underline-offset: 8px;
    text-decoration: underline;
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
                <PrimaryButton onClick={() => handleBuyTicket()}>BUY TICKET</PrimaryButton>
                <SupportButtonsCtn>
                    <SettingsButton origin="/select" onClick={() => handleToSettings()}/>
                    <Link onClick={() => handleToHowToPlay()}>How to play?</Link>
                </SupportButtonsCtn>             
            </ButtonCtn>

        </>
    )
}

export default Select;