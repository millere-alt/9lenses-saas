#!/bin/bash

# 9Vectors Credentials Setup Script
# This script will help you configure Auth0 and Stripe credentials

echo "=============================================================================="
echo "  🔐 9VECTORS - AUTH0 & STRIPE CREDENTIALS SETUP"
echo "=============================================================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}This script will update your .env files with Auth0 and Stripe credentials.${NC}"
echo ""
echo "You can get these credentials from:"
echo "  • Auth0: https://manage.auth0.com/"
echo "  • Stripe: https://dashboard.stripe.com/"
echo ""
read -p "Press Enter to continue..."

# Auth0 Credentials
echo ""
echo -e "${GREEN}=== AUTH0 CREDENTIALS ===${NC}"
echo ""

read -p "Auth0 Domain (e.g., dev-abc123.us.auth0.com): " AUTH0_DOMAIN
read -p "Auth0 Client ID: " AUTH0_CLIENT_ID
read -p "Auth0 Client Secret: " AUTH0_CLIENT_SECRET

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

# Auth0 Configuration
VITE_AUTH0_DOMAIN=$AUTH0_DOMAIN
VITE_AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID
VITE_AUTH0_AUDIENCE=https://9vectors.com/api

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY

# Anthropic API Key for AI Coaching
# Get your API key from: https://console.anthropic.com/
#
# IMPORTANT: In production, do NOT expose API keys in the browser!
# Use a backend proxy/API route instead.
VITE_ANTHROPIC_API_KEY=

# Optional: Configure AI model
# VITE_AI_MODEL=claude-3-5-sonnet-20241022

# Optional: Enable/disable AI features
# VITE_AI_ENABLED=true
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

# Auth0 Configuration
AUTH0_DOMAIN=$AUTH0_DOMAIN
AUTH0_AUDIENCE=https://9vectors.com/api
AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID
AUTH0_CLIENT_SECRET=$AUTH0_CLIENT_SECRET

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
echo "     - /Users/edwinmiller/Desktop/9Vectors/.env (frontend)"
echo "     - /Users/edwinmiller/Desktop/9Vectors/api/.env (backend)"
echo ""
echo "  2. If you haven't created Stripe products yet:"
echo "     - Go to https://dashboard.stripe.com/products"
echo "     - Create 3 products and update the STRIPE_PRICE_* values"
echo ""
echo "  3. Configure Auth0 Application Settings:"
echo "     - Allowed Callback URLs: http://localhost:3005"
echo "     - Allowed Logout URLs: http://localhost:3005"
echo "     - Allowed Web Origins: http://localhost:3005"
echo ""
echo "  4. Restart your servers to apply changes"
echo ""
echo "=============================================================================="
