#!/bin/bash

# 9Vectors Deployment Verification Script
# This script verifies that the Azure deployment is working correctly

set -e

RESOURCE_GROUP="9vectors-rg"
WEB_APP_NAME="9vectors-app"
DNS_ZONE="9vectors.com"

echo "========================================="
echo "9Vectors Deployment Verification"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check function
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1"
        return 1
    fi
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# 1. Check Azure login
echo "1. Checking Azure authentication..."
az account show > /dev/null 2>&1
check "Azure CLI authenticated"

# 2. Check Resource Group
echo ""
echo "2. Checking Resource Group..."
az group show --name $RESOURCE_GROUP > /dev/null 2>&1
check "Resource Group exists: $RESOURCE_GROUP"

# 3. Check App Service Plan
echo ""
echo "3. Checking App Service Plan..."
az appservice plan show --name 9vectors-asp --resource-group $RESOURCE_GROUP > /dev/null 2>&1
check "App Service Plan exists"

# 4. Check Web App
echo ""
echo "4. Checking Web App..."
WEB_APP_STATE=$(az webapp show --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP --query state -o tsv 2>/dev/null)
if [ "$WEB_APP_STATE" = "Running" ]; then
    check "Web App is running"
else
    warn "Web App state: $WEB_APP_STATE"
fi

# 5. Get Web App URL
echo ""
echo "5. Getting Web App details..."
WEB_APP_URL=$(az webapp show --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP --query defaultHostName -o tsv)
echo "   Default URL: https://$WEB_APP_URL"

# 6. Test Web App accessibility
echo ""
echo "6. Testing Web App accessibility..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://$WEB_APP_URL || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
    check "Web App is accessible (HTTP $HTTP_CODE)"
else
    warn "Web App returned HTTP $HTTP_CODE"
fi

# 7. Check HTTPS redirect
echo ""
echo "7. Checking HTTPS enforcement..."
HTTPS_ONLY=$(az webapp show --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP --query httpsOnly -o tsv)
if [ "$HTTPS_ONLY" = "true" ]; then
    check "HTTPS-only is enabled"
else
    warn "HTTPS-only is NOT enabled"
fi

# 8. Check DNS Zone
echo ""
echo "8. Checking DNS Zone..."
az network dns zone show --resource-group $RESOURCE_GROUP --name $DNS_ZONE > /dev/null 2>&1
if check "DNS Zone exists: $DNS_ZONE"; then
    echo ""
    echo "   DNS Nameservers:"
    az network dns zone show --resource-group $RESOURCE_GROUP --name $DNS_ZONE --query nameServers -o tsv | sed 's/^/   - /'
fi

# 9. Check DNS records
echo ""
echo "9. Checking DNS records..."
DNS_RECORDS=$(az network dns record-set list --resource-group $RESOURCE_GROUP --zone-name $DNS_ZONE --query "length(@)" -o tsv 2>/dev/null || echo "0")
if [ "$DNS_RECORDS" -gt "0" ]; then
    check "DNS records configured ($DNS_RECORDS records)"
    echo ""
    echo "   DNS Records:"
    az network dns record-set list --resource-group $RESOURCE_GROUP --zone-name $DNS_ZONE --output table | head -10
else
    warn "No DNS records found"
fi

# 10. Check custom domains
echo ""
echo "10. Checking custom domains..."
CUSTOM_DOMAINS=$(az webapp config hostname list --resource-group $RESOURCE_GROUP --webapp-name $WEB_APP_NAME --query "length(@)" -o tsv)
if [ "$CUSTOM_DOMAINS" -gt "0" ]; then
    check "Custom domains configured ($CUSTOM_DOMAINS domains)"
    az webapp config hostname list --resource-group $RESOURCE_GROUP --webapp-name $WEB_APP_NAME --query "[].name" -o tsv | sed 's/^/   - /'
else
    warn "No custom domains configured yet"
fi

# 11. Check SSL certificates
echo ""
echo "11. Checking SSL certificates..."
SSL_CERTS=$(az webapp config ssl list --resource-group $RESOURCE_GROUP --query "length(@)" -o tsv)
if [ "$SSL_CERTS" -gt "0" ]; then
    check "SSL certificates configured ($SSL_CERTS certificates)"
else
    warn "No SSL certificates configured yet"
fi

# 12. Check deployment slots
echo ""
echo "12. Checking deployment configuration..."
az webapp deployment source show --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP > /dev/null 2>&1
check "Deployment source configured"

# 13. Check application settings
echo ""
echo "13. Checking application settings..."
APP_SETTINGS=$(az webapp config appsettings list --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP --query "length(@)" -o tsv)
echo "   Application settings: $APP_SETTINGS configured"

# 14. Test domain resolution (if DNS migrated)
echo ""
echo "14. Checking domain DNS resolution..."
DOMAIN_IP=$(dig +short $DNS_ZONE @8.8.8.8 | head -1)
if [ -n "$DOMAIN_IP" ]; then
    check "Domain resolves to: $DOMAIN_IP"

    # Check if it's pointing to Azure
    if [[ $DOMAIN_IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo ""
        echo "15. Testing custom domain..."
        CUSTOM_HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://$DNS_ZONE 2>/dev/null || echo "000")
        if [ "$CUSTOM_HTTP_CODE" = "200" ] || [ "$CUSTOM_HTTP_CODE" = "301" ] || [ "$CUSTOM_HTTP_CODE" = "302" ]; then
            check "Custom domain is accessible (HTTP $CUSTOM_HTTP_CODE)"
        else
            warn "Custom domain returned HTTP $CUSTOM_HTTP_CODE"
        fi
    fi
else
    warn "Domain does not resolve yet (DNS not migrated or still propagating)"
fi

# Summary
echo ""
echo "========================================="
echo "Verification Summary"
echo "========================================="
echo ""
echo "Resources:"
echo "  - Resource Group: $RESOURCE_GROUP"
echo "  - Web App: $WEB_APP_NAME"
echo "  - Default URL: https://$WEB_APP_URL"
echo "  - Custom Domain: $DNS_ZONE"
echo ""
echo "Next Steps:"
if [ "$CUSTOM_DOMAINS" -eq "0" ]; then
    echo "  1. Configure custom domains"
    echo "  2. Add DNS records"
    echo "  3. Migrate DNS from GoDaddy"
    echo "  4. Enable SSL certificates"
elif [ "$SSL_CERTS" -eq "0" ]; then
    echo "  1. Wait for DNS propagation"
    echo "  2. Enable SSL certificates"
elif [ -z "$DOMAIN_IP" ]; then
    echo "  1. Migrate DNS from GoDaddy to Azure nameservers"
    echo "  2. Wait for DNS propagation"
else
    echo "  ✓ Deployment appears to be complete!"
    echo "  - Monitor application performance"
    echo "  - Check GitHub Actions for CI/CD status"
fi
echo ""
