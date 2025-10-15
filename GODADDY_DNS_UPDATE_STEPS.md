# GoDaddy DNS Update - Step-by-Step Guide

## ⚡ Quick Action Required

To get www.9vectors.com running, you need to update the nameservers at GoDaddy.

---

## 🎯 Step-by-Step Instructions

### Step 1: Login to GoDaddy

1. Open your browser and go to: **https://dcc.godaddy.com/**
2. Login with your GoDaddy credentials

### Step 2: Navigate to Domain Management

1. Click on your profile/account name (top right)
2. Click **"My Products"**
3. Find and click on **"Domains"** section
4. You should see **9vectors.com** in your domain list

### Step 3: Access Nameserver Settings

1. Click on the **9vectors.com** domain name
2. Scroll down to the **"Nameservers"** section
3. Click the **"Change"** button next to Nameservers
4. Select **"Enter my own nameservers (advanced)"** or **"Custom"**

### Step 4: Update Nameservers

**Remove** any existing nameservers and **enter these 4 Azure nameservers**:

```
ns1-09.azure-dns.com
ns2-09.azure-dns.net
ns3-09.azure-dns.org
ns4-09.azure-dns.info
```

**Important Notes**:
- You need ALL 4 nameservers
- Remove the trailing dots if GoDaddy doesn't accept them
- Make sure there are no typos
- Order doesn't matter

### Step 5: Save Changes

1. Click **"Save"** or **"Update"** button
2. GoDaddy may show a warning - this is normal
3. Confirm the changes

---

## ⏱️ What Happens Next

### Immediate (0-5 minutes)
- GoDaddy saves your changes
- Azure DNS starts responding to queries

### Short-term (2-4 hours) - Most common
- DNS propagates globally
- www.9vectors.com starts resolving to Azure
- Application becomes accessible

### Maximum (up to 48 hours) - Rare
- Full global DNS propagation
- All DNS servers worldwide updated

---

## ✅ How to Check Progress

### Method 1: Online Tool
Go to: **https://www.whatsmydns.net/**
- Enter: `9vectors.com`
- Select: `NS` (Nameservers)
- Click Search
- Look for Azure nameservers appearing

### Method 2: Command Line
```bash
# Check nameservers
dig NS 9vectors.com

# Check www subdomain
dig www.9vectors.com

# Use Google DNS for checking
dig @8.8.8.8 NS 9vectors.com
```

### Method 3: Browser
Try opening: **https://www.9vectors.com**
- If it doesn't work immediately, wait and try again in 30 minutes

---

## 🎯 After DNS Propagates

Once DNS has propagated (you'll see Azure nameservers in the checks above), run these commands:

### Complete Custom Domain Setup

```bash
# Add www.9vectors.com to Static Web App
az staticwebapp hostname set \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --hostname www.9vectors.com

# Add apex domain (9vectors.com) - optional
az staticwebapp hostname set \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --hostname 9vectors.com \
  --validation-method dns-txt-token
```

**SSL Certificate**:
- Automatically created by Azure
- Usually takes 10-15 minutes after domain is added
- Completely free and auto-renewing

---

## 🚨 Troubleshooting

### "Nameservers haven't changed"
- **Wait**: Changes can take 5-10 minutes to show at GoDaddy
- **Clear cache**: Try checking in an incognito/private browser window
- **Verify**: Make sure you saved the changes

### "DNS not propagating"
- **Be patient**: Can take 2-4 hours typically
- **Check multiple tools**: Use whatsmydns.net and dig command
- **Local cache**: Your computer might cache old DNS (restart browser)

### "Still showing old nameservers"
- **Time**: DNS propagation isn't instant
- **Location**: Some regions update faster than others
- **TTL**: Old records have a "time to live" that must expire

### "Can't access www.9vectors.com"
- **Check propagation first**: Use whatsmydns.net
- **Wait for Azure setup**: After propagation, run the az commands above
- **SSL provisioning**: Can take 10-15 minutes for certificate

---

## 📞 Current Status Check

Run this command anytime to check status:

```bash
# Check current nameservers for 9vectors.com
dig NS 9vectors.com +short

# Should eventually show:
# ns1-09.azure-dns.com.
# ns2-09.azure-dns.net.
# ns3-09.azure-dns.org.
# ns4-09.azure-dns.info.
```

---

## 🎉 Success Indicators

You'll know it worked when:

1. ✅ whatsmydns.net shows Azure nameservers globally
2. ✅ `dig NS 9vectors.com` shows Azure nameservers
3. ✅ www.9vectors.com resolves to an IP address
4. ✅ https://www.9vectors.com loads your application
5. ✅ SSL certificate is valid (green padlock in browser)

---

## 📋 Pre-Update Checklist

Before updating nameservers at GoDaddy:

- ✅ Azure DNS Zone created: **9vectors.com**
- ✅ Azure nameservers ready: **ns1-09.azure-dns.com** (+ 3 others)
- ✅ CNAME record for www: **www → agreeable-bush-03cb6a40f.2.azurestaticapps.net**
- ✅ TXT validation record: **Added**
- ✅ Static Web App ready: **9vectors-app**
- ✅ Application deployed: **Working at Azure URL**

**Everything is ready!** ✅

---

## 🔄 Rollback Plan

If something goes wrong, you can rollback:

1. Login to GoDaddy
2. Go back to Nameservers settings
3. Change back to GoDaddy's default nameservers
4. DNS will revert to old configuration

**But don't worry** - nothing will break! The Azure deployment is separate and working.

---

## ⏭️ What to Do Right Now

1. **Open GoDaddy**: https://dcc.godaddy.com/
2. **Navigate to**: 9vectors.com domain settings
3. **Update nameservers** with the 4 Azure nameservers above
4. **Save changes**
5. **Wait 2-4 hours** for propagation
6. **Check progress** using whatsmydns.net
7. **Run Azure commands** (after propagation) to complete setup

---

## 📞 Need Help?

**Check Azure DNS Zone**:
```bash
az network dns zone show \
  --resource-group 9vectors-rg \
  --name 9vectors.com \
  --query nameServers
```

**Check DNS Records**:
```bash
az network dns record-set list \
  --resource-group 9vectors-rg \
  --zone-name 9vectors.com \
  --output table
```

**View Static Web App Status**:
```bash
az staticwebapp show \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --query "{name:name, defaultHostname:defaultHostname}"
```

---

## 🎯 Quick Reference

**Azure Nameservers to Enter**:
```
ns1-09.azure-dns.com
ns2-09.azure-dns.net
ns3-09.azure-dns.org
ns4-09.azure-dns.info
```

**GoDaddy Login**: https://dcc.godaddy.com/

**Check Propagation**: https://www.whatsmydns.net/

**Final URL**: https://www.9vectors.com

---

**Ready? Let's get www.9vectors.com live!** 🚀
