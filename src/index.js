import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { ThemeProvider } from "styled-components";

// core functions
import GA from '@core/utils/GoogleAnalytics';
import { AuthenticationProvider } from '@core/context/Authentication';
import { WalletGlobalProvider } from '@core/context/WalletGlobal';
import { NotificationsProvider } from '@core/context/Notifications';
import { AppProvider } from '@core/context/App';

// styles
import { theme, GlobalStyles } from './styles';

// react components
import Notification from '@components/Notification';
import App from './app';

ReactDOM.render(
    <AuthenticationProvider>
        <WalletGlobalProvider>
            <ThemeProvider theme={theme}>
                <GlobalStyles />
                <NotificationsProvider Notification={Notification}>
                    <Router>
                        {GA.init() && <GA.RouteTracker />}
                        <AppProvider>
                            <App />
                        </AppProvider>
                    </Router>
                </NotificationsProvider>
            </ThemeProvider>
        </WalletGlobalProvider>
    </AuthenticationProvider>,
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
