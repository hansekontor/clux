import React from 'react'
import QrCode from './QrCode'
import styled from 'styled-components';
import CopyCode from './CopyCode';
import Text from './Text';

const ContentContainer = styled.div`
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    padding-bottom: 56px;
    position: sticky;
    top: 0;
    z-index: 1;
    padding-top: 16px;
    background-color: ${({ theme }) => theme.select.background};
    box-sizing: border-box;
`;

export default function Content({ value }) {
    return (
        <ContentContainer>
            <QrCode value={value} />
            <Text />
            <CopyCode value={value} />
        </ContentContainer>
    )
}
