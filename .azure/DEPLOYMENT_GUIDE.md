# 9Vectors Azure Deployment Guide

Complete guide for deploying 9Vectors SaaS application to Azure using Static Web Apps and Azure Functions.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     9Vectors on Azure                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────┐         ┌──────────────────────┐ │
│  │  Azure Static Web    │         │   Azure Functions    │ │
│  │       Apps           │────────▶│      (Node 20)       │ │
│  │  (React Frontend)    │  API    │   Express Wrapper    │ │
│  └──────────────────────┘         └──────────────────────┘ │
│                                             │               │
│                                             │               │
│                                             ▼               │
│                                    ┌──────────────────────┐ │
│                                    │   Azure Cosmos DB    │ │
│                                    │    (NoSQL)           │ │
│                                    └──────────────────────┘ │
│                                                             │
│  Resource Group: Snapshot9                                 │
│  Region: East US                                           │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

1. **Azure CLI** installed and configured
   ```bash
   az --version
   az login
   ```

2. **GitHub Account** with repository access

3. **Node.js 20+** installed locally for testing

4. **Required Secrets:**
   - Stripe publishable key
   - Auth0 credentials (domain, client ID, audience)
   - Azure credentials (will be generated during deployment)

## Step 1: Deploy Azure Infrastructure

Run the automated deployment script:

```bash
cd .azure
./deploy-full-infrastructure.sh
```

This script will create:

- ✅ Azure Static Web App (`9vectors-web`)
- ✅ Azure Function App (`9vectors-api`)
- ✅ Azure Cosmos DB Account (`9vectors-cosmos`)
- ✅ Cosmos DB Database and Containers
- ✅ Storage Account for Functions
- ✅ App Service Plan (B1 tier)

**Expected Duration:** 5-10 minutes

### Script Output

The script will output important values:

```
🔐 GitHub Secrets (save these for CI/CD):
   AZURE_STATIC_WEB_APPS_API_TOKEN: <token>
   COSMOS_ENDPOINT: <endpoint>
   COSMOS_KEY: <key>
```

**IMPORTANT:** Save these values - you'll need them for GitHub secrets!

## Step 2: Configure GitHub Secrets

Add the following secrets to your GitHub repository:

Navigate to: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

### Required Secrets:

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Static Web App deployment token | From deployment script output |
| `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` | Function App publish profile | See below |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe public key | Stripe Dashboard → API Keys |
| `VITE_AUTH0_DOMAIN` | Auth0 domain | Auth0 Dashboard → Application Settings |
| `VITE_AUTH0_CLIENT_ID` | Auth0 client ID | Auth0 Dashboard → Application Settings |
| `VITE_AUTH0_AUDIENCE` | Auth0 API audience | Auth0 Dashboard → API Settings |
| `COSMOS_ENDPOINT` | Cosmos DB endpoint | From deployment script output |
| `COSMOS_KEY` | Cosmos DB primary key | From deployment script output |

### Get Function App Publish Profile:

```bash
az functionapp deployment list-publishing-profiles \
  --name 9vectors-api \
  --resource-group Snapshot9 \
  --xml > publish-profile.xml
```

Copy the entire contents of `publish-profile.xml` and add as `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` secret.

## Step 3: Update Environment Variables

### Frontend (.env)

Update production values:

```bash
VITE_API_URL=https://9vectors-api.azurewebsites.net
VITE_ENV=production
VITE_AUTH0_DOMAIN=<your-auth0-domain>
VITE_AUTH0_CLIENT_ID=<your-auth0-client-id>
VITE_AUTH0_AUDIENCE=<your-auth0-audience>
VITE_STRIPE_PUBLISHABLE_KEY=<your-stripe-key>
```

### Backend (Azure Function App Settings)

These are automatically configured by the deployment script, but you can verify/update:

```bash
az functionapp config appsettings list \
  --name 9vectors-api \
  --resource-group Snapshot9
```

Required settings:
- `COSMOS_ENDPOINT`
- `COSMOS_KEY`
- `COSMOS_DATABASE=9vectors`
- `NODE_ENV=production`
- `JWT_SECRET` (add this manually for auth)

Add JWT secret:

```bash
az functionapp config appsettings set \
  --name 9vectors-api \
  --resource-group Snapshot9 \
  --settings "JWT_SECRET=<generate-secure-random-string>"
```

## Step 4: Deploy via GitHub Actions

### Automatic Deployment

Push to `main` branch to trigger deployment:

```bash
git add .
git commit -m "Setup Azure deployment"
git push origin main
```

### Monitor Deployment

1. Go to GitHub repository → `Actions` tab
2. Watch the workflow run
3. Two jobs run in parallel:
   - `build_and_deploy_frontend`
   - `build_and_deploy_backend`
4. Verify deployment with `verify_deployment` job

### Expected Duration

- Frontend build: ~2-3 minutes
- Backend build: ~3-5 minutes
- Total: ~5-8 minutes

## Step 5: Verify Deployment

### Check Frontend

```bash
curl -I https://9vectors-web.azurestaticapps.net
# Expected: HTTP 200
```

### Check Backend API

```bash
curl https://9vectors-api.azurewebsites.net/health
# Expected: {"status":"ok","timestamp":"...","service":"9Vectors API - Azure Functions"}
```

### Check Cosmos DB Connection

```bash
curl https://9vectors-api.azurewebsites.net/api/auth/me
# Expected: 401 (Unauthorized) - proves API and DB are working
```

## Step 6: Configure Custom Domain (Optional)

### For Static Web App:

```bash
az staticwebapp hostname set \
  --name 9vectors-web \
  --resource-group Snapshot9 \
  --hostname www.9vectors.com
```

### For Function App:

```bash
az functionapp config hostname add \
  --webapp-name 9vectors-api \
  --resource-group Snapshot9 \
  --hostname api.9vectors.com
```

### Update DNS:

Add CNAME records:
- `www.9vectors.com` → `9vectors-web.azurestaticapps.net`
- `api.9vectors.com` → `9vectors-api.azurewebsites.net`

## Monitoring and Logs

### View Function Logs:

```bash
az functionapp log tail \
  --name 9vectors-api \
  --resource-group Snapshot9
```

### View Static Web App Logs:

```bash
az staticwebapp show \
  --name 9vectors-web \
  --resource-group Snapshot9
```

### Application Insights (Recommended):

Enable Application Insights for better monitoring:

```bash
az monitor app-insights component create \
  --app 9vectors-insights \
  --location eastus \
  --resource-group Snapshot9

# Link to Function App
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
  --app 9vectors-insights \
  --resource-group Snapshot9 \
  --query instrumentationKey -o tsv)

az functionapp config appsettings set \
  --name 9vectors-api \
  --resource-group Snapshot9 \
  --settings "APPINSIGHTS_INSTRUMENTATIONKEY=$INSTRUMENTATION_KEY"
```

## Troubleshooting

### Issue: Frontend 500 Error

**Solution:** Check Static Web App build logs in GitHub Actions

```bash
# View Static Web App details
az staticwebapp show \
  --name 9vectors-web \
  --resource-group Snapshot9
```

### Issue: Backend API Not Responding

**Solution:** Check Function App logs

```bash
az functionapp log tail \
  --name 9vectors-api \
  --resource-group Snapshot9
```

### Issue: Cosmos DB Connection Error

**Solution:** Verify connection string and firewall rules

```bash
# Check Cosmos DB firewall
az cosmosdb show \
  --name 9vectors-cosmos \
  --resource-group Snapshot9 \
  --query "ipRules"

# Allow Azure services
az cosmosdb update \
  --name 9vectors-cosmos \
  --resource-group Snapshot9 \
  --enable-virtual-network true
```

### Issue: CORS Errors

**Solution:** Update Function App CORS settings

```bash
az functionapp cors add \
  --name 9vectors-api \
  --resource-group Snapshot9 \
  --allowed-origins "https://9vectors-web.azurestaticapps.net" "https://www.9vectors.com"
```

## Costs Estimation

| Resource | Tier | Monthly Cost (Est.) |
|----------|------|---------------------|
| Static Web App | Free | $0 |
| Function App | B1 | ~$13 |
| Cosmos DB | 400 RU/s | ~$24 |
| Storage Account | Standard | ~$1 |
| **Total** | | **~$38/month** |

### Cost Optimization Tips:

1. **Use Free Tier Static Web Apps** ✅ (Already configured)
2. **Optimize Cosmos DB RU/s** - Start with 400, scale as needed
3. **Enable Function App Auto-scale** - Only pay for what you use
4. **Use Azure DevOps** - Free CI/CD minutes

## Scaling

### Scale Function App:

```bash
# Scale to 3 instances
az functionapp plan update \
  --name 9vectors-plan \
  --resource-group Snapshot9 \
  --number-of-workers 3

# Enable auto-scale
az monitor autoscale create \
  --resource-group Snapshot9 \
  --resource 9vectors-plan \
  --resource-type Microsoft.Web/serverFarms \
  --name autoscale-9vectors \
  --min-count 1 \
  --max-count 10 \
  --count 1
```

### Scale Cosmos DB:

```bash
# Increase to 1000 RU/s
az cosmosdb sql database throughput update \
  --account-name 9vectors-cosmos \
  --resource-group Snapshot9 \
  --name 9vectors \
  --throughput 1000
```

## Backup and Disaster Recovery

### Cosmos DB Backup:

Automatic backups are enabled by default (continuous backup mode).

```bash
# Verify backup policy
az cosmosdb show \
  --name 9vectors-cosmos \
  --resource-group Snapshot9 \
  --query backupPolicy
```

### Restore from Backup:

```bash
# List available restore timestamps
az cosmosdb sql database list-restorable \
  --account-name 9vectors-cosmos \
  --location eastus

# Restore to point in time
az cosmosdb restore \
  --account-name 9vectors-cosmos-restored \
  --resource-group Snapshot9 \
  --source-account-name 9vectors-cosmos \
  --restore-timestamp "2025-10-20T00:00:00Z"
```

## Security Best Practices

1. ✅ **Enable HTTPS Only** (default)
2. ✅ **Use Managed Identities** (configure for production)
3. ✅ **Restrict Cosmos DB Access** (enable IP filtering)
4. ✅ **Enable Application Insights** (for monitoring)
5. ✅ **Regular Security Updates** (automated via Dependabot)
6. ✅ **Secrets in Key Vault** (recommended for production)

### Enable Managed Identity:

```bash
# Enable system-assigned identity for Function App
az functionapp identity assign \
  --name 9vectors-api \
  --resource-group Snapshot9

# Grant Function App access to Cosmos DB
PRINCIPAL_ID=$(az functionapp identity show \
  --name 9vectors-api \
  --resource-group Snapshot9 \
  --query principalId -o tsv)

az cosmosdb sql role assignment create \
  --account-name 9vectors-cosmos \
  --resource-group Snapshot9 \
  --role-definition-name "Cosmos DB Built-in Data Contributor" \
  --principal-id $PRINCIPAL_ID \
  --scope "/"
```

## Support and Documentation

- **Azure Documentation:** https://docs.microsoft.com/azure
- **Static Web Apps:** https://docs.microsoft.com/azure/static-web-apps
- **Azure Functions:** https://docs.microsoft.com/azure/azure-functions
- **Cosmos DB:** https://docs.microsoft.com/azure/cosmos-db

## Quick Reference Commands

```bash
# View all resources in Snapshot9
az resource list --resource-group Snapshot9 --output table

# Restart Function App
az functionapp restart --name 9vectors-api --resource-group Snapshot9

# View Function App metrics
az monitor metrics list \
  --resource 9vectors-api \
  --resource-group Snapshot9 \
  --resource-type Microsoft.Web/sites \
  --metric "Requests" "ResponseTime"

# Delete all resources (CAUTION!)
az group delete --name Snapshot9 --yes --no-wait
```

---

**Last Updated:** October 2025
**Version:** 1.0
**Maintained By:** 9Vectors DevOps Team
