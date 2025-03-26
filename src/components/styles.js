import styled, { createGlobalStyle } from 'styled-components';

const theme = { 
    app: {
        background: '#F6F6F6',
    },
    buttons: {
        primary: {
            background: '#F2BC57', 
            color: '#000000',
            font: 'Sequel 100 Wide 95',
            inactive: {
                background: '#DFDFDF', 
            }
        },
        secondary: {
            background: '#FEFFFE', 
            color: '#000000',
            font: 'Sequel 100 Wide 95',
        },
        tertiary: {
            background: '#44405B', 
            color: '#FEFFFE',
            font: 'Helvetica',
        },
    }, 
    text: {
        color: '#000000',
        font: 'Sequel 100 Wide 95'
    },
    footer: {
        background: '#48445C'
    },
    select: {
        background: '#1A1826',
    },
    checkout: {
        background: '#FEFFFE',
        text: '#1A1826',
        payment: {
            background: '#EAEAEA',
        },
        methods: {
            active: {
                background: '#131312',
                color: '#FEFFFE'
            },
            inactive: {
                background: '#EAEAEA',
                color: '#131312,'
            },
            border: '#B9B9B9'
        },
        navigation: {
            background: '#FEFFFE'
        },
        divider: {
            color: '#E1E0E0'
        }
    },
    error: {
        background: '#FB918E',
        color: '#002152'
    },
    success: {
        background: '#38A368',
        color: '#FEFFFE'
    },
    info: {
        background: '#FEFFFE',
        color: '#002152'
    },
    numbers: {
        background: '#FEFFFE',
        divider: '#C6C6C6',
        font: 'Sequel 100 Wide 95'
    },
    loader: { 
        background: '#000000',
        container: '#FEFFFE',
        circle: '#32C770',
    },
    input: {
        background: '#FEFFFE',
        color: '#ABCDEF'
    },
    balance: {
        background: '#1A2131',
        color: '#FEFFFE'
    }
};

const GlobalStyle = createGlobalStyle`        
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

export {
    theme,
    GlobalStyle, 
    App, 
    AppBody, 
    AppCtn,
}