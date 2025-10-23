# GitHub Secrets Configuration

This document lists all required GitHub repository secrets for automated deployment of the 9Vectors SaaS platform.

## Quick Setup

Use the automated setup script to load all secrets from Azure:

```bash
cd .azure
./setup-github-secrets.sh
```

For manual configuration or troubleshooting, see the sections below.

## Required Secrets

### Azure Deployment Credentials

#### `AZURE_CREDENTIALS`
Service principal credentials for Azure CLI operations.

**Format**:
```json
{
  "clientId": "<service-principal-client-id>",
  "clientSecret": "<service-principal-secret>",
  "subscriptionId": "<azure-subscription-id>",
  "tenantId": "<azure-tenant-id>"
}
```

**How to obtain**:
```bash
# Create service principal with contributor access
az ad sp create-for-rbac \
  --name "9vectors-github-actions" \
  --role contributor \
  --scopes /subscriptions/<subscription-id>/resourceGroups/9vectors-rg \
  --sdk-auth

# Output will be the JSON to paste into GitHub secret
```

**Set via GitHub CLI**:
```bash
gh secret set AZURE_CREDENTIALS < azure-credentials.json
```

#### `AZURE_STATIC_WEB_APPS_API_TOKEN`
Deployment token for Azure Static Web Apps.

**How to obtain**:
```bash
# Via Azure CLI
az staticwebapp secrets list \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --query "properties.apiKey" -o tsv

# Via Azure Portal
# Navigate to: Static Web App → Settings → Deployment tokens → Manage deployment token
```

**Set via GitHub CLI**:
```bash
TOKEN=$(az staticwebapp secrets list --name 9vectors-app --resource-group 9vectors-rg --query "properties.apiKey" -o tsv)
gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --body "$TOKEN"
```

#### `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`
Publish profile for Azure Functions deployment.

**How to obtain**:
```bash
# Via Azure CLI
az functionapp deployment list-publishing-profiles \
  --name 9vectors-api \
  --resource-group 9vectors-rg \
  --xml

# Via Azure Portal
# Navigate to: Function App → Deployment → Deployment Center → Manage publish profile → Download
```

**Set via GitHub CLI**:
```bash
az functionapp deployment list-publishing-profiles \
  --name 9vectors-api \
  --resource-group 9vectors-rg \
  --xml | gh secret set AZURE_FUNCTIONAPP_PUBLISH_PROFILE
```

---

### Frontend Environment Variables

All frontend secrets use the `VITE_` prefix and are embedded in the frontend build.

#### `VITE_API_URL`
Backend API base URL.

**Value**: `https://9vectors-api.azurewebsites.net/api`

**Set via GitHub CLI**:
```bash
gh secret set VITE_API_URL --body "https://9vectors-api.azurewebsites.net/api"
```

#### `VITE_AUTH0_DOMAIN`
Auth0 tenant domain.

**Example**: `9vectors.us.auth0.com`

**How to obtain**: Auth0 Dashboard → Applications → 9Vectors SPA → Settings → Domain

**Set via GitHub CLI**:
```bash
gh secret set VITE_AUTH0_DOMAIN --body "9vectors.us.auth0.com"
```

#### `VITE_AUTH0_CLIENT_ID`
Auth0 application client ID.

**How to obtain**: Auth0 Dashboard → Applications → 9Vectors SPA → Settings → Client ID

**Set via GitHub CLI**:
```bash
gh secret set VITE_AUTH0_CLIENT_ID --body "your-auth0-client-id"
```

#### `VITE_AUTH0_AUDIENCE`
Auth0 API audience identifier.

**Example**: `https://api.9vectors.com`

**How to obtain**: Auth0 Dashboard → Applications → APIs → 9Vectors API → Settings → Identifier

**Set via GitHub CLI**:
```bash
gh secret set VITE_AUTH0_AUDIENCE --body "https://api.9vectors.com"
```

#### `VITE_AZURE_AD_B2C_TENANT_NAME`
Azure AD B2C tenant name.

**Value**: `9vectors`

**Set via GitHub CLI**:
```bash
gh secret set VITE_AZURE_AD_B2C_TENANT_NAME --body "9vectors"
```

#### `VITE_AZURE_AD_B2C_CLIENT_ID`
Azure AD B2C application client ID.

**How to obtain**: Azure Portal → Azure AD B2C → App registrations → 9Vectors → Application (client) ID

**Set via GitHub CLI**:
```bash
gh secret set VITE_AZURE_AD_B2C_CLIENT_ID --body "your-b2c-client-id"
```

#### `VITE_AZURE_AD_B2C_SIGN_UP_SIGN_IN_POLICY`
Azure AD B2C sign-up/sign-in user flow name.

**Value**: `B2C_1_signupsignin`

**Set via GitHub CLI**:
```bash
gh secret set VITE_AZURE_AD_B2C_SIGN_UP_SIGN_IN_POLICY --body "B2C_1_signupsignin"
```

#### `VITE_AZURE_AD_B2C_RESET_PASSWORD_POLICY`
Azure AD B2C password reset user flow name.

**Value**: `B2C_1_passwordreset`

**Set via GitHub CLI**:
```bash
gh secret set VITE_AZURE_AD_B2C_RESET_PASSWORD_POLICY --body "B2C_1_passwordreset"
```

#### `VITE_AZURE_AD_B2C_EDIT_PROFILE_POLICY`
Azure AD B2C profile editing user flow name.

**Value**: `B2C_1_profileedit`

**Set via GitHub CLI**:
```bash
gh secret set VITE_AZURE_AD_B2C_EDIT_PROFILE_POLICY --body "B2C_1_profileedit"
```

#### `VITE_ANTHROPIC_API_KEY`
Anthropic Claude API key for AI coaching features.

**How to obtain**: https://console.anthropic.com/settings/keys

**Set via GitHub CLI**:
```bash
gh secret set VITE_ANTHROPIC_API_KEY --body "sk-ant-api03-your-key"
```

#### `VITE_STRIPE_PUBLISHABLE_KEY`
Stripe publishable key for payment processing.

**How to obtain**: Stripe Dashboard → Developers → API keys → Publishable key

**Set via GitHub CLI**:
```bash
gh secret set VITE_STRIPE_PUBLISHABLE_KEY --body "pk_live_your-key"
```

---

### Backend Environment Variables

Backend secrets are set as Azure Function App application settings during deployment.

#### `COSMOS_ENDPOINT`
Azure Cosmos DB endpoint URL.

**How to obtain**:
```bash
az cosmosdb show \
  --name 9vectors-cosmos \
  --resource-group 9vectors-rg \
  --query "documentEndpoint" -o tsv
```

**Set via GitHub CLI**:
```bash
ENDPOINT=$(az cosmosdb show --name 9vectors-cosmos --resource-group 9vectors-rg --query "documentEndpoint" -o tsv)
gh secret set COSMOS_ENDPOINT --body "$ENDPOINT"
```

#### `COSMOS_KEY`
Azure Cosmos DB primary key.

**How to obtain**:
```bash
az cosmosdb keys list \
  --name 9vectors-cosmos \
  --resource-group 9vectors-rg \
  --query "primaryMasterKey" -o tsv
```

**Set via GitHub CLI**:
```bash
KEY=$(az cosmosdb keys list --name 9vectors-cosmos --resource-group 9vectors-rg --query "primaryMasterKey" -o tsv)
gh secret set COSMOS_KEY --body "$KEY"
```

#### `COSMOS_DATABASE`
Cosmos DB database name.

**Value**: `9vectors`

**Set via GitHub CLI**:
```bash
gh secret set COSMOS_DATABASE --body "9vectors"
```

#### `COSMOS_CONTAINER`
Cosmos DB container name.

**Value**: `assessments`

**Set via GitHub CLI**:
```bash
gh secret set COSMOS_CONTAINER --body "assessments"
```

#### `AUTH0_DOMAIN`
Auth0 tenant domain (same as VITE_AUTH0_DOMAIN).

**Set via GitHub CLI**:
```bash
gh secret set AUTH0_DOMAIN --body "9vectors.us.auth0.com"
```

#### `AUTH0_AUDIENCE`
Auth0 API audience (same as VITE_AUTH0_AUDIENCE).

**Set via GitHub CLI**:
```bash
gh secret set AUTH0_AUDIENCE --body "https://api.9vectors.com"
```

#### `JWT_SECRET`
Secret key for JWT token signing.

**How to generate**:
```bash
# Generate secure random secret
openssl rand -base64 64
```

**Set via GitHub CLI**:
```bash
JWT_SECRET=$(openssl rand -base64 64)
gh secret set JWT_SECRET --body "$JWT_SECRET"
```

#### `AZURE_AD_B2C_TENANT_NAME`
Azure AD B2C tenant name (same as frontend).

**Set via GitHub CLI**:
```bash
gh secret set AZURE_AD_B2C_TENANT_NAME --body "9vectors"
```

#### `AZURE_AD_B2C_CLIENT_ID`
Azure AD B2C client ID (same as frontend).

**Set via GitHub CLI**:
```bash
gh secret set AZURE_AD_B2C_CLIENT_ID --body "your-b2c-client-id"
```

#### `AZURE_AD_B2C_CLIENT_SECRET`
Azure AD B2C client secret.

**How to obtain**: Azure Portal → Azure AD B2C → App registrations → 9Vectors → Certificates & secrets

**Set via GitHub CLI**:
```bash
gh secret set AZURE_AD_B2C_CLIENT_SECRET --body "your-b2c-client-secret"
```

#### `AZURE_AD_B2C_POLICY_NAME`
Azure AD B2C policy name.

**Value**: `B2C_1_signupsignin`

**Set via GitHub CLI**:
```bash
gh secret set AZURE_AD_B2C_POLICY_NAME --body "B2C_1_signupsignin"
```

#### `ANTHROPIC_API_KEY`
Anthropic Claude API key (same as frontend).

**Set via GitHub CLI**:
```bash
gh secret set ANTHROPIC_API_KEY --body "sk-ant-api03-your-key"
```

#### `STRIPE_SECRET_KEY`
Stripe secret key for payment processing.

**How to obtain**: Stripe Dashboard → Developers → API keys → Secret key

**Set via GitHub CLI**:
```bash
gh secret set STRIPE_SECRET_KEY --body "sk_live_your-key"
```

#### `STRIPE_WEBHOOK_SECRET`
Stripe webhook signing secret.

**How to obtain**: Stripe Dashboard → Developers → Webhooks → Select endpoint → Signing secret

**Set via GitHub CLI**:
```bash
gh secret set STRIPE_WEBHOOK_SECRET --body "whsec_your-secret"
```

#### `STRIPE_PRICE_STARTER`
Stripe price ID for Starter plan.

**How to obtain**: Stripe Dashboard → Products → Starter → Pricing → Copy price ID

**Set via GitHub CLI**:
```bash
gh secret set STRIPE_PRICE_STARTER --body "price_starter_id"
```

#### `STRIPE_PRICE_PROFESSIONAL`
Stripe price ID for Professional plan.

**Set via GitHub CLI**:
```bash
gh secret set STRIPE_PRICE_PROFESSIONAL --body "price_professional_id"
```

#### `STRIPE_PRICE_ENTERPRISE`
Stripe price ID for Enterprise plan.

**Set via GitHub CLI**:
```bash
gh secret set STRIPE_PRICE_ENTERPRISE --body "price_enterprise_id"
```

#### `AZURE_COMMUNICATION_CONNECTION_STRING`
Azure Communication Services connection string.

**How to obtain**:
```bash
az communication list-key \
  --name 9vectors-communication \
  --resource-group 9vectors-rg \
  --query "primaryConnectionString" -o tsv
```

**Set via GitHub CLI**:
```bash
CONN_STR=$(az communication list-key --name 9vectors-communication --resource-group 9vectors-rg --query "primaryConnectionString" -o tsv)
gh secret set AZURE_COMMUNICATION_CONNECTION_STRING --body "$CONN_STR"
```

#### `AZURE_COMMUNICATION_SENDER_EMAIL`
Email address for sending system emails.

**Value**: `noreply@9vectors.com`

**Set via GitHub CLI**:
```bash
gh secret set AZURE_COMMUNICATION_SENDER_EMAIL --body "noreply@9vectors.com"
```

#### `FRONTEND_URL`
Frontend application URL for email links.

**Value**: `https://www.9vectors.com`

**Set via GitHub CLI**:
```bash
gh secret set FRONTEND_URL --body "https://www.9vectors.com"
```

---

## Verification

After setting all secrets, verify they are configured correctly:

```bash
# List all secrets (values are hidden)
gh secret list

# Expected output should include all secrets listed above
```

## Security Best Practices

1. **Never commit secrets** to version control
2. **Rotate credentials regularly**:
   - JWT_SECRET: Every 90 days
   - Service principal secrets: Every 180 days
   - API keys: Per provider recommendations
3. **Use separate credentials** for production vs. staging environments
4. **Limit service principal permissions** to only required resource groups
5. **Monitor secret access** in Azure Activity Logs and GitHub audit logs
6. **Delete unused secrets** to minimize attack surface

## Troubleshooting

### Secret not found during deployment
- Verify secret name matches exactly (case-sensitive)
- Check secret is set in correct repository
- Ensure workflow has access to repository secrets

### Invalid Azure credentials
- Verify service principal has Contributor role
- Check subscription ID is correct
- Ensure service principal is not expired

### Function App settings not applied
- Verify `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` is valid
- Check Function App name matches workflow
- Ensure deployment completed successfully

### Cosmos DB connection fails
- Verify endpoint URL format: `https://<account>.documents.azure.com:443/`
- Check firewall rules allow GitHub Actions IPs
- Ensure key is the primary master key (not readonly key)

## Related Documentation

- [Setup Azure Credentials Script](.azure/setup-azure-credentials.sh)
- [Automated Secrets Setup](.azure/setup-github-secrets.sh)
- [Deployment Guide](.azure/DEPLOYMENT_GUIDE.md)
- [GitHub Actions Workflow: Frontend](.github/workflows/deploy-frontend.yml)
- [GitHub Actions Workflow: Backend](.github/workflows/deploy-backend.yml)
