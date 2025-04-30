import React from 'react';
import { StyledOverlay } from './Overlay.styles';

export default function Overlay({ children, ...props}) {
    return (
        <StyledOverlay {...props}>{children}</StyledOverlay>
    )
}
