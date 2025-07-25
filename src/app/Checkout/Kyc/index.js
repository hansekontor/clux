import React from 'react'
import { useHistory } from 'react-router-dom';

// core functions
import { useCheckout, useNotifications } from 'blocklotto-sdk';

// custom react components
import Header from '@components/Header';
import Button from '@components/Button';
import FlexGrow from '../components/FlexGrow';
import { VideoIcon, PicturesIcon, SmartphoneIcon } from '@components/Icons';
import Typography from '@components/Typography';
import Container from './components/Container';
import ContentHeader from './components/ContentHeader';
import Subtitle from './components/Subtitle';
import { BottomItem, TopItem } from './components/Item';
import Content from './components/Content';
import Subscript from './components/Subscript';

export default function Kyc() {
    const { handleKYCandCapture } = useCheckout();
    const notify = useNotifications();
    const history = useHistory();

    const handleSuccess = (message) => {
        notify({ type: "success", message: "KYC successful"});
    }

    const handleError = (message) => {
        notify({ type: "error", message });
        history.push("/select");
    }
    return (
        <>
            <Header />
            <FlexGrow variant="secondary">
                <Container>
                    <VideoIcon />
                    <ContentHeader>Complete KYC - Coming Soon</ContentHeader>
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
                <Button onClick={(e) => handleKYCandCapture(e, handleSuccess, handleError)}>
                    Continue
                </Button>
            </FlexGrow>
        </>
    )
}
