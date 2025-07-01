import React from 'react';
import { StyledButton } from './Button.styles';

export default function Button({
    as = "button",
    children,
    startIcon,
    endIcon,
    ...props
}) {
    return (
        <StyledButton as={as} {...props}>
           {startIcon}{children}{endIcon}
        </StyledButton>
    )
}
