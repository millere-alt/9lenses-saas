# DNS Migration Guide: GoDaddy to Azure DNS

This guide walks you through migrating 9vectors.com DNS from GoDaddy to Azure DNS.

## Prerequisites

- Azure DNS Zone created (done by deployment script)
- Access to GoDaddy account
- Domain: 9vectors.com registered at GoDaddy

## Step 1: Get Azure DNS Nameservers

After running the deployment script, you'll receive 4 Azure nameservers. They look like:

```
ns1-01.azure-dns.com
ns2-01.azure-dns.net
ns3-01.azure-dns.org
ns4-01.azure-dns.info
```

If you need to retrieve them again:

```bash
az network dns zone show \
  --resource-group 9vectors-rg \
  --name 9vectors.com \
  --query nameServers -o tsv
```

## Step 2: Configure DNS Records in Azure

Before switching nameservers, configure all DNS records in Azure:

### A Record for Root Domain

Get your Web App IP address:

```bash
# Get the Web App's default hostname
WEB_APP_HOSTNAME=$(az webapp show \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --query defaultHostName -o tsv)

# First, add custom domain (this validates ownership)
az webapp config hostname add \
  --webapp-name 9vectors-app \
  --resource-group 9vectors-rg \
  --hostname 9vectors.com
```

Create DNS records:

```bash
# Create CNAME for www
az network dns record-set cname set-record \
  --resource-group 9vectors-rg \
  --zone-name 9vectors.com \
  --record-set-name www \
  --cname 9vectors-app.azurewebsites.net

# Create A record for root domain (@)
# Note: You'll need to create a TXT record for domain verification first
az network dns record-set txt add-record \
  --resource-group 9vectors-rg \
  --zone-name 9vectors.com \
  --record-set-name asuid \
  --value $(az webapp show \
    --name 9vectors-app \
    --resource-group 9vectors-rg \
    --query customDomainVerificationId -o tsv)

# Create A record pointing to Azure Traffic Manager or App Service IP
# For App Service, use CNAME for www and redirect root to www
az network dns record-set a add-record \
  --resource-group 9vectors-rg \
  --zone-name 9vectors.com \
  --record-set-name @ \
  --ipv4-address <APP_SERVICE_IP>
```

### Alternative: Use CNAME for both (recommended)

```bash
# Create CNAME for www
az network dns record-set cname set-record \
  --resource-group 9vectors-rg \
  --zone-name 9vectors.com \
  --record-set-name www \
  --cname 9vectors-app.azurewebsites.net

# For root domain, use ALIAS record or Azure Front Door
# (Azure DNS supports ALIAS records at the zone apex)
```

### Other useful records

```bash
# Add MX records if you have email
az network dns record-set mx add-record \
  --resource-group 9vectors-rg \
  --zone-name 9vectors.com \
  --record-set-name @ \
  --exchange mail.9vectors.com \
  --preference 10

# Add TXT record for SPF
az network dns record-set txt add-record \
  --resource-group 9vectors-rg \
  --zone-name 9vectors.com \
  --record-set-name @ \
  --value "v=spf1 include:_spf.google.com ~all"
```

## Step 3: Update Nameservers at GoDaddy

### Via GoDaddy Website:

1. Log in to GoDaddy: https://dcc.godaddy.com/
2. Go to **My Products** → **Domains**
3. Click on **9vectors.com**
4. Scroll to **Nameservers** section
5. Click **Change**
6. Select **Custom** nameservers
7. Enter all 4 Azure nameservers:
   - ns1-01.azure-dns.com
   - ns2-01.azure-dns.net
   - ns3-01.azure-dns.org
   - ns4-01.azure-dns.info
8. Click **Save**

### Via GoDaddy API (Optional):

You can also use the GoDaddy API if you have API credentials.

## Step 4: Verify DNS Propagation

DNS changes can take 24-48 hours to fully propagate, but usually happen within a few hours.

Check nameservers:

```bash
# Check if nameservers have updated
dig NS 9vectors.com

# Or use nslookup
nslookup -type=NS 9vectors.com
```

Check DNS records:

```bash
# Check A record
dig A 9vectors.com

# Check CNAME
dig CNAME www.9vectors.com

# Use Google DNS for checking
dig @8.8.8.8 9vectors.com
```

Online tools:
- https://www.whatsmydns.net/
- https://dnschecker.org/

## Step 5: Configure SSL Certificate in Azure

Once DNS is pointing to Azure, configure SSL:

```bash
# Add custom domain
az webapp config hostname add \
  --webapp-name 9vectors-app \
  --resource-group 9vectors-rg \
  --hostname 9vectors.com

az webapp config hostname add \
  --webapp-name 9vectors-app \
  --resource-group 9vectors-rg \
  --hostname www.9vectors.com

# Create managed SSL certificate
az webapp config ssl create \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --hostname 9vectors.com

az webapp config ssl create \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --hostname www.9vectors.com

# Bind SSL certificate
az webapp config ssl bind \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --certificate-thumbprint <THUMBPRINT> \
  --ssl-type SNI
```

## Step 6: Verify Everything Works

Test the application:

```bash
# Test HTTPS
curl -I https://9vectors.com
curl -I https://www.9vectors.com

# Verify certificate
openssl s_client -connect 9vectors.com:443 -servername 9vectors.com
```

Check in browser:
- https://9vectors.com
- https://www.9vectors.com

## Troubleshooting

### DNS not resolving
- Wait longer (up to 48 hours)
- Clear local DNS cache: `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder` (macOS)
- Try different DNS servers (8.8.8.8, 1.1.1.1)

### SSL certificate issues
- Ensure DNS is fully propagated first
- Verify domain ownership records are in place
- Check App Service logs

### Application not loading
- Check App Service deployment logs
- Verify GitHub Actions ran successfully
- Check environment variables are set

## Rollback Plan

If you need to rollback:

1. Log back into GoDaddy
2. Change nameservers back to GoDaddy's default nameservers
3. DNS will revert to old configuration

## Important Notes

- **Keep GoDaddy domain registration**: We're only moving DNS management to Azure, not the domain registration
- **Backup current DNS**: Before switching, export or screenshot all current DNS records from GoDaddy
- **Email considerations**: If you have email service, ensure MX records are properly configured before switching
- **TTL values**: Lower TTL values before migration for faster rollback if needed

## Complete DNS Record Checklist

Before switching nameservers, ensure you have:

- [ ] A/CNAME record for root domain (@)
- [ ] CNAME record for www
- [ ] TXT record for domain verification (asuid)
- [ ] MX records (if using email)
- [ ] SPF/DKIM/DMARC records (if using email)
- [ ] Any other subdomains (api, staging, etc.)

## Timeline

| Time | Action |
|------|--------|
| T-0 | Create Azure DNS zone and records |
| T-0 | Verify all records in Azure |
| T-0 | Update nameservers at GoDaddy |
| T+1h | Start checking DNS propagation |
| T+4h | Most DNS should be propagated |
| T+24h | Configure SSL certificates |
| T+48h | Full propagation complete |

## Support

If you encounter issues:
- Azure DNS: https://docs.microsoft.com/azure/dns/
- GoDaddy Support: https://www.godaddy.com/help
- DNS Propagation checker: https://www.whatsmydns.net/
