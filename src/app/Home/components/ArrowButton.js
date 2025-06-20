import styled from 'styled-components';

const ArrowButton = styled.button`
    width: 30px;
    aspect-ratio: 1 / 1;
    border-radius: ${({ theme }) => theme.shape.full};
    background-color: ${({ theme }) => theme.color.common.white};
    border: none;
    transition: ${({ theme }) =>
        `all ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`};
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.color.text.primary};

    &:hover {
        background-color: ${({ theme }) => theme.color.tertiary.main};
        color: ${({ theme }) => theme.color.tertiary.contrastText};
    }

    ${({ disabled }) =>
        disabled ? `
            opacity: 0.3;
    ` : ""}
`;

export default ArrowButton;