import React from 'react';

// core functions
import { useCheckout } from '@core/context/Checkout';

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

	// If user has not agreed to the terms
	if (!hasAgreed) return <Tos />;

	// If user has not entered an email
	if (!hasEmail) return <Email />;

	// If KYC is required
	if (showKyc) return <Kyc />;

	return <Payment />;
}

export default Checkout;
