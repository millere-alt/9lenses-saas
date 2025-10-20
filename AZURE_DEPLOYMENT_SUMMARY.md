# Azure CI/CD Pipeline - Deployment Summary

## Overview

Complete CI/CD pipeline created for deploying 9Vectors SaaS application to Azure with:
- **Frontend**: Azure Static Web Apps (React + Vite)
- **Backend**: Azure Functions (Node.js 20 + Express wrapper)
- **Database**: Azure Cosmos DB (NoSQL)
- **Resource Group**: Snapshot9

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    9Vectors on Azure                             │
│                                                                  │
│  ┌────────────────────┐                                         │
│  │  GitHub Repository │                                         │
│  │   (main branch)    │                                         │
│  └──────────┬─────────┘                                         │
│             │ push                                              │
│             ▼                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │          GitHub Actions Workflow                        │   │
│  │  ┌──────────────────┐    ┌──────────────────────────┐  │   │
│  │  │  Frontend Build  │    │    Backend Build         │  │   │
│  │  │  - npm ci        │    │    - npm ci (api/)       │  │   │
│  │  │  - npm run build │    │    - Bundle functions    │  │   │
│  │  │  - Creates dist/ │    │    - Create deploy.zip   │  │   │
│  │  └────────┬─────────┘    └──────────┬───────────────┘  │   │
│  │           │                          │                  │   │
│  └───────────┼──────────────────────────┼──────────────────┘   │
│              │                          │                      │
│              ▼                          ▼                      │
│  ┌──────────────────────┐  ┌──────────────────────────────┐   │
│  │ Azure Static Web App │  │   Azure Function App         │   │
│  │   9vectors-web       │  │      9vectors-api            │   │
│  │   (React Frontend)   │──▶  (Express wrapper)           │   │
│  │                      │API │   - All routes /api/*       │   │
│  │ Location: eastus     │  │   - Node.js 20               │   │
│  │ SKU: Free            │  │   - B1 App Service Plan      │   │
│  └──────────────────────┘  └────────────┬─────────────────┘   │
│                                         │                      │
│                                         ▼                      │
│                            ┌──────────────────────────────┐   │
│                            │    Azure Cosmos DB           │   │
│                            │    9vectors-cosmos           │   │
│                            │    - Database: 9vectors      │   │
│                            │    - 5 Containers            │   │
│                            │    - 400 RU/s per container  │   │
│                            └──────────────────────────────┘   │
│                                                                │
│  Resource Group: Snapshot9                                    │
│  Region: East US                                              │
└──────────────────────────────────────────────────────────────┘
```

## Files Created

### Infrastructure Scripts
1. **`.azure/deploy-full-infrastructure.sh`** ✅
   - Creates all Azure resources in Snapshot9 resource group
   - Sets up Static Web App, Function App, Cosmos DB
   - Configures containers and connection strings
   - **Run once** for initial setup

2. **`.azure/setup-secrets.sh`** ✅
   - Configures all GitHub secrets automatically
   - Retrieves Azure credentials
   - Sets up Auth0 and Stripe secrets
   - **Run once** after infrastructure deployment

### Backend (Azure Functions)
3. **`api/host.json`** ✅
   - Azure Functions host configuration
   - Function timeout: 5 minutes
   - Application Insights integration

4. **`api/local.settings.json`** ✅
   - Local development settings
   - Environment variables template
   - CORS configuration

5. **`api/functions/httpTrigger.js`** ✅
   - Main HTTP trigger function
   - Express app wrapper
   - Handles all routes with pattern `{*segments}`
   - Database initialization

6. **`api/package.json`** ✅ (Updated)
   - Added `@azure/functions` dependency
   - Added func:start and func:build scripts

7. **`api/.funcignore`** ✅
   - Excludes unnecessary files from deployment

8. **`api/.gitignore`** ✅
   - Azure Functions specific ignores

### CI/CD Pipeline
9. **`.github/workflows/azure-deploy-full.yml`** ✅
   - Complete CI/CD workflow
   - Parallel frontend and backend builds
   - Automated deployment
   - Post-deployment verification

### Documentation
10. **`.azure/DEPLOYMENT_GUIDE.md`** ✅
    - Complete deployment guide
    - Architecture overview
    - Troubleshooting tips
    - Scaling and monitoring

11. **`.azure/README.md`** ✅ (Updated)
    - Quick start guide
    - File overview
    - Common commands

12. **`AZURE_DEPLOYMENT_SUMMARY.md`** ✅ (This file)
    - High-level overview
    - Next steps

## GitHub Secrets Required

Set these in GitHub repository settings (`Settings` → `Secrets and variables` → `Actions`):

| Secret Name | Source | Used For |
|------------|--------|----------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Azure Static Web App | Frontend deployment |
| `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` | Azure Function App | Backend deployment |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard | Payment processing |
| `VITE_AUTH0_DOMAIN` | Auth0 Dashboard | Authentication |
| `VITE_AUTH0_CLIENT_ID` | Auth0 Dashboard | Authentication |
| `VITE_AUTH0_AUDIENCE` | Auth0 Dashboard | Authentication |
| `COSMOS_ENDPOINT` | Azure Cosmos DB | Database connection |
| `COSMOS_KEY` | Azure Cosmos DB | Database connection |

## Deployment Steps

### 1. Deploy Infrastructure (One-time)

```bash
cd .azure
./deploy-full-infrastructure.sh
```

**What it does:**
- ✅ Creates resource group (Snapshot9)
- ✅ Creates Storage Account
- ✅ Creates Cosmos DB with all containers
- ✅ Creates App Service Plan (B1)
- ✅ Creates Function App
- ✅ Creates Static Web App
- ✅ Configures Function App settings

**Duration:** 5-10 minutes

**Output:** Saves important values (API tokens, connection strings)

### 2. Configure GitHub Secrets

```bash
./setup-secrets.sh
```

**What it does:**
- ✅ Retrieves Azure credentials automatically
- ✅ Prompts for Auth0 credentials
- ✅ Prompts for Stripe key
- ✅ Generates and sets JWT secret
- ✅ Configures all GitHub secrets

**Duration:** 2-3 minutes

### 3. Deploy Application

```bash
git add .
git commit -m "Add Azure CI/CD pipeline"
git push origin main
```

**What happens:**
- ✅ GitHub Actions workflow triggers
- ✅ Frontend builds (2-3 minutes)
- ✅ Backend builds (3-5 minutes)
- ✅ Both deploy in parallel
- ✅ Health checks verify deployment

**Duration:** 5-8 minutes

## Verification

### Check Deployment Status

```bash
# View GitHub Actions
# Go to: https://github.com/millere-alt/9lenses-saas/actions

# Check Frontend
curl -I https://9vectors-web.azurestaticapps.net

# Check Backend API
curl https://9vectors-api.azurewebsites.net/health
# Expected: {"status":"ok",...}

# Check API endpoint
curl https://9vectors-api.azurewebsites.net/api/health
# Expected: {"status":"ok",...}
```

### Monitor Logs

```bash
# Function App logs
az functionapp log tail \
  --name 9vectors-api \
  --resource-group Snapshot9

# View all resources
az resource list \
  --resource-group Snapshot9 \
  --output table
```

## Cost Breakdown

| Resource | Tier/SKU | Monthly Cost (Est.) |
|----------|----------|---------------------|
| Azure Static Web App | Free | $0.00 |
| App Service Plan (B1) | 1 core, 1.75 GB | ~$13.00 |
| Azure Function App | Included in plan | $0.00 |
| Cosmos DB (400 RU/s × 5) | 2000 RU/s total | ~$24.00 |
| Storage Account | Standard LRS | ~$1.00 |
| **Total** | | **~$38.00/month** |

### Cost Optimization Options

1. **Reduce Cosmos DB RU/s**: Start with 400 RU/s total (shared)
2. **Use Consumption Plan**: For Function App (pay per execution)
3. **Enable Auto-pause**: For non-production environments
4. **Use Free Tier**: Cosmos DB free tier (25GB, 1000 RU/s)

## Workflow Details

### Frontend Deployment (`build_and_deploy_frontend`)

```yaml
Steps:
1. Checkout code
2. Setup Node.js 20
3. npm ci (install dependencies)
4. npm run build (create production bundle)
5. Deploy to Azure Static Web Apps
   - Uploads dist/ directory
   - Configures routing
   - Enables custom domain
```

### Backend Deployment (`build_and_deploy_backend`)

```yaml
Steps:
1. Checkout code
2. Setup Node.js 20
3. npm ci --production (api/)
4. Install Azure Functions Core Tools
5. Create deployment package
   - Copy src/, functions/, node_modules/
   - Create deployment.zip
6. Deploy to Azure Function App
   - Upload package
   - Configure environment
   - Restart function
```

### Verification (`verify_deployment`)

```yaml
Steps:
1. Wait 30 seconds for stabilization
2. Check Frontend health (HTTP 200)
3. Check Backend health (HTTP 200)
4. Display deployment summary
```

## Environment Variables

### Frontend (Build Time)

Set in GitHub Actions workflow:

```yaml
VITE_API_URL: https://9vectors-api.azurewebsites.net
VITE_STRIPE_PUBLISHABLE_KEY: ${{ secrets.VITE_STRIPE_PUBLISHABLE_KEY }}
VITE_AUTH0_DOMAIN: ${{ secrets.VITE_AUTH0_DOMAIN }}
VITE_AUTH0_CLIENT_ID: ${{ secrets.VITE_AUTH0_CLIENT_ID }}
VITE_AUTH0_AUDIENCE: ${{ secrets.VITE_AUTH0_AUDIENCE }}
VITE_ENV: production
```

### Backend (Runtime)

Set in Azure Function App:

```bash
COSMOS_ENDPOINT=<from-deployment-script>
COSMOS_KEY=<from-deployment-script>
COSMOS_DATABASE=9vectors
COSMOS_CONTAINER_USERS=users
COSMOS_CONTAINER_ORGANIZATIONS=organizations
COSMOS_CONTAINER_ASSESSMENTS=assessments
NODE_ENV=production
JWT_SECRET=<auto-generated>
FRONTEND_URL=https://9vectors-web.azurestaticapps.net
PRODUCTION_URL=https://www.9vectors.com
```

## Troubleshooting

### Issue: Deployment Fails

**Check:**
1. GitHub Actions logs
2. Azure Portal deployment center
3. Function App logs

**Common fixes:**
- Verify all secrets are set
- Check package.json syntax
- Ensure dependencies are compatible with Node 20

### Issue: Backend Returns 500

**Check:**
```bash
az functionapp log tail --name 9vectors-api --resource-group Snapshot9
```

**Common fixes:**
- Verify Cosmos DB connection strings
- Check environment variables
- Restart Function App

### Issue: CORS Errors

**Fix:**
```bash
# Update CORS in functions/httpTrigger.js
# Or add in Azure Portal:
az functionapp cors add \
  --name 9vectors-api \
  --resource-group Snapshot9 \
  --allowed-origins "https://9vectors-web.azurestaticapps.net"
```

## Scaling

### Vertical Scaling (Upgrade Instance Size)

```bash
# Upgrade to S1 (staging slots + better performance)
az appservice plan update \
  --name 9vectors-plan \
  --resource-group Snapshot9 \
  --sku S1

# Upgrade to P1V2 (premium, 2x resources)
az appservice plan update \
  --name 9vectors-plan \
  --resource-group Snapshot9 \
  --sku P1V2
```

### Horizontal Scaling (Add More Instances)

```bash
# Manual scaling
az appservice plan update \
  --name 9vectors-plan \
  --resource-group Snapshot9 \
  --number-of-workers 3

# Auto-scaling (S1 tier or higher)
az monitor autoscale create \
  --resource-group Snapshot9 \
  --resource 9vectors-plan \
  --resource-type Microsoft.Web/serverFarms \
  --name autoscale-9vectors \
  --min-count 1 \
  --max-count 10 \
  --count 2
```

### Database Scaling

```bash
# Increase Cosmos DB throughput
az cosmosdb sql database throughput update \
  --account-name 9vectors-cosmos \
  --resource-group Snapshot9 \
  --name 9vectors \
  --throughput 1000
```

## Next Steps

### Immediate (Day 1)
- [x] Run `./deploy-full-infrastructure.sh`
- [x] Run `./setup-secrets.sh`
- [ ] Push to main branch
- [ ] Verify deployment
- [ ] Test all API endpoints

### Short Term (Week 1)
- [ ] Configure custom domain
- [ ] Set up Application Insights
- [ ] Configure alerts
- [ ] Test load and performance
- [ ] Document API endpoints

### Long Term (Month 1)
- [ ] Implement staged deployments
- [ ] Set up automated testing in pipeline
- [ ] Configure backup strategy
- [ ] Implement monitoring dashboard
- [ ] Optimize Cosmos DB queries

## Resources

### Documentation
- [DEPLOYMENT_GUIDE.md](./.azure/DEPLOYMENT_GUIDE.md) - Complete guide
- [Azure Functions Docs](https://docs.microsoft.com/azure/azure-functions/)
- [Static Web Apps Docs](https://docs.microsoft.com/azure/static-web-apps/)
- [Cosmos DB Docs](https://docs.microsoft.com/azure/cosmos-db/)

### Tools
- [Azure Portal](https://portal.azure.com)
- [GitHub Actions](https://github.com/millere-alt/9lenses-saas/actions)
- [Application Insights](https://portal.azure.com) (after setup)

### Support
- Azure Support: Azure Portal → Support + Help
- GitHub Issues: Repository issues tab
- Azure CLI Help: `az functionapp --help`

---

**Created:** October 2025
**Last Updated:** October 2025
**Status:** ✅ Ready for Deployment
**Version:** 1.0
