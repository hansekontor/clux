import styled from "styled-components";
import { theme } from '@styles';

export const StyledBody = styled.div`
    text-align: center;
    font-family: 'Inter-Medium', Helvetica;
    background-color: ${theme.app.background};
`;

export const StyledWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    top: 0;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background: #f6f6f6;
    flex-direction: column;
    position: fixed;
    overflow: hidden;
`;

export const StyledContainer = styled.div`
    width: 480px;
    height: 100%;
    background-color: ${props => props.theme.select.background};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    position: fixed;
    top: 0;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1), 0px 3px 6px rgba(0, 0, 0, 0.05);
    margin-bottom: 0px;
    overflow: hidden;

    @media (max-width: 480px) {
        width: 100%;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
    }
`;