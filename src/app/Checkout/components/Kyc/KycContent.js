import React from 'react';

import { VideoIcon, PicturesIcon, SmartphoneIcon } from '@components/Icons';
import { Text, BoldText } from '@components/Text';
import { BottomItem, Container, Content, Header, Subscript, Subtitle, TopItem } from './KycStyles';

const KycContent = () => {
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

export default KycContent;