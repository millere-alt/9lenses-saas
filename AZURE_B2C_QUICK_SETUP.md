# Azure AD B2C Quick Setup Guide

## ✅ What's Already Done

1. **Login Button Added**: Your app now has a "Sign In" button in the top-right header
2. **Code Integration Complete**: Azure AD B2C is fully integrated in the codebase
3. **Azure Account**: You're logged into Azure (millereisage.onmicrosoft.com)
4. **Application Running**: http://localhost:3005 with login button visible

---

## 🚀 Quick Setup Steps (15 minutes)

### Step 1: Create Azure AD B2C Tenant

1. **Open Azure Portal**: https://portal.azure.com/
   - Or run: `open https://portal.azure.com/`

2. **Create B2C Tenant**:
   - Click **Create a resource**
   - Search for **"Azure Active Directory B2C"**
   - Click **Create**
   - Select **Create a new Azure AD B2C Tenant**

3. **Fill in Details**:
   ```
   Organization name:    9Vectors
   Initial domain name:  9vectors
   Country/Region:       United States
   Subscription:         Azure subscription 1
   Resource group:       9vectors-rg (use existing)
   ```

4. Click **Review + create** then **Create**
5. **Wait 2-3 minutes** for tenant creation

### Step 2: Switch to B2C Tenant

1. After creation, click **Switch** (or the notification bell)
2. You should now see: **9vectors.onmicrosoft.com**

### Step 3: Register Application

1. In B2C tenant, go to **Azure AD B2C** (search if needed)
2. Click **App registrations** → **New registration**
3. Fill in:
   ```
   Name:                    9Vectors SaaS
   Supported account types: Accounts in any identity provider...
   Redirect URI:
     - Platform: Single-page application (SPA)
     - URL: http://localhost:3005
   ```
4. Click **Register**

5. **COPY THE CLIENT ID** (Application/client ID)
   - Example: `12345678-1234-1234-1234-123456789abc`
   - You'll need this!

### Step 4: Configure Authentication

1. Click **Authentication** (left sidebar)
2. Add additional redirect URIs:
   - `https://www.9vectors.com`
   - `http://localhost:3005`
3. Under **Implicit grant and hybrid flows**:
   - ✅ Enable **Access tokens**
   - ✅ Enable **ID tokens**
4. Click **Save**

### Step 5: Create Client Secret

1. Click **Certificates & secrets** (left sidebar)
2. Click **New client secret**
3. Fill in:
   ```
   Description: 9Vectors Client Secret
   Expires:     24 months
   ```
4. Click **Add**
5. **IMMEDIATELY COPY THE VALUE** (you can't see it again!)
   - Example: `abc123def456~_ghi789jkl012`

### Step 6: Create User Flows

#### 6.1 Sign-up and Sign-in Flow

1. Go back to **Azure AD B2C**
2. Click **User flows** → **New user flow**
3. Select **Sign up and sign in** → **Recommended** version
4. Fill in:
   ```
   Name: signupsignin
   ```
   (This becomes `B2C_1_signupsignin`)
5. **Identity providers**: ✅ Email signup
6. **User attributes and claims** - Select these:
   - ✅ Email Address
   - ✅ Display Name
   - ✅ Given Name
   - ✅ Surname
7. Click **Create**

#### 6.2 Password Reset Flow

1. **New user flow** → **Password reset** → **Recommended**
2. Name: `passwordreset`
3. Click **Create**

#### 6.3 Profile Editing Flow

1. **New user flow** → **Profile editing** → **Recommended**
2. Name: `profileedit`
3. Click **Create**

### Step 7: Get Your Credentials

You now have:

```
Tenant Name:   9vectors
Client ID:     [From Step 3.5]
Client Secret: [From Step 5.5]
```

### Step 8: Update Environment Files

Run this command:

```bash
cd /Users/edwinmiller/Desktop/9Vectors
./setup-azure-credentials.sh
```

Or manually update:

**Frontend `.env`**:
```bash
VITE_AZURE_AD_B2C_TENANT_NAME=9vectors
VITE_AZURE_AD_B2C_CLIENT_ID=your-client-id-here
```

**Backend `api/.env`**:
```bash
AZURE_AD_B2C_TENANT_NAME=9vectors
AZURE_AD_B2C_CLIENT_ID=your-client-id
AZURE_AD_B2C_CLIENT_SECRET=your-client-secret
```

### Step 9: Test Login

1. Restart servers:
   ```bash
   # Kill old servers
   lsof -ti:3005 | xargs kill
   lsof -ti:3001 | xargs kill

   # Start backend
   cd /Users/edwinmiller/Desktop/9Vectors/api && npm start &

   # Start frontend
   cd /Users/edwinmiller/Desktop/9Vectors && npm run dev
   ```

2. Open http://localhost:3005
3. Click **Sign In** button (top right)
4. You should see Azure AD B2C login page: `9vectors.b2clogin.com`
5. Click **Sign up now**
6. Create test account
7. Should redirect back logged in!

---

## 🎯 What You'll See After Setup

### Before Login:
- Top right: **[Pricing]** **[Sign In]** button

### After Login:
- Top right: User menu with:
  - Your name and email
  - Plan type (Free, Starter, etc.)
  - Billing & Subscription link
  - Upgrade Plan link
  - Sign Out button

---

## 📋 Credentials Checklist

Make sure you have these ready:

- [ ] Tenant Name: `9vectors`
- [ ] Client ID: `________________________________`
- [ ] Client Secret: `________________________________`
- [ ] User Flow Names:
  - [ ] `B2C_1_signupsignin` ✅
  - [ ] `B2C_1_passwordreset` ✅
  - [ ] `B2C_1_profileedit` ✅

---

## 🔧 Troubleshooting

### "Configuration object is not valid" error
**Solution**: Make sure all env variables are set (no `your-tenant-name` placeholders)

### Redirect loop or "AADB2C90118" error
**Solution**: This is normal for password reset! User gets redirected to reset flow automatically.

### "Invalid redirect URI" error
**Solution**: Make sure `http://localhost:3005` is added in Azure AD B2C app registration → Authentication

### Can't see Client Secret value
**Solution**: You can only see it once. Create a new one if you missed it.

---

## 🌐 Quick Links

| Resource | URL |
|----------|-----|
| **Azure Portal** | https://portal.azure.com/ |
| **Local App** | http://localhost:3005 |
| **API Docs** | http://localhost:3001 |
| **Detailed Setup** | [AZURE_AD_B2C_SETUP.md](AZURE_AD_B2C_SETUP.md) |

---

## ⏱️ Time Estimate

- Create B2C Tenant: **3 minutes**
- Register Application: **2 minutes**
- Configure Authentication: **2 minutes**
- Create Client Secret: **1 minute**
- Create User Flows: **5 minutes**
- Update Environment: **2 minutes**
- Test Login: **2 minutes**

**Total: ~15-20 minutes**

---

## 🎉 After Setup

Once configured, your users can:
1. Sign up with email
2. Sign in securely via Azure AD B2C
3. Reset forgotten passwords
4. Edit their profiles
5. Subscribe to paid plans via Stripe
6. Manage billing through Stripe Customer Portal

All with enterprise-grade security from Microsoft Azure!

---

**Need Help?** See [AZURE_AD_B2C_SETUP.md](AZURE_AD_B2C_SETUP.md) for detailed instructions with screenshots.
