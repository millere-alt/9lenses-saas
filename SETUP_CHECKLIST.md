# 🎯 9Vectors High-Priority Setup Checklist

## ✅ Completed

- ✅ Backend deployed successfully to Azure Functions
- ✅ Frontend deployed to Azure Static Web Apps
- ✅ Database configured with all containers
- ✅ CI/CD pipeline set up
- ✅ SSL/HTTPS enabled
- ✅ GitHub secrets configured
- ✅ Placeholder API key added to Azure

## ⚠️ Action Required (High Priority)

### 1. Add Anthropic API Key (5 minutes)

**Why?** AI coaching features won't work without this.

**Steps:**

1. **Get your Anthropic API key:**
   - Go to: https://console.anthropic.com/
   - Sign in to your Anthropic account
   - Click on "API Keys" in the left sidebar
   - Click "Create Key" if you don't have one
   - Copy the key (starts with `sk-ant-`)

2. **Add key to Azure:**

```bash
# Replace YOUR_KEY_HERE with the key you copied
az functionapp config appsettings set \
  --name snapshot9-functions-flex \
  --resource-group Snapshot9 \
  --settings "ANTHROPIC_API_KEY=YOUR_KEY_HERE"
```

3. **Verify it worked:**

```bash
# Check that the setting was added
az functionapp config appsettings list \
  --name snapshot9-functions-flex \
  --resource-group Snapshot9 \
  --query "[?name=='ANTHROPIC_API_KEY'].{name:name}" -o table
```

**Expected output:** Should show ANTHROPIC_API_KEY in the list

---

### 2. Update Auth0 Dashboard (10 minutes)

**Why?** Users need to be able to log in to your production site.

**Steps:**

1. **Go to Auth0 Dashboard:**
   - Visit: https://manage.auth0.com/
   - Sign in to your Auth0 account
   - Go to Applications → Applications
   - Find your 9Vectors application

2. **Update Application URIs:**

   Click on your application, then scroll to "Application URIs"

   **Allowed Callback URLs** - Add these (comma-separated):
   ```
   https://www.snapshot9.com/callback,
   https://red-sand-0b83aa50f.1.azurestaticapps.net/callback,
   http://localhost:5173/callback,
   http://localhost:3005/callback
   ```

   **Allowed Logout URLs** - Add these:
   ```
   https://www.snapshot9.com,
   https://red-sand-0b83aa50f.1.azurestaticapps.net,
   http://localhost:5173,
   http://localhost:3005
   ```

   **Allowed Web Origins** - Add these:
   ```
   https://www.snapshot9.com,
   https://red-sand-0b83aa50f.1.azurestaticapps.net,
   http://localhost:5173,
   http://localhost:3005
   ```

3. **Click "Save Changes"** at the bottom

4. **Verify your settings:**
   - Domain: Should match `VITE_AUTH0_DOMAIN` in GitHub secrets
   - Client ID: Should match `VITE_AUTH0_CLIENT_ID` in GitHub secrets
   - Audience: Should match `VITE_AUTH0_AUDIENCE` in GitHub secrets

---

### 3. Wait for Deployment ✅ COMPLETE

The deployment is complete! Both frontend and backend are now live.

---

## 🧪 Testing Your Production Setup

### Test 1: Frontend is Live

Open your browser and visit:
- https://www.snapshot9.com
- You should see the 9Vectors homepage

### Test 2: Backend API is Working

```bash
# Test the health endpoint
curl https://snapshot9-functions-flex.azurewebsites.net/health

# Expected response:
# {"status":"ok","timestamp":"...","service":"9Vectors API"}
```

### Test 3: Auth0 Login Works

1. Visit https://www.snapshot9.com
2. Click "Sign In" or "Get Started"
3. You should be redirected to Auth0 login page
4. After login, you should return to the app

**If login doesn't work:** Double-check Auth0 callback URLs from step 2 above

### Test 4: AI Coaching Works (after adding Anthropic key)

This will only work after you complete step 1 (adding Anthropic API key):

1. Log in to the app
2. Start or open an assessment
3. Look for AI coaching suggestions
4. Try asking the AI coach a question

---

## 📊 Current Status

| Component | Status | URL |
|-----------|--------|-----|
| Frontend | ✅ Live | https://www.snapshot9.com |
| Backend API | ✅ Live | https://snapshot9-functions-flex.azurewebsites.net/api |
| Database | ✅ Ready | Cosmos DB configured |
| SSL/HTTPS | ✅ Enabled | Auto-managed by Azure |
| Auth0 | ⚠️ Needs Update | Update callback URLs |
| AI Features | ⚠️ Needs Key | Add Anthropic API key |
| Stripe | ✅ Test Mode | Production keys optional |

---

## 🚀 After Completing High-Priority Tasks

Once you've completed the above, you can:

1. **Test the full user flow:**
   - Sign up / Log in
   - Create an assessment
   - Invite team members
   - Use AI coaching
   - View dashboard

2. **Monitor your app:**
   - GitHub Actions: https://github.com/millere-alt/9lenses-saas/actions
   - Azure Portal: https://portal.azure.com → Snapshot9

3. **When ready for production payments:**
   - Get Stripe production keys from https://dashboard.stripe.com/
   - Update in GitHub secrets (see PRODUCTION_SETUP.md)

---

## 🆘 Troubleshooting

### "AI coaching doesn't work"
→ Make sure you completed Step 1 (Anthropic API key)

### "Can't log in"
→ Make sure you completed Step 2 (Auth0 callback URLs)

### "Backend returns 500 errors"
→ Check Azure Function App logs in Azure Portal

### "Frontend shows blank page"
→ Check browser console for errors
→ Verify API_URL is correct in build

---

## 📞 Need Help?

- **Documentation:** See [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) for complete details
- **Quick Reference:** See [QUICK_START.md](./QUICK_START.md)
- **Logs:** https://portal.azure.com → Snapshot9 → snapshot9-functions-flex → Log stream

---

**Estimated time to complete:** 15 minutes
**Current step:** Add Anthropic API key (Step 1)
