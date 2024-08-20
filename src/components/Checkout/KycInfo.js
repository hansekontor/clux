import React from 'react';
import styled from 'styled-components';

import VideoPersonSvg from '@assets/video_person_icon.svg';
import PicturesSvg from '@assets/pictures_icon.svg';
import SmartphoneSvg from '@assets/smartphone_icon.svg';


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
`;
const TopItem = styled(Item)`
    border-radius: 8px 8px 0 0;
`;
const BottomItem = styled(Item)`
    border-radius: 0 0 8px 8px;
`;
const Subscript = styled.div`
    font-size: 12px;
    padding: 12px 0;
`;
const Circle = styled.div`
    background-color: #D0CED8;
    border-radius: 177px;
    height: 64px;
    width: 64px;
    cursor: pointer;
    cursor: pointer;
    text-align: center;
    cursor: pointer;    
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
`;
const Icon = styled.img`
    height: 28px;
    position: absolute;
`;
const SmallCircle = styled(Circle)`
    width: 40px;
    height: 40px;
    background-color: #FFFFFF;
    margin: 0px 12px;
    border-radius: 20px;
`;
const BoldText = styled(Header)`
    font-weight: 600;
    font-family: Helvetica;
    font-size: 14px;
    padding: 0px;
`;
const Text = styled(BoldText)`
    font-weight: 500px;
`;

const KycInfo = () => {
    return (
        <Container>
            <Circle>
                <Icon src ={VideoPersonSvg}/>
            </Circle>
            <Header>Complete KYC</Header>
            <Subtitle>You need to submit a photo ID and liveness check</Subtitle>
            <TopItem>
                <SmallCircle>
                    <img src={PicturesSvg} />
                </SmallCircle>
                <BoldText>Submit a photo ID</BoldText>
                <Text>1 minute</Text>
            </TopItem>
            <BottomItem>
                <SmallCircle>
                    <img src={SmartphoneSvg} />
                </SmallCircle>
                <BoldText>Do a liveness check</BoldText>
                <Text>1 minute</Text>
            </BottomItem>
            <Subscript>Total time 2 minutes</Subscript>
        </Container>   
    )
}

export default KycInfo;