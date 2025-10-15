#!/bin/bash

# 9Vectors Azure AD B2C & Stripe Credentials Setup Script

echo "=============================================================================="
echo "  🔐 9VECTORS - AZURE AD B2C & STRIPE SETUP"
echo "=============================================================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}This script will update your .env files with Azure AD B2C and Stripe credentials.${NC}"
echo ""
echo "You can get these credentials from:"
echo "  • Azure AD B2C: https://portal.azure.com/ (search for Azure AD B2C)"
echo "  • Stripe: https://dashboard.stripe.com/"
echo ""
read -p "Press Enter to continue..."

# Azure AD B2C Credentials
echo ""
echo -e "${GREEN}=== AZURE AD B2C CREDENTIALS ===${NC}"
echo ""

read -p "Azure AD B2C Tenant Name (e.g., 9vectors): " AZURE_TENANT_NAME
read -p "Azure AD B2C Client ID: " AZURE_CLIENT_ID
read -p "Azure AD B2C Client Secret: " AZURE_CLIENT_SECRET

# Stripe Credentials
echo ""
echo -e "${GREEN}=== STRIPE CREDENTIALS ===${NC}"
echo ""

read -p "Stripe Publishable Key (pk_test_...): " STRIPE_PUBLISHABLE_KEY
read -p "Stripe Secret Key (sk_test_...): " STRIPE_SECRET_KEY
read -p "Stripe Webhook Secret (whsec_...) [Optional, press Enter to skip]: " STRIPE_WEBHOOK_SECRET

# Stripe Price IDs
echo ""
echo -e "${GREEN}=== STRIPE PRICE IDs ===${NC}"
echo "If you haven't created products yet, you can skip these and add them later."
echo ""

read -p "Starter Plan Price ID (price_...) [Optional]: " STRIPE_PRICE_STARTER
read -p "Professional Plan Price ID (price_...) [Optional]: " STRIPE_PRICE_PROFESSIONAL
read -p "Enterprise Plan Price ID (price_...) [Optional]: " STRIPE_PRICE_ENTERPRISE

# Set defaults if empty
STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET:-"your-stripe-webhook-secret"}
STRIPE_PRICE_STARTER=${STRIPE_PRICE_STARTER:-"price_starter_monthly_id"}
STRIPE_PRICE_PROFESSIONAL=${STRIPE_PRICE_PROFESSIONAL:-"price_professional_monthly_id"}
STRIPE_PRICE_ENTERPRISE=${STRIPE_PRICE_ENTERPRISE:-"price_enterprise_monthly_id"}

# Update Frontend .env
echo ""
echo -e "${YELLOW}Updating frontend .env file...${NC}"

cat > .env << EOF
# Backend API URL
VITE_API_URL=http://localhost:3001
VITE_ENV=development

# Azure AD B2C Configuration
VITE_AZURE_AD_B2C_TENANT_NAME=$AZURE_TENANT_NAME
VITE_AZURE_AD_B2C_CLIENT_ID=$AZURE_CLIENT_ID
VITE_AZURE_AD_B2C_SIGN_UP_SIGN_IN_POLICY=B2C_1_signupsignin
VITE_AZURE_AD_B2C_RESET_PASSWORD_POLICY=B2C_1_passwordreset
VITE_AZURE_AD_B2C_EDIT_PROFILE_POLICY=B2C_1_profileedit

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY

# Anthropic API Key for AI Coaching (Optional)
VITE_ANTHROPIC_API_KEY=
EOF

# Update Backend api/.env
echo -e "${YELLOW}Updating backend api/.env file...${NC}"

cat > api/.env << EOF
# Server Configuration
PORT=3001
NODE_ENV=development

# Azure Cosmos DB Configuration
COSMOS_ENDPOINT=https://9vectors-cosmos.documents.azure.com:443/
COSMOS_KEY=\${COSMOS_KEY_FROM_EXISTING_ENV}
COSMOS_DATABASE=9vectors
COSMOS_CONTAINER_USERS=users
COSMOS_CONTAINER_ORGANIZATIONS=organizations
COSMOS_CONTAINER_ASSESSMENTS=assessments

# JWT Configuration
JWT_SECRET=9vectors-jwt-secret-key-change-in-production-2025
JWT_EXPIRES_IN=7d

# Azure AD B2C Configuration
AZURE_AD_B2C_TENANT_NAME=$AZURE_TENANT_NAME
AZURE_AD_B2C_CLIENT_ID=$AZURE_CLIENT_ID
AZURE_AD_B2C_CLIENT_SECRET=$AZURE_CLIENT_SECRET
AZURE_AD_B2C_POLICY_NAME=B2C_1_signupsignin

# Stripe Configuration
STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET

# Stripe Price IDs
STRIPE_PRICE_STARTER=$STRIPE_PRICE_STARTER
STRIPE_PRICE_PROFESSIONAL=$STRIPE_PRICE_PROFESSIONAL
STRIPE_PRICE_ENTERPRISE=$STRIPE_PRICE_ENTERPRISE

# CORS Configuration
FRONTEND_URL=http://localhost:3005
PRODUCTION_URL=https://www.9vectors.com
EOF

echo ""
echo -e "${GREEN}✅ Credentials configured successfully!${NC}"
echo ""
echo "Next steps:"
echo "  1. Review the updated .env files:"
echo "     - .env (frontend)"
echo "     - api/.env (backend)"
echo ""
echo "  2. If you haven't created Azure AD B2C tenant yet:"
echo "     - Follow the guide: AZURE_AD_B2C_SETUP.md"
echo ""
echo "  3. If you haven't created Stripe products yet:"
echo "     - Go to https://dashboard.stripe.com/products"
echo "     - Create 3 products and update the STRIPE_PRICE_* values"
echo ""
echo "  4. Restart your servers:"
echo "     - Terminal 1: cd api && npm start"
echo "     - Terminal 2: npm run dev"
echo ""
echo "  5. Test:"
echo "     - Open http://localhost:3005"
echo "     - Click Sign In (should redirect to Azure AD B2C)"
echo "     - Go to /pricing and test checkout"
echo ""
echo "=============================================================================="
