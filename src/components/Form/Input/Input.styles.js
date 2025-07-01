import styled from "styled-components";

export const BaseInput = styled.input`
    background-color: ${({ theme }) => theme.color.grey[200]};
    border: none;
    transition: ${({ theme }) =>
        `all ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`};
    border-radius: ${({ theme }) => theme.shape.sm};
    padding: ${({ theme }) => theme.spacing(1.5)};
    padding-left: ${({ theme }) => theme.spacing(2.5)};
    padding-right: ${({ theme }) => theme.spacing(2.5)};
    width: ${({ fullWidth }) => fullWidth ? "100%" : "auto"};
    box-sizing: border-box;
    font-size: ${({ theme }) => theme.typography.fontSize};

    &:hover {
        background-color: ${({ theme }) => theme.color.grey[300]};
    }
`;
