import { createGlobalStyle } from "styled-components";
import ReservoirGrunge from '@assets/fonts/ReservoirGrunge.ttf.woff';

const GlobalStyle = createGlobalStyle`
    /* Font face */
    @font-face {
        font-family: 'Sequel 100 Wide 95';
        src: url(${ReservoirGrunge});
    }

    body {
        margin: 0;
        font-family: 'Inter-Medium', Helvetica, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        /* Scrollbar styles */
        ::-webkit-scrollbar {
        width: 3px;
        }

        ::-webkit-scrollbar-thumb {
        background: #efefef;
        border-radius: 10px;
        }
    }

    code {
        font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
        monospace;
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

export default GlobalStyle;