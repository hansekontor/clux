import React from 'react'
import styled from 'styled-components';
import Typography from '@components/Typography';

const TextContainer = styled.div`
    text-align: centeR;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    padding-left: 16px;
    padding-right: 16px;
    margin-bottom: 24px;
`;

const HeaderTitle = styled(Typography).attrs({
    size: 'large',
    variant: 'header'
})`
    text-align: center;
    margin-bottom: 8px;
    font-size: 36px;
`

const Paragraph = styled(Typography)`
    text-align: center;
`

export default function Text() {
    return (
        <TextContainer>
            <HeaderTitle>Refer & Earn Money</HeaderTitle>
            <Paragraph>Copy that highlights the attractive reasons for using Klux’s referral system and potential earning figures.</Paragraph>
        </TextContainer>
    )
}
