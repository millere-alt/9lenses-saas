#!/usr/bin/env bash

################################################################################
# Setup GitHub Secrets Script
#
# This script automates the process of loading secrets from Azure into GitHub
# repository secrets for automated deployment via GitHub Actions.
#
# Prerequisites:
#   1. Azure CLI installed and authenticated (az login)
#   2. GitHub CLI installed and authenticated (gh auth login)
#   3. Contributor access to Azure resource group
#   4. Admin access to GitHub repository
#
# Usage:
#   ./setup-github-secrets.sh [options]
#
# Options:
#   --repo OWNER/REPO    Specify GitHub repository (default: current repo)
#   --dry-run            Preview secrets without uploading to GitHub
#   --skip-confirmation  Skip confirmation prompt
#   -h, --help           Show this help message
#
# Examples:
#   ./setup-github-secrets.sh                    # Interactive mode
#   ./setup-github-secrets.sh --dry-run          # Preview only
#   ./setup-github-secrets.sh --repo myorg/repo  # Specify repository
#
################################################################################

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
RESOURCE_GROUP="9vectors-rg"
STATIC_WEB_APP="9vectors-app"
FUNCTION_APP="9vectors-api"
COSMOS_ACCOUNT="9vectors-cosmos"
COSMOS_DATABASE="9vectors"
COSMOS_CONTAINER="assessments"
COMMUNICATION_SERVICE="9vectors-communication"

# Default options
DRY_RUN=false
SKIP_CONFIRMATION=false
GITHUB_REPO=""

# Secret tracking
declare -A SECRETS
declare -a FAILED_SECRETS
declare -a SKIPPED_SECRETS
SUCCESS_COUNT=0
FAIL_COUNT=0
SKIP_COUNT=0

################################################################################
# Helper Functions
################################################################################

print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_usage() {
    sed -n '2,24p' "$0" | sed 's/^# //' | sed 's/^#//'
    exit 0
}

check_prerequisites() {
    print_header "Checking Prerequisites"

    local all_ok=true

    # Check Azure CLI
    if command -v az &> /dev/null; then
        print_success "Azure CLI installed"

        # Check if logged in
        if az account show &> /dev/null; then
            local account=$(az account show --query name -o tsv)
            print_success "Azure CLI authenticated (Account: $account)"
        else
            print_error "Azure CLI not authenticated. Run: az login"
            all_ok=false
        fi
    else
        print_error "Azure CLI not installed. Install from: https://docs.microsoft.com/cli/azure/install-azure-cli"
        all_ok=false
    fi

    # Check GitHub CLI
    if command -v gh &> /dev/null; then
        print_success "GitHub CLI installed"

        # Check if logged in
        if gh auth status &> /dev/null; then
            local user=$(gh api user --jq '.login' 2>/dev/null || echo "unknown")
            print_success "GitHub CLI authenticated (User: $user)"
        else
            print_error "GitHub CLI not authenticated. Run: gh auth login"
            all_ok=false
        fi
    else
        print_error "GitHub CLI not installed. Install from: https://cli.github.com"
        all_ok=false
    fi

    # Verify resource group exists
    if az group show --name "$RESOURCE_GROUP" &> /dev/null; then
        print_success "Resource group '$RESOURCE_GROUP' exists"
    else
        print_error "Resource group '$RESOURCE_GROUP' not found"
        all_ok=false
    fi

    if [ "$all_ok" = false ]; then
        print_error "Prerequisites not met. Please resolve issues above."
        exit 1
    fi
}

get_github_repo() {
    if [ -n "$GITHUB_REPO" ]; then
        echo "$GITHUB_REPO"
        return
    fi

    # Try to detect from git remote
    if git remote get-url origin &> /dev/null; then
        local remote_url=$(git remote get-url origin)
        # Extract owner/repo from various URL formats
        if [[ $remote_url =~ github\.com[:/]([^/]+/[^/]+?)(\.git)?$ ]]; then
            echo "${BASH_REMATCH[1]}"
            return
        fi
    fi

    echo ""
}

retrieve_azure_secrets() {
    print_header "Retrieving Secrets from Azure"

    # Azure Static Web Apps deployment token
    print_info "Fetching Static Web App deployment token..."
    if SECRETS[AZURE_STATIC_WEB_APPS_API_TOKEN]=$(az staticwebapp secrets list \
        --name "$STATIC_WEB_APP" \
        --resource-group "$RESOURCE_GROUP" \
        --query "properties.apiKey" -o tsv 2>/dev/null); then
        print_success "AZURE_STATIC_WEB_APPS_API_TOKEN"
    else
        print_warning "AZURE_STATIC_WEB_APPS_API_TOKEN not found (may need manual setup)"
        SKIPPED_SECRETS+=("AZURE_STATIC_WEB_APPS_API_TOKEN")
    fi

    # Azure Function App publish profile
    print_info "Fetching Function App publish profile..."
    if SECRETS[AZURE_FUNCTIONAPP_PUBLISH_PROFILE]=$(az functionapp deployment list-publishing-profiles \
        --name "$FUNCTION_APP" \
        --resource-group "$RESOURCE_GROUP" \
        --xml 2>/dev/null); then
        print_success "AZURE_FUNCTIONAPP_PUBLISH_PROFILE"
    else
        print_warning "AZURE_FUNCTIONAPP_PUBLISH_PROFILE not found (may need manual setup)"
        SKIPPED_SECRETS+=("AZURE_FUNCTIONAPP_PUBLISH_PROFILE")
    fi

    # Cosmos DB endpoint
    print_info "Fetching Cosmos DB endpoint..."
    if SECRETS[COSMOS_ENDPOINT]=$(az cosmosdb show \
        --name "$COSMOS_ACCOUNT" \
        --resource-group "$RESOURCE_GROUP" \
        --query "documentEndpoint" -o tsv 2>/dev/null); then
        print_success "COSMOS_ENDPOINT"
    else
        print_warning "COSMOS_ENDPOINT not found"
        SKIPPED_SECRETS+=("COSMOS_ENDPOINT")
    fi

    # Cosmos DB key
    print_info "Fetching Cosmos DB primary key..."
    if SECRETS[COSMOS_KEY]=$(az cosmosdb keys list \
        --name "$COSMOS_ACCOUNT" \
        --resource-group "$RESOURCE_GROUP" \
        --query "primaryMasterKey" -o tsv 2>/dev/null); then
        print_success "COSMOS_KEY"
    else
        print_warning "COSMOS_KEY not found"
        SKIPPED_SECRETS+=("COSMOS_KEY")
    fi

    # Cosmos DB database and container (static values)
    SECRETS[COSMOS_DATABASE]="$COSMOS_DATABASE"
    print_success "COSMOS_DATABASE"

    SECRETS[COSMOS_CONTAINER]="$COSMOS_CONTAINER"
    print_success "COSMOS_CONTAINER"

    # Azure Communication Services connection string
    print_info "Fetching Azure Communication Services connection string..."
    if SECRETS[AZURE_COMMUNICATION_CONNECTION_STRING]=$(az communication list-key \
        --name "$COMMUNICATION_SERVICE" \
        --resource-group "$RESOURCE_GROUP" \
        --query "primaryConnectionString" -o tsv 2>/dev/null); then
        print_success "AZURE_COMMUNICATION_CONNECTION_STRING"
    else
        print_warning "AZURE_COMMUNICATION_CONNECTION_STRING not found (may need manual setup)"
        SKIPPED_SECRETS+=("AZURE_COMMUNICATION_CONNECTION_STRING")
    fi

    # Static configuration values
    SECRETS[AZURE_COMMUNICATION_SENDER_EMAIL]="noreply@9vectors.com"
    print_success "AZURE_COMMUNICATION_SENDER_EMAIL"

    SECRETS[FRONTEND_URL]="https://www.9vectors.com"
    print_success "FRONTEND_URL"

    SECRETS[VITE_API_URL]="https://${FUNCTION_APP}.azurewebsites.net/api"
    print_success "VITE_API_URL"

    # Try to get existing Function App settings (these may be user-configured)
    print_info "Checking existing Function App settings..."
    if az functionapp config appsettings list \
        --name "$FUNCTION_APP" \
        --resource-group "$RESOURCE_GROUP" &> /dev/null; then

        local app_settings=$(az functionapp config appsettings list \
            --name "$FUNCTION_APP" \
            --resource-group "$RESOURCE_GROUP" -o json 2>/dev/null)

        # Try to extract settings that might already be configured
        for setting in AUTH0_DOMAIN AUTH0_AUDIENCE JWT_SECRET \
                      AZURE_AD_B2C_TENANT_NAME AZURE_AD_B2C_CLIENT_ID AZURE_AD_B2C_CLIENT_SECRET AZURE_AD_B2C_POLICY_NAME \
                      ANTHROPIC_API_KEY \
                      STRIPE_SECRET_KEY STRIPE_WEBHOOK_SECRET STRIPE_PRICE_STARTER STRIPE_PRICE_PROFESSIONAL STRIPE_PRICE_ENTERPRISE \
                      VITE_AUTH0_DOMAIN VITE_AUTH0_CLIENT_ID VITE_AUTH0_AUDIENCE \
                      VITE_AZURE_AD_B2C_TENANT_NAME VITE_AZURE_AD_B2C_CLIENT_ID \
                      VITE_AZURE_AD_B2C_SIGN_UP_SIGN_IN_POLICY VITE_AZURE_AD_B2C_RESET_PASSWORD_POLICY VITE_AZURE_AD_B2C_EDIT_PROFILE_POLICY \
                      VITE_ANTHROPIC_API_KEY VITE_STRIPE_PUBLISHABLE_KEY; do

            local value=$(echo "$app_settings" | jq -r ".[] | select(.name==\"$setting\") | .value" 2>/dev/null || echo "")
            if [ -n "$value" ] && [ "$value" != "null" ]; then
                SECRETS[$setting]="$value"
                print_success "$setting (from Function App)"
            fi
        done
    fi

    # Check for service principal credentials file
    if [ -f ".azure/azure-credentials.json" ]; then
        print_info "Found azure-credentials.json file"
        SECRETS[AZURE_CREDENTIALS]=$(cat .azure/azure-credentials.json)
        print_success "AZURE_CREDENTIALS (from file)"
    else
        print_warning "AZURE_CREDENTIALS not found (.azure/azure-credentials.json missing)"
        print_info "Run ./setup-azure-credentials.sh to create service principal"
        SKIPPED_SECRETS+=("AZURE_CREDENTIALS")
    fi
}

display_secrets_summary() {
    print_header "Secrets Summary"

    echo -e "${GREEN}Retrieved Secrets (${#SECRETS[@]}):${NC}"
    for key in "${!SECRETS[@]}"; do
        local value="${SECRETS[$key]}"
        local preview
        if [ ${#value} -gt 50 ]; then
            preview="${value:0:20}...${value: -10}"
        else
            preview="${value:0:10}..."
        fi
        echo "  • $key: $preview"
    done

    if [ ${#SKIPPED_SECRETS[@]} -gt 0 ]; then
        echo -e "\n${YELLOW}Skipped Secrets (${#SKIPPED_SECRETS[@]}):${NC}"
        for key in "${SKIPPED_SECRETS[@]}"; do
            echo "  • $key (requires manual configuration)"
        done
    fi
}

upload_to_github() {
    local repo=$1

    print_header "Uploading Secrets to GitHub: $repo"

    for key in "${!SECRETS[@]}"; do
        local value="${SECRETS[$key]}"

        if [ -z "$value" ]; then
            print_warning "Skipping $key (empty value)"
            SKIP_COUNT=$((SKIP_COUNT + 1))
            continue
        fi

        if [ "$DRY_RUN" = true ]; then
            print_info "[DRY RUN] Would set: $key"
            SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        else
            if echo "$value" | gh secret set "$key" --repo "$repo" 2>/dev/null; then
                print_success "$key"
                SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
            else
                print_error "$key (upload failed)"
                FAILED_SECRETS+=("$key")
                FAIL_COUNT=$((FAIL_COUNT + 1))
            fi
        fi
    done
}

print_final_report() {
    print_header "Final Report"

    echo -e "${GREEN}✓ Successfully set: $SUCCESS_COUNT secrets${NC}"

    if [ $FAIL_COUNT -gt 0 ]; then
        echo -e "${RED}✗ Failed: $FAIL_COUNT secrets${NC}"
        for key in "${FAILED_SECRETS[@]}"; do
            echo "    • $key"
        done
    fi

    if [ $SKIP_COUNT -gt 0 ]; then
        echo -e "${YELLOW}⊘ Skipped: $SKIP_COUNT secrets${NC}"
    fi

    if [ ${#SKIPPED_SECRETS[@]} -gt 0 ]; then
        echo -e "\n${YELLOW}Secrets requiring manual configuration:${NC}"
        for key in "${SKIPPED_SECRETS[@]}"; do
            echo "  • $key"
        done
        echo -e "\n${BLUE}See .azure/GITHUB_SECRETS.md for manual setup instructions.${NC}"
    fi

    if [ "$DRY_RUN" = true ]; then
        echo -e "\n${BLUE}This was a dry run. No secrets were uploaded.${NC}"
        echo -e "${BLUE}Run without --dry-run to upload secrets to GitHub.${NC}"
    fi
}

################################################################################
# Main Script
################################################################################

main() {
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --skip-confirmation)
                SKIP_CONFIRMATION=true
                shift
                ;;
            --repo)
                GITHUB_REPO="$2"
                shift 2
                ;;
            -h|--help)
                print_usage
                ;;
            *)
                print_error "Unknown option: $1"
                print_usage
                ;;
        esac
    done

    # Print banner
    echo -e "${BLUE}"
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║                                                               ║"
    echo "║           9Vectors GitHub Secrets Setup Script               ║"
    echo "║                                                               ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"

    # Check prerequisites
    check_prerequisites

    # Detect GitHub repository
    local repo=$(get_github_repo)
    if [ -z "$repo" ]; then
        print_error "Could not detect GitHub repository"
        echo "Please specify with --repo OWNER/REPO or run from a git repository"
        exit 1
    fi

    print_info "Target repository: $repo"

    # Retrieve secrets from Azure
    retrieve_azure_secrets

    # Display summary
    display_secrets_summary

    # Confirmation prompt
    if [ "$SKIP_CONFIRMATION" = false ] && [ "$DRY_RUN" = false ]; then
        echo ""
        read -p "$(echo -e ${YELLOW}Upload ${#SECRETS[@]} secrets to GitHub repository $repo? [y/N]: ${NC})" -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Operation cancelled by user"
            exit 0
        fi
    fi

    # Upload to GitHub
    upload_to_github "$repo"

    # Print final report
    print_final_report

    # Exit with appropriate code
    if [ $FAIL_COUNT -gt 0 ]; then
        exit 1
    else
        exit 0
    fi
}

# Run main function
main "$@"
