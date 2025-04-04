import React from 'react';

// core functions
import { useCheckout } from '@core/checkout';

// checkout components
import Tos from './components/Tos/Tos';
import Email from './components/Email/Email';
import Kyc from './components/Kyc/Kyc';
import Cart from './components/Cart/Cart';

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

	return <Cart />;
}

export default Checkout;
