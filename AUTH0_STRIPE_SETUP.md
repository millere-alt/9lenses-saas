# Auth0 and Stripe Integration Setup Guide

This guide will walk you through setting up Auth0 authentication and Stripe payments for the 9Vectors application.

## Table of Contents
1. [Auth0 Setup](#auth0-setup)
2. [Stripe Setup](#stripe-setup)
3. [Environment Configuration](#environment-configuration)
4. [Testing the Integration](#testing-the-integration)
5. [Deployment](#deployment)

---

## Auth0 Setup

### Step 1: Create Auth0 Account
1. Go to https://auth0.com and sign up for a free account
2. Create a new tenant (e.g., `9vectors`)

### Step 2: Create Application
1. Navigate to **Applications** > **Applications** in the Auth0 dashboard
2. Click **Create Application**
3. Name: `9Vectors SaaS`
4. Type: Select **Single Page Web Applications**
5. Click **Create**

### Step 3: Configure Application Settings
1. In your application settings, scroll to **Application URIs**
2. Add the following URLs:

   **Allowed Callback URLs:**
   ```
   http://localhost:3005, https://www.9vectors.com
   ```

   **Allowed Logout URLs:**
   ```
   http://localhost:3005, https://www.9vectors.com
   ```

   **Allowed Web Origins:**
   ```
   http://localhost:3005, https://www.9vectors.com
   ```

3. Scroll to **Advanced Settings** > **Grant Types**
4. Ensure these are enabled:
   - Authorization Code
   - Refresh Token
   - Implicit

5. Click **Save Changes**

### Step 4: Create API
1. Navigate to **Applications** > **APIs**
2. Click **Create API**
3. Settings:
   - Name: `9Vectors API`
   - Identifier: `https://9vectors.com/api`
   - Signing Algorithm: `RS256`
4. Click **Create**

### Step 5: Get Credentials
From your Application settings, copy:
- **Domain** (e.g., `your-tenant.us.auth0.com`)
- **Client ID**
- **Client Secret** (from Settings tab)

---

## Stripe Setup

### Step 1: Create Stripe Account
1. Go to https://stripe.com and sign up
2. Activate your account (you can start in test mode)

### Step 2: Get API Keys
1. Navigate to **Developers** > **API Keys**
2. Copy your:
   - **Publishable key** (starts with `pk_test_` in test mode)
   - **Secret key** (starts with `sk_test_` in test mode)

### Step 3: Create Products and Prices
1. Navigate to **Products** > **Add product**
2. Create three products:

#### Starter Plan
- Name: `9Vectors Starter`
- Description: `Starter plan with AI insights`
- Pricing:
  - Price: `$49`
  - Billing period: `Monthly`
  - Click **Save product**
  - Copy the **Price ID** (starts with `price_...`)

#### Professional Plan
- Name: `9Vectors Professional`
- Description: `Professional plan with advanced features`
- Pricing:
  - Price: `$149`
  - Billing period: `Monthly`
  - Click **Save product**
  - Copy the **Price ID**

#### Enterprise Plan
- Name: `9Vectors Enterprise`
- Description: `Enterprise plan with unlimited access`
- Pricing:
  - Price: `$499`
  - Billing period: `Monthly`
  - Click **Save product**
  - Copy the **Price ID**

### Step 4: Set Up Webhook
1. Navigate to **Developers** > **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://www.9vectors.com/api/stripe/webhook` (or use ngrok for local testing)
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_...`)

### Step 5: Enable Customer Portal
1. Navigate to **Settings** > **Billing** > **Customer portal**
2. Click **Activate test link** (or configure as needed)
3. Customize the portal settings:
   - Enable invoice history
   - Enable subscription cancellation
   - Enable payment method updates

---

## Environment Configuration

### Frontend (.env)
Update `/Users/edwinmiller/Desktop/9Vectors/.env`:

```bash
# Backend API URL
VITE_API_URL=http://localhost:3001
VITE_ENV=development

# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id-from-auth0
VITE_AUTH0_AUDIENCE=https://9vectors.com/api

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key
```

### Backend (api/.env)
Update `/Users/edwinmiller/Desktop/9Vectors/api/.env`:

```bash
# Auth0 Configuration
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_AUDIENCE=https://9vectors.com/api
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Stripe Price IDs
STRIPE_PRICE_STARTER=price_your-starter-price-id
STRIPE_PRICE_PROFESSIONAL=price_your-professional-price-id
STRIPE_PRICE_ENTERPRISE=price_your-enterprise-price-id
```

---

## Switch to Auth0 Authentication

### Update App.jsx
Edit `/Users/edwinmiller/Desktop/9Vectors/src/App.jsx`:

Replace:
```javascript
import { AuthProvider } from './contexts/AuthContext';
```

With:
```javascript
import { Auth0ProviderWithConfig } from './contexts/Auth0Context';
```

And replace:
```javascript
<AuthProvider>
  {/* routes */}
</AuthProvider>
```

With:
```javascript
<Auth0ProviderWithConfig>
  {/* routes */}
</Auth0ProviderWithConfig>
```

### Update Components Using Auth
Any component using `useAuth()` will automatically work with Auth0 since both contexts export the same interface.

---

## Testing the Integration

### Test Auth0 Login
1. Start the application: `npm run dev`
2. Click "Sign In" button
3. You should be redirected to Auth0 login page
4. Create a test account or sign in with Google/GitHub
5. After successful login, you should be redirected back to the app

### Test Stripe Checkout
1. Log in to the application
2. Navigate to `/pricing` or `/billing`
3. Click "Upgrade Now" on any paid plan
4. You should be redirected to Stripe Checkout
5. Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
6. Complete the checkout
7. You should be redirected back with success message

### Test Billing Portal
1. After subscribing, go to `/billing`
2. Click "Manage Subscription"
3. You should be redirected to Stripe Customer Portal
4. Test updating payment method and canceling subscription

---

## Deployment

### Deploy to Azure Static Web Apps

#### Update Environment Variables in Azure
1. Go to your Static Web App in Azure Portal
2. Navigate to **Configuration**
3. Add application settings:
   - `VITE_AUTH0_DOMAIN`
   - `VITE_AUTH0_CLIENT_ID`
   - `VITE_AUTH0_AUDIENCE`
   - `VITE_STRIPE_PUBLISHABLE_KEY`

#### Update Auth0 Production Settings
1. In Auth0 dashboard, update your application settings
2. Add production URLs to:
   - Allowed Callback URLs: `https://www.9vectors.com`
   - Allowed Logout URLs: `https://www.9vectors.com`
   - Allowed Web Origins: `https://www.9vectors.com`

#### Update Stripe Webhook
1. Update webhook endpoint URL to production API
2. Use production secret keys (starting with `pk_live_` and `sk_live_`)

### Deploy API to Azure App Service

#### Add Environment Variables
In your Azure App Service, add:
- All Auth0 configuration
- All Stripe configuration
- Cosmos DB configuration

#### Update CORS Settings
In `api/src/server.js`, the CORS configuration already includes `PRODUCTION_URL`.

---

## Troubleshooting

### Auth0 Issues

**Problem:** "Invalid callback URL"
- **Solution:** Verify the callback URL in Auth0 matches your app exactly

**Problem:** "Access Denied"
- **Solution:** Check that the API identifier matches in both Auth0 and your `.env`

**Problem:** "Token expired"
- **Solution:** Auth0 tokens auto-refresh. Check browser console for errors

### Stripe Issues

**Problem:** "Invalid API key"
- **Solution:** Verify you're using the correct key for test/production mode

**Problem:** "Webhook signature verification failed"
- **Solution:** Check that the webhook secret matches the endpoint in Stripe dashboard

**Problem:** "Payment declined"
- **Solution:** Use Stripe test cards: https://stripe.com/docs/testing

---

## Security Best Practices

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use different keys for test/production**
3. **Rotate secrets regularly**
4. **Enable 2FA on Auth0 and Stripe accounts**
5. **Monitor Stripe webhooks for suspicious activity**
6. **Use HTTPS in production**
7. **Implement rate limiting** (already configured)
8. **Keep dependencies updated**

---

## Additional Resources

- [Auth0 Documentation](https://auth0.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Auth0 React SDK](https://auth0.com/docs/libraries/auth0-react)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)

---

## Support

For issues specific to:
- **Auth0**: Check Auth0 community forums or support
- **Stripe**: Contact Stripe support or check their docs
- **9Vectors App**: Create an issue in the GitHub repository
