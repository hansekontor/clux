import styled, { css } from "styled-components";

const baseButtonStyles = css`
  display: flex;
  align-items: center;
  justify-content: ${({ justifyContent }) => (justifyContent ? justifyContent : "center")};
  text-align: ${({ textAlign }) => (textAlign ? textAlign : "center")};
  gap: ${({ theme }) => theme.spacing(1)};
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  font-family: ${({ theme }) => theme.typography.button.fontFamily};
  font-size: ${({ theme }) => theme.typography.button.fontSize};
  font-weight: ${({ theme }) => theme.typography.button.fontWeight};
  line-height: ${({ theme }) => theme.typography.button.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.button.letterSpacing};
  text-transform: ${({ theme }) => theme.typography.button.textTransform};
  border: none;
  border-radius: ${({ theme }) => theme.shape.md};
  padding: ${({ theme, size }) => {
    const vertical = size === "lg" ? 3 : size === "sm" ? 1 : size === "xs" ? 0.5 : 2;
    const horizontal = size === "lg" ? 4 : size === "sm" ? 2 : size === "xs" ? 1 : 3;
    return `${theme.spacing(vertical)} ${theme.spacing(horizontal)}`;
  }};
  background-color: ${({ theme, color = "primary" }) =>
    theme?.color?.[color]?.main || color};
  color: ${({ theme, color = "primary" }) =>
    theme?.color?.[color]?.contrastText || "white"};
  transition: ${({ theme }) =>
    `all ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`};
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background-color: ${({ theme, color = "primary" }) =>
      theme?.color?.[color]?.dark || color};
    color: ${({ theme, color = "primary" }) =>
      theme?.color?.[color]?.contrastText || "white"};
  }
`;

const variantStyles = {
  pill: css`
    border-radius: ${({ theme }) => theme.shape.full};
  `,
  text: css`
    padding: 0;
    background-color: transparent;
    color: ${({ theme, color = "primary" }) =>
      theme?.color?.[color]?.main || color};
    &:hover {
      background-color: transparent;
      color: ${({ theme, color = "primary" }) =>
        theme?.color?.[color]?.dark || color};
    }
  `,
};

export const StyledButton = styled.button`
  ${baseButtonStyles}
  ${({ variant }) => variant && variantStyles[variant]}
`;