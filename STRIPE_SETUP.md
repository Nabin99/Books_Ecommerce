# Stripe Payment Integration Setup

This guide will help you set up Stripe payments for your e-commerce application.

## Backend Setup

### 1. Install Dependencies
The Stripe package has already been installed. Make sure you have the following in your `backend/package.json`:
```json
{
  "dependencies": {
    "stripe": "^latest_version"
  }
}
```

### 2. Environment Variables
Add the following to your `backend/.env` file:
```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```

### 3. Get Your Stripe Keys
1. Sign up for a Stripe account at https://stripe.com
2. Go to the Stripe Dashboard
3. Navigate to Developers > API Keys
4. Copy your **Publishable Key** and **Secret Key**
5. Use the test keys for development (they start with `pk_test_` and `sk_test_`)

## Frontend Setup

### 1. Install Dependencies
The Stripe packages have already been installed. Make sure you have:
```json
{
  "dependencies": {
    "@stripe/stripe-js": "^latest_version",
    "@stripe/react-stripe-js": "^latest_version"
  }
}
```

### 2. Environment Variables
Add the following to your `frontend/.env` file:
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

## Features Added

### Backend Features
- **Payment Controller**: Handles payment intent creation, confirmation, and refunds
- **Payment Routes**: API endpoints for payment operations
- **Updated Order Model**: Added payment status and Stripe payment intent tracking
- **Enhanced Order Controller**: Supports different payment modes

### Frontend Features
- **Payment API**: Redux API calls for payment operations
- **Payment Slice**: State management for payment operations
- **Stripe Components**: 
  - `StripeProvider`: Wraps the app with Stripe configuration
  - `StripePayment`: Handles card payment form
- **Enhanced Checkout**: Integrated Stripe payment flow

## Payment Flow

1. **User selects payment method** (COD or Stripe)
2. **Order creation**: Order is created with pending payment status
3. **Payment intent creation**: For Stripe payments, a payment intent is created
4. **Payment form**: User enters card details in a modal
5. **Payment confirmation**: Payment is processed and order status is updated
6. **Success/Error handling**: User is redirected based on payment result

## API Endpoints

### Payment Endpoints
- `POST /payments/create-payment-intent` - Create Stripe payment intent
- `POST /payments/confirm-payment` - Confirm payment with backend
- `GET /payments/status/:orderId` - Get payment status
- `POST /payments/refund/:orderId` - Process refund

## Testing

### Test Card Numbers
Use these test card numbers for testing:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

### Test Data
- **Expiry Date**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

## Security Notes

1. **Never expose your secret key** in frontend code
2. **Always use HTTPS** in production
3. **Validate payment amounts** on the backend
4. **Handle webhooks** for production (not implemented in this basic setup)
5. **Use environment variables** for all sensitive data

## Production Considerations

1. **Webhook Handling**: Implement Stripe webhooks for payment status updates
2. **Error Handling**: Add comprehensive error handling and logging
3. **Security**: Implement additional security measures
4. **Testing**: Use Stripe's test mode for development
5. **Monitoring**: Set up payment monitoring and alerts

## Troubleshooting

### Common Issues
1. **CORS errors**: Ensure your frontend origin is allowed in backend CORS settings
2. **Payment intent errors**: Check that your Stripe keys are correct
3. **Environment variables**: Make sure all environment variables are set correctly
4. **Network errors**: Verify your API endpoints are accessible

### Debug Tips
1. Check browser console for frontend errors
2. Check server logs for backend errors
3. Use Stripe's test mode for development
4. Verify all environment variables are loaded correctly 