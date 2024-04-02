// modules
import React from "react";
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
    bottom: 5%;
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

const Select = () => {
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
            <ChickenSelector />
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