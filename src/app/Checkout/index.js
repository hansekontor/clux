import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// core functions
import { useCheckout } from '@core/context/Checkout';
import { useApp } from '@core/context/App';
import { useNotifications } from '@core/context/Notifications';

// checkout components
import Tos from './Tos';
import Email from './Email';
import Kyc from './Kyc';
import Payment from './Payment';

const Checkout = () => {
	const {
		hasAgreed,
		hasEmail,
		showKyc,
	} = useCheckout();
	const { playerNumbers } = useApp()
	const history = useHistory();
	const notify = useNotifications();

	// Check if player numbers are set
	useEffect(() => {
		let isMounted = true;
		const checkPlayerNumbers = async () => {
			if (playerNumbers.length !== 4 && isMounted) {
				notify({message: "PLAYER NUMBERS ARE MISSING", type: "error"});
				history.push("/");
			}
		};
		checkPlayerNumbers();
		return () => { isMounted = false };  // Cleanup function
	}, [playerNumbers]);

	// If user has not agreed to the terms
	if (!hasAgreed) return <Tos />;

	// If user has not entered an email
	if (!hasEmail) return <Email />;

	// If KYC is required
	if (showKyc) return <Kyc />;

	return <Payment />;
}

export default Checkout;
