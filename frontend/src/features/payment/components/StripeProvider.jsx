import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Load Stripe with your publishable key
const stripePromise = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
	? loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
	: null;

const StripeProvider = ({ children }) => {
	// If Stripe key is not available, render children without Stripe Elements
	if (!stripePromise) {
		return <>{children}</>;
	}

	return (
		<Elements stripe={stripePromise}>
			{children}
		</Elements>
	);
};

export default StripeProvider; 