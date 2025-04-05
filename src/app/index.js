// node modules
import React, { useState, Suspense, lazy, useEffect, useContext } from 'react';
import {
	Route,
	Switch,
	Redirect,
	useHistory,
	useLocation
} from 'react-router-dom';

// core components
import { CheckoutProvider } from '@core/context/Checkout';
import { useWalletGlobal } from '@core/context/WalletGlobal';
import { isValidStoredWallet } from '@core/utils/cashMethods';

// react components
import Layout from '@components/Layout';
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
import LoadingAnimation from '@components/LoadingAnimation';
import { CashLoadingIcon, LoadingBlock } from '@components/Icons';


const App = () => {
	const history = useHistory();
	const location = useLocation();

	const { wallet, loading } = useWalletGlobal();
	const codeSplitLoader = <LoadingBlock>{CashLoadingIcon}</LoadingBlock>;
	const [loadingStatus, setLoadingStatus] = useState(false);
	const [loader, setLoader] = useState(true);
	const [playerNumbers, setPlayerNumbers] = useState(false);
	const [activeTicket, setActiveTicket] = useState(false);
	const [payout, setPayout] = useState(false);
	const [protection, setProtection] = useState(true);
	const [redeemAll, setRedeemAll] = useState(false);
	const [user, setUser] = useState(false);


	useEffect(() => {
		if (location.state?.repeatOnboarding) {
			setProtection(true);
			window.history.replaceState({}, '')
		}
	}, [location.state])

	// activates the loading screen on change of loadingStatus for loading within routes
	useEffect(async () => {
		if (loadingStatus && !loader) {
			setLoader(true);
		} else if (!loadingStatus && loader) {
			// await sleep(500);
			setLoader(false);
		}
	}, [loadingStatus]);

	// initial wallet loading or creation
	useEffect(async () => {
		console.log("APP wallet", wallet);
		if (loading) {
			setLoadingStatus("LOADING WALLET");
		} else {
			setLoader(false);
		}
	}, [loading]);

	// handle query parameters
	useEffect(() => {
		const ticketIdFromQuery = new URLSearchParams(location?.search).get("ticket");
		const hasCorrectLength = ticketIdFromQuery?.length === 64;
		if (ticketIdFromQuery && hasCorrectLength) {
			setActiveTicket({ id: ticketIdFromQuery });
			history.push("/waitingroom");
		}
	}, []);


	return (
		<Layout>
			<Suspense fallback={codeSplitLoader}>
				{loader &&
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
										<CheckoutProvider
											passLoadingStatus={setLoadingStatus}
											playerNumbers={playerNumbers}
											passPurchasedTicket={setActiveTicket}
											user={user}
										>
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
