# DNS Setup Guide for 9Vectors

This guide covers DNS configuration for the 9Vectors SaaS platform using Azure Static Web Apps and Azure Functions.

## Overview

The 9Vectors platform uses the following domains:

- **www.9vectors.com** - Primary frontend application (Azure Static Web Apps)
- **api.9vectors.com** - Backend API (Azure Functions)
- **9vectors.com** - Root domain (redirects to www.9vectors.com)

## Prerequisites

- Domain registered at a DNS provider (e.g., GoDaddy, Namecheap, Cloudflare, Route 53)
- Access to DNS management console
- Azure CLI installed and authenticated
- Contributor access to Azure resource group

## Part 1: Configure Azure Static Web App Custom Domain

### Step 1: Add Custom Domain to Static Web App

```bash
# Add www.9vectors.com to Static Web App
az staticwebapp hostname set \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --hostname www.9vectors.com

# The command will output DNS validation records needed
```

**Expected Output**:
```
{
  "hostname": "www.9vectors.com",
  "validationToken": "abc123def456...",
  "status": "WaitingForValidation"
}
```

### Step 2: Get DNS Validation Records

```bash
# Get TXT record for domain validation
az staticwebapp hostname show \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --hostname www.9vectors.com
```

You'll receive:
- **TXT record name**: `_dnsauth.www.9vectors.com`
- **TXT record value**: `<validation-token>`
- **CNAME record**: `www.9vectors.com` → `<static-web-app-url>.azurestaticapps.net`

### Step 3: Configure DNS Records at Your Provider

Add the following DNS records:

#### TXT Record (for validation)
- **Type**: TXT
- **Name**: `_dnsauth.www`
- **Value**: `<validation-token from Azure>`
- **TTL**: 3600 (1 hour)

#### CNAME Record (for www subdomain)
- **Type**: CNAME
- **Name**: `www`
- **Value**: `<your-static-web-app>.azurestaticapps.net`
- **TTL**: 3600 (1 hour)

**Note**: If your DNS provider shows the full domain (www.9vectors.com) instead of just "www", that's fine.

### Step 4: Verify DNS Propagation

Wait 5-10 minutes, then verify DNS records:

```bash
# Check TXT record
dig TXT _dnsauth.www.9vectors.com +short

# Check CNAME record
dig CNAME www.9vectors.com +short
```

Expected outputs:
- TXT: `"<validation-token>"`
- CNAME: `<your-static-web-app>.azurestaticapps.net.`

### Step 5: Verify Custom Domain in Azure

```bash
# Check domain validation status
az staticwebapp hostname show \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --hostname www.9vectors.com

# Status should change to "Ready" after validation
```

If status is still "WaitingForValidation", wait a few more minutes and retry.

### Step 6: Enable HTTPS/SSL

Azure Static Web Apps automatically provisions a free SSL certificate once the domain is validated. This typically takes 5-10 minutes.

Verify HTTPS is working:
```bash
curl -I https://www.9vectors.com
```

Expected response should include:
```
HTTP/2 200
```

## Part 2: Configure Root Domain Redirect (9vectors.com → www.9vectors.com)

Azure Static Web Apps doesn't support apex/root domains directly. Use your DNS provider's redirect feature.

### Option A: DNS Provider Redirect (Recommended)

Most DNS providers offer URL forwarding/redirect features:

**GoDaddy**:
1. Go to DNS Management
2. Click "Add" → "Forwarding"
3. Forward `9vectors.com` to `https://www.9vectors.com`
4. Select "Permanent (301)" redirect
5. Enable "Forward only" (not "Forward with masking")

**Namecheap**:
1. Go to Advanced DNS
2. Add "URL Redirect Record"
3. Source: `@` (root domain)
4. Target: `https://www.9vectors.com`
5. Type: Permanent (301)

**Cloudflare**:
1. Go to Rules → Page Rules
2. Create rule: `9vectors.com/*` → `https://www.9vectors.com/$1`
3. Setting: Forwarding URL (301 - Permanent Redirect)

### Option B: ALIAS/ANAME Record (if supported)

If your DNS provider supports ALIAS or ANAME records (e.g., Route 53, Cloudflare):

```bash
# Add root domain to Static Web App
az staticwebapp hostname set \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --hostname 9vectors.com

# Get validation token
az staticwebapp hostname show \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --hostname 9vectors.com
```

Then add DNS records:
- **Type**: TXT
  - **Name**: `_dnsauth`
  - **Value**: `<validation-token>`
- **Type**: ALIAS or ANAME
  - **Name**: `@` (root)
  - **Value**: `<your-static-web-app>.azurestaticapps.net`

## Part 3: Configure Backend API Custom Domain (api.9vectors.com)

### Step 1: Add Custom Domain to Function App

```bash
# Add custom domain to Function App
az functionapp config hostname add \
  --webapp-name 9vectors-api \
  --resource-group 9vectors-rg \
  --hostname api.9vectors.com
```

### Step 2: Get Domain Verification ID

```bash
# Get custom domain verification ID
az functionapp config hostname get-external-ip \
  --webapp-name 9vectors-api \
  --resource-group 9vectors-rg
```

**Output**: IP address like `20.42.68.123`

Also get the verification ID:
```bash
az functionapp show \
  --name 9vectors-api \
  --resource-group 9vectors-rg \
  --query customDomainVerificationId -o tsv
```

### Step 3: Configure DNS Records for API

Add the following DNS records at your provider:

#### TXT Record (for verification)
- **Type**: TXT
- **Name**: `asuid.api`
- **Value**: `<customDomainVerificationId from Azure>`
- **TTL**: 3600

#### CNAME Record (for api subdomain)
- **Type**: CNAME
- **Name**: `api`
- **Value**: `9vectors-api.azurewebsites.net`
- **TTL**: 3600

### Step 4: Verify DNS and Bind Domain

Wait 5-10 minutes, then verify:

```bash
# Check TXT record
dig TXT asuid.api.9vectors.com +short

# Check CNAME record
dig CNAME api.9vectors.com +short
```

Then bind the domain:
```bash
# This will enable the custom domain
az functionapp config hostname add \
  --webapp-name 9vectors-api \
  --resource-group 9vectors-rg \
  --hostname api.9vectors.com
```

### Step 5: Enable HTTPS for API

Create a managed SSL certificate:

```bash
# Create managed certificate for api.9vectors.com
az functionapp config ssl create \
  --resource-group 9vectors-rg \
  --name 9vectors-api \
  --hostname api.9vectors.com

# Bind the certificate
az functionapp config ssl bind \
  --resource-group 9vectors-rg \
  --name 9vectors-api \
  --certificate-thumbprint <thumbprint-from-create-command> \
  --ssl-type SNI
```

### Step 6: Update Function App CORS

Update CORS settings to allow requests from the frontend domain:

```bash
az functionapp cors add \
  --name 9vectors-api \
  --resource-group 9vectors-rg \
  --allowed-origins https://www.9vectors.com https://9vectors.com
```

## Part 4: Update Application Configuration

### Update Frontend Environment Variables

Update `.env` (local) and GitHub secrets:

```bash
# Update VITE_API_URL
VITE_API_URL=https://api.9vectors.com/api
```

Update GitHub secret:
```bash
gh secret set VITE_API_URL --body "https://api.9vectors.com/api"
```

### Update Backend Environment Variables

Update `FRONTEND_URL` in Function App settings:

```bash
az functionapp config appsettings set \
  --name 9vectors-api \
  --resource-group 9vectors-rg \
  --settings FRONTEND_URL=https://www.9vectors.com
```

Update GitHub secret:
```bash
gh secret set FRONTEND_URL --body "https://www.9vectors.com"
```

### Update Auth0 Configuration

Update Auth0 application settings:

1. Go to Auth0 Dashboard → Applications → 9Vectors SPA
2. Update **Allowed Callback URLs**:
   ```
   https://www.9vectors.com/callback,
   https://9vectors.com/callback,
   http://localhost:3005/callback
   ```
3. Update **Allowed Logout URLs**:
   ```
   https://www.9vectors.com,
   https://9vectors.com,
   http://localhost:3005
   ```
4. Update **Allowed Web Origins**:
   ```
   https://www.9vectors.com,
   https://9vectors.com,
   http://localhost:3005
   ```
5. Update **Allowed Origins (CORS)**:
   ```
   https://www.9vectors.com,
   https://9vectors.com,
   http://localhost:3005
   ```

### Update Stripe Configuration

Update Stripe webhook endpoint URL:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Update webhook endpoint to: `https://api.9vectors.com/api/stripe/webhook`
3. Update `STRIPE_WEBHOOK_SECRET` in GitHub secrets and Azure Function App settings

## Part 5: Verification and Testing

### Verify Frontend

```bash
# Test www subdomain
curl -I https://www.9vectors.com
# Should return: HTTP/2 200

# Test root domain redirect
curl -I https://9vectors.com
# Should return: HTTP/1.1 301 Moved Permanently
# Location: https://www.9vectors.com

# Test HTTPS redirect
curl -I http://www.9vectors.com
# Should redirect to HTTPS
```

### Verify Backend API

```bash
# Test API endpoint
curl https://api.9vectors.com/api/health
# Should return: {"status":"healthy"}

# Test HTTPS
curl -I https://api.9vectors.com
# Should return: HTTP/2 200
```

### End-to-End Testing

1. Visit https://www.9vectors.com
2. Open browser DevTools → Network tab
3. Log in with test account
4. Verify API requests go to `https://api.9vectors.com/api/*`
5. Check for SSL/TLS errors (should be none)
6. Test all major features:
   - User registration/login
   - Create assessment
   - AI coaching
   - Document upload
   - Stripe payment

## Troubleshooting

### DNS Changes Not Propagating

**Problem**: DNS records updated but not resolving.

**Solution**:
```bash
# Check DNS propagation globally
dig www.9vectors.com @8.8.8.8  # Google DNS
dig www.9vectors.com @1.1.1.1  # Cloudflare DNS

# Flush local DNS cache (macOS)
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Flush local DNS cache (Windows)
ipconfig /flushdns

# Flush local DNS cache (Linux)
sudo systemd-resolve --flush-caches
```

**Wait time**: DNS propagation can take up to 48 hours, but typically completes in 1-4 hours.

### Azure Domain Validation Fails

**Problem**: "WaitingForValidation" status doesn't change to "Ready".

**Solution**:
1. Verify TXT record is correct:
   ```bash
   dig TXT _dnsauth.www.9vectors.com +short
   ```
2. Ensure no conflicting DNS records exist
3. Delete and re-add the custom domain in Azure:
   ```bash
   az staticwebapp hostname delete --name 9vectors-app --resource-group 9vectors-rg --hostname www.9vectors.com
   az staticwebapp hostname set --name 9vectors-app --resource-group 9vectors-rg --hostname www.9vectors.com
   ```

### SSL Certificate Not Provisioning

**Problem**: HTTPS not working or showing certificate errors.

**Solution**:
1. Verify domain is validated and status is "Ready"
2. Wait 10-15 minutes for automatic SSL provisioning
3. Check SSL certificate status:
   ```bash
   az staticwebapp show --name 9vectors-app --resource-group 9vectors-rg --query customDomains
   ```
4. If still failing, delete and re-add custom domain

### CORS Errors from API

**Problem**: Browser console shows CORS errors when calling API.

**Solution**:
```bash
# Verify CORS settings
az functionapp cors show --name 9vectors-api --resource-group 9vectors-rg

# Add missing origins
az functionapp cors add --name 9vectors-api --resource-group 9vectors-rg \
  --allowed-origins https://www.9vectors.com https://9vectors.com

# Remove unwanted origins
az functionapp cors remove --name 9vectors-api --resource-group 9vectors-rg \
  --allowed-origins http://localhost:3005
```

### API Calls Failing After Domain Change

**Problem**: Frontend can't reach API after switching to custom domain.

**Solution**:
1. Verify `VITE_API_URL` is updated in frontend build
2. Rebuild and redeploy frontend:
   ```bash
   npm run build
   # Deployment will happen automatically via GitHub Actions
   ```
3. Clear browser cache and hard reload (Cmd/Ctrl + Shift + R)
4. Check browser DevTools → Network tab for actual API URL being called

### Root Domain Not Redirecting

**Problem**: 9vectors.com doesn't redirect to www.9vectors.com.

**Solution**:
1. Verify redirect is configured in DNS provider
2. Test redirect directly:
   ```bash
   curl -L https://9vectors.com
   ```
3. If using ALIAS record, verify it points to the correct Azure Static Web App URL
4. Contact DNS provider support if redirect feature isn't working

## DNS Record Summary

Here's a complete summary of all DNS records needed:

### For DNS Provider (e.g., GoDaddy, Namecheap)

| Type  | Name              | Value                                          | TTL  | Purpose                    |
|-------|-------------------|------------------------------------------------|------|----------------------------|
| TXT   | _dnsauth.www      | `<azure-validation-token>`                     | 3600 | Verify www.9vectors.com    |
| CNAME | www               | `<static-web-app>.azurestaticapps.net`        | 3600 | Frontend (www.9vectors.com)|
| TXT   | asuid.api         | `<function-app-verification-id>`               | 3600 | Verify api.9vectors.com    |
| CNAME | api               | `9vectors-api.azurewebsites.net`              | 3600 | Backend (api.9vectors.com) |
| Redirect | @ (root)       | `https://www.9vectors.com` (301)               | -    | Root → www redirect        |

### Optional: If Using ALIAS for Root Domain

| Type  | Name              | Value                                          | TTL  | Purpose                    |
|-------|-------------------|------------------------------------------------|------|----------------------------|
| TXT   | _dnsauth          | `<azure-validation-token-for-root>`            | 3600 | Verify 9vectors.com        |
| ALIAS | @ (root)          | `<static-web-app>.azurestaticapps.net`        | 3600 | Root domain                |

## Security Considerations

1. **Force HTTPS**: Ensure all HTTP requests redirect to HTTPS
   - Configured via `Strict-Transport-Security` header in `staticwebapp.config.json`

2. **CORS Configuration**: Limit allowed origins to production domains only
   - Remove localhost origins from production Function App

3. **Content Security Policy**: Configure CSP headers to prevent XSS
   - Already configured in `staticwebapp.config.json`

4. **DNS Security**: Enable DNSSEC if your provider supports it
   - Protects against DNS spoofing attacks

5. **Certificate Monitoring**: Set up alerts for SSL certificate expiration
   - Azure managed certificates auto-renew, but monitor for failures

## Next Steps

After DNS configuration is complete:

1. Update `.env.production` with production URLs
2. Update GitHub secrets for deployment
3. Redeploy frontend and backend via GitHub Actions
4. Test all authentication flows (Auth0, Azure AD B2C)
5. Update Stripe webhook endpoints
6. Update email templates with new domain
7. Test email sending (password reset, invitations)
8. Set up monitoring and alerts for custom domains
9. Configure CDN or DDoS protection (optional, via Cloudflare)

## Related Documentation

- [Azure Static Web Apps Custom Domains](https://learn.microsoft.com/en-us/azure/static-web-apps/custom-domain)
- [Azure Functions Custom Domains](https://learn.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-custom-domain)
- [GitHub Secrets Setup](.azure/GITHUB_SECRETS.md)
- [Deployment Guide](.azure/DEPLOYMENT_GUIDE.md)
