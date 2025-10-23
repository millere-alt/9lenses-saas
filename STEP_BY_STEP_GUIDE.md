# 🎯 Step-by-Step Setup Guide - Let's Do This!

## Overview

You have 2 tasks to complete. I'll guide you through each one with screenshots, exact steps, and commands ready to copy/paste.

**Total Time:** 15 minutes
**Difficulty:** Easy - just copy/paste and click

---

# TASK 1: Add Anthropic API Key (5 minutes)

## Step 1.1: Get Your Anthropic API Key

### Open Anthropic Console
1. **Click this link:** https://console.anthropic.com/
2. **Sign in** with your Anthropic account
   - If you don't have an account, click "Sign Up" (takes 2 minutes)
   - You'll need to verify your email

### Navigate to API Keys
3. Once logged in, look at the **left sidebar**
4. Click on **"API Keys"** (it has a key icon 🔑)

### Create or Copy Your API Key
5. You'll see a list of API keys (or a button to create one)
6. **If you have an existing key:**
   - Click the "Copy" button next to it
   - **IMPORTANT:** Save it somewhere safe (like a password manager)

7. **If you need to create a new key:**
   - Click **"Create Key"** button (usually top-right)
   - Give it a name like "9Vectors Production"
   - Click **"Create"**
   - **IMMEDIATELY COPY THE KEY** - you can only see it once!
   - It will look like: `sk-ant-api03-...` (long string)

### What You Should Have Now
✅ A key that starts with `sk-ant-`
✅ The key saved somewhere safe

---

## Step 1.2: Add Key to Azure

### Open Your Terminal
1. Make sure you're logged into Azure CLI (you already are)

### Run This Command

**IMPORTANT:** Replace `YOUR_KEY_HERE` with your actual key from Step 1.1

```bash
az functionapp config appsettings set \
  --name snapshot9-functions-flex \
  --resource-group Snapshot9 \
  --settings "ANTHROPIC_API_KEY=YOUR_KEY_HERE"
```

### Example (DON'T USE THIS KEY - IT'S FAKE):
```bash
# This is just an example - use YOUR key
az functionapp config appsettings set \
  --name snapshot9-functions-flex \
  --resource-group Snapshot9 \
  --settings "ANTHROPIC_API_KEY=sk-ant-api03-1234567890abcdef"
```

### What You Should See
After running the command, you'll see output like:
```
[
  {
    "name": "ANTHROPIC_API_KEY",
    ...
  }
]
```

---

## Step 1.3: Verify It Worked

Run this command to check:

```bash
az functionapp config appsettings list \
  --name snapshot9-functions-flex \
  --resource-group Snapshot9 \
  --query "[?name=='ANTHROPIC_API_KEY'].{name:name}" -o table
```

**Expected output:**
```
Name
-----------------
ANTHROPIC_API_KEY
```

### ✅ Task 1 Complete!
Your AI features are now enabled! 🎉

---

# TASK 2: Update Auth0 Dashboard (10 minutes)

## Step 2.1: Open Auth0 Dashboard

### Navigate to Auth0
1. **Click this link:** https://manage.auth0.com/
2. **Sign in** with your Auth0 account
3. You should see your Auth0 dashboard

### Find Your Application
4. In the left sidebar, click **"Applications"**
5. Then click **"Applications"** again (it's a submenu)
6. You'll see a list of your applications
7. **Find your 9Vectors application** (might be called "9Vectors" or "9lenses-saas")
   - If you're not sure which one, look for the one with the Client ID matching your GitHub secret
8. **Click on the application name** to open its settings

---

## Step 2.2: Add Production URLs

You should now see the application settings page with many fields.

### Scroll to "Application URIs" Section

Look for these three fields:
1. **Allowed Callback URLs**
2. **Allowed Logout URLs**
3. **Allowed Web Origins**

---

## Step 2.3: Update Each Field

### Field 1: Allowed Callback URLs

**What's currently there:** Probably something like `http://localhost:5173/callback`

**What to add:**
```
https://www.snapshot9.com/callback,https://red-sand-0b83aa50f.1.azurestaticapps.net/callback,http://localhost:5173/callback,http://localhost:3005/callback
```

**How to do it:**
1. Click in the "Allowed Callback URLs" field
2. **Keep existing URLs** and add a comma after them
3. Paste the new URLs above
4. Final result should look like:
   ```
   http://localhost:5173/callback,https://www.snapshot9.com/callback,https://red-sand-0b83aa50f.1.azurestaticapps.net/callback,http://localhost:3005/callback
   ```

---

### Field 2: Allowed Logout URLs

**What to add:**
```
https://www.snapshot9.com,https://red-sand-0b83aa50f.1.azurestaticapps.net,http://localhost:5173,http://localhost:3005
```

**How to do it:**
1. Click in the "Allowed Logout URLs" field
2. **Keep existing URLs** and add a comma after them
3. Paste the new URLs above

---

### Field 3: Allowed Web Origins

**What to add:**
```
https://www.snapshot9.com,https://red-sand-0b83aa50f.1.azurestaticapps.net,http://localhost:5173,http://localhost:3005
```

**How to do it:**
1. Click in the "Allowed Web Origins" field
2. **Keep existing URLs** and add a comma after them
3. Paste the new URLs above

---

## Step 2.4: Save Your Changes

### VERY IMPORTANT!
1. Scroll to the **bottom of the page**
2. Click the **"Save Changes"** button
3. Wait for the green success message

**If you don't click Save, nothing will work!**

---

## Step 2.5: Verify Your Settings

### Double-Check These Three Fields

**Allowed Callback URLs should contain:**
- ✅ https://www.snapshot9.com/callback
- ✅ https://red-sand-0b83aa50f.1.azurestaticapps.net/callback

**Allowed Logout URLs should contain:**
- ✅ https://www.snapshot9.com
- ✅ https://red-sand-0b83aa50f.1.azurestaticapps.net

**Allowed Web Origins should contain:**
- ✅ https://www.snapshot9.com
- ✅ https://red-sand-0b83aa50f.1.azurestaticapps.net

### ✅ Task 2 Complete!
Users can now log in to your production site! 🎉

---

# 🎊 ALL DONE! Now Let's Test

## Test 1: Visit Your Site

**Open your browser and go to:**
https://www.snapshot9.com

**What you should see:**
- ✅ The 9Vectors homepage loads
- ✅ No errors in the browser console (press F12 to check)

---

## Test 2: Test Login

1. **Click "Sign In"** or "Get Started" button
2. **What should happen:**
   - You're redirected to Auth0 login page
   - You can sign in or sign up
   - After login, you're redirected back to the app
   - You see your dashboard or assessment page

**If login doesn't work:**
- Go back to Auth0 dashboard
- Double-check you clicked "Save Changes"
- Verify the URLs are correct (no typos)

---

## Test 3: Test AI Coaching (Optional)

**This only works if you added the Anthropic API key:**

1. Log in to the app
2. Create or open an assessment
3. Look for AI coaching suggestions
4. Try asking the AI a question about your business

**What you should see:**
- ✅ AI responds with helpful coaching advice
- ✅ No errors about "API key not configured"

**If AI doesn't work:**
- Verify you completed Task 1 (Anthropic API key)
- Check the key was saved correctly (run the verify command from Step 1.3)

---

# 🎉 Success Criteria

You're done when:

- ✅ You can visit https://www.snapshot9.com
- ✅ You can click "Sign In" and log in successfully
- ✅ After login, you're redirected back to the app
- ✅ You can create/view assessments
- ✅ AI coaching gives you responses (not errors)

---

# 🆘 Troubleshooting

## Problem: "Cannot read property of undefined" after login

**Solution:**
- Clear your browser cache and cookies
- Try logging out and back in
- Check Auth0 URLs were saved correctly

## Problem: "API key not configured" for AI

**Solution:**
- Re-run the Anthropic key command from Task 1
- Verify the key starts with `sk-ant-`
- Wait 30 seconds for Azure to update settings

## Problem: "CORS error" in browser console

**Solution:**
- Verify you saved changes in Auth0
- Check all three URL fields have the production URLs
- Try accessing directly: https://www.snapshot9.com (not via IP)

## Problem: Page loads but features don't work

**Solution:**
- Open browser console (F12)
- Look for red errors
- Most likely: Auth0 URLs not saved or Anthropic key missing

---

# 📞 Need Help?

If something doesn't work:

1. **Check browser console** (F12) for error messages
2. **Verify Auth0 settings** - click "Save Changes"!
3. **Verify Anthropic key** - run the verify command from Step 1.3
4. **Clear browser cache** - sometimes old code is cached
5. **Wait 60 seconds** - Azure takes time to update settings

---

# 🎯 What's Next?

Once everything works, you can:

1. **Invite your team** - share https://www.snapshot9.com
2. **Run your first assessment** - test the full workflow
3. **Try AI coaching** - ask questions about your business
4. **Monitor your app** - check Azure Portal for logs

**When ready for real payments:**
- Replace Stripe test keys with production keys
- See [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) for details

---

**You're almost there! Just 2 quick tasks and you're live! 🚀**
