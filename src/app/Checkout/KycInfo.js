import React from 'react';
import styled from 'styled-components';

import { VideoIcon, PicturesIcon, SmartphoneIcon } from '@components/Icons';
import { Text, BoldText } from '@components/Text';


const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 90%;
`;
const Header = styled.div`
    font-weight: 700;
    font-size: 20px;
    font-family: Helvetica;
    padding: 12px 0;
`;
const Subtitle = styled.div`
    font-family: 12px;
    padding-bottom: 7px;
`;
const Item = styled.div`
    background-color: #F6F6F6;
    height: 60px;
    width: 100%;
    border: 1px solid #DFDFDF; 
    display: flex;
    align-items: center;
    gap: 12px;
`;
const TopItem = styled(Item)`
    border-radius: 8px 8px 0 0;
`;
const BottomItem = styled(Item)`
    border-radius: 0 0 8px 8px;
`;
const Content = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-left: 12px;
`;
const Subscript = styled.div`
    font-size: 12px;
    padding: 12px 0;
`;

const KycInfo = () => {
    return (
        <Container>
            <VideoIcon />
            <Header>Complete KYC - Coming Soon</Header>
            <Subtitle>You need to submit a photo ID and liveness check</Subtitle>
            <TopItem>
                <Content>
                    <PicturesIcon />
                    <BoldText>Submit a photo ID</BoldText>
                    <Text>1 minute</Text>                    
                </Content>
            </TopItem>
            <BottomItem>
                <Content>
                    <SmartphoneIcon />
                    <BoldText>Do a liveness check</BoldText>
                    <Text>1 minute</Text>                    
                </Content>
            </BottomItem>
            <Subscript>Total time 2 minutes</Subscript>
        </Container>   
    )
}

export default KycInfo;