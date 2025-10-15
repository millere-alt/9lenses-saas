# 9Vectors Azure Deployment - Quick Start Guide

Fast-track guide to get 9vectors.com deployed to Azure.

## Prerequisites Checklist

- [ ] Azure CLI installed and logged in (`az login`)
- [ ] Azure subscription active
- [ ] GitHub repository access
- [ ] GoDaddy account access for DNS
- [ ] Domain: 9vectors.com registered

## Step-by-Step Deployment

### 1. Deploy Azure Infrastructure (5 minutes)

```bash
cd /Users/edwinmiller/Desktop/9Vectors
./.azure/deploy-azure-infrastructure.sh
```

**Save the output!** You'll need:
- 4 Azure nameservers (for GoDaddy DNS)
- Service Principal creation command

### 2. Create Service Principal (2 minutes)

Copy and run the command from the previous output:

```bash
az ad sp create-for-rbac \
  --name "9vectors-github-actions" \
  --role contributor \
  --scopes /subscriptions/$(az account show --query id -o tsv)/resourceGroups/9vectors-rg \
  --sdk-auth
```

**Copy the entire JSON output** - you'll add this to GitHub.

### 3. Configure GitHub Secrets (3 minutes)

Go to: https://github.com/millere-alt/9lenses-saas/settings/secrets/actions

Add these 3 secrets:

| Secret Name | Value |
|------------|-------|
| `AZURE_CREDENTIALS` | Entire JSON from Step 2 |
| `VITE_API_URL` | `https://9vectors.com/api` |
| `VITE_STRIPE_PUBLIC_KEY` | Your production Stripe key |

### 4. Push to Trigger Deployment (1 minute)

```bash
git add .
git commit -m "Add Azure deployment configuration"
git push origin main
```

Watch deployment at: https://github.com/millere-alt/9lenses-saas/actions

### 5. Configure Custom Domain (10 minutes)

#### Add domain verification TXT record:

```bash
# Get verification ID
VERIFICATION_ID=$(az webapp show \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --query customDomainVerificationId -o tsv)

# Add TXT record
az network dns record-set txt add-record \
  --resource-group 9vectors-rg \
  --zone-name 9vectors.com \
  --record-set-name asuid \
  --value $VERIFICATION_ID
```

#### Add DNS records:

```bash
# CNAME for www
az network dns record-set cname set-record \
  --resource-group 9vectors-rg \
  --zone-name 9vectors.com \
  --record-set-name www \
  --cname 9vectors-app.azurewebsites.net

# A record for root (get IP first)
APP_IP=$(az webapp show \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --query inboundIpAddress -o tsv)

az network dns record-set a add-record \
  --resource-group 9vectors-rg \
  --zone-name 9vectors.com \
  --record-set-name @ \
  --ipv4-address $APP_IP
```

#### Add custom domains to Web App:

```bash
# Wait 2-3 minutes after adding TXT record, then:
az webapp config hostname add \
  --webapp-name 9vectors-app \
  --resource-group 9vectors-rg \
  --hostname 9vectors.com

az webapp config hostname add \
  --webapp-name 9vectors-app \
  --resource-group 9vectors-rg \
  --hostname www.9vectors.com
```

### 6. Migrate DNS from GoDaddy (5 minutes + propagation time)

#### Get Azure nameservers:

```bash
az network dns zone show \
  --resource-group 9vectors-rg \
  --name 9vectors.com \
  --query nameServers -o tsv
```

#### Update GoDaddy:

1. Login to GoDaddy: https://dcc.godaddy.com/
2. Go to **My Products** → **Domains**
3. Click **9vectors.com**
4. Scroll to **Nameservers** → Click **Change**
5. Select **Custom** nameservers
6. Paste all 4 Azure nameservers
7. Click **Save**

**Wait 2-48 hours for DNS propagation** (usually 2-4 hours)

### 7. Enable SSL Certificates (5 minutes)

**Important**: Only do this AFTER DNS has propagated to Azure!

```bash
# Create free managed certificates
az webapp config ssl create \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --hostname 9vectors.com

az webapp config ssl create \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --hostname www.9vectors.com
```

SSL certificates will auto-renew every 6 months.

### 8. Verify Deployment

```bash
# Run verification script
./.azure/verify-deployment.sh

# Or manually test
curl -I https://9vectors-app.azurewebsites.net
curl -I https://9vectors.com
curl -I https://www.9vectors.com
```

## Verification Checklist

- [ ] Azure resources created (Resource Group, App Service, DNS Zone)
- [ ] GitHub Actions workflow runs successfully
- [ ] Application accessible at https://9vectors-app.azurewebsites.net
- [ ] DNS nameservers updated at GoDaddy
- [ ] DNS propagated (check at https://www.whatsmydns.net/)
- [ ] Custom domains configured in Azure
- [ ] SSL certificates enabled and working
- [ ] https://9vectors.com loads correctly
- [ ] https://www.9vectors.com loads correctly

## Common Issues & Solutions

### GitHub Actions Fails

**Problem**: Deployment fails in GitHub Actions

**Solution**:
1. Check that `AZURE_CREDENTIALS` secret is correct JSON format
2. Verify Service Principal has correct permissions
3. Check build logs in GitHub Actions

### DNS Not Resolving

**Problem**: 9vectors.com doesn't resolve

**Solution**:
1. Check nameservers: `dig NS 9vectors.com`
2. Wait longer - DNS can take up to 48 hours
3. Clear local DNS cache
4. Check https://www.whatsmydns.net/

### SSL Certificate Creation Fails

**Problem**: `az webapp config ssl create` fails

**Solution**:
1. **Most common**: DNS hasn't propagated yet - wait longer
2. Verify domain is added to Web App: `az webapp config hostname list`
3. Check verification TXT record exists: `dig TXT asuid.9vectors.com`

### Application Shows 404

**Problem**: Application loads but shows 404 or blank page

**Solution**:
1. Check if build succeeded in GitHub Actions
2. Verify `dist` folder was created
3. Check startup command: Should serve from `dist` folder
4. View logs: `az webapp log tail --name 9vectors-app --resource-group 9vectors-rg`

## Monitoring & Management

### View Logs

```bash
# Real-time logs
az webapp log tail --name 9vectors-app --resource-group 9vectors-rg

# Download logs
az webapp log download --name 9vectors-app --resource-group 9vectors-rg
```

### Restart Application

```bash
az webapp restart --name 9vectors-app --resource-group 9vectors-rg
```

### View Metrics

```bash
az monitor metrics list \
  --resource /subscriptions/$(az account show --query id -o tsv)/resourceGroups/9vectors-rg/providers/Microsoft.Web/sites/9vectors-app \
  --metric-names "Requests,ResponseTime"
```

### Scale Application

```bash
# Scale up (larger instance)
az appservice plan update \
  --name 9vectors-asp \
  --resource-group 9vectors-rg \
  --sku S1

# Scale out (more instances)
az appservice plan update \
  --name 9vectors-asp \
  --resource-group 9vectors-rg \
  --number-of-workers 2
```

## CI/CD Workflow

Every push to `main` branch automatically:
1. Builds the application
2. Runs tests (if configured)
3. Deploys to Azure
4. Verifies deployment

Monitor at: https://github.com/millere-alt/9lenses-saas/actions

## Cost Estimate

**Basic (B1) tier** - Current configuration:
- App Service Plan: ~$13/month
- Azure DNS: $0.50/month + $0.40 per million queries
- Bandwidth: First 100GB free
- SSL Certificates: Free (managed)

**Total**: ~$14/month

## Support & Documentation

- **Full Setup Guide**: [AZURE_SETUP.md](./AZURE_SETUP.md)
- **DNS Migration**: [DNS_MIGRATION_GUIDE.md](./DNS_MIGRATION_GUIDE.md)
- **Azure Docs**: https://docs.microsoft.com/azure/app-service/
- **GitHub Actions**: https://docs.github.com/actions

## Quick Commands Reference

```bash
# Check deployment status
./.azure/verify-deployment.sh

# View app URL
az webapp show --name 9vectors-app --resource-group 9vectors-rg --query defaultHostName -o tsv

# View logs
az webapp log tail --name 9vectors-app --resource-group 9vectors-rg

# Restart app
az webapp restart --name 9vectors-app --resource-group 9vectors-rg

# Check DNS
dig NS 9vectors.com
dig A 9vectors.com

# List all resources
az resource list --resource-group 9vectors-rg --output table
```

## Rollback Plan

If something goes wrong:

1. **Application issues**: Revert Git commit and push
2. **DNS issues**: Change nameservers back to GoDaddy in GoDaddy portal
3. **Complete rollback**: Keep infrastructure but stop using it

## Next Steps After Deployment

1. ✅ Monitor application performance in Azure Portal
2. ✅ Set up Application Insights for detailed monitoring
3. ✅ Configure alerts for downtime or errors
4. ✅ Review and optimize costs
5. ✅ Set up backup strategy
6. ✅ Configure custom domain email (if needed)

---

**Estimated Total Time**: 30 minutes active work + 2-48 hours DNS propagation

**Questions?** Refer to the full documentation in `.azure/` folder.
