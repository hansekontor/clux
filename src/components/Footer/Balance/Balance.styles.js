import styled from "styled-components";

export const StyledBalance = styled.div`
    width: 112px;
    height: 40px;
    border-radius: 12px;
    background: ${props => props.theme.balance.background};
    color: ${props => props.theme.balance.color};
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Helvetica;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 2px;
`;