// node modules
import React, { useState } from 'react';
import styled from 'styled-components';

// assets
import RingPng from '@assets/ring_on_beach.png';
import CluxPng from '@assets/clux_chicken.png';

// styled css components
const ChickenCtn = styled.div`
    background-color: #fefffe;
    border-radius: 24px;
    border-style: none;
    width: 88%;
    margin-top: 9px;
    margin-bottom: 9px;
    height: 55%;
    flex-grow: 1;
`;
const Background = styled.img`
    z-index: -1;
`;
const Chicken = styled.img`
`;

const IdleChicken = ({
    passLoadingStatus,
    passRandomNumbers,
    passAnimationKey,
    ...props
}) => {

    return (
        <ChickenCtn>
            <Background src={RingPng} />
            <Chicken src={CluxPng}/>
        </ChickenCtn>            
    )
}

export default IdleChicken;