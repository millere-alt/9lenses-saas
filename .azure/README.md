# Azure Deployment Documentation for 9Vectors

This folder contains all automation scripts and documentation for deploying 9vectors.com to Azure.

## 📁 Files Overview

| File | Purpose |
|------|---------|
| **QUICKSTART.md** | 🚀 Fast deployment guide (start here!) |
| **AZURE_SETUP.md** | 📖 Complete setup documentation |
| **DNS_MIGRATION_GUIDE.md** | 🌐 GoDaddy to Azure DNS migration |
| **deploy-azure-infrastructure.sh** | ⚙️ Automated infrastructure setup script |
| **verify-deployment.sh** | ✅ Deployment verification script |

## 🚀 Quick Start

New to this setup? Follow these steps:

1. **Read**: [QUICKSTART.md](./QUICKSTART.md) - 30-minute deployment guide
2. **Run**: `./deploy-azure-infrastructure.sh` - Create Azure resources
3. **Configure**: Add GitHub secrets for CI/CD
4. **Migrate**: Follow [DNS_MIGRATION_GUIDE.md](./DNS_MIGRATION_GUIDE.md)
5. **Verify**: Run `./verify-deployment.sh`

## 📋 Deployment Checklist

### Phase 1: Azure Setup (Day 1)
- [ ] Run `deploy-azure-infrastructure.sh`
- [ ] Create Service Principal for GitHub
- [ ] Configure GitHub Secrets
- [ ] Push to trigger first deployment
- [ ] Verify app at azurewebsites.net URL

### Phase 2: DNS Configuration (Day 1)
- [ ] Get Azure nameservers
- [ ] Configure DNS records in Azure
- [ ] Add custom domains to Web App
- [ ] Update GoDaddy nameservers

### Phase 3: DNS Propagation (Day 1-2)
- [ ] Wait for DNS propagation
- [ ] Monitor with whatsmydns.net
- [ ] Verify DNS resolves correctly

### Phase 4: SSL Setup (Day 2-3)
- [ ] Create managed SSL certificates
- [ ] Verify HTTPS works
- [ ] Test both www and root domain

### Phase 5: Go Live (Day 3)
- [ ] Run `verify-deployment.sh`
- [ ] Test all functionality
- [ ] Monitor logs and metrics
- [ ] Update any external links

## 🏗️ Infrastructure Components

### Azure Resources Created

```
9vectors-rg (Resource Group)
├── 9vectors-asp (App Service Plan - B1 Linux)
├── 9vectors-app (Web App - Node.js 20)
└── 9vectors.com (DNS Zone)
```

### Cost Breakdown

- **App Service Plan (B1)**: ~$13/month
- **DNS Zone**: $0.50/month
- **Bandwidth**: First 100GB free
- **SSL Certificates**: Free (managed)
- **Total**: ~$14/month

## 🔄 CI/CD Pipeline

Automated via GitHub Actions:

1. **Trigger**: Push to `main` branch
2. **Build**: Install deps → Build Vite app
3. **Deploy**: Package → Deploy to Azure
4. **Verify**: Health check

**Workflow**: [.github/workflows/azure-deploy.yml](../.github/workflows/azure-deploy.yml)

## 🌐 DNS Architecture

```
9vectors.com
├── @ (root)     → A record → Azure App Service IP
├── www          → CNAME → 9vectors-app.azurewebsites.net
└── asuid        → TXT → Domain verification
```

## 🔐 GitHub Secrets Required

| Secret | Description | Example |
|--------|-------------|---------|
| `AZURE_CREDENTIALS` | Service Principal JSON | `{clientId: "...", ...}` |
| `VITE_API_URL` | Production API URL | `https://9vectors.com/api` |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe public key | `pk_live_...` |

## 📊 Monitoring & Management

### View Application Logs
```bash
az webapp log tail --name 9vectors-app --resource-group 9vectors-rg
```

### Check Deployment Status
```bash
./verify-deployment.sh
```

### Restart Application
```bash
az webapp restart --name 9vectors-app --resource-group 9vectors-rg
```

### Scale Up/Out
```bash
# Upgrade to S1 tier
az appservice plan update --name 9vectors-asp --resource-group 9vectors-rg --sku S1

# Add more instances
az appservice plan update --name 9vectors-asp --resource-group 9vectors-rg --number-of-workers 2
```

## 🐛 Troubleshooting

| Problem | Solution | Documentation |
|---------|----------|---------------|
| Deployment fails | Check GitHub Actions logs | [AZURE_SETUP.md](./AZURE_SETUP.md#troubleshooting) |
| DNS not resolving | Wait for propagation (48h) | [DNS_MIGRATION_GUIDE.md](./DNS_MIGRATION_GUIDE.md#troubleshooting) |
| SSL fails | Ensure DNS propagated first | [AZURE_SETUP.md](./AZURE_SETUP.md#troubleshooting) |
| 404 errors | Check build output & startup | [AZURE_SETUP.md](./AZURE_SETUP.md#troubleshooting) |

## 🔒 Security Features

- ✅ HTTPS-only enforcement
- ✅ Security headers (XSS, frame options, etc.)
- ✅ Managed SSL certificates with auto-renewal
- ✅ Azure Active Directory integration for secrets
- ✅ Network isolation options available

## 📈 Scaling Options

### Vertical Scaling (Bigger Instances)
- **B1**: 1 core, 1.75 GB RAM - Current
- **S1**: 1 core, 1.75 GB RAM + staging slots
- **P1V2**: 1 core, 3.5 GB RAM + premium features
- **P2V2**: 2 cores, 7 GB RAM

### Horizontal Scaling (More Instances)
- **Manual**: `az appservice plan update --number-of-workers N`
- **Auto-scale**: Configure rules based on CPU/memory

### Global Distribution
- Add **Azure Front Door** for CDN + global load balancing
- Add **Azure Traffic Manager** for geo-routing

## 🔄 Update Workflow

### For Code Changes
```bash
git add .
git commit -m "Your changes"
git push origin main
# GitHub Actions deploys automatically
```

### For Infrastructure Changes
```bash
# Modify infrastructure as needed
az webapp config set ...
az network dns record-set ...
# Document changes here
```

### For Environment Variables
```bash
# Update GitHub Secrets, then redeploy
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

## 📚 Additional Resources

### Azure Documentation
- [App Service](https://docs.microsoft.com/azure/app-service/)
- [Azure DNS](https://docs.microsoft.com/azure/dns/)
- [App Service Deployment](https://docs.microsoft.com/azure/app-service/deploy-continuous-deployment)

### Tools
- [Azure Portal](https://portal.azure.com)
- [GitHub Actions Status](https://github.com/millere-alt/9lenses-saas/actions)
- [DNS Checker](https://www.whatsmydns.net/)
- [SSL Checker](https://www.ssllabs.com/ssltest/)

## 🆘 Support

### Check Status
1. Run `./verify-deployment.sh`
2. Check GitHub Actions for errors
3. Review Azure logs

### Get Help
- Azure Support: https://portal.azure.com (Support + Help)
- GitHub Issues: Repository issues tab
- Azure CLI Docs: `az webapp --help`

## 📝 Change Log

Track major infrastructure changes here:

| Date | Change | Author |
|------|--------|--------|
| 2025-10-14 | Initial Azure setup created | Claude |

## 🎯 Next Steps

After successful deployment:

1. **Monitor**: Set up Application Insights
2. **Optimize**: Review performance metrics
3. **Secure**: Enable Azure Key Vault for secrets
4. **Backup**: Configure backup schedule
5. **Test**: Set up automated testing in pipeline

---

**Need help?** Start with [QUICKSTART.md](./QUICKSTART.md) or [AZURE_SETUP.md](./AZURE_SETUP.md)
