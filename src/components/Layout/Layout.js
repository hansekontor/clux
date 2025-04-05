import React from 'react';
import { StyledBody, StyledContainer, StyledWrapper } from './Layout.styles';

export default function Layout({ children }) {
    return (
        <StyledBody>
            <StyledWrapper>
                <StyledContainer>
                    {children}
                </StyledContainer>
            </StyledWrapper>
        </StyledBody>
    )
}