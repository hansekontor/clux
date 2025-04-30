import styled from "styled-components";

export const StyledContainer = styled.div`
    width: 90%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 12px auto;
`;

export const StyledRow = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-evenly;
`;

export const StyledWordBox = styled.div`
    background-color: ${props => props.theme.app.background};
    display: flex;
    justify-content: space-between;
    padding-left: 7px;
    padding-right: 7px;
    min-width: 80px;
    height: 42px;
    align-items: center;
    border-radius: 4px;
`;

export const StyledCount = styled.div`
    color: #B0B0B0;
`;

export const StyledWord = styled.div`
    color: ${props => props.theme.text.color};
    font-family: Inter-Medium, Helvetica;
`;