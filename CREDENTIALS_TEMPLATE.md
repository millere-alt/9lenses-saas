# 🔐 Credentials Configuration Guide

## Quick Setup Options

### Option 1: Interactive Script (Recommended)
Run this command from the project root:
```bash
./setup-credentials.sh
```

### Option 2: Manual Configuration
Copy the credentials below and update the `.env` files manually.

---

## 📋 Required Credentials Checklist

### Auth0 Setup (https://manage.auth0.com/)

- [ ] **Step 1:** Create Auth0 account
- [ ] **Step 2:** Create new "Single Page Application"
- [ ] **Step 3:** Configure Application URLs:
  - Allowed Callback URLs: `http://localhost:3005, https://www.9vectors.com`
  - Allowed Logout URLs: `http://localhost:3005, https://www.9vectors.com`
  - Allowed Web Origins: `http://localhost:3005, https://www.9vectors.com`
- [ ] **Step 4:** Copy credentials:
  - Domain: `_______________________`
  - Client ID: `_______________________`
  - Client Secret: `_______________________`

### Stripe Setup (https://dashboard.stripe.com/)

- [ ] **Step 1:** Create Stripe account
- [ ] **Step 2:** Get API Keys (Developers > API Keys):
  - Publishable Key: `pk_test_____________________`
  - Secret Key: `sk_test_____________________`
- [ ] **Step 3:** Create Products (Products > Add Product):

  **Starter Plan ($49/month)**
  - [ ] Created product
  - [ ] Price ID: `price_____________________`

  **Professional Plan ($149/month)**
  - [ ] Created product
  - [ ] Price ID: `price_____________________`

  **Enterprise Plan ($499/month)**
  - [ ] Created product
  - [ ] Price ID: `price_____________________`

- [ ] **Step 4:** Set up Webhook (Developers > Webhooks):
  - Endpoint: `https://www.9vectors.com/api/stripe/webhook`
  - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
  - Signing Secret: `whsec_____________________`

---

## 📝 Configuration Files

### Frontend: `.env`
```bash
# Backend API URL
VITE_API_URL=http://localhost:3001
VITE_ENV=development

# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com          # ⬅️ UPDATE THIS
VITE_AUTH0_CLIENT_ID=your-auth0-client-id            # ⬅️ UPDATE THIS
VITE_AUTH0_AUDIENCE=https://9vectors.com/api

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-key         # ⬅️ UPDATE THIS

# Anthropic API Key for AI Coaching (Optional)
VITE_ANTHROPIC_API_KEY=
```

### Backend: `api/.env`
```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Azure Cosmos DB Configuration (Already configured)
COSMOS_ENDPOINT=https://9vectors-cosmos.documents.azure.com:443/
COSMOS_KEY=your-cosmos-db-key-already-in-api-env
COSMOS_DATABASE=9vectors
COSMOS_CONTAINER_USERS=users
COSMOS_CONTAINER_ORGANIZATIONS=organizations
COSMOS_CONTAINER_ASSESSMENTS=assessments

# JWT Configuration (Already configured)
JWT_SECRET=9vectors-jwt-secret-key-change-in-production-2025
JWT_EXPIRES_IN=7d

# Auth0 Configuration
AUTH0_DOMAIN=your-tenant.us.auth0.com                # ⬅️ UPDATE THIS
AUTH0_AUDIENCE=https://9vectors.com/api
AUTH0_CLIENT_ID=your-auth0-client-id                  # ⬅️ UPDATE THIS
AUTH0_CLIENT_SECRET=your-auth0-client-secret          # ⬅️ UPDATE THIS

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your-secret-key             # ⬅️ UPDATE THIS
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret       # ⬅️ UPDATE THIS (optional for local)

# Stripe Price IDs
STRIPE_PRICE_STARTER=price_starter_id                 # ⬅️ UPDATE THIS
STRIPE_PRICE_PROFESSIONAL=price_professional_id       # ⬅️ UPDATE THIS
STRIPE_PRICE_ENTERPRISE=price_enterprise_id           # ⬅️ UPDATE THIS

# CORS Configuration (Already configured)
FRONTEND_URL=http://localhost:3005
PRODUCTION_URL=https://www.9vectors.com
```

---

## 🚀 Quick Start After Adding Credentials

### 1. Update Environment Files
Replace the placeholder values in both `.env` files with your actual credentials.

### 2. Restart Servers
```bash
# Stop all running processes (Ctrl+C in terminals)

# Start backend
cd api
npm start

# In a new terminal, start frontend
cd ..
npm run dev
```

### 3. Test Authentication
- Open http://localhost:3005
- Click "Sign In" button
- You should be redirected to Auth0 login

### 4. Test Stripe Integration
- Navigate to http://localhost:3005/pricing
- Click "Upgrade Now" on any plan
- Use test card: `4242 4242 4242 4242`
- Complete checkout
- Verify subscription activated

---

## 🔧 Testing Credentials

### Test Auth0
```bash
# Check if Auth0 is configured
curl -I https://YOUR-DOMAIN.us.auth0.com/.well-known/openid-configuration
```
Should return `200 OK`

### Test Stripe
```bash
# Test with curl (from project root)
curl http://localhost:3001/api/stripe/plans
```
Should return JSON with plan information.

---

## 🛡️ Security Best Practices

✅ **DO:**
- Use test credentials during development
- Store production credentials in Azure Key Vault
- Use different credentials for dev/staging/production
- Enable 2FA on Auth0 and Stripe accounts
- Regularly rotate secrets

❌ **DON'T:**
- Commit `.env` files to git (they're in `.gitignore`)
- Share credentials via email or chat
- Use production credentials in development
- Expose secret keys in frontend code

---

## 📚 Additional Resources

### Auth0
- Dashboard: https://manage.auth0.com/
- Documentation: https://auth0.com/docs
- React SDK: https://auth0.com/docs/libraries/auth0-react

### Stripe
- Dashboard: https://dashboard.stripe.com/
- Documentation: https://stripe.com/docs
- Testing: https://stripe.com/docs/testing
- Test Cards: https://stripe.com/docs/testing#cards

---

## 🆘 Troubleshooting

### "Invalid callback URL" in Auth0
**Solution:** Verify callback URLs in Auth0 dashboard match exactly:
- `http://localhost:3005`
- `https://www.9vectors.com`

### "Invalid API key" in Stripe
**Solution:**
- Ensure you're using the correct key for test/live mode
- Check that key starts with `pk_test_` (publishable) or `sk_test_` (secret)

### "Webhook signature verification failed"
**Solution:**
- For local testing, skip webhook verification or use Stripe CLI
- In production, ensure webhook secret matches endpoint

### Can't find Price IDs
**Solution:**
- Go to Stripe Dashboard > Products
- Click on a product
- Look for "Pricing" section
- Copy the ID starting with `price_`

---

## ✅ Verification Checklist

Before deploying to production:

- [ ] Auth0 application configured with production URLs
- [ ] All Stripe products created with correct prices
- [ ] Webhook endpoint verified and tested
- [ ] Production credentials added to Azure
- [ ] Test mode successful
- [ ] Payment flow tested end-to-end
- [ ] Subscription management tested
- [ ] Environment variables secured
- [ ] `.env` files in `.gitignore`
- [ ] Documentation reviewed

---

**Need Help?** Check [AUTH0_STRIPE_SETUP.md](AUTH0_STRIPE_SETUP.md) for detailed setup instructions.
