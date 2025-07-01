import styled, { css } from "styled-components";

const baseIconButtonStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${({ theme }) => theme.shape.sm};
  padding: ${({ theme }) => theme.spacing(1)};
  background-color: transparent;
  transition: ${({ theme }) =>
    `all ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`};
  cursor: pointer;
  text-decoration: none;
  color: inherit;

  &:hover {
    background-color: ${({ theme }) =>
      theme.color.grey[300]};
  }
`;

export const StyledIconButton = styled.button`
  ${baseIconButtonStyles}
`;