// node modules
import React, { Suspense, lazy } from 'react';
import {
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';

// core components
import { useApp } from 'blocklotto-sdk';
import { CheckoutProvider } from 'blocklotto-sdk';
import { CashoutProvider } from 'blocklotto-sdk';

// react components
const Select = lazy(() => import('./Select'));
const Checkout = lazy(() => import('./Checkout'));
const Backup = lazy(() => import('./Backup'));
const WaitingRoom = lazy(() => import('./WaitingRoom'));
const Game = lazy(() => import('./Game'));
const Result = lazy(() => import('./Result'));
const Wallet = lazy(() => import('./Wallet'));
const Cashout = lazy(() => import('./Cashout'));
const NotFound = lazy(() => import('./NotFound'));
const OnBoarding = lazy(() => import('./OnBoarding'));
const Affiliate = lazy(() => import('./Affiliate'));
import Layout from '@components/Layout';
import LoadingAnimation from '@components/LoadingAnimation';
import { CashLoadingIcon, LoadingBlock } from '@components/Icons';


const App = () => {
	const { wallet } = useApp();
	const {
		loadingStatus,
		loading,
		protection,
		user,
		playerNumbers,
		activeTicket,
		setProtection,
		setUser,
		setLoadingStatus,
		setPlayerNumbers,
		setActiveTicket,
	} = useApp();

	const codeSplitLoader = <LoadingBlock>{CashLoadingIcon}</LoadingBlock>;

	return (
		<Layout>
			<Suspense fallback={codeSplitLoader}>
				<>
					{protection ?
						<OnBoarding />
						:
						<>
							<Switch>
								<Route path="/select">
									<Select />
								</Route>
								<Route path="/checkout">
									<CheckoutProvider>
										<Checkout />
									</CheckoutProvider>
								</Route>
								<Route path="/waitingroom">
									<WaitingRoom />
								</Route>
								<Route path="/game">
									<Game />
								</Route>
								<Route path="/result">
									<Result />
								</Route>
								<Route path="/backup">
									<Backup />
								</Route>
								<Route path="/wallet">
									<Wallet
										passLoadingStatus={setLoadingStatus}
										user={user}
									/>
								</Route>
								<Route path="/cashout">
									<CashoutProvider>
										<Cashout />
									</CashoutProvider>
								</Route>
								<Route path="/affiliate">
									<Affiliate />
								</Route>
								<Redirect exact from="/" to="/select" />
								<Route component={NotFound} />
							</Switch>
						</>
					}
				</>
			</Suspense>
		</Layout>

	);
};

export default App;
