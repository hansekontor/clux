import React from 'react';

import { VideoIcon, PicturesIcon, SmartphoneIcon } from '@components/Icons';
import Typography from '@components/Typography';
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
                    <Typography weight="bold">Submit a photo ID</Typography>
                    <Typography>1 minute</Typography>
                </Content>
            </TopItem>
            <BottomItem>
                <Content>
                    <SmartphoneIcon />
                    <Typography weight="bold">Do a liveness check</Typography>
                    <Typography>1 minute</Typography>
                </Content>
            </BottomItem>
            <Subscript>Total time 2 minutes</Subscript>
        </Container>
    )
}

export default KycContent;