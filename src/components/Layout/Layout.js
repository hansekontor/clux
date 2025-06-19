import React from 'react';
import { StyledContainer, StyledWrapper } from './Layout.styles';

export default function Layout({ children }) {

    return (
        <StyledWrapper>
            <StyledContainer>
                {children}
            </StyledContainer>
        </StyledWrapper>
    )
}