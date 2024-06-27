// node modules
import React, { useState } from 'react';
import styled from 'styled-components';

// assets
import ChickenPng from '@assets/chicken_placeholder.png';

// styled css components
const ChickenCtn = styled.div`
    background-color: #ffffff;
    border-radius: 24px;
    border-style: none;
    width: 88%;
    margin-top: 9px;
    margin-bottom: 9px;
`;

const Chicken = styled.img`
`;

const IdleChicken = ({
    passRandomNumbers,
    ...props
}) => {

    return (
        <ChickenCtn>
            <Chicken src={ChickenPng}/>
        </ChickenCtn>            
    )
}

export default IdleChicken;