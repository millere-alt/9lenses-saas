#!/usr/bin/env bash

################################################################################
# Setup GitHub Secrets Script (Bash 3.2+ Compatible)
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

# Secret tracking (using simple counters and temp files)
SUCCESS_COUNT=0
FAIL_COUNT=0
SKIP_COUNT=0
SECRETS_DIR=$(mktemp -d)
FAILED_SECRETS_FILE="$SECRETS_DIR/failed.txt"
SKIPPED_SECRETS_FILE="$SECRETS_DIR/skipped.txt"

# Cleanup temp files on exit
trap 'rm -rf "$SECRETS_DIR"' EXIT

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

set_secret() {
    local key="$1"
    local value="$2"
    echo "$value" > "$SECRETS_DIR/$key"
}

get_secret() {
    local key="$1"
    if [ -f "$SECRETS_DIR/$key" ]; then
        cat "$SECRETS_DIR/$key"
    else
        echo ""
    fi
}

has_secret() {
    local key="$1"
    [ -f "$SECRETS_DIR/$key" ]
}

list_secrets() {
    ls "$SECRETS_DIR" 2>/dev/null | grep -v -E '(failed|skipped)\.txt' || true
}

add_failed_secret() {
    echo "$1" >> "$FAILED_SECRETS_FILE"
}

add_skipped_secret() {
    echo "$1" >> "$SKIPPED_SECRETS_FILE"
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

read_env_file() {
    local env_file="$1"
    local key="$2"

    if [ ! -f "$env_file" ]; then
        return 1
    fi

    # Read the value from .env file (handle comments and empty lines)
    local value=$(grep "^${key}=" "$env_file" | head -1 | cut -d'=' -f2- | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

    if [ -n "$value" ]; then
        echo "$value"
        return 0
    fi

    return 1
}

retrieve_azure_secrets() {
    print_header "Retrieving Secrets from Azure"

    # Azure Static Web Apps deployment token
    print_info "Fetching Static Web App deployment token..."
    if value=$(az staticwebapp secrets list \
        --name "$STATIC_WEB_APP" \
        --resource-group "$RESOURCE_GROUP" \
        --query "properties.apiKey" -o tsv 2>/dev/null); then
        set_secret "AZURE_STATIC_WEB_APPS_API_TOKEN" "$value"
        print_success "AZURE_STATIC_WEB_APPS_API_TOKEN"
    else
        print_warning "AZURE_STATIC_WEB_APPS_API_TOKEN not found (may need manual setup)"
        add_skipped_secret "AZURE_STATIC_WEB_APPS_API_TOKEN"
    fi

    # Azure Function App publish profile
    print_info "Fetching Function App publish profile..."
    if value=$(az functionapp deployment list-publishing-profiles \
        --name "$FUNCTION_APP" \
        --resource-group "$RESOURCE_GROUP" \
        --xml 2>/dev/null); then
        set_secret "AZURE_FUNCTIONAPP_PUBLISH_PROFILE" "$value"
        print_success "AZURE_FUNCTIONAPP_PUBLISH_PROFILE"
    else
        print_warning "AZURE_FUNCTIONAPP_PUBLISH_PROFILE not found (may need manual setup)"
        add_skipped_secret "AZURE_FUNCTIONAPP_PUBLISH_PROFILE"
    fi

    # Cosmos DB endpoint
    print_info "Fetching Cosmos DB endpoint..."
    if value=$(az cosmosdb show \
        --name "$COSMOS_ACCOUNT" \
        --resource-group "$RESOURCE_GROUP" \
        --query "documentEndpoint" -o tsv 2>/dev/null); then
        set_secret "COSMOS_ENDPOINT" "$value"
        print_success "COSMOS_ENDPOINT"
    else
        print_warning "COSMOS_ENDPOINT not found"
        add_skipped_secret "COSMOS_ENDPOINT"
    fi

    # Cosmos DB key
    print_info "Fetching Cosmos DB primary key..."
    if value=$(az cosmosdb keys list \
        --name "$COSMOS_ACCOUNT" \
        --resource-group "$RESOURCE_GROUP" \
        --query "primaryMasterKey" -o tsv 2>/dev/null); then
        set_secret "COSMOS_KEY" "$value"
        print_success "COSMOS_KEY"
    else
        print_warning "COSMOS_KEY not found"
        add_skipped_secret "COSMOS_KEY"
    fi

    # Cosmos DB database and container (static values)
    set_secret "COSMOS_DATABASE" "$COSMOS_DATABASE"
    print_success "COSMOS_DATABASE"

    set_secret "COSMOS_CONTAINER" "$COSMOS_CONTAINER"
    print_success "COSMOS_CONTAINER"

    # Azure Communication Services connection string
    print_info "Fetching Azure Communication Services connection string..."

    # First try to read from api/.env file
    if value=$(read_env_file "api/.env" "AZURE_COMMUNICATION_CONNECTION_STRING" 2>/dev/null); then
        set_secret "AZURE_COMMUNICATION_CONNECTION_STRING" "$value"
        print_success "AZURE_COMMUNICATION_CONNECTION_STRING (from api/.env)"
    # Fallback to Azure CLI
    elif value=$(az communication list-key \
        --name "$COMMUNICATION_SERVICE" \
        --resource-group "$RESOURCE_GROUP" \
        --query "primaryConnectionString" -o tsv 2>/dev/null); then
        set_secret "AZURE_COMMUNICATION_CONNECTION_STRING" "$value"
        print_success "AZURE_COMMUNICATION_CONNECTION_STRING (from Azure)"
    else
        print_warning "AZURE_COMMUNICATION_CONNECTION_STRING not found (may need manual setup)"
        add_skipped_secret "AZURE_COMMUNICATION_CONNECTION_STRING"
    fi

    # Azure Communication Services sender email
    print_info "Fetching Azure Communication Services sender email..."

    # First try to read from api/.env file
    if value=$(read_env_file "api/.env" "AZURE_COMMUNICATION_SENDER_EMAIL" 2>/dev/null); then
        set_secret "AZURE_COMMUNICATION_SENDER_EMAIL" "$value"
        print_success "AZURE_COMMUNICATION_SENDER_EMAIL (from api/.env)"
    else
        # Use default value
        set_secret "AZURE_COMMUNICATION_SENDER_EMAIL" "noreply@9vectors.com"
        print_success "AZURE_COMMUNICATION_SENDER_EMAIL (default)"
    fi

    set_secret "FRONTEND_URL" "https://www.9vectors.com"
    print_success "FRONTEND_URL"

    set_secret "VITE_API_URL" "https://${FUNCTION_APP}.azurewebsites.net/api"
    print_success "VITE_API_URL"

    # JWT Secret from api/.env
    print_info "Fetching JWT secret..."
    if value=$(read_env_file "api/.env" "JWT_SECRET" 2>/dev/null); then
        set_secret "JWT_SECRET" "$value"
        print_success "JWT_SECRET (from api/.env)"
    else
        print_warning "JWT_SECRET not found in api/.env (may need manual setup)"
        add_skipped_secret "JWT_SECRET"
    fi

    # JWT Refresh Secret from api/.env
    print_info "Fetching JWT refresh secret..."
    if value=$(read_env_file "api/.env" "JWT_REFRESH_SECRET" 2>/dev/null); then
        set_secret "JWT_REFRESH_SECRET" "$value"
        print_success "JWT_REFRESH_SECRET (from api/.env)"
    else
        print_warning "JWT_REFRESH_SECRET not found in api/.env"
        add_skipped_secret "JWT_REFRESH_SECRET"
    fi

    # Check for service principal credentials file
    if [ -f ".azure/azure-credentials.json" ]; then
        print_info "Found azure-credentials.json file"
        set_secret "AZURE_CREDENTIALS" "$(cat .azure/azure-credentials.json)"
        print_success "AZURE_CREDENTIALS (from file)"
    else
        print_warning "AZURE_CREDENTIALS not found (.azure/azure-credentials.json missing)"
        print_info "Run ./setup-azure-credentials.sh to create service principal"
        add_skipped_secret "AZURE_CREDENTIALS"
    fi

    print_info "\nNote: User-configured secrets (Auth0, Stripe, Anthropic) must be set manually."
    print_info "See .azure/GITHUB_SECRETS.md for complete list."
}

display_secrets_summary() {
    print_header "Secrets Summary"

    local secret_count=$(list_secrets | wc -l | tr -d ' ')
    echo -e "${GREEN}Retrieved Secrets ($secret_count):${NC}"
    for key in $(list_secrets); do
        local value=$(get_secret "$key")
        local preview
        if [ ${#value} -gt 50 ]; then
            preview="${value:0:20}...${value: -10}"
        else
            preview="${value:0:10}..."
        fi
        echo "  • $key: $preview"
    done

    if [ -f "$SKIPPED_SECRETS_FILE" ]; then
        local skipped_count=$(wc -l < "$SKIPPED_SECRETS_FILE" | tr -d ' ')
        if [ "$skipped_count" -gt 0 ]; then
            echo -e "\n${YELLOW}Skipped Secrets ($skipped_count):${NC}"
            while IFS= read -r key; do
                echo "  • $key (requires manual configuration)"
            done < "$SKIPPED_SECRETS_FILE"
        fi
    fi
}

upload_to_github() {
    local repo=$1

    print_header "Uploading Secrets to GitHub: $repo"

    for key in $(list_secrets); do
        local value=$(get_secret "$key")

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
                add_failed_secret "$key"
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
        if [ -f "$FAILED_SECRETS_FILE" ]; then
            while IFS= read -r key; do
                echo "    • $key"
            done < "$FAILED_SECRETS_FILE"
        fi
    fi

    if [ $SKIP_COUNT -gt 0 ]; then
        echo -e "${YELLOW}⊘ Skipped: $SKIP_COUNT secrets${NC}"
    fi

    if [ -f "$SKIPPED_SECRETS_FILE" ]; then
        local skipped_count=$(wc -l < "$SKIPPED_SECRETS_FILE" | tr -d ' ')
        if [ "$skipped_count" -gt 0 ]; then
            echo -e "\n${YELLOW}Secrets requiring manual configuration:${NC}"
            while IFS= read -r key; do
                echo "  • $key"
            done < "$SKIPPED_SECRETS_FILE"
            echo -e "\n${BLUE}See .azure/GITHUB_SECRETS.md for manual setup instructions.${NC}"
        fi
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
        local secret_count=$(list_secrets | wc -l | tr -d ' ')
        echo ""
        read -p "$(echo -e ${YELLOW}Upload $secret_count secrets to GitHub repository $repo? [y/N]: ${NC})" -n 1 -r
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
