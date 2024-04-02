// node modules
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

// react components
import PrimaryButton from '@components/Common/PrimaryButton';
import Header from '@components/Common/Header'; 

// styled css components
const TextCtn = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 80%;
`;
const ScrollableTextCtn = styled.div`
    overflow-y: auto;
    text-align: left;
`;
const Caption = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
`;
const Text = styled.p`
    font-size: 14px;
    font-weight: 400;
    color: #333333;
`;

const HowToPlay = () => {
    const history = useHistory();
    const location = useLocation();

    // handlers 
    const handleBackToSelection = () => {
        history.push(location.state?.prev || "/waitingRoom");    
    }

    return (
        <>
            <Header />
            <TextCtn>
                <ScrollableTextCtn>
                    <Caption>What makes it special</Caption>
                    <Text>Example Text. Example Text. Example Text. Example Text. Example Text. Example Text. Example Text. Example Text. Example Text. Example Text. Example Text. Example Text. Example Text. </Text>

                    <Caption>What exactly do I purchase?</Caption>
                    <Text>Example Text. Example Text. Example Text. Example Text. Example Text. Example Text. Example Text. Example Text. Example Text. Example Text. Example Text. Example Text. Example Text. </Text>                    
                </ScrollableTextCtn>
            </TextCtn>

            <PrimaryButton onClick={() => handleBackToSelection()}>Back</PrimaryButton>        
        </>
    )
}

export default HowToPlay;