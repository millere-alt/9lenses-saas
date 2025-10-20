#!/bin/bash

# Azure Infrastructure Deployment Script for 9Vectors
# Creates: Static Web App + Azure Functions + Cosmos DB in Snapshot9 resource group

set -e  # Exit on error

# Configuration
RESOURCE_GROUP="Snapshot9"
LOCATION="eastus"
APP_NAME="9vectors"
STATIC_WEB_APP_NAME="${APP_NAME}-web"
FUNCTION_APP_NAME="${APP_NAME}-api"
STORAGE_ACCOUNT_NAME="9vectorsstorage"
COSMOS_ACCOUNT_NAME="9vectors-cosmos"
COSMOS_DATABASE_NAME="9vectors"
APP_SERVICE_PLAN_NAME="${APP_NAME}-plan"

echo "========================================="
echo "9Vectors Azure Infrastructure Deployment"
echo "========================================="
echo ""
echo "Resource Group: $RESOURCE_GROUP"
echo "Location: $LOCATION"
echo "Static Web App: $STATIC_WEB_APP_NAME"
echo "Function App: $FUNCTION_APP_NAME"
echo "Cosmos DB: $COSMOS_ACCOUNT_NAME"
echo ""

# Check if logged in to Azure
echo "🔍 Checking Azure CLI authentication..."
if ! az account show &> /dev/null; then
    echo "❌ Not logged in to Azure. Please run 'az login' first."
    exit 1
fi

SUBSCRIPTION_ID=$(az account show --query id -o tsv)
SUBSCRIPTION_NAME=$(az account show --query name -o tsv)
echo "✅ Logged in to Azure"
echo "   Subscription: $SUBSCRIPTION_NAME"
echo "   ID: $SUBSCRIPTION_ID"
echo ""

# Check if resource group exists
echo "🔍 Checking if resource group '$RESOURCE_GROUP' exists..."
if az group show --name "$RESOURCE_GROUP" &> /dev/null; then
    echo "✅ Resource group '$RESOURCE_GROUP' exists"
else
    echo "⚠️  Resource group '$RESOURCE_GROUP' not found"
    read -p "Create resource group '$RESOURCE_GROUP'? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📦 Creating resource group..."
        az group create --name "$RESOURCE_GROUP" --location "$LOCATION"
        echo "✅ Resource group created"
    else
        echo "❌ Cannot proceed without resource group. Exiting."
        exit 1
    fi
fi
echo ""

# Create Storage Account for Azure Functions
echo "📦 Creating Storage Account for Azure Functions..."
STORAGE_EXISTS=$(az storage account check-name --name "$STORAGE_ACCOUNT_NAME" --query nameAvailable -o tsv)
if [ "$STORAGE_EXISTS" = "false" ]; then
    echo "ℹ️  Storage account '$STORAGE_ACCOUNT_NAME' already exists, checking if it's in our resource group..."
    STORAGE_RG=$(az storage account show --name "$STORAGE_ACCOUNT_NAME" --query resourceGroup -o tsv 2>/dev/null || echo "")
    if [ "$STORAGE_RG" != "$RESOURCE_GROUP" ]; then
        echo "⚠️  Storage account exists in different resource group: $STORAGE_RG"
        STORAGE_ACCOUNT_NAME="${STORAGE_ACCOUNT_NAME}$(date +%s)"
        echo "   Using alternative name: $STORAGE_ACCOUNT_NAME"
    else
        echo "✅ Storage account already exists in resource group"
    fi
else
    echo "   Creating new storage account: $STORAGE_ACCOUNT_NAME"
fi

if ! az storage account show --name "$STORAGE_ACCOUNT_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    az storage account create \
        --name "$STORAGE_ACCOUNT_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --sku Standard_LRS \
        --kind StorageV2
    echo "✅ Storage account created"
else
    echo "✅ Using existing storage account"
fi
echo ""

# Create Cosmos DB Account
echo "📦 Creating Cosmos DB Account..."
if az cosmosdb show --name "$COSMOS_ACCOUNT_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo "✅ Cosmos DB account already exists"
else
    echo "   Creating Cosmos DB account (this may take 3-5 minutes)..."
    az cosmosdb create \
        --name "$COSMOS_ACCOUNT_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --locations regionName="$LOCATION" failoverPriority=0 \
        --default-consistency-level "Session" \
        --enable-automatic-failover false \
        --enable-free-tier false
    echo "✅ Cosmos DB account created"
fi

# Create Cosmos DB Database
echo "📦 Creating Cosmos DB Database..."
if az cosmosdb sql database show \
    --account-name "$COSMOS_ACCOUNT_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --name "$COSMOS_DATABASE_NAME" &> /dev/null; then
    echo "✅ Cosmos DB database already exists"
else
    az cosmosdb sql database create \
        --account-name "$COSMOS_ACCOUNT_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --name "$COSMOS_DATABASE_NAME"
    echo "✅ Cosmos DB database created"
fi

# Create Cosmos DB Containers
echo "📦 Creating Cosmos DB Containers..."
CONTAINERS=("users:organizationId" "organizations:id" "assessments:organizationId" "invitations:organizationId" "benchmarks:id")

for CONTAINER_INFO in "${CONTAINERS[@]}"; do
    IFS=':' read -r CONTAINER_NAME PARTITION_KEY <<< "$CONTAINER_INFO"
    echo "   Creating container: $CONTAINER_NAME"

    if az cosmosdb sql container show \
        --account-name "$COSMOS_ACCOUNT_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --database-name "$COSMOS_DATABASE_NAME" \
        --name "$CONTAINER_NAME" &> /dev/null; then
        echo "   ✅ Container '$CONTAINER_NAME' already exists"
    else
        az cosmosdb sql container create \
            --account-name "$COSMOS_ACCOUNT_NAME" \
            --resource-group "$RESOURCE_GROUP" \
            --database-name "$COSMOS_DATABASE_NAME" \
            --name "$CONTAINER_NAME" \
            --partition-key-path "/$PARTITION_KEY" \
            --throughput 400
        echo "   ✅ Container '$CONTAINER_NAME' created"
    fi
done
echo ""

# Get Cosmos DB connection details
echo "🔑 Retrieving Cosmos DB connection details..."
COSMOS_ENDPOINT=$(az cosmosdb show \
    --name "$COSMOS_ACCOUNT_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query documentEndpoint -o tsv)

COSMOS_KEY=$(az cosmosdb keys list \
    --name "$COSMOS_ACCOUNT_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query primaryMasterKey -o tsv)

echo "✅ Cosmos DB connection details retrieved"
echo ""

# Create App Service Plan for Functions
echo "📦 Creating App Service Plan for Azure Functions..."
if az appservice plan show --name "$APP_SERVICE_PLAN_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo "✅ App Service Plan already exists"
else
    az appservice plan create \
        --name "$APP_SERVICE_PLAN_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --sku B1 \
        --is-linux
    echo "✅ App Service Plan created"
fi
echo ""

# Create Azure Function App
echo "📦 Creating Azure Function App..."
if az functionapp show --name "$FUNCTION_APP_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo "✅ Function App already exists"
else
    az functionapp create \
        --name "$FUNCTION_APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --storage-account "$STORAGE_ACCOUNT_NAME" \
        --plan "$APP_SERVICE_PLAN_NAME" \
        --runtime node \
        --runtime-version 20 \
        --functions-version 4 \
        --os-type Linux
    echo "✅ Function App created"
fi
echo ""

# Configure Function App Settings
echo "⚙️  Configuring Function App settings..."
az functionapp config appsettings set \
    --name "$FUNCTION_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --settings \
        "COSMOS_ENDPOINT=$COSMOS_ENDPOINT" \
        "COSMOS_KEY=$COSMOS_KEY" \
        "COSMOS_DATABASE=$COSMOS_DATABASE_NAME" \
        "COSMOS_CONTAINER_USERS=users" \
        "COSMOS_CONTAINER_ORGANIZATIONS=organizations" \
        "COSMOS_CONTAINER_ASSESSMENTS=assessments" \
        "NODE_ENV=production" \
        "WEBSITE_RUN_FROM_PACKAGE=1" \
        "SCM_DO_BUILD_DURING_DEPLOYMENT=true"

echo "✅ Function App settings configured"
echo ""

# Create Static Web App
echo "📦 Creating Azure Static Web App..."
if az staticwebapp show --name "$STATIC_WEB_APP_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo "✅ Static Web App already exists"
else
    # Note: GitHub token will be needed for automatic workflow setup
    echo "   Creating Static Web App (manual GitHub integration)..."
    az staticwebapp create \
        --name "$STATIC_WEB_APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --sku Free
    echo "✅ Static Web App created"
fi
echo ""

# Get Static Web App API key
echo "🔑 Retrieving Static Web App deployment token..."
SWA_TOKEN=$(az staticwebapp secrets list \
    --name "$STATIC_WEB_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query properties.apiKey -o tsv)

# Get Function App URL
FUNCTION_URL=$(az functionapp show \
    --name "$FUNCTION_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query defaultHostName -o tsv)

# Get Static Web App URL
SWA_URL=$(az staticwebapp show \
    --name "$STATIC_WEB_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query defaultHostname -o tsv)

echo ""
echo "========================================="
echo "✅ Deployment Complete!"
echo "========================================="
echo ""
echo "📝 Configuration Summary:"
echo "   Resource Group: $RESOURCE_GROUP"
echo "   Static Web App: https://$SWA_URL"
echo "   Function App: https://$FUNCTION_URL"
echo "   Cosmos DB: $COSMOS_ENDPOINT"
echo ""
echo "🔐 GitHub Secrets (save these for CI/CD):"
echo "   AZURE_STATIC_WEB_APPS_API_TOKEN: $SWA_TOKEN"
echo "   AZURE_FUNCTIONAPP_PUBLISH_PROFILE: (retrieve separately)"
echo "   COSMOS_ENDPOINT: $COSMOS_ENDPOINT"
echo "   COSMOS_KEY: $COSMOS_KEY"
echo ""
echo "📋 Next Steps:"
echo "   1. Add the above secrets to your GitHub repository"
echo "   2. Update .env files with production values"
echo "   3. Push to main branch to trigger deployment"
echo "   4. Configure custom domain (optional)"
echo ""
echo "🔧 Retrieve Function App Publish Profile:"
echo "   az functionapp deployment list-publishing-profiles \\"
echo "     --name $FUNCTION_APP_NAME \\"
echo "     --resource-group $RESOURCE_GROUP \\"
echo "     --xml"
echo ""
