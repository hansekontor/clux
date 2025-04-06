// node modules
import React, { Suspense, lazy } from 'react';
import {
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';

// core components
import { useBlockLotto } from '@core/context/BlockLotto';
import { isValidStoredWallet } from '@core/utils/cashMethods';
import { useApp } from '@core/context/App';
import { CheckoutProvider } from '@core/context/Checkout';
import { OnBoardingProvider } from '@core/context/OnBoarding';
import { BackupProvider } from '@core/context/Backup';
import { CashoutProvider } from '@core/context/Cashout';
import { GameProvider } from '@core/context/Game';
import { ResultProvider } from '@core/context/Result';

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
	const { wallet } = useBlockLotto();
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
							<OnBoardingProvider>
								<OnBoarding />
							</OnBoardingProvider>
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
										<GameProvider>
											<Game />
										</GameProvider>
									</Route>

									<Route path="/result">
										<ResultProvider>
											<Result
												passLoadingStatus={setLoadingStatus}
												payout={payout}
												ticket={activeTicket}
												redeemAll={redeemAll}
											/>
										</ResultProvider>
									</Route>
									<Route path="/backup">
										<BackupProvider>
											<Backup />
										</BackupProvider>
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
