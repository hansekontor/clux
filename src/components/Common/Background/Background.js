import React from 'react';
import { StyledBackground } from './Background.styles';

export default function Background({ children, ...props }) {
    return (
        <StyledBackground {...props}>{children}</StyledBackground>
    )
}
