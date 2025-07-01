import styled from "styled-components";

export const BaseAlert = styled.div`
    border-radius: ${({ theme }) => theme.shape.sm};
    padding: ${({ theme }) => theme.spacing(1.5)};
    padding-left: ${({ theme }) => theme.spacing(2.5)};
    padding-right: ${({ theme }) => theme.spacing(2.5)};
    border: 1px solid;
    display: flex;
    gap: ${({ theme }) => theme.spacing(1)};
    align-items: center;

    background-color: ${({ theme, type }) => {
        switch (type) {
            case 'error':
                return `${theme.color.error.main}30`; // Adding 30 for reduced opacity (hex transparency)
            case 'success':
                return `${theme.color.success.light}30`;
            case 'info':
                return `${theme.color.info.light}30`;
            case 'warning':
                return `${theme.color.warning.light}30`;
            default:
                return `${theme.color.primary.light}30`;
        }
    }};
    border-color: ${({ theme, type }) => {
        switch (type) {
            case 'error':
                return theme.color.error.main;
            case 'success':
                return theme.color.success.main;
            case 'info':
                return theme.color.info.main;
            case 'warning':
                return theme.color.warning.main;
            default:
                return theme.color.primary.main;
        }
    }};
    color: ${({ theme, type }) => {
        switch (type) {
            case 'error':
                return theme.color.error.dark;
            case 'success':
                return theme.color.success.dark;
            case 'info':
                return theme.color.info.dark;
            case 'warning':
                return theme.color.warning.dark;
            default:
                return theme.color.primary.dark;
        }
    }};
`