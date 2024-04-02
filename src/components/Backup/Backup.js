import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { SecondaryButton, SupportButtons } from '@components/Common/PrimaryButton';
import RingPng from '@assets/ring.png';

const Background = styled.img`
    position: relative;
    height: 100vh;
    z-index: -4;
    object-fit: cover;
    filter: grayscale(1);
`;
const Overlay = styled.div`
    background-color: rgba(255,255,255,0.9);
    position: absolute;
    width: inherit;
    height: inherit;
    z-index: -3;
    display: block;
    top: 0;
    left: 0; 
`;
const Title = styled.div`
    color: #000000;
    z-index: 1;
    font-size: 30px;
    font-weight: 600;
`;
const Input = styled.input`
z-index: 1;
color: #000000;
    border: none;
    border-radius: 50px;
    font-family: "Inter-Regular", Helvetica;
    font-size: 14px;
    font-weight: 400;
    height: 48px;
    letter-spacing: 0.25px;
    line-height: 20.2px;
    padding: 12px 22px;
    position: relative;
    text-align: center;
    white-space: nowrap;
    background-color: #000000;
    color: #ffffffb2;
`;
const Text = styled.p`
    z-index: 1;
    color: #000000;
`;
const Content = styled.div`
    top: 40%;
    position: absolute;
    left: 7%;
    right: 7px;
    text-align: left;
`;


const Backup = () => {
    const history = useHistory();

    const [hasBackedUp, setHasBackedUp] = useState(false);

    // handlers
    const handleOnSubmit = () => {
        history.push('/waitingroom');
    }

    return (
        <>
            <Background src={RingPng} />
            <Overlay>
                <Content>
                    {!hasBackedUp ? (
                        <>
                            <Title>Backup your Wallet</Title>
                            <Text>The crypto wallet associated with this lottery game is not backed up. Please backup and secure the wallet to avoid loss of funds.</Text>
                            <SecondaryButton onClick={setHasBackedUp}>Backup Wallet</SecondaryButton>
                            <a onClick={setHasBackedUp}>Skip Backup</a>                           
                        </>
                    ) : (
                        <>
                            <Title>Get Notified</Title>
                            <Text>Enter your email to get notified when the results are ready:</Text>
                            <form onSubmit={() => handleOnSubmit()}>
                                <Input 
                                    placeholder="Enter Email"
                                />
                                <SecondaryButton type="submit">Submit</SecondaryButton>
                            </form>                        
                        </>
                    )} 
                </Content>
                <SupportButtons />
          
            </Overlay>
        </>
    )
}

export default Backup;