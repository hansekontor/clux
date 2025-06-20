import React from "react";

import { BadgeContainer, StyledBadge } from "./Badge.styles";

export default function Badge({ children, number, size, ...props }) {
  return (
    <BadgeContainer>
      {number > 0 && <StyledBadge $size={size} {...props}>{number}</StyledBadge>}
      {children}
    </BadgeContainer>
  );
}
