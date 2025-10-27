# 9Vectors Production Setup Guide

## ✅ Completed Configuration

### Azure Infrastructure
- **Resource Group**: 9vectors-rg
- **Region**: East US 2

#### Frontend (Azure Static Web Apps)
- **Name**: 9vectors-app
- **Default URL**: https://agreeable-bush-03cb6a40f.2.azurestaticapps.net
- **Custom Domains**:
  - 9vectors.com ✅
  - www.9vectors.com ✅
  - 9vectors.ai ✅
  - www.9vectors.ai ✅
- **SSL**: Automatically managed by Azure ✅

#### Backend API (Azure Functions)
- **Name**: 9vectors-api
- **URL**: https://9vectors-api.azurewebsites.net/api
- **Runtime**: Node.js 20
- **Plan**: Flex Consumption
- **Health Endpoint**: https://9vectors-api.azurewebsites.net/api/health

#### Database (Azure Cosmos DB)
- **Account**: snapshot9-cosmos
- **Endpoint**: https://snapshot9-cosmos.documents.azure.com:443/
- **Database**: 9vectors
- **Containers**:
  - users (partitioned by /organizationId) ✅
  - organizations (partitioned by /id) ✅
  - assessments (partitioned by /organizationId) ✅
  - invitations (partitioned by /organizationId) ✅
  - benchmarks (partitioned by /id) ✅

#### Storage
- **Account**: 9vectorsstorage
- **Purpose**: Azure Functions backend storage

### GitHub Secrets (Configured) ✅
- `AZURE_CREDENTIALS` ✅
- `AZURE_STATIC_WEB_APPS_API_TOKEN` ✅
- `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` ✅
- `VITE_AUTH0_DOMAIN` ✅
- `VITE_AUTH0_CLIENT_ID` ✅
- `VITE_AUTH0_AUDIENCE` ✅
- `VITE_STRIPE_PUBLIC_KEY` ✅
- `VITE_STRIPE_PUBLISHABLE_KEY` ✅

### Azure Function App Settings (Configured) ✅
- `COSMOS_ENDPOINT` ✅
- `COSMOS_KEY` ✅
- `COSMOS_DATABASE=9vectors` ✅
- `COSMOS_CONTAINER_USERS=users` ✅
- `COSMOS_CONTAINER_ORGANIZATIONS=organizations` ✅
- `COSMOS_CONTAINER_ASSESSMENTS=assessments` ✅
- `COSMOS_CONTAINER_INVITATIONS=invitations` ✅
- `COSMOS_CONTAINER_BENCHMARKS=benchmarks` ✅
- `NODE_ENV=production` ✅
- `FRONTEND_URL=https://www.9vectors.com` ✅
- `PRODUCTION_URL=https://www.9vectors.com` ✅
- `ANTHROPIC_API_KEY=sk-ant-PLACEHOLDER-replace-with-real-key` ⚠️ **NEEDS UPDATE**

## ⚠️ Required Actions

### 1. Update Anthropic API Key
The backend AI features require a valid Anthropic API key.

```bash
# Replace with your actual Anthropic API key
az functionapp config appsettings set \
  --name snapshot9-functions-flex \
  --resource-group Snapshot9 \
  --settings "ANTHROPIC_API_KEY=sk-ant-YOUR-ACTUAL-KEY-HERE"
```

**Where to get the key:**
1. Go to https://console.anthropic.com/
2. Navigate to API Keys
3. Copy your key
4. Run the command above

### 2. Configure 9vectors.com Domain (Optional)
If you want to use 9vectors.com instead of snapshot9.com:

```bash
# Add custom domain to Static Web App
az staticwebapp hostname set \
  --name snapshot9-saas \
  --resource-group Snapshot9 \
  --hostname www.9vectors.com

# Get DNS validation records
az staticwebapp hostname show \
  --name snapshot9-saas \
  --resource-group Snapshot9 \
  --hostname www.9vectors.com
```

Then add the TXT and CNAME records to your DNS provider.

### 3. Configure Auth0 Production Settings
Update Auth0 dashboard (https://manage.auth0.com/) with production URLs:

**Allowed Callback URLs:**
```
https://www.snapshot9.com/callback
https://red-sand-0b83aa50f.1.azurestaticapps.net/callback
```

**Allowed Logout URLs:**
```
https://www.snapshot9.com
https://red-sand-0b83aa50f.1.azurestaticapps.net
```

**Allowed Web Origins:**
```
https://www.snapshot9.com
https://red-sand-0b83aa50f.1.azurestaticapps.net
```

### 4. Configure Stripe Production Keys
Currently using test keys. For production payments:

1. Get production keys from https://dashboard.stripe.com/apikeys
2. Update GitHub secrets:

```bash
gh secret set VITE_STRIPE_PUBLISHABLE_KEY -b "pk_live_YOUR_KEY_HERE"
```

3. Update backend Stripe secret key in Azure Function App:

```bash
az functionapp config appsettings set \
  --name snapshot9-functions-flex \
  --resource-group Snapshot9 \
  --settings "STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE"
```

## 🚀 Deployment

### Automatic Deployment (GitHub Actions)
Every push to `main` branch triggers automatic deployment:
1. Frontend builds and deploys to Azure Static Web Apps
2. Backend packages and deploys to Azure Functions
3. Health checks verify both services

**Monitor deployments:**
https://github.com/millere-alt/9lenses-saas/actions

### Manual Deployment
Trigger manual deployment:

```bash
gh workflow run "Deploy 9Vectors to Azure (Full Stack)" --ref main
```

## 🧪 Testing

### Health Checks
```bash
# Test backend health
curl https://snapshot9-functions-flex.azurewebsites.net/health

# Expected response:
# {"status":"ok","timestamp":"...","service":"9Vectors API"}
```

### Test AI Endpoints (requires valid ANTHROPIC_API_KEY)
```bash
# Test AI coaching
curl -X POST https://snapshot9-functions-flex.azurewebsites.net/api/ai/coach \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{"context":{"workflow":"assessment"},"mode":"coaching"}'
```

### Frontend Testing
Visit: https://www.snapshot9.com

## 📊 Monitoring

### Azure Portal
- View logs: https://portal.azure.com → Snapshot9 resource group
- Function App logs: Monitor → Log stream
- Static Web App: Monitor → Metrics

### Application Insights (Optional Enhancement)
To add detailed monitoring:

```bash
# Create Application Insights
az monitor app-insights component create \
  --app 9vectors-insights \
  --location eastus \
  --resource-group Snapshot9 \
  --application-type web

# Get instrumentation key and add to Function App
INSIGHTS_KEY=$(az monitor app-insights component show \
  --app 9vectors-insights \
  --resource-group Snapshot9 \
  --query instrumentationKey -o tsv)

az functionapp config appsettings set \
  --name snapshot9-functions-flex \
  --resource-group Snapshot9 \
  --settings "APPINSIGHTS_INSTRUMENTATIONKEY=$INSIGHTS_KEY"
```

## 🔒 Security Checklist

- ✅ API keys secured on backend only
- ✅ HTTPS enforced
- ✅ CORS configured for production domains
- ✅ Rate limiting enabled (15 min window, 100 requests)
- ✅ Helmet security headers
- ✅ Request sanitization
- ✅ SQL injection protection (Cosmos DB parameterized queries)
- ✅ File upload validation (type, size)
- ✅ Error handling without exposing internals
- ⚠️ CSRF protection (TODO: implement tokens)
- ⚠️ Auth0 JWT validation (TODO: verify in middleware)

## 📈 Scaling

### Current Tier: B1 (Basic)
- 1.75 GB RAM
- 1 vCPU
- ~$13/month

### Upgrade for production load:
```bash
# Upgrade to S1 (includes staging slots)
az appservice plan update \
  --name ASP-Snapshot9-a096 \
  --resource-group Snapshot9 \
  --sku S1

# Or scale to premium for better performance
az appservice plan update \
  --name ASP-Snapshot9-a096 \
  --resource-group Snapshot9 \
  --sku P1V2
```

## 🆘 Troubleshooting

### Deployment Fails
1. Check GitHub Actions logs
2. Verify all secrets are set
3. Check Azure resource status in portal

### Backend Returns 500
1. Check Function App logs
2. Verify Cosmos DB connection
3. Check ANTHROPIC_API_KEY is valid

### Frontend Shows Errors
1. Check browser console
2. Verify API_URL points to backend
3. Check CORS settings

## 📝 Next Steps

1. **Update ANTHROPIC_API_KEY** with real key ⚠️
2. Test AI coaching features
3. Configure production Stripe keys
4. Set up monitoring alerts
5. Enable Application Insights
6. Add CSRF protection
7. Implement rate limiting per user
8. Set up automated backups for Cosmos DB
9. Configure CDN for static assets
10. Set up staging environment

## 🔗 Quick Links

- **Production Site**: https://www.snapshot9.com
- **API Base URL**: https://snapshot9-functions-flex.azurewebsites.net/api
- **Azure Portal**: https://portal.azure.com
- **GitHub Actions**: https://github.com/millere-alt/9lenses-saas/actions
- **Auth0 Dashboard**: https://manage.auth0.com/
- **Stripe Dashboard**: https://dashboard.stripe.com/

---

**Last Updated**: 2025-10-22
**Status**: Production Ready (pending Anthropic API key update)
