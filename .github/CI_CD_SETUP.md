# GitHub Actions CI/CD Pipeline Setup Guide

## 📋 Overview

This document provides a comprehensive guide to the GitHub Actions CI/CD pipeline setup for CryptoHub. The pipeline automates testing, building, deployment, and security scanning.

## 🏗️ Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions Pipeline                   │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
         ┌──────▼──────┐  ┌──▼─────┐  ┌──▼─────────┐
         │  CI: Lint   │  │ CI:    │  │ CI:        │
         │  + Test     │  │ Build  │  │ Security   │
         │  + Quality  │  │        │  │ Scanning   │
         └──────┬──────┘  └──┬─────┘  └──┬─────────┘
                │             │             │
                └─────────────┼─────────────┘
                              │
                    ┌─────────▼──────────┐
                    │ Quality Gate Check  │
                    │ (All Pass?)         │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │ CD: Deploy Staging  │
                    │ (Develop Branch)    │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │CD: Deploy          │
                    │Production (Main)   │
                    └────────────────────┘
```

## 📦 Workflows

### 1. **CI Workflow** (`.github/workflows/ci.yml`)

Runs on: `push` and `pull_request` to `main` and `develop`

**Jobs:**
- **Linting** (ESLint)
  - Runs on Node 18.x and 20.x
  - Enforces code quality standards
  - Comments on PRs with results

- **Testing** (Vitest)
  - Runs comprehensive test suite
  - Uploads coverage reports to Codecov
  - Archives test results

- **Build Verification**
  - Builds the project for production
  - Verifies dist directory exists
  - Archives build artifacts

- **Bundle Size Analysis**
  - Analyzes final bundle size
  - Reports module sizes
  - Tracks performance

- **Quality Gate**
  - Aggregates all checks
  - Prevents merge if any check fails
  - Comments success on PR

### 2. **CD Workflow** (`.github/workflows/cd.yml`)

Runs on: `push` to `main` or `develop`, triggered by successful CI

**Jobs:**
- **Deploy to Staging**
  - Triggers on push to `develop`
  - Deploys to staging environment
  - Health checks deployment
  - Sends notifications

- **Deploy to Production**
  - Triggers on push to `main`
  - Requires staging deployment success
  - Deploys with `--production` flag
  - Health checks and verification
  - Sends Slack notifications

- **Docker Build**
  - Builds Docker image on main branch
  - Pushes to GitHub Container Registry
  - Uses BuildKit for caching
  - Tags with git ref and SHA

- **Rollback Handler**
  - Activates if deployment fails
  - Creates rollback notification
  - Alerts team immediately

- **Deployment Report**
  - Generates deployment summary
  - Archives report artifacts
  - Includes links to environments

### 3. **Security Workflow** (`.github/workflows/security.yml`)

Runs on: `push`, `pull_request`, and daily schedule (2 AM UTC)

**Jobs:**
- **Dependency Vulnerability Check**
  - `npm audit` scanning
  - Reports vulnerabilities by severity
  - Comments on PRs

- **CodeQL Analysis**
  - Static code analysis
  - Security and quality queries
  - Reports findings in Security tab

- **Snyk Security Scanning**
  - Dependency and code vulnerability scanning
  - SARIF report upload
  - Severity threshold enforcement

- **License Compliance Check**
  - Identifies all dependencies
  - Checks license compatibility
  - Generates license report

- **Secret Detection**
  - TruffleHog scanning
  - Git-secrets validation
  - Prevents credential leaks

- **ESLint Security Rules**
  - Security-focused linting
  - Detects unsafe patterns
  - Reports violations

### 4. **Code Quality Workflow** (`.github/workflows/quality.yml`)

Runs on: `push` and `pull_request`

**Jobs:**
- **Code Complexity Analysis**
  - Measures cyclomatic complexity
  - Detects code duplication
  - Generates detailed reports

- **Performance Audit**
  - Lighthouse CI tests
  - Performance metrics
  - Best practices validation

- **Accessibility Testing**
  - Axe accessibility checker
  - WCAG compliance verification
  - Reports violations

- **Type Checking**
  - JSDoc type validation
  - Type safety enforcement
  - Prevents type errors

- **Dependency Graph**
  - Updates GitHub dependency graph
  - Feeds security advisories
  - Helps with impact analysis

## 🔐 Required GitHub Secrets

Set these secrets in your repository settings at `Settings > Secrets and variables > Actions`

```
VERCEL_TOKEN          # Vercel deployment token
VERCEL_ORG_ID         # Vercel organization ID
VERCEL_PROJECT_ID_STAGING  # Staging project ID
VERCEL_PROJECT_ID_PROD     # Production project ID
STAGING_API_URL       # Staging API endpoint
PRODUCTION_API_URL    # Production API endpoint
COINGECKO_API_KEY     # CoinGecko API key
SLACK_WEBHOOK         # Slack webhook for notifications
SNYK_TOKEN           # Snyk security scanning token
```

## 📝 Environment Files

Create `.env.example` in repository root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_CG_API_KEY=your_coingecko_api_key

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🚀 Deployment Configuration

### Vercel Setup

1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set up preview deployments for pull requests
4. Enable auto-deployment from main branch

### Docker Deployment

1. Build image: `docker build -t cryptohub:latest .`
2. Push to registry: `docker push ghcr.io/karanunique/cryptohub:latest`
3. Deploy to container service

## 📊 Monitoring & Notifications

### PR Checks
- Automatic comments on each PR with:
  - ✅ Linting status
  - ✅ Test results
  - ✅ Build status
  - ✅ Security scan results
  - ✅ Overall approval/rejection

### Slack Notifications
- Production deployment success/failure
- Critical security vulnerabilities
- Build failures on main branch

### Email Notifications
- GitHub native email for failures
- Workflow run summaries

## ⚙️ Configuration Files

### `vitest.config.js`
Test runner configuration with coverage settings

### `eslint.config.js`
Linting rules and code quality standards

### `.github/workflows/*.yml`
All CI/CD workflow definitions

## 🔄 Local Development

Run checks locally before pushing:

```bash
# Linting
npm run lint

# Tests
npm test

# Build
npm run build

# Security audit
npm audit

# Type checking
npm run type-check  # if configured
```

## 📈 Metrics & Reporting

### Generated Reports

1. **Test Coverage** - Codecov integration shows:
   - Overall coverage percentage
   - Per-file coverage
   - Historical trends

2. **Performance** - Lighthouse reports:
   - Performance score
   - Accessibility score
   - Best practices
   - SEO score

3. **Security** - Multiple sources:
   - Vulnerability count by severity
   - Dependency status
   - Code scanning alerts

4. **Code Quality** - Complexity metrics:
   - Cyclomatic complexity
   - LOC per function
   - Duplicate code percentage

## 🆘 Troubleshooting

### Common Issues

**Tests fail locally but pass in CI**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version matches CI: `node --version`
- Update dependencies: `npm update`

**Deployment fails**
- Check environment variables in secrets
- Verify Vercel token has correct permissions
- Review deployment logs in Actions tab

**Security scan timeouts**
- Continue-on-error directives prevent script failures
- Check individual scan logs in artifacts
- May need credential/token refresh

### Debug Mode

Add to any workflow step:
```yaml
- name: Debug
  if: failure()
  run: |
    echo "Debugging failed workflow"
    npm --version
    node --version
    git log --oneline -5
```

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment](https://vercel.com/docs)
- [Snyk Security](https://snyk.io/docs/)
- [CodeQL Analysis](https://codeql.github.com/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

## ✅ Checklist for Implementation

- [ ] Create `.github/workflows/` directory
- [ ] Add all workflow files (ci.yml, cd.yml, security.yml, quality.yml)
- [ ] Set up GitHub repository secrets
- [ ] Configure Vercel projects and tokens
- [ ] Create Dockerfile for containerization
- [ ] Test workflows with dummy PR
- [ ] Monitor first automated deployment
- [ ] Document any custom configurations
- [ ] Set up Slack notifications
- [ ] Train team on new CI/CD process

## 🎯 Success Metrics

Track these metrics to ensure pipeline effectiveness:

- **Build Success Rate** - Target: >95%
- **Test Coverage** - Target: >60%
- **Deployment Frequency** - Track trends
- **Mean Time to Recovery** - From pipeline failure to fix
- **Security Issue Detection** - Vulnerabilities caught per month
- **Deployment Reliability** - Failed production deployments

---

**Last Updated**: March 5, 2026
**Maintainer**: CryptoHub Development Team
