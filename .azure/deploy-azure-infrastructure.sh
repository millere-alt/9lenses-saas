#!/bin/bash

# 9Vectors Azure Infrastructure Deployment Script
# This script creates all necessary Azure resources for 9vectors.com

set -e

# Configuration
RESOURCE_GROUP="9vectors-rg"
LOCATION="eastus"
APP_SERVICE_PLAN="9vectors-asp"
WEB_APP_NAME="9vectors-app"
DNS_ZONE="9vectors.com"
SKU="B1"  # Basic tier - adjust as needed

echo "========================================="
echo "9Vectors Azure Infrastructure Setup"
echo "========================================="
echo ""

# Check if logged into Azure
echo "Checking Azure login status..."
az account show > /dev/null 2>&1 || {
    echo "Please login to Azure first:"
    az login
}

# Display current subscription
echo ""
echo "Current Azure Subscription:"
az account show --query "{Name:name, SubscriptionId:id}" -o table
echo ""
read -p "Is this the correct subscription? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please set the correct subscription using: az account set --subscription <subscription-id>"
    exit 1
fi

# Create Resource Group
echo ""
echo "Creating Resource Group: $RESOURCE_GROUP"
az group create \
    --name $RESOURCE_GROUP \
    --location $LOCATION \
    --tags application=9vectors environment=production

# Create App Service Plan
echo ""
echo "Creating App Service Plan: $APP_SERVICE_PLAN"
az appservice plan create \
    --name $APP_SERVICE_PLAN \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --sku $SKU \
    --is-linux \
    --tags application=9vectors environment=production

# Create Web App
echo ""
echo "Creating Web App: $WEB_APP_NAME"
az webapp create \
    --name $WEB_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --plan $APP_SERVICE_PLAN \
    --runtime "NODE:20-lts" \
    --tags application=9vectors environment=production

# Configure Web App settings
echo ""
echo "Configuring Web App settings..."
az webapp config set \
    --name $WEB_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --startup-file "npx serve -s dist -l 8080" \
    --always-on true

# Configure deployment settings
echo ""
echo "Configuring deployment settings..."
az webapp deployment source config-local-git \
    --name $WEB_APP_NAME \
    --resource-group $RESOURCE_GROUP

# Enable HTTPS only
echo ""
echo "Enabling HTTPS only..."
az webapp update \
    --name $WEB_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --https-only true

# Create DNS Zone
echo ""
echo "Creating DNS Zone: $DNS_ZONE"
az network dns zone create \
    --resource-group $RESOURCE_GROUP \
    --name $DNS_ZONE \
    --tags application=9vectors environment=production

# Get Web App default hostname
WEB_APP_HOSTNAME=$(az webapp show \
    --name $WEB_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --query defaultHostName -o tsv)

echo ""
echo "========================================="
echo "Azure Infrastructure Created Successfully!"
echo "========================================="
echo ""
echo "Resource Group: $RESOURCE_GROUP"
echo "App Service Plan: $APP_SERVICE_PLAN"
echo "Web App: $WEB_APP_NAME"
echo "Default URL: https://$WEB_APP_HOSTNAME"
echo "DNS Zone: $DNS_ZONE"
echo ""

# Get DNS nameservers
echo "DNS Nameservers (copy these to GoDaddy):"
az network dns zone show \
    --resource-group $RESOURCE_GROUP \
    --name $DNS_ZONE \
    --query nameServers -o tsv

echo ""
echo "========================================="
echo "Next Steps:"
echo "========================================="
echo "1. Create Service Principal for GitHub Actions"
echo "2. Add custom domain to Web App"
echo "3. Configure DNS records"
echo "4. Update GoDaddy nameservers"
echo "5. Configure SSL certificate"
echo ""

# Create service principal instructions
echo "Run this command to create a Service Principal:"
echo ""
echo "az ad sp create-for-rbac \\"
echo "  --name \"9vectors-github-actions\" \\"
echo "  --role contributor \\"
echo "  --scopes /subscriptions/\$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP \\"
echo "  --sdk-auth"
echo ""
