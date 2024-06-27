// modules
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory } from 'react-router-dom';

// react components
import Header from '@components/Common/Header';
import JackpotCarousel from './Jackpot';
import IdleChicken from './IdleChicken';
import RandomNumbers from './RandomNumbers';
import PrimaryButton from '@components/Common/PrimaryButton';


const Select = ({
    passRandomNumbers,
    passLoadingStatus
}) => {
    const history = useHistory();

    // helpers
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // loading might be turned on after redirect from checkout
    useEffect(async() => {
        await sleep(2000);
        passLoadingStatus(false);
    }, [])
    
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
            <JackpotCarousel />
            <IdleChicken /> 
            <RandomNumbers passRandomNumbers={passRandomNumbers}/>
            <PrimaryButton onClick={() => handleBuyTicket()}>
                Play Now - $10
            </PrimaryButton>
            
        </>
    )
}

export default Select;