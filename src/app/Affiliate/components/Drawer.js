import React from 'react'
import styled from 'styled-components';

const DrawerWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: white;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    padding-top: 32px;
    padding-bottom: 32px;
    position: relative;
    z-index: 2;
    box-sizing: border-box;
    box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
    top: -16px;
`;

const DrawerContainer = styled.div`
    width: 100%;
    box-sizing: border-box;
    padding-left: 16px;
    padding-right: 16px;
`;

export default function Drawer({ children }) {
    return (
        <DrawerWrapper>
            <DrawerContainer>
                {children}
            </DrawerContainer>
        </DrawerWrapper>
    )
}
