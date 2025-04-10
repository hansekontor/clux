import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { ThemeProvider } from "styled-components";

// core functions
import GA from '@core/utils/GoogleAnalytics';
import BlockLottoProvider from '@core/providers/BlockLottoProvider';
import LoadingAnimation from '@components/LoadingAnimation';

// styles
import { theme, GlobalStyles } from './styles';

// react components
import Notification from '@components/Notification';
import App from './app';


ReactDOM.render(
    <ThemeProvider theme={theme}>
        <GlobalStyles />
        <BlockLottoProvider Notification={Notification} Loading={LoadingAnimation}>
            <Router>
                {GA.init() && <GA.RouteTracker />}
                <App />
            </Router>
        </BlockLottoProvider>
    </ThemeProvider>,
    document.getElementById('root'),
);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () =>
        navigator.serviceWorker.register('/serviceWorker.js').catch(() => null),
    );
}

if (module.hot) {
    module.hot.accept();
}
