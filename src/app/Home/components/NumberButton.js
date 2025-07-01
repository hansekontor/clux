import styled from 'styled-components';

const NumberButton = styled.button`
    width: 100%;
    min-width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: ${({ theme }) => theme.shape.full};
    background-color: ${({ theme }) => theme.color.common.white};
    border: none;
    transition: ${({ theme }) =>
    `all ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`};
    cursor: pointer;
    color: ${({ theme }) => theme.color.text.primary};
    font-size: 1.2rem;

    &:hover {
        background-color: ${({ theme }) => theme.color.grey[200]};
    }

    /* Active */
    ${({ theme, active }) =>
        active ? `
        background-color: ${theme.color.tertiary.main};
        color: ${theme.color.tertiary.contrastText};

        &:hover {
            background-color: ${theme.color.tertiary.dark};
        }
    ` : ""}
`;

export default NumberButton;