// node modules
import React, { Suspense, lazy } from 'react';
import {
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';

// core components
import { useCashTab } from '@core/context/CashTab';
import { useApp } from '@core/context/App';
import { CheckoutProvider } from '@core/context/Checkout';
import { CashoutProvider } from '@core/context/Cashout';
import { ResultProvider } from '@core/context/Result';
import { WaitingRoomProvider } from '@core/context/WaitingRoom';

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
const OnBoarding = lazy(() => import('./OnBoarding'))
import Layout from '@components/Layout';
import LoadingAnimation from '@components/LoadingAnimation';
import { CashLoadingIcon, LoadingBlock } from '@components/Icons';


const App = () => {
	const { wallet } = useCashTab();
	const {
		loadingStatus,
		loading,
		protection,
		user,
		playerNumbers,
		activeTicket,
		redeemAll,
		payout,
		setProtection,
		setUser,
		setLoadingStatus,
		setPlayerNumbers,
		setActiveTicket,
		setRedeemAll
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
									<WaitingRoomProvider>
										<WaitingRoom
											passLoadingStatus={setLoadingStatus}
											activeTicket={activeTicket}
											playerNumbers={playerNumbers}
											user={user}
										/>
									</WaitingRoomProvider>
								</Route>
								<Route path="/game">
										<Game />
								</Route>

								<Route path="/result">
									<ResultProvider>
										<Result />
									</ResultProvider>
								</Route>
								<Route path="/backup">
									<Backup />
								</Route>
								<Route path="/wallet">
									<Wallet
										passLoadingStatus={setLoadingStatus}
										passRedeemAll={setRedeemAll}
										user={user}
									/>
								</Route>
								<Route path="/cashout">
									<CashoutProvider>
										<Cashout />
									</CashoutProvider>
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
