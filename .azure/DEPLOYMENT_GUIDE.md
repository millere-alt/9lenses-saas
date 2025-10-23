# 9Vectors Deployment Guide

Complete guide for deploying the 9Vectors SaaS platform to production on Azure.

## Overview

The 9Vectors platform consists of:
- **Frontend**: React SPA hosted on Azure Static Web Apps
- **Backend**: Node.js API running on Azure Functions
- **Database**: Azure Cosmos DB (NoSQL)
- **Storage**: Azure Blob Storage (for document uploads)
- **Email**: Azure Communication Services
- **CI/CD**: GitHub Actions

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Azure Setup](#initial-azure-setup)
3. [GitHub Repository Configuration](#github-repository-configuration)
4. [First-Time Deployment](#first-time-deployment)
5. [Continuous Deployment](#continuous-deployment)
6. [Environment Configuration](#environment-configuration)
7. [DNS and Custom Domains](#dns-and-custom-domains)
8. [Monitoring and Troubleshooting](#monitoring-and-troubleshooting)
9. [Rollback Procedures](#rollback-procedures)
10. [Security Checklist](#security-checklist)

## Prerequisites

### Required Tools

- **Azure CLI** (v2.50+): [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli)
- **GitHub CLI** (v2.30+): [Install GitHub CLI](https://cli.github.com/)
- **Node.js** (v20+): [Install Node.js](https://nodejs.org/)
- **Git**: [Install Git](https://git-scm.com/)

Verify installations:
```bash
az --version        # Should show 2.50+
gh --version        # Should show 2.30+
node --version      # Should show v20+
git --version       # Should show 2.30+
```

### Required Access

- **Azure Subscription**: Contributor or Owner role
- **GitHub Repository**: Admin access
- **Domain Registrar**: DNS management access (for custom domains)
- **Auth0 Account**: Admin access (for authentication)
- **Stripe Account**: Admin access (for payments)
- **Anthropic Account**: API access (for AI features)

### Authentication Setup

```bash
# Login to Azure CLI
az login

# Set default subscription
az account set --subscription "Your Subscription Name"

# Verify current account
az account show

# Login to GitHub CLI
gh auth login

# Verify GitHub authentication
gh auth status
```

## Initial Azure Setup

### Step 1: Create Resource Group

```bash
# Create resource group in your preferred region
az group create \
  --name 9vectors-rg \
  --location eastus

# Verify creation
az group show --name 9vectors-rg
```

### Step 2: Create Azure Cosmos DB

```bash
# Create Cosmos DB account
az cosmosdb create \
  --name 9vectors-cosmos \
  --resource-group 9vectors-rg \
  --locations regionName=eastus failoverPriority=0 \
  --default-consistency-level Session \
  --enable-automatic-failover true

# Create database
az cosmosdb sql database create \
  --account-name 9vectors-cosmos \
  --resource-group 9vectors-rg \
  --name 9vectors

# Create main container (assessments)
az cosmosdb sql container create \
  --account-name 9vectors-cosmos \
  --resource-group 9vectors-rg \
  --database-name 9vectors \
  --name assessments \
  --partition-key-path "/organizationId" \
  --throughput 400

# Create additional containers
for container in users organizations invitations benchmarks; do
  az cosmosdb sql container create \
    --account-name 9vectors-cosmos \
    --resource-group 9vectors-rg \
    --database-name 9vectors \
    --name $container \
    --partition-key-path "/organizationId" \
    --throughput 400
done

# Get connection details (save these for later)
az cosmosdb show \
  --name 9vectors-cosmos \
  --resource-group 9vectors-rg \
  --query "documentEndpoint" -o tsv

az cosmosdb keys list \
  --name 9vectors-cosmos \
  --resource-group 9vectors-rg \
  --query "primaryMasterKey" -o tsv
```

### Step 3: Create Azure Static Web App

```bash
# Create Static Web App (frontend)
az staticwebapp create \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --location eastus2 \
  --sku Standard \
  --source https://github.com/YOUR-USERNAME/9lenses-saas \
  --branch main \
  --app-location "/" \
  --output-location "dist" \
  --login-with-github

# Get deployment token
az staticwebapp secrets list \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --query "properties.apiKey" -o tsv
```

Save the deployment token - you'll need it for GitHub secrets.

### Step 4: Create Azure Function App

```bash
# Create storage account for Function App
az storage account create \
  --name 9vectorsstorage \
  --resource-group 9vectors-rg \
  --location eastus \
  --sku Standard_LRS

# Create Function App
az functionapp create \
  --name 9vectors-api \
  --resource-group 9vectors-rg \
  --storage-account 9vectorsstorage \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --os-type Linux

# Get publish profile
az functionapp deployment list-publishing-profiles \
  --name 9vectors-api \
  --resource-group 9vectors-rg \
  --xml
```

Save the publish profile - you'll need it for GitHub secrets.

### Step 5: Create Azure Communication Services

```bash
# Create Communication Services resource
az communication create \
  --name 9vectors-communication \
  --resource-group 9vectors-rg \
  --location global \
  --data-location UnitedStates

# Get connection string
az communication list-key \
  --name 9vectors-communication \
  --resource-group 9vectors-rg \
  --query "primaryConnectionString" -o tsv
```

### Step 6: Create Azure Blob Storage (for documents)

```bash
# Create storage account for documents
az storage account create \
  --name 9vectorsdocs \
  --resource-group 9vectors-rg \
  --location eastus \
  --sku Standard_LRS \
  --allow-blob-public-access false

# Create container for document uploads
az storage container create \
  --name documents \
  --account-name 9vectorsdocs \
  --public-access off

# Get connection string
az storage account show-connection-string \
  --name 9vectorsdocs \
  --resource-group 9vectors-rg \
  --query "connectionString" -o tsv
```

## GitHub Repository Configuration

### Step 1: Create Service Principal for GitHub Actions

```bash
# Run the automated setup script
cd .azure
./setup-azure-credentials.sh

# This creates a service principal and saves credentials to:
# .azure/azure-credentials.json
```

**Manual creation** (if script fails):
```bash
# Get subscription ID
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

# Create service principal
az ad sp create-for-rbac \
  --name "9vectors-github-actions" \
  --role contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/9vectors-rg \
  --sdk-auth

# Save the output JSON to .azure/azure-credentials.json
```

### Step 2: Configure GitHub Secrets

Use the automated secrets setup script:

```bash
cd .azure
./setup-github-secrets.sh

# For dry-run (preview only):
./setup-github-secrets.sh --dry-run

# To skip confirmation prompt:
./setup-github-secrets.sh --skip-confirmation
```

**Manual configuration** (if script fails):

See [GITHUB_SECRETS.md](.azure/GITHUB_SECRETS.md) for complete list of required secrets.

Minimum required secrets:
```bash
# Azure deployment credentials
gh secret set AZURE_CREDENTIALS < .azure/azure-credentials.json
gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --body "<token-from-step-3>"
gh secret set AZURE_FUNCTIONAPP_PUBLISH_PROFILE --body "<profile-from-step-4>"

# Database
gh secret set COSMOS_ENDPOINT --body "<endpoint-from-step-2>"
gh secret set COSMOS_KEY --body "<key-from-step-2>"
gh secret set COSMOS_DATABASE --body "9vectors"
gh secret set COSMOS_CONTAINER --body "assessments"

# Frontend URLs
gh secret set VITE_API_URL --body "https://9vectors-api.azurewebsites.net/api"

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 64)
gh secret set JWT_SECRET --body "$JWT_SECRET"
```

For all other secrets, see [GITHUB_SECRETS.md](.azure/GITHUB_SECRETS.md).

### Step 3: Verify GitHub Actions Workflows

Ensure the following workflow files exist:
- `.github/workflows/deploy-frontend.yml`
- `.github/workflows/deploy-backend.yml`

Check workflows are valid:
```bash
# View workflow files
cat .github/workflows/deploy-frontend.yml
cat .github/workflows/deploy-backend.yml

# Verify GitHub recognizes workflows
gh workflow list
```

## First-Time Deployment

### Step 1: Deploy Backend First

```bash
# Trigger backend deployment manually
gh workflow run deploy-backend.yml

# Monitor deployment
gh run list --workflow=deploy-backend.yml
gh run view <run-id> --log
```

Wait for backend deployment to complete before deploying frontend.

### Step 2: Configure Backend Environment Variables

```bash
# Set Function App application settings
az functionapp config appsettings set \
  --name 9vectors-api \
  --resource-group 9vectors-rg \
  --settings \
    NODE_ENV=production \
    COSMOS_ENDPOINT="<your-endpoint>" \
    COSMOS_KEY="<your-key>" \
    COSMOS_DATABASE=9vectors \
    COSMOS_CONTAINER=assessments \
    JWT_SECRET="<your-jwt-secret>" \
    AUTH0_DOMAIN="<your-auth0-domain>" \
    AUTH0_AUDIENCE="<your-auth0-audience>" \
    FRONTEND_URL="https://www.9vectors.com"

# Verify settings
az functionapp config appsettings list \
  --name 9vectors-api \
  --resource-group 9vectors-rg
```

### Step 3: Deploy Frontend

```bash
# Trigger frontend deployment manually
gh workflow run deploy-frontend.yml

# Monitor deployment
gh run list --workflow=deploy-frontend.yml
gh run view <run-id> --log
```

### Step 4: Verify Deployment

```bash
# Check frontend
curl -I https://9vectors-app.azurestaticapps.net
# Should return HTTP/2 200

# Check backend
curl https://9vectors-api.azurewebsites.net/api/health
# Should return {"status":"healthy"}
```

### Step 5: Test End-to-End

1. Open browser to `https://9vectors-app.azurestaticapps.net`
2. Open DevTools → Network tab
3. Register a new user account
4. Create a test assessment
5. Verify API calls succeed
6. Check Cosmos DB for created records:
   ```bash
   # Using Azure CLI
   az cosmosdb sql container show \
     --account-name 9vectors-cosmos \
     --resource-group 9vectors-rg \
     --database-name 9vectors \
     --name users
   ```

## Continuous Deployment

Once initial setup is complete, deployments happen automatically via GitHub Actions.

### Automatic Deployment Triggers

**Frontend** (`.github/workflows/deploy-frontend.yml`):
- Triggers on push to `main` branch when frontend files change:
  - `src/**`
  - `public/**`
  - `index.html`
  - `vite.config.js`
  - `package.json`
- Also triggers on pull request open/update/close
- Manual trigger via `workflow_dispatch`

**Backend** (`.github/workflows/deploy-backend.yml`):
- Triggers on push to `main` branch when backend files change:
  - `api/**`
- Manual trigger via `workflow_dispatch`

### Manual Deployment

Trigger deployments manually from CLI:

```bash
# Deploy frontend
gh workflow run deploy-frontend.yml

# Deploy backend
gh workflow run deploy-backend.yml

# Deploy both (separate commands)
gh workflow run deploy-frontend.yml && gh workflow run deploy-backend.yml
```

Or from GitHub web interface:
1. Go to repository → Actions
2. Select workflow (Deploy Frontend or Deploy Backend)
3. Click "Run workflow"
4. Select branch `main`
5. Click "Run workflow"

### Viewing Deployment Status

```bash
# List recent workflow runs
gh run list

# View specific run
gh run view <run-id>

# View logs
gh run view <run-id> --log

# Watch live logs
gh run watch <run-id>
```

### Deployment Notifications

Set up Slack/email notifications for deployment status:

1. Go to repository → Settings → Webhooks
2. Add webhook URL (Slack webhook or custom endpoint)
3. Select events: Workflow runs
4. Save webhook

## Environment Configuration

### Production Environment Variables

All production environment variables are stored as:
1. **GitHub Secrets**: For CI/CD workflows
2. **Azure Function App Settings**: For backend runtime
3. **Build-time variables**: Embedded in frontend build

### Frontend Environment Variables

Updated via GitHub secrets (prefix with `VITE_`):
- `VITE_API_URL`
- `VITE_AUTH0_DOMAIN`
- `VITE_AUTH0_CLIENT_ID`
- `VITE_AUTH0_AUDIENCE`
- `VITE_ANTHROPIC_API_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- (See [GITHUB_SECRETS.md](.azure/GITHUB_SECRETS.md) for complete list)

### Backend Environment Variables

Updated via Azure Function App settings:
```bash
# Update single setting
az functionapp config appsettings set \
  --name 9vectors-api \
  --resource-group 9vectors-rg \
  --settings SETTING_NAME=value

# Update multiple settings
az functionapp config appsettings set \
  --name 9vectors-api \
  --resource-group 9vectors-rg \
  --settings \
    SETTING1=value1 \
    SETTING2=value2

# Delete setting
az functionapp config appsettings delete \
  --name 9vectors-api \
  --resource-group 9vectors-rg \
  --setting-names SETTING_NAME
```

### Updating Secrets

```bash
# Update GitHub secret
gh secret set SECRET_NAME --body "new-value"

# Update multiple secrets from file
gh secret set SECRET_NAME < secret-file.txt

# List all secrets (values are hidden)
gh secret list

# Delete secret
gh secret delete SECRET_NAME
```

## DNS and Custom Domains

See [DNS_SETUP.md](.azure/DNS_SETUP.md) for complete DNS configuration guide.

**Quick setup**:
1. Configure DNS records at your registrar
2. Add custom domain to Azure Static Web App
3. Add custom domain to Azure Function App
4. Update environment variables with production URLs
5. Verify HTTPS/SSL certificates

## Monitoring and Troubleshooting

### Azure Monitor Setup

```bash
# Enable Application Insights for Function App
az monitor app-insights component create \
  --app 9vectors-insights \
  --resource-group 9vectors-rg \
  --location eastus

# Link to Function App
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
  --app 9vectors-insights \
  --resource-group 9vectors-rg \
  --query instrumentationKey -o tsv)

az functionapp config appsettings set \
  --name 9vectors-api \
  --resource-group 9vectors-rg \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=$INSTRUMENTATION_KEY
```

### Viewing Logs

**Frontend logs**:
```bash
# Via Azure Portal
# Navigate to: Static Web App → Monitoring → Logs

# Via CLI (limited)
az staticwebapp show \
  --name 9vectors-app \
  --resource-group 9vectors-rg
```

**Backend logs**:
```bash
# Stream live logs
az webapp log tail \
  --name 9vectors-api \
  --resource-group 9vectors-rg

# Download logs
az webapp log download \
  --name 9vectors-api \
  --resource-group 9vectors-rg \
  --log-file backend-logs.zip
```

### Common Issues

#### Deployment Fails with "Unauthorized"
**Cause**: GitHub Actions doesn't have permissions.

**Solution**:
```bash
# Verify service principal credentials
cat .azure/azure-credentials.json

# Re-create service principal
./setup-azure-credentials.sh
gh secret set AZURE_CREDENTIALS < .azure/azure-credentials.json
```

#### Frontend Build Fails
**Cause**: Missing environment variables or build errors.

**Solution**:
```bash
# Test build locally
npm run build

# Check GitHub secrets
gh secret list

# View workflow logs
gh run view <run-id> --log
```

#### Backend Functions Not Working
**Cause**: Missing environment variables or configuration.

**Solution**:
```bash
# Check Function App settings
az functionapp config appsettings list \
  --name 9vectors-api \
  --resource-group 9vectors-rg

# Restart Function App
az functionapp restart \
  --name 9vectors-api \
  --resource-group 9vectors-rg

# Check logs
az webapp log tail --name 9vectors-api --resource-group 9vectors-rg
```

#### Database Connection Fails
**Cause**: Incorrect Cosmos DB credentials or firewall rules.

**Solution**:
```bash
# Verify Cosmos DB is accessible
az cosmosdb show --name 9vectors-cosmos --resource-group 9vectors-rg

# Check firewall rules
az cosmosdb firewall list --name 9vectors-cosmos --resource-group 9vectors-rg

# Allow Azure services
az cosmosdb update \
  --name 9vectors-cosmos \
  --resource-group 9vectors-rg \
  --enable-virtual-network true
```

## Rollback Procedures

### Rolling Back Frontend

```bash
# List recent deployments
gh api repos/:owner/:repo/deployments | jq -r '.[] | "\(.id) \(.ref) \(.created_at)"'

# Revert to previous commit
git revert HEAD
git push origin main

# Or redeploy specific commit
git checkout <commit-hash>
git push -f origin HEAD:rollback-branch
gh workflow run deploy-frontend.yml --ref rollback-branch
```

### Rolling Back Backend

```bash
# List deployment history
az functionapp deployment list-publishing-profiles \
  --name 9vectors-api \
  --resource-group 9vectors-rg

# Swap to previous slot (if using slots)
az functionapp deployment slot swap \
  --name 9vectors-api \
  --resource-group 9vectors-rg \
  --slot staging

# Or redeploy previous version
git checkout <commit-hash>
gh workflow run deploy-backend.yml
```

### Emergency Rollback

If deployment causes critical issues:

```bash
# Stop Function App
az functionapp stop --name 9vectors-api --resource-group 9vectors-rg

# Investigate issue
az webapp log tail --name 9vectors-api --resource-group 9vectors-rg

# Fix and restart
az functionapp start --name 9vectors-api --resource-group 9vectors-rg
```

## Security Checklist

Before going to production, verify:

### Azure Security

- [ ] Enable Azure AD authentication for Azure Portal access
- [ ] Configure Cosmos DB firewall rules (allow only Azure services + your IPs)
- [ ] Enable soft delete for Cosmos DB
- [ ] Rotate all service principal credentials
- [ ] Enable Azure Security Center recommendations
- [ ] Configure diagnostic logs for all resources
- [ ] Enable Azure DDoS Protection (if budget allows)

### Application Security

- [ ] All secrets stored in GitHub Secrets and Azure Key Vault (not in code)
- [ ] HTTPS enforced for all endpoints (HTTP redirects to HTTPS)
- [ ] CORS configured with specific allowed origins (no wildcards)
- [ ] Content Security Policy headers configured
- [ ] Rate limiting enabled on API endpoints
- [ ] Input validation on all API endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding)
- [ ] CSRF protection for state-changing operations

### Authentication & Authorization

- [ ] Auth0 production tenant configured
- [ ] JWT secret is strong and rotated regularly
- [ ] Token expiration configured (e.g., 1 hour)
- [ ] Refresh token rotation enabled
- [ ] Multi-factor authentication available
- [ ] Password strength requirements enforced
- [ ] Account lockout after failed login attempts

### Data Security

- [ ] Cosmos DB encryption at rest enabled (default)
- [ ] TLS 1.2+ enforced for all connections
- [ ] Partition keys properly configured for multi-tenancy
- [ ] Sensitive data encrypted in database
- [ ] Backup and disaster recovery configured
- [ ] Data retention policies defined
- [ ] GDPR compliance verified (if applicable)

### Monitoring & Alerts

- [ ] Application Insights configured
- [ ] Log aggregation set up
- [ ] Error alerts configured (email/Slack)
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring configured
- [ ] Cost alerts set up
- [ ] Security alerts enabled (Azure Security Center)

## Next Steps

After successful deployment:

1. **Configure Custom Domains**: See [DNS_SETUP.md](.azure/DNS_SETUP.md)
2. **Set Up Monitoring**: Configure Application Insights dashboards
3. **Load Testing**: Test application under realistic load
4. **Disaster Recovery**: Document and test backup/restore procedures
5. **Documentation**: Update team documentation with production URLs
6. **User Training**: Train team on production environment
7. **Marketing**: Update marketing site with production links

## Related Documentation

- [GitHub Secrets Setup](GITHUB_SECRETS.md)
- [DNS Configuration](DNS_SETUP.md)
- [Azure Architecture](../docs/README_ARCHITECTURE.md)
- [Credentials Setup](../docs/README_CREDENTIALS_SETUP.md)

## Support

For deployment issues:
1. Check workflow logs: `gh run view <run-id> --log`
2. Check Azure logs: `az webapp log tail --name 9vectors-api --resource-group 9vectors-rg`
3. Review this guide and related documentation
4. Check Azure Service Health for outages
5. Contact Azure support if needed

---

Last Updated: 2025-10-23
