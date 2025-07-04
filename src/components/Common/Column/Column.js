import React from 'react';
import { StyledColumn } from './Column.styles';

export default function Column({ children, ...props }) {
    return (
        <StyledColumn {...props}>{children}</StyledColumn>
    )
}
