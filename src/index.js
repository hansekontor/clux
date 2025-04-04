import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import { HashRouter as Router } from 'react-router-dom';

// core functions
import GA from '@core/utils/GoogleAnalytics';
import { AuthenticationProvider } from '@core/context/Authentication';
import { WalletProvider } from '@core/context/Wallet';
import { NotificationsProvider } from '@core/context/Notifications';

// custom notifications
import Notification from './components/Notification';

ReactDOM.render(
    <AuthenticationProvider>
        <WalletProvider>
            <NotificationsProvider Notification={Notification}>
                <Router>
                    {GA.init() && <GA.RouteTracker />}
                    <App />
                </Router>
            </NotificationsProvider>
        </WalletProvider>
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
