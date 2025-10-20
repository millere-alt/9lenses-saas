#!/bin/bash

# GitHub Secrets Setup Script for 9Vectors Azure Deployment
# This script helps you configure all required GitHub secrets for CI/CD

set -e

REPO_OWNER="millere-alt"
REPO_NAME="9lenses-saas"
RESOURCE_GROUP="Snapshot9"
FUNCTION_APP_NAME="9vectors-api"
STATIC_WEB_APP_NAME="9vectors-web"
COSMOS_ACCOUNT_NAME="9vectors-cosmos"

echo "========================================="
echo "9Vectors GitHub Secrets Setup"
echo "========================================="
echo ""
echo "This script will help you configure GitHub secrets"
echo "for automated CI/CD deployment to Azure."
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "   Install it from: https://cli.github.com/"
    echo "   Or run: brew install gh"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "🔐 Not authenticated with GitHub. Running authentication..."
    gh auth login
fi

echo "✅ GitHub CLI is ready"
echo ""

# Check Azure CLI
if ! az account show &> /dev/null; then
    echo "❌ Not logged in to Azure. Please run 'az login' first."
    exit 1
fi

echo "✅ Azure CLI is ready"
echo ""

# Function to set GitHub secret
set_github_secret() {
    local secret_name=$1
    local secret_value=$2

    echo "📝 Setting secret: $secret_name"
    echo "$secret_value" | gh secret set "$secret_name" --repo "$REPO_OWNER/$REPO_NAME"
    echo "✅ Secret set: $secret_name"
}

# Get Azure Static Web Apps API Token
echo "🔑 Retrieving Azure Static Web Apps API Token..."
SWA_TOKEN=$(az staticwebapp secrets list \
    --name "$STATIC_WEB_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query properties.apiKey -o tsv)

if [ -z "$SWA_TOKEN" ]; then
    echo "⚠️  Could not retrieve Static Web App token."
    echo "   Make sure the resource exists: $STATIC_WEB_APP_NAME"
else
    set_github_secret "AZURE_STATIC_WEB_APPS_API_TOKEN" "$SWA_TOKEN"
fi
echo ""

# Get Function App Publish Profile
echo "🔑 Retrieving Function App Publish Profile..."
PUBLISH_PROFILE=$(az functionapp deployment list-publishing-profiles \
    --name "$FUNCTION_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --xml)

if [ -z "$PUBLISH_PROFILE" ]; then
    echo "⚠️  Could not retrieve Function App publish profile."
    echo "   Make sure the resource exists: $FUNCTION_APP_NAME"
else
    set_github_secret "AZURE_FUNCTIONAPP_PUBLISH_PROFILE" "$PUBLISH_PROFILE"
fi
echo ""

# Get Cosmos DB credentials
echo "🔑 Retrieving Cosmos DB credentials..."
COSMOS_ENDPOINT=$(az cosmosdb show \
    --name "$COSMOS_ACCOUNT_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query documentEndpoint -o tsv)

COSMOS_KEY=$(az cosmosdb keys list \
    --name "$COSMOS_ACCOUNT_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query primaryMasterKey -o tsv)

if [ -z "$COSMOS_ENDPOINT" ] || [ -z "$COSMOS_KEY" ]; then
    echo "⚠️  Could not retrieve Cosmos DB credentials."
    echo "   Make sure the resource exists: $COSMOS_ACCOUNT_NAME"
else
    set_github_secret "COSMOS_ENDPOINT" "$COSMOS_ENDPOINT"
    set_github_secret "COSMOS_KEY" "$COSMOS_KEY"
fi
echo ""

# Prompt for Auth0 credentials
echo "🔐 Auth0 Configuration"
echo "   Please provide your Auth0 credentials."
echo ""

read -p "Auth0 Domain (e.g., dev-xyz.us.auth0.com): " AUTH0_DOMAIN
if [ -n "$AUTH0_DOMAIN" ]; then
    set_github_secret "VITE_AUTH0_DOMAIN" "$AUTH0_DOMAIN"
fi

read -p "Auth0 Client ID: " AUTH0_CLIENT_ID
if [ -n "$AUTH0_CLIENT_ID" ]; then
    set_github_secret "VITE_AUTH0_CLIENT_ID" "$AUTH0_CLIENT_ID"
fi

read -p "Auth0 Audience: " AUTH0_AUDIENCE
if [ -n "$AUTH0_AUDIENCE" ]; then
    set_github_secret "VITE_AUTH0_AUDIENCE" "$AUTH0_AUDIENCE"
fi
echo ""

# Prompt for Stripe key
echo "💳 Stripe Configuration"
read -p "Stripe Publishable Key (pk_test_...): " STRIPE_KEY
if [ -n "$STRIPE_KEY" ]; then
    set_github_secret "VITE_STRIPE_PUBLISHABLE_KEY" "$STRIPE_KEY"
fi
echo ""

# Prompt for JWT Secret
echo "🔒 JWT Configuration"
echo "   Generate a secure random string for JWT secret."
JWT_SECRET=$(openssl rand -base64 32)
echo "   Generated JWT secret: ${JWT_SECRET:0:20}..."
set_github_secret "JWT_SECRET" "$JWT_SECRET"

# Also set in Azure Function App
echo "   Setting JWT secret in Azure Function App..."
az functionapp config appsettings set \
    --name "$FUNCTION_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --settings "JWT_SECRET=$JWT_SECRET" > /dev/null
echo "✅ JWT secret configured"
echo ""

# Verify secrets
echo "========================================="
echo "✅ Secrets Configuration Complete!"
echo "========================================="
echo ""
echo "📋 Configured Secrets:"
gh secret list --repo "$REPO_OWNER/$REPO_NAME"
echo ""

echo "🎯 Next Steps:"
echo "   1. Verify all secrets are set correctly"
echo "   2. Push to main branch to trigger deployment"
echo "   3. Monitor deployment in GitHub Actions"
echo ""
echo "📚 Documentation:"
echo "   .azure/DEPLOYMENT_GUIDE.md"
echo ""
