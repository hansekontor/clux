import styled from "styled-components";

export const StyledBadge = styled.div`
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => ($size === "sm" ? "16px" : "20px")};
  height: ${({ $size }) => ($size === "sm" ? "16px" : "20px")};
  border-radius: 999px;
  font-size: ${({ theme, $size }) =>
    $size === "sm" ? "0.5rem" : theme.typography.caption.fontSize};
  background-color: ${({ theme, color = "primary" }) =>
    theme?.color?.[color]?.main || color};
  color: ${({ theme, color = "primary" }) =>
    theme?.color?.[color]?.contrastText || "white"};
  position: absolute;
  top: -5px;
  right: -5px;
  box-shadow: ${({ theme }) => theme.shadows[1]};
  z-index: 999999999;
`;

export const BadgeContainer = styled.div`
  position: relative;
`;
