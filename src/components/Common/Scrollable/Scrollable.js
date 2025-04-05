import React from 'react';
import { StyledScrollable } from './Scrollable.styles';

export default function Scrollable({ children, ...props }) {
    return (
        <StyledScrollable {...props}>{children}</StyledScrollable>
    )
}
