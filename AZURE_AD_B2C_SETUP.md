# Azure AD B2C & Stripe Integration Setup Guide

This guide will walk you through setting up **Azure AD B2C** authentication and **Stripe** payments for the 9Vectors application - keeping everything in the Azure ecosystem!

## Table of Contents
1. [Azure AD B2C Setup](#azure-ad-b2c-setup)
2. [Stripe Setup](#stripe-setup)
3. [Environment Configuration](#environment-configuration)
4. [Testing the Integration](#testing-the-integration)
5. [Deployment](#deployment)

---

## Azure AD B2C Setup

### Why Azure AD B2C?
- ✅ Fully integrated with Azure infrastructure
- ✅ No vendor lock-in to third parties
- ✅ Built-in social identity providers
- ✅ Custom branding and user flows
- ✅ Scalable and secure
- ✅ Free tier: 50,000 MAU (Monthly Active Users)

### Step 1: Create Azure AD B2C Tenant

1. Go to [Azure Portal](https://portal.azure.com/)
2. Search for "Azure AD B2C" in the search bar
3. Click **Create**
4. Select **Create a new Azure AD B2C Tenant**
5. Fill in:
   - **Organization name**: `9Vectors`
   - **Initial domain name**: `9vectors` (will become `9vectors.onmicrosoft.com`)
   - **Country/Region**: `United States`
6. Click **Review + create** then **Create**
7. Wait 2-3 minutes for tenant creation
8. Click **Link to subscription** if prompted

### Step 2: Register Your Application

1. In Azure AD B2C, go to **App registrations**
2. Click **New registration**
3. Fill in:
   - **Name**: `9Vectors SaaS`
   - **Supported account types**: `Accounts in any identity provider or organizational directory (for authenticating users with user flows)`
   - **Redirect URI**:
     - Platform: `Single-page application (SPA)`
     - URL: `http://localhost:3005`
4. Click **Register**

5. After registration, note down:
   - **Application (client) ID** - You'll need this!

6. Go to **Authentication** in the left menu:
   - Under **Single-page application** redirect URIs, add:
     - `http://localhost:3005`
     - `https://www.9vectors.com`
   - Under **Implicit grant and hybrid flows**, enable:
     - ✅ **Access tokens (used for implicit flows)**
     - ✅ **ID tokens (used for implicit and hybrid flows)**
   - Click **Save**

7. Go to **Certificates & secrets**:
   - Click **New client secret**
   - Description: `9Vectors Client Secret`
   - Expires: `24 months`
   - Click **Add**
   - **IMPORTANT**: Copy the **Value** immediately (you can't see it again!)

### Step 3: Create User Flows

#### Sign-up and Sign-in Flow
1. In Azure AD B2C, go to **User flows**
2. Click **New user flow**
3. Select **Sign up and sign in**
4. Select **Recommended** version
5. Fill in:
   - **Name**: `signupsignin` (will become `B2C_1_signupsignin`)
   - **Identity providers**:
     - ✅ **Email signup**
     - ✅ **Google** (optional, requires setup)
     - ✅ **Facebook** (optional, requires setup)
     - ✅ **Microsoft Account** (optional)
   - **Multifactor authentication**: `Optional` or `Required`
   - **User attributes and token claims**:
     - Collect: ✅ Email Address, ✅ Display Name, ✅ Given Name, ✅ Surname
     - Return: ✅ Email Addresses, ✅ Display Name, ✅ Given Name, ✅ Surname, ✅ User's Object ID
6. Click **Create**

#### Password Reset Flow
1. Click **New user flow**
2. Select **Password reset**
3. Select **Recommended** version
4. Fill in:
   - **Name**: `passwordreset` (will become `B2C_1_passwordreset`)
   - **Identity providers**: ✅ **Reset password using email address**
   - **Application claims**: ✅ Email Addresses, ✅ User's Object ID
5. Click **Create**

#### Profile Editing Flow
1. Click **New user flow**
2. Select **Profile editing**
3. Select **Recommended** version
4. Fill in:
   - **Name**: `profileedit` (will become `B2C_1_profileedit`)
   - **Identity providers**: ✅ **Local Account SignIn**
   - **User attributes**: ✅ Display Name, ✅ Given Name, ✅ Surname
   - **Application claims**: ✅ Email Addresses, ✅ Display Name, ✅ Given Name, ✅ Surname
5. Click **Create**

### Step 4: Configure API Permissions

1. Go to **App registrations** > **9Vectors SaaS**
2. Click **API permissions**
3. Click **Add a permission**
4. Select **Microsoft Graph**
5. Select **Delegated permissions**
6. Add:
   - ✅ `openid`
   - ✅ `profile`
   - ✅ `offline_access`
7. Click **Add permissions**
8. Click **Grant admin consent for [your directory]**
9. Click **Yes**

### Step 5: Get Your Credentials

From your Azure AD B2C tenant:

1. **Tenant Name**:
   - Go to **Overview**
   - Copy the **Domain name** (e.g., `9vectors.onmicrosoft.com`)
   - Your tenant name is the first part: `9vectors`

2. **Client ID**:
   - Go to **App registrations** > **9Vectors SaaS**
   - Copy **Application (client) ID**

3. **Client Secret**:
   - The value you copied earlier from **Certificates & secrets**

4. **Policy Names**:
   - `B2C_1_signupsignin` (default)
   - `B2C_1_passwordreset` (default)
   - `B2C_1_profileedit` (default)

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

#### Starter Plan ($49/month)
1. Navigate to **Products** > **Add product**
2. Fill in:
   - **Name**: `9Vectors Starter`
   - **Description**: `Starter plan with AI insights`
3. Under **Pricing**:
   - **Price**: `49.00`
   - **Billing period**: `Monthly`
   - **Currency**: `USD`
4. Click **Save product**
5. **Copy the Price ID** (starts with `price_...`)

#### Professional Plan ($149/month)
1. Click **Add product**
2. Fill in:
   - **Name**: `9Vectors Professional`
   - **Description**: `Professional plan with advanced features`
3. Under **Pricing**:
   - **Price**: `149.00`
   - **Billing period**: `Monthly`
4. Click **Save product**
5. **Copy the Price ID**

#### Enterprise Plan ($499/month)
1. Click **Add product**
2. Fill in:
   - **Name**: `9Vectors Enterprise`
   - **Description**: `Enterprise plan with unlimited access`
3. Under **Pricing**:
   - **Price**: `499.00`
   - **Billing period**: `Monthly`
4. Click **Save product**
5. **Copy the Price ID**

### Step 4: Set Up Webhook
1. Navigate to **Developers** > **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL**: `https://www.9vectors.com/api/stripe/webhook`
   - For local testing, use ngrok: `https://your-ngrok-url.ngrok.io/api/stripe/webhook`
4. Click **Select events** and add:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
5. Click **Add endpoint**
6. **Copy the Signing secret** (starts with `whsec_...`)

### Step 5: Enable Customer Portal
1. Navigate to **Settings** > **Billing** > **Customer portal**
2. Click **Activate test link**
3. Configure settings:
   - ✅ **Invoice history**
   - ✅ **Update payment method**
   - ✅ **Cancel subscription**
4. Click **Save**

---

## Environment Configuration

### Frontend (.env)
Update `/Users/edwinmiller/Desktop/9Vectors/.env`:

```bash
# Backend API URL
VITE_API_URL=http://localhost:3001
VITE_ENV=development

# Azure AD B2C Configuration
VITE_AZURE_AD_B2C_TENANT_NAME=9vectors
VITE_AZURE_AD_B2C_CLIENT_ID=your-client-id-here
VITE_AZURE_AD_B2C_SIGN_UP_SIGN_IN_POLICY=B2C_1_signupsignin
VITE_AZURE_AD_B2C_RESET_PASSWORD_POLICY=B2C_1_passwordreset
VITE_AZURE_AD_B2C_EDIT_PROFILE_POLICY=B2C_1_profileedit

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key
```

### Backend (api/.env)
Update `/Users/edwinmiller/Desktop/9Vectors/api/.env`:

```bash
# Azure AD B2C Configuration
AZURE_AD_B2C_TENANT_NAME=9vectors
AZURE_AD_B2C_CLIENT_ID=your-client-id
AZURE_AD_B2C_CLIENT_SECRET=your-client-secret
AZURE_AD_B2C_POLICY_NAME=B2C_1_signupsignin

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Stripe Price IDs
STRIPE_PRICE_STARTER=price_your-starter-id
STRIPE_PRICE_PROFESSIONAL=price_your-professional-id
STRIPE_PRICE_ENTERPRISE=price_your-enterprise-id
```

---

## Testing the Integration

### Test Azure AD B2C Login

1. **Start the application**:
   ```bash
   # Terminal 1 - Backend
   cd api && npm start

   # Terminal 2 - Frontend
   npm run dev
   ```

2. **Open browser**: http://localhost:3005
3. **Click "Sign In"**
4. You should be redirected to Azure AD B2C login page
5. **Create a test account**:
   - Click "Sign up now"
   - Enter email and password
   - Fill in name fields
   - Complete registration
6. You should be redirected back to the app, now logged in

### Test Stripe Checkout

1. **Navigate to**: http://localhost:3005/pricing
2. **Click "Upgrade Now"** on any plan
3. You should be redirected to Stripe Checkout
4. **Use test card**:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
5. **Complete checkout**
6. You should be redirected back with success message
7. **Check subscription**: http://localhost:3005/billing

### Test Billing Portal

1. **Go to**: http://localhost:3005/billing
2. **Click "Manage Subscription"**
3. You should be redirected to Stripe Customer Portal
4. Test:
   - Update payment method
   - View invoice history
   - Cancel subscription

---

## Deployment to Azure

### Update Azure AD B2C for Production

1. **Add production redirect URIs**:
   - Go to **App registrations** > **Authentication**
   - Add: `https://www.9vectors.com`
   - Click **Save**

2. **Update user flows** (if needed):
   - Customize branding
   - Add company logo
   - Customize colors

### Update Environment Variables in Azure

1. **Azure Static Web App**:
   - Go to your Static Web App in Azure Portal
   - Navigate to **Configuration**
   - Add application settings:
     ```
     VITE_AZURE_AD_B2C_TENANT_NAME=9vectors
     VITE_AZURE_AD_B2C_CLIENT_ID=your-client-id
     VITE_AZURE_AD_B2C_SIGN_UP_SIGN_IN_POLICY=B2C_1_signupsignin
     VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-live-key
     ```

2. **Azure App Service (API)**:
   - Go to your App Service
   - Navigate to **Configuration** > **Application settings**
   - Add all backend environment variables
   - Use production Stripe keys (`sk_live_...`)

### Update Stripe Webhook

1. **Add production webhook endpoint**:
   - URL: `https://www.9vectors.com/api/stripe/webhook`
2. **Switch to live mode**:
   - Use live API keys
   - Test with real (small amount) transactions

---

## Troubleshooting

### Azure AD B2C Issues

**Problem:** "AADB2C90118: The user has forgotten their password"
- **Solution:** This is expected! User is redirected to password reset flow automatically

**Problem:** "Redirect URI mismatch"
- **Solution:** Verify redirect URIs in App Registration match exactly

**Problem:** "Invalid token"
- **Solution:** Check that tenant name and policy names are correct in `.env`

### Stripe Issues

**Problem:** "Invalid API key"
- **Solution:** Verify you're using correct key for test/live mode

**Problem:** "Webhook signature verification failed"
- **Solution:** Check webhook secret matches endpoint in Stripe dashboard

**Problem:** "Price not found"
- **Solution:** Verify Price IDs are correct and from the right Stripe account

---

## Security Best Practices

1. **Azure AD B2C**:
   - Enable MFA for all users
   - Use strong password policies
   - Monitor sign-in logs regularly
   - Set up Conditional Access policies

2. **Stripe**:
   - Never expose secret keys
   - Always verify webhook signatures
   - Use different keys for test/production
   - Enable radar for fraud detection

3. **General**:
   - Use HTTPS in production
   - Keep dependencies updated
   - Implement rate limiting
   - Monitor logs for suspicious activity

---

## Cost Breakdown

### Azure AD B2C
- **Free tier**: 50,000 MAU
- **Premium P1**: $0.00325 per MAU (after free tier)
- **Estimated monthly cost** (10,000 users): **FREE**

### Stripe
- **2.9% + $0.30** per successful transaction
- **No monthly fees**
- **Estimated monthly cost** (100 subscriptions at $49): **$150**

### Total Azure Infrastructure
- Azure Cosmos DB (Free tier): **$0**
- Azure Static Web Apps (Free tier): **$0**
- Azure AD B2C (< 50k users): **$0**
- **Total**: ~$150/month (mostly Stripe fees)

---

## Additional Resources

- [Azure AD B2C Documentation](https://docs.microsoft.com/en-us/azure/active-directory-b2c/)
- [MSAL React Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react)
- [Stripe Documentation](https://stripe.com/docs)
- [Azure Portal](https://portal.azure.com/)

---

## Support

For issues specific to:
- **Azure AD B2C**: Check Microsoft Learn or Azure support
- **Stripe**: Contact Stripe support
- **9Vectors App**: Create an issue in the GitHub repository

---

**Congratulations!** 🎉 You now have a fully integrated authentication and payment system using Azure AD B2C and Stripe!
