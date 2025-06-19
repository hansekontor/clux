import styled from "styled-components";

export const StyledWrapper = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.color.background.paper};
    overflow: hidden;
`;

export const StyledContainer = styled.div`
    flex: 1;    
    width: 100%;
    max-width: 480px;
    height: 100%;
    background-color: ${({ theme }) => theme.color.background.default};
    box-shadow: ${({ theme }) => theme.shadows[8]};
    display: flex;
    flex-direction: column;

    @media (max-width: 480px) {
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
    }
`;