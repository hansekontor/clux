import React from 'react';
import { StyledIconButton } from './IconButton.styles';

export default function IconButton({
    as = "button",
    children,
    startIcon,
    endIcon,
    ...props
}) {
    return (
        <StyledIconButton as={as} {...props}>
           {startIcon}{children}{endIcon}
        </StyledIconButton>
    )
}
