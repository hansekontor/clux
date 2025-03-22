import styled, { createGlobalStyle } from 'styled-components';
import { theme } from '../assets/styles/theme';


const GlobalStyle = createGlobalStyle`    
    .ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-btns > button, .ant-modal > button, .ant-modal-confirm-btns > button, .ant-modal-footer > button, #cropControlsConfirm {
        border-radius: 8px;
        background-color: ${props => props.theme.modals.buttons.background};
        color: ${props => props.theme.wallet.text.primary};
        font-weight: bold;
    }    
    
    .ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-btns > button:hover,.ant-modal-confirm-btns > button:hover, .ant-modal-footer > button:hover, #cropControlsConfirm:hover {
        color: ${props => props.theme.primary};
        transition: color 0.3s;
        background-color: ${props => props.theme.modals.buttons.background};
    }
    
    .ant-spin-text {
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: bold;
        margin-top: 40px;
        font-size: 16px;
        color: ${props => props.theme.wallet.text.secondary};
    }
    .cashLoadingIcon {
        color: #000000 !important;
        font-size: 48px !important;
    }
    table {
        border: 1px solid black;
        border-collapse: collapse;
    }
    th {
        border: 1px solid black;
        border-collapse: collapse;
    }
    td {
        border: 1px solid black;
        border-collapse: collapse;
    }
    .ant-carousel {
        width: 90%;
    }
    .ant-radio-checked {
        background-color: #48445c;
        border-color: #48445c;
    }
        
`;
const App = styled.div`
    text-align: center;
    font-family: 'Inter-Medium', Helvetica;
    background-color: ${theme.app.background};
`;
const AppBody = styled.div`
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
const AppCtn = styled.div`
    width: 480px;
    height: 100%;
    background-color: #1A1826;
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

export {
    GlobalStyle, 
    App, 
    AppBody, 
    AppCtn,
}