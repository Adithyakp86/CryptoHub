# GitHub Workflows Documentation

This directory contains the automated CI/CD pipeline for CryptoHub.

## 📂 Workflow Files

### 1. `ci.yml` - Continuous Integration
**Triggers**: On `push` and `pull_request` to `main` and `develop`

**What it does**:
- ESLint code quality checks
- Unit tests with coverage
- Build verification
- Bundle size analysis
- Quality gate enforcement

**Outputs**:
- Test coverage reports (Codecov)
- Build artifacts
- PR comments with status

### 2. `cd.yml` - Continuous Deployment
**Triggers**: On `push` to `main` or `develop`

**What it does**:
- Deploys staging on `develop` branch
- Deploys production on `main` branch
- Docker image build and push
- Health checks
- Slack notifications
- Rollback handling

**Environment Access**:
- Staging: https://staging-cryptohub.vercel.app
- Production: https://cryptohub.vercel.app

### 3. `security.yml` - Security Scanning
**Triggers**: On `push`, `pull_request`, and daily (2 AM UTC)

**What it does**:
- npm audit for vulnerabilities
- CodeQL static analysis
- Snyk security scanning
- License compliance check
- Secret detection
- ESLint security rules

**Outputs**:
- Security reports in GitHub Security tab
- PR comments with findings
- Artifact reports

### 4. `quality.yml` - Code Quality Analysis
**Triggers**: On `push` and `pull_request`

**What it does**:
- Code complexity analysis
- Performance audits (Lighthouse)
- Accessibility testing (Axe)
- Type checking
- Dependency graph updates

**Outputs**:
- Quality metrics reports
- Performance scores
- Accessibility violations

## 🔑 Required Secrets

Store these in repository **Settings > Secrets and variables > Actions**:

```
Deployment Secrets:
- VERCEL_TOKEN
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID_STAGING
- VERCEL_PROJECT_ID_PROD

API Keys:
- COINGECKO_API_KEY
- STAGING_API_URL
- PRODUCTION_API_URL

Scanning Tokens:
- SNYK_TOKEN

Notifications:
- SLACK_WEBHOOK
```

## 🚀 How to Use

### Creating Issues
Issues automatically create notifications in workflow runs.

### Pull Request Workflow

1. Create a feature branch: `git checkout -b feature/xyz`
2. Push changes: `git push origin feature/xyz`
3. Open a PR against `main` or `develop`
4. CI workflow runs automatically
5. See results in PR checks
6. PR comments show detailed status
7. Fix any issues and re-push
8. Merge when all checks pass

### Deploying to Production

1. Ensure PR is merged to `main`
2. CD workflow automatically triggers
3. Staging deployment (if first)
4. Production deployment
5. Health checks verify success
6. Slack notification sent

## ⚙️ Workflow Parameters

### Matrix Testing
Workflows test against multiple Node versions:
- Node 18.x (LTS)
- Node 20.x (LTS)

This ensures compatibility across versions.

### Retry & Continue
Some jobs have `continue-on-error: true` to:
- Not block deployments for optional checks
- Capture security data even if vulnerable
- Allow reporting without blocking

### Artifacts
Generated artifacts are retained for:
- Test results: 30 days
- Security reports: 90 days
- Deployment reports: 30 days
- Build outputs: 7 days

## 📊 Monitoring

### GitHub Dashboard
- **Actions tab**: View workflow runs
- **Security tab**: See security scanning results
- **Environments**: Track deployments

### Codecov Dashboard
- Code coverage trends
- Per-file coverage analysis
- Coverage history

### Vercel Dashboard
- Deployment history
- Preview URLs for PRs
- Performance analytics

## 🔧 Customization

To modify workflows:

1. Edit `.github/workflows/*.yml`
2. Test changes in a feature branch
3. Verify with test runs
4. Document changes in PR

Common customizations:
- Change notification channels
- Add more test environments
- Adjust severity thresholds
- Add deployment steps

## 🐛 Debugging Failures

### Check Logs
1. Go to **Actions** tab
2. Click failed workflow run
3. Expand failed job
4. Review step logs

### Common Issues
- **Lint errors**: Run `npm run lint` locally
- **Test failures**: Run `npm test` locally
- **Build errors**: Run `npm run build` locally
- **Deployment failed**: Check Vercel logs

### View Artifacts
1. Go to failed workflow run
2. Scroll to "Artifacts" section
3. Download reports
4. Review detailed information

## 📚 Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Actions Marketplace](https://github.com/marketplace?type=actions)

## 💡 Best Practices

1. **Keep workflows simple**: Each workflow should have one clear purpose
2. **Use cache**: Cache dependencies to speed up workflows
3. **Fail fast**: Place quick checks before long-running tasks
4. **Document changes**: Update this file when modifying workflows
5. **Test locally**: Run linting and tests locally before pushing
6. **Monitor costs**: GitHub Actions has usage limits on free tier

## 🎯 Success Criteria

✅ All PRs pass CI checks before merging
✅ Production deployments happen automatically
✅ Security vulnerabilities are detected pre-merge
✅ Code quality metrics are tracked
✅ No manual deployment steps needed
✅ Team is notified of deployment status

---

**For detailed setup instructions, see [CI_CD_SETUP.md](CI_CD_SETUP.md)**
