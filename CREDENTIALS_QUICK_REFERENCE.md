# 🎯 Quick Credentials Reference

## Copy-Paste Your Credentials Here

### Auth0 Credentials
```
Domain:        ________________________________
Client ID:     ________________________________
Client Secret: ________________________________
```

### Stripe Credentials
```
Publishable Key: pk_test_____________________
Secret Key:      sk_test_____________________
Webhook Secret:  whsec_______________________
```

### Stripe Price IDs (Optional - can add later)
```
Starter Plan:       price_____________________
Professional Plan:  price_____________________
Enterprise Plan:    price_____________________
```

---

## Then Update These Files

### File 1: `.env` (Frontend)
**Location:** `/Users/edwinmiller/Desktop/9Vectors/.env`

**Lines to update:**
```bash
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
```

### File 2: `api/.env` (Backend)
**Location:** `/Users/edwinmiller/Desktop/9Vectors/api/.env`

**Lines to update:**
```bash
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
STRIPE_SECRET_KEY=sk_test_your-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PRICE_STARTER=price_starter_id
STRIPE_PRICE_PROFESSIONAL=price_professional_id
STRIPE_PRICE_ENTERPRISE=price_enterprise_id
```

---

## Or Use the Automatic Script

```bash
cd /Users/edwinmiller/Desktop/9Vectors
./setup-credentials.sh
```

The script will:
1. Ask you for each credential
2. Automatically update both `.env` files
3. Show you what was changed

---

## Where to Get Each Credential

| Credential | Where to Find |
|-----------|---------------|
| **Auth0 Domain** | Auth0 Dashboard → Applications → Your App → Domain |
| **Auth0 Client ID** | Auth0 Dashboard → Applications → Your App → Client ID |
| **Auth0 Client Secret** | Auth0 Dashboard → Applications → Your App → Settings → Client Secret |
| **Stripe Publishable Key** | Stripe Dashboard → Developers → API Keys → Publishable key |
| **Stripe Secret Key** | Stripe Dashboard → Developers → API Keys → Secret key |
| **Stripe Webhook Secret** | Stripe Dashboard → Developers → Webhooks → Signing secret |
| **Stripe Price IDs** | Stripe Dashboard → Products → [Product Name] → Pricing |

---

## Quick Links

- Auth0 Dashboard: https://manage.auth0.com/
- Stripe Dashboard: https://dashboard.stripe.com/
- Stripe API Keys: https://dashboard.stripe.com/apikeys
- Stripe Products: https://dashboard.stripe.com/products

---

## Test Credentials (For Reference)

**Auth0:**
- You must create your own account (free tier available)

**Stripe Test Cards:**
```
Success:    4242 4242 4242 4242
Decline:    4000 0000 0000 0002
3D Secure:  4000 0027 6000 3184

Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

---

## After Adding Credentials

1. **Save the files**
2. **Restart servers:**
   ```bash
   # Stop with Ctrl+C, then:
   cd api && npm start              # Terminal 1
   cd .. && npm run dev             # Terminal 2
   ```
3. **Test:**
   - Open http://localhost:3005
   - Click "Sign In" (should redirect to Auth0)
   - Go to /pricing and test checkout

---

## Troubleshooting

**Problem:** "Configuration missing" error
**Solution:** Make sure you replaced ALL placeholder values

**Problem:** Auth0 redirect fails
**Solution:** Check Allowed Callback URLs in Auth0 includes `http://localhost:3005`

**Problem:** Stripe error "Invalid API key"
**Solution:** Verify you copied the full key including `pk_test_` or `sk_test_` prefix

---

**Need more help?** See [GETTING_STARTED_CREDENTIALS.md](GETTING_STARTED_CREDENTIALS.md)
