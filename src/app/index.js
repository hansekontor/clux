// node modules
import React, { Suspense, lazy } from 'react';
import {
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';

// core components
import { CheckoutProvider } from '@core/context/Checkout';
import { useWalletGlobal } from '@core/context/WalletGlobal';
import { isValidStoredWallet } from '@core/utils/cashMethods';
import { useApp } from '@core/context/App';

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
	const { wallet } = useWalletGlobal();
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
				{loading &&
					<>
						<LoadingAnimation loadingStatus={loadingStatus} />
					</>
				}

				{wallet && isValidStoredWallet(wallet) ? (
					<>
						{protection ?
							<OnBoarding
								passProtection={setProtection}
								passUser={setUser}
								passLoadingStatus={setLoadingStatus}
							/>
							:
							<>
								<Switch>
									<Route path="/select">
										<Select
											passRandomNumbers={setPlayerNumbers}
											passLoadingStatus={setLoadingStatus}
											user={user}
										/>
									</Route>
									<Route path="/checkout">
										<CheckoutProvider>
											<Checkout />
										</CheckoutProvider>
									</Route>
									<Route path="/waitingroom">
										<WaitingRoom
											passLoadingStatus={setLoadingStatus}
											activeTicket={activeTicket}
											playerNumbers={playerNumbers}
											user={user}
										/>
									</Route>
									<Route path="/game">
										<Game
											passLoadingStatus={setLoadingStatus}
											ticket={activeTicket}
										/>
									</Route>

									<Route path="/result">
										<Result
											passLoadingStatus={setLoadingStatus}
											payout={payout}
											ticket={activeTicket}
											redeemAll={redeemAll}
										/>
									</Route>
									<Route path="/backup">
										<Backup
											purchasedTicket={activeTicket}
											passLoadingStatus={setLoadingStatus}
										/>
									</Route>
									<Route path="/wallet">
										<Wallet
											passLoadingStatus={setLoadingStatus}
											passRedeemAll={setRedeemAll}
											user={user}
										/>
									</Route>
									<Route path="/cashout">
										<Cashout
											passLoadingStatus={setLoadingStatus}
										/>
									</Route>
									<Redirect exact from="/" to="/select" />
									<Route component={NotFound} />
								</Switch>
							</>
						}
					</>
				) : (
					<>
						<LoadingAnimation loadingStatus={"LOADING WALLET"} />
					</>
				)}

			</Suspense>
		</Layout>

	);
};

export default App;
