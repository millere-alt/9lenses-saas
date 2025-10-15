# 🚀 Getting Started with Auth0 & Stripe

## Current Status
✅ **Application is running!**
- Frontend: http://localhost:3005
- Backend: http://localhost:3001/api
- Database: Azure Cosmos DB (connected)

⚠️ **Missing:** Auth0 and Stripe credentials

---

## 🎯 Two Ways to Add Credentials

### Option 1: Quick Interactive Setup (5 minutes)

Run this command in your terminal:

```bash
cd /Users/edwinmiller/Desktop/9Vectors
./setup-credentials.sh
```

The script will ask you for each credential and automatically update your `.env` files.

### Option 2: Manual Setup (10 minutes)

Follow the detailed guide: [CREDENTIALS_TEMPLATE.md](CREDENTIALS_TEMPLATE.md)

---

## 📦 What You'll Need

### From Auth0 (https://auth0.com)
1. Create a free account
2. Create a "Single Page Application"
3. Get 3 values:
   - Domain (looks like: `dev-abc123.us.auth0.com`)
   - Client ID
   - Client Secret

**Time:** ~3 minutes

### From Stripe (https://stripe.com)
1. Create a free account
2. Go to "Developers" > "API Keys"
3. Get 2 keys:
   - Publishable key (starts with `pk_test_`)
   - Secret key (starts with `sk_test_`)
4. Create 3 products ($49, $149, $499)
5. Copy each Price ID

**Time:** ~5 minutes

---

## 🔄 After Adding Credentials

### 1. Restart Your Servers

**Terminal 1 - Backend:**
```bash
cd /Users/edwinmiller/Desktop/9Vectors/api
npm start
```

**Terminal 2 - Frontend:**
```bash
cd /Users/edwinmiller/Desktop/9Vectors
npm run dev
```

### 2. Test the Application

**Test Auth0 Login:**
1. Go to http://localhost:3005
2. Click "Sign In"
3. You should see Auth0 login page

**Test Stripe Payments:**
1. Go to http://localhost:3005/pricing
2. Click "Upgrade Now"
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout

---

## 🎓 Step-by-Step Guides

Choose based on your experience level:

### Beginner
📘 **Start here:** [CREDENTIALS_TEMPLATE.md](CREDENTIALS_TEMPLATE.md)
- Includes screenshots
- Detailed instructions
- Troubleshooting tips

### Experienced
📗 **Quick reference:** [AUTH0_STRIPE_SETUP.md](AUTH0_STRIPE_SETUP.md)
- Technical details
- API configuration
- Production deployment

---

## ⚡ Quick Commands Reference

```bash
# Run interactive setup
./setup-credentials.sh

# Check if servers are running
lsof -i :3001  # Backend
lsof -i :3005  # Frontend

# Start backend
cd api && npm start

# Start frontend (in new terminal)
npm run dev

# Test API
curl http://localhost:3001/health
curl http://localhost:3001/api/stripe/plans

# View logs
# Backend logs show in Terminal 1
# Frontend logs show in Terminal 2
```

---

## 🔍 How to Find Your Credentials

### Auth0 Dashboard
```
https://manage.auth0.com/
  └─ Applications
      └─ Applications
          └─ [Your App Name]
              ├─ Domain ✓
              ├─ Client ID ✓
              └─ Settings
                  └─ Client Secret ✓
```

### Stripe Dashboard
```
https://dashboard.stripe.com/
  ├─ Developers
  │   ├─ API Keys
  │   │   ├─ Publishable key ✓
  │   │   └─ Secret key ✓
  │   └─ Webhooks (optional for now)
  │
  └─ Products
      ├─ Starter ($49)
      │   └─ Pricing
      │       └─ Price ID ✓
      ├─ Professional ($149)
      │   └─ Price ID ✓
      └─ Enterprise ($499)
          └─ Price ID ✓
```

---

## 💡 Pro Tips

1. **Use Test Mode First**
   - Auth0: Use development tenant
   - Stripe: Use test keys (`pk_test_`, `sk_test_`)

2. **One Service at a Time**
   - Set up Auth0 first, test login
   - Then set up Stripe, test payments

3. **Save Your Credentials**
   - Keep them in a password manager
   - Don't share them
   - Use different keys for production

4. **Test with Test Cards**
   ```
   Success: 4242 4242 4242 4242
   Decline: 4000 0000 0000 0002
   3D Secure: 4000 0027 6000 3184
   ```

---

## 🆘 Common Issues

### "No Auth0 credentials found"
**Solution:** Run `./setup-credentials.sh` or manually edit `.env` files

### "Application not loading"
**Solution:** Check both servers are running:
```bash
lsof -i :3001  # Should show node process
lsof -i :3005  # Should show node process
```

### "Invalid API key" from Stripe
**Solution:** Make sure you copied the full key including the prefix (`pk_test_` or `sk_test_`)

### Auth0 redirect not working
**Solution:** In Auth0 dashboard, verify these URLs are added:
- Allowed Callback URLs: `http://localhost:3005`
- Allowed Logout URLs: `http://localhost:3005`
- Allowed Web Origins: `http://localhost:3005`

---

## ✅ Checklist

Before you start coding:

- [ ] Auth0 account created
- [ ] Auth0 application configured
- [ ] Auth0 credentials copied
- [ ] Stripe account created
- [ ] Stripe API keys copied
- [ ] Stripe products created (or skip for now)
- [ ] `.env` files updated
- [ ] Servers restarted
- [ ] Login tested
- [ ] Payment tested (if products created)

---

## 📞 Next Steps

Once credentials are added:

1. ✅ **Test the integration**
   - Login with Auth0
   - Subscribe to a plan
   - Manage billing

2. 🎨 **Customize your app**
   - Update branding
   - Add features
   - Configure workflows

3. 🚀 **Deploy to production**
   - Follow [AUTH0_STRIPE_SETUP.md](AUTH0_STRIPE_SETUP.md#deployment)
   - Use production credentials
   - Enable webhooks

---

**Ready to start?** Run `./setup-credentials.sh` now! 🚀
