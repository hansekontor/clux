import React from 'react';
import { StyledButtonPrimary, StyledButtonSecondary, StyledButtonTertiary } from './Button.styles';

export default function Button({ variant = 'primary', children, ...props }) {
  if (variant === 'primary') {
    return <StyledButtonPrimary {...props}>{children}</StyledButtonPrimary>;
  } else if (variant === 'secondary') {
    return <StyledButtonSecondary {...props}>{children}</StyledButtonSecondary>;
  } else if (variant === 'tertiary') {
    return <StyledButtonTertiary {...props}>{children}</StyledButtonTertiary>;
  }

  return <StyledButtonPrimary {...props}>{children}</StyledButtonPrimary>;
}