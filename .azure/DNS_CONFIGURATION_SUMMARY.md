# DNS Configuration Summary

**Date**: October 23, 2025
**Status**: ✅ DNS Zones and Records Configured
**Next Steps**: DNS Propagation + Custom Domain Validation

---

## DNS Zones Created

### 9vectors.com
- **Resource Group**: 9vectors-rg
- **Status**: ✅ Already existed
- **Nameservers**:
  - ns1-09.azure-dns.com.
  - ns2-09.azure-dns.net.
  - ns3-09.azure-dns.org.
  - ns4-09.azure-dns.info.

### 9vectors.ai
- **Resource Group**: 9vectors-rg
- **Status**: ✅ Newly created
- **Nameservers**:
  - ns1-04.azure-dns.com.
  - ns2-04.azure-dns.net.
  - ns3-04.azure-dns.org.
  - ns4-04.azure-dns.info.

---

## DNS Records Configured

### 9vectors.com DNS Records

| Record Type | Name | Target | TTL | Status |
|-------------|------|--------|-----|--------|
| A | @ | 20.169.91.64 | 3600 | ✅ Created |
| CNAME | www | agreeable-bush-03cb6a40f.2.azurestaticapps.net | 3600 | ✅ Already existed |

### 9vectors.ai DNS Records

| Record Type | Name | Target | TTL | Status |
|-------------|------|--------|-----|--------|
| A | @ | 20.169.91.64 | 3600 | ✅ Created |
| CNAME | www | agreeable-bush-03cb6a40f.2.azurestaticapps.net | 3600 | ✅ Created |

---

## Azure Static Web App Custom Domains

**Static Web App**: 9vectors-app
**Default Hostname**: agreeable-bush-03cb6a40f.2.azurestaticapps.net

### Currently Configured Domains

- ✅ 9vectors.com (active)
- ✅ www.9vectors.com (active)

### Pending Configuration (After DNS Propagation)

- ⏳ 9vectors.ai (requires DNS TXT validation)
- ⏳ www.9vectors.ai (requires CNAME propagation)

---

## Next Steps

### 1. Update Domain Registrar Nameservers

You need to update the nameservers at your domain registrar (where you purchased the domains) to point to Azure DNS.

**For 9vectors.com** (if not already done):
```
ns1-09.azure-dns.com
ns2-09.azure-dns.net
ns3-09.azure-dns.org
ns4-09.azure-dns.info
```

**For 9vectors.ai** (NEW - must be done):
```
ns1-04.azure-dns.com
ns2-04.azure-dns.net
ns3-04.azure-dns.org
ns4-04.azure-dns.info
```

### 2. Wait for DNS Propagation

DNS changes can take 24-48 hours to fully propagate globally, but usually occur within 15-30 minutes.

**Check propagation status**:
```bash
# Check 9vectors.com
dig 9vectors.com
dig www.9vectors.com

# Check 9vectors.ai
dig 9vectors.ai
dig www.9vectors.ai

# Or use online tools
# https://dnschecker.org
```

### 3. Add Custom Domains to Static Web App

Once DNS has propagated (CNAME records are resolvable), add the domains:

**For 9vectors.ai (apex domain - requires TXT validation)**:
```bash
# This will provide a validation token that you need to add as a TXT record
az staticwebapp hostname set \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --hostname 9vectors.ai \
  --validation-method dns-txt-token
```

**For www.9vectors.ai**:
```bash
az staticwebapp hostname set \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --hostname www.9vectors.ai
```

### 4. Verify SSL Certificates

Azure automatically provisions free SSL/TLS certificates for custom domains. Verify they're active:

```bash
# Check SSL status
az staticwebapp show \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --query "customDomains"

# Test HTTPS access
curl -I https://9vectors.com
curl -I https://www.9vectors.com
curl -I https://9vectors.ai
curl -I https://www.9vectors.ai
```

---

## Current Status Summary

| Domain | DNS Zone | A Record | CNAME | Custom Domain | SSL |
|--------|----------|----------|-------|---------------|-----|
| 9vectors.com | ✅ | ✅ | ✅ (www) | ✅ | ✅ |
| www.9vectors.com | ✅ | N/A | ✅ | ✅ | ✅ |
| 9vectors.ai | ✅ | ✅ | ✅ (www) | ⏳ Pending | ⏳ Pending |
| www.9vectors.ai | ✅ | N/A | ✅ | ⏳ Pending | ⏳ Pending |

**Legend**:
- ✅ = Configured and active
- ⏳ = Configured but pending (DNS propagation or domain validation)
- ❌ = Not configured

---

## Troubleshooting

### Custom Domain Validation Fails

If adding custom domains fails with "CNAME Record is invalid":
1. Verify DNS propagation: `nslookup www.9vectors.ai`
2. Wait 15-30 minutes for propagation
3. Retry the `az staticwebapp hostname set` command

### SSL Certificate Not Provisioning

If SSL certificates don't automatically provision:
1. Verify custom domain is successfully added
2. Wait 10-15 minutes for automatic provisioning
3. Check Static Web App in Azure Portal → Custom Domains section

### DNS Not Resolving

If domains don't resolve after 24 hours:
1. Verify nameservers are updated at domain registrar
2. Check for typos in DNS records
3. Use `dig +trace 9vectors.ai` to trace DNS resolution path

---

## CLI Commands Reference

### List all DNS records
```bash
az network dns record-set list \
  --resource-group 9vectors-rg \
  --zone-name 9vectors.com \
  -o table
```

### List custom domains on Static Web App
```bash
az staticwebapp show \
  --name 9vectors-app \
  --resource-group 9vectors-rg \
  --query "{customDomains:customDomains, defaultHostname:defaultHostname}"
```

### Get nameservers for a DNS zone
```bash
az network dns zone show \
  --resource-group 9vectors-rg \
  --name 9vectors.ai \
  --query "nameServers"
```

---

## Summary

✅ **Completed**:
- DNS zone for 9vectors.com verified
- DNS zone for 9vectors.ai created
- A records configured for both apex domains
- CNAME records configured for www subdomains
- 9vectors.com and www.9vectors.com are active with SSL

⏳ **Pending** (Requires action):
1. Update nameservers at domain registrar for 9vectors.ai
2. Wait for DNS propagation (15-30 minutes)
3. Add 9vectors.ai and www.9vectors.ai as custom domains to Static Web App
4. Verify SSL certificates are provisioned

🎯 **End State**:
- All four domains (9vectors.com, www.9vectors.com, 9vectors.ai, www.9vectors.ai) will point to your Azure Static Web App
- All domains will have automatic SSL/TLS certificates
- Users can access your app via any of these domains
