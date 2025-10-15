# 9Vectors Azure Deployment Setup

Complete guide for deploying 9vectors.com to Azure with automated CI/CD.

## Overview

This setup includes:
- Azure App Service (Node.js 20 LTS)
- Azure DNS Zone for 9vectors.com
- GitHub Actions CI/CD pipeline
- Automated SSL certificate management
- Production environment configuration

## Prerequisites

1. Azure account with active subscription
2. Azure CLI installed: https://docs.microsoft.com/cli/azure/install-azure-cli
3. GitHub repository access
4. GoDaddy account access (for DNS migration)

## Step 1: Deploy Azure Infrastructure

Run the automated deployment script:

```bash
cd /Users/edwinmiller/Desktop/9Vectors
./.azure/deploy-azure-infrastructure.sh
```

This script will create:
- Resource Group: `9vectors-rg`
- App Service Plan: `9vectors-asp` (Basic B1, Linux)
- Web App: `9vectors-app`
- DNS Zone: `9vectors.com`

**Important**: Save the output! You'll need:
- Azure nameservers (for GoDaddy)
- Web App hostname
- Service Principal command

## Step 2: Create Service Principal for GitHub Actions

The script will output a command. Run it:

```bash
az ad sp create-for-rbac \
  --name "9vectors-github-actions" \
  --role contributor \
  --scopes /subscriptions/$(az account show --query id -o tsv)/resourceGroups/9vectors-rg \
  --sdk-auth
```

This outputs JSON credentials. **Save this JSON** - you'll add it to GitHub.

Example output:
```json
{
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

## Step 3: Configure GitHub Secrets

Go to your GitHub repository: https://github.com/millere-alt/9lenses-saas

Navigate to: **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

### Required Secrets:

1. **AZURE_CREDENTIALS**
   - Value: The entire JSON output from Step 2

2. **VITE_API_URL**
   - Value: `https://9vectors.com/api`
   - (or your actual API URL)

3. **VITE_STRIPE_PUBLIC_KEY**
   - Value: Your production Stripe public key
   - Get from: https://dashboard.stripe.com/apikeys

### How to add secrets:

1. Click **New repository secret**
2. Name: `AZURE_CREDENTIALS`
3. Value: Paste the JSON from service principal
4. Click **Add secret**
5. Repeat for other secrets

## Step 4: Configure Custom Domain and SSL

### Add Custom Domain to Azure Web App

```bash
# Get domain verification ID
VERIFICATION_ID=$(az webapp show \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --query customDomainVerificationId -o tsv)

echo "Domain Verification ID: $VERIFICATION_ID"

# Add TXT record for verification (do this in Azure DNS)
az network dns record-set txt add-record \
  --resource-group 9vectors-rg \
  --zone-name 9vectors.com \
  --record-set-name asuid \
  --value $VERIFICATION_ID

# Wait a few minutes for DNS to propagate, then add custom domains
az webapp config hostname add \
  --webapp-name 9vectors-app \
  --resource-group 9vectors-rg \
  --hostname 9vectors.com

az webapp config hostname add \
  --webapp-name 9vectors-app \
  --resource-group 9vectors-rg \
  --hostname www.9vectors.com
```

### Create DNS Records

```bash
# CNAME for www subdomain
az network dns record-set cname set-record \
  --resource-group 9vectors-rg \
  --zone-name 9vectors.com \
  --record-set-name www \
  --cname 9vectors-app.azurewebsites.net

# A record for root domain (alternative: use Azure Front Door for apex domain)
# Get the inbound IP address
az webapp show \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --query inboundIpAddress -o tsv

# Create A record
az network dns record-set a add-record \
  --resource-group 9vectors-rg \
  --zone-name 9vectors.com \
  --record-set-name @ \
  --ipv4-address <IP_FROM_ABOVE>
```

### Enable Managed SSL Certificates

```bash
# Create managed certificates (free)
az webapp config ssl create \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --hostname 9vectors.com

az webapp config ssl create \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --hostname www.9vectors.com

# Certificates will auto-renew
```

## Step 5: Migrate DNS from GoDaddy to Azure

See detailed guide: [DNS_MIGRATION_GUIDE.md](./DNS_MIGRATION_GUIDE.md)

Quick steps:
1. Get Azure nameservers from deployment output
2. Log into GoDaddy
3. Update nameservers for 9vectors.com
4. Wait for propagation (2-48 hours)

## Step 6: Deploy Application

### Manual Deployment (first time)

```bash
# Build locally
npm run build

# Deploy to Azure
az webapp deploy \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --src-path ./dist \
  --type static
```

### Automated Deployment (GitHub Actions)

Once secrets are configured, simply push to main:

```bash
git add .
git commit -m "Configure Azure deployment"
git push origin main
```

GitHub Actions will automatically:
1. Build the application
2. Run tests (if configured)
3. Deploy to Azure
4. Verify deployment

Monitor at: https://github.com/millere-alt/9lenses-saas/actions

## Step 7: Configure Application Settings in Azure

```bash
# Set Node version
az webapp config appsettings set \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --settings WEBSITE_NODE_DEFAULT_VERSION="~20"

# Set startup command
az webapp config set \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --startup-file "npx serve -s dist -l 8080"

# Enable application logging
az webapp log config \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --application-logging filesystem \
  --level information

# Enable HTTPS redirect
az webapp update \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --https-only true
```

## Step 8: Verify Deployment

### Check Web App Status

```bash
# Get app details
az webapp show \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --query "{Name:name, State:state, DefaultHostName:defaultHostName, HttpsOnly:httpsOnly}" \
  --output table

# Check if app is running
curl -I https://9vectors-app.azurewebsites.net
```

### View Logs

```bash
# Stream logs
az webapp log tail \
  --name 9vectors-app \
  --resource-group 9vectors-rg

# Download logs
az webapp log download \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --log-file 9vectors-logs.zip
```

### Test Application

```bash
# Test default hostname
curl https://9vectors-app.azurewebsites.net

# Test custom domain (after DNS migration)
curl https://9vectors.com
curl https://www.9vectors.com
```

## Ongoing Management

### Update Application

Push to GitHub main branch - automatic deployment via GitHub Actions

### Monitor Performance

```bash
# View metrics
az monitor metrics list \
  --resource /subscriptions/$(az account show --query id -o tsv)/resourceGroups/9vectors-rg/providers/Microsoft.Web/sites/9vectors-app \
  --metric-names "Requests,ResponseTime,Http5xx"
```

### Scale Application

```bash
# Scale up (increase instance size)
az appservice plan update \
  --name 9vectors-asp \
  --resource-group 9vectors-rg \
  --sku S1

# Scale out (increase instance count)
az appservice plan update \
  --name 9vectors-asp \
  --resource-group 9vectors-rg \
  --number-of-workers 2
```

### Backup and Restore

```bash
# Create backup
az webapp config backup create \
  --resource-group 9vectors-rg \
  --webapp-name 9vectors-app \
  --backup-name 9vectors-backup-$(date +%Y%m%d) \
  --container-url <storage-container-sas-url>
```

## Troubleshooting

### Deployment Fails

1. Check GitHub Actions logs
2. Verify Azure credentials in GitHub secrets
3. Check Azure App Service logs:
   ```bash
   az webapp log tail --name 9vectors-app --resource-group 9vectors-rg
   ```

### Application Not Loading

1. Verify build succeeded: Check `dist` folder locally
2. Test default URL: https://9vectors-app.azurewebsites.net
3. Check startup command is correct
4. Verify environment variables

### DNS Issues

1. Check nameservers: `dig NS 9vectors.com`
2. Verify DNS records in Azure:
   ```bash
   az network dns record-set list \
     --resource-group 9vectors-rg \
     --zone-name 9vectors.com \
     --output table
   ```
3. Use DNS checker: https://www.whatsmydns.net/

### SSL Certificate Issues

1. Verify DNS is pointing to Azure (required for cert validation)
2. Check certificate status:
   ```bash
   az webapp config ssl list \
     --resource-group 9vectors-rg \
     --query "[].{Name:name, Thumbprint:thumbprint, State:subjectName}"
   ```
3. Wait for DNS propagation before creating certificates

## Cost Optimization

Current configuration (Basic B1):
- ~$13/month for App Service Plan
- DNS Zone: $0.50/month + $0.40 per million queries
- Bandwidth: First 100GB free, then $0.087/GB

To reduce costs:
- Use Free (F1) tier for development/testing
- Share App Service Plan across multiple apps
- Use Azure Front Door for CDN and caching

## Security Best Practices

1. **Always use HTTPS**: Enabled by default in this setup
2. **Managed Identity**: Consider using for Azure resource access
3. **Key Vault**: Store secrets in Azure Key Vault instead of environment variables
4. **Network Security**: Consider adding VNet integration for enhanced security
5. **Monitoring**: Enable Application Insights for performance monitoring

## Next Steps

1. ✅ Infrastructure deployed
2. ✅ GitHub Actions configured
3. ✅ DNS migration planned
4. ⏳ Deploy first version
5. ⏳ Migrate DNS
6. ⏳ Enable SSL
7. ⏳ Monitor and optimize

## Support Resources

- Azure App Service: https://docs.microsoft.com/azure/app-service/
- Azure DNS: https://docs.microsoft.com/azure/dns/
- GitHub Actions: https://docs.github.com/actions
- Azure CLI: https://docs.microsoft.com/cli/azure/

## Quick Reference Commands

```bash
# View all resources
az resource list --resource-group 9vectors-rg --output table

# Restart app
az webapp restart --name 9vectors-app --resource-group 9vectors-rg

# Get URL
az webapp show --name 9vectors-app --resource-group 9vectors-rg --query defaultHostName -o tsv

# Delete everything (careful!)
az group delete --name 9vectors-rg --yes
```
