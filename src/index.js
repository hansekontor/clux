import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { ThemeProvider } from "styled-components";

// core functions
import GA from '@core/utils/GoogleAnalytics';
import BlockLottoCoreProvider from '@core/providers/CoreProvider';
import BlockLottoFunctionsProvider from '@core/providers/FunctionsProvider';
// import { AppProvider } from '@core/context/App';
import LoadingAnimation from '@components/LoadingAnimation';

// styles
import { theme, GlobalStyles } from './styles';

// react components
import Notification from '@components/Notification';
import App from './app';


ReactDOM.render(
    <ThemeProvider theme={theme}>
        <GlobalStyles />
        <BlockLottoCoreProvider Notification={Notification} Loading={LoadingAnimation}>
            <Router>
                {GA.init() && <GA.RouteTracker />}
                {/* <AppProvider> */}
                    <BlockLottoFunctionsProvider>
                        <App />
                    </BlockLottoFunctionsProvider>
                {/* </AppProvider> */}
            </Router>
        </BlockLottoCoreProvider>
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
