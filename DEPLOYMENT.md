# 🚀 Deployment Guide - Smart Stadiums FIFA 2026

## Quick Start (5 minutes to production)

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- TiDB Cloud account (free tier: 5GB)
- OpenAI API key

### Step 1: Clone & Setup Repository

```bash
git clone https://github.com/yourusername/smart-stadiums-fifa.git
cd smart-stadiums-fifa
npm install
```

### Step 2: Setup TiDB Database

1. **Create TiDB Cluster**
   - Go to https://tidbcloud.com
   - Click "Create Cluster"
   - Select Free tier
   - Region: US (recommended)
   - Wait 5-10 minutes for creation

2. **Get Connection String**
   - Click cluster name
   - Click "Connect"
   - Copy connection string
   - Format: `mysql://user:password@host:4000/smart_stadiums`

3. **Create Database**
   ```sql
   CREATE DATABASE smart_stadiums;
   ```

### Step 3: Local Setup

```bash
# Create .env.local
cp .env.example .env.local

# Edit .env.local with:
# - DATABASE_URL (from TiDB)
# - OPENAI_API_KEY (from OpenAI)
# - AUTH_SECRET (generate: $(openssl rand -hex 32))
```

### Step 4: Run Migrations

```bash
npm run prisma:migrate
npm run prisma:seed
```

### Step 5: Start Development

```bash
npm run dev
```

Visit `http://localhost:3000`

Login with:
```
Email: demo@stadiums.com
Password: Demo@12345
```

---

## Production Deployment (Vercel)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit: Smart Stadiums FIFA 2026"
git push origin main
```

### Step 2: Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel
```

### Step 3: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
DATABASE_URL = mysql://user:password@host:4000/smart_stadiums
OPENAI_API_KEY = sk-your-key-here
AUTH_SECRET = your-secret-key
NEXT_PUBLIC_API_URL = https://your-domain.vercel.app
```

### Step 4: Run Migrations in Production

```bash
vercel env pull
npm run prisma:migrate -- --skip-generate
```

### Step 5: Verify Deployment

Visit your Vercel URL and test:
- [ ] Login page loads
- [ ] Register works
- [ ] Dashboard loads
- [ ] AI Chat responds
- [ ] Crowd stats show
- [ ] Incident report works

---

## Environment Variables Reference

| Variable | Type | Required | Example |
|----------|------|----------|---------|
| `DATABASE_URL` | Private | ✅ | `mysql://user:pass@host/db` |
| `OPENAI_API_KEY` | Private | ✅ | `sk-...` |
| `AUTH_SECRET` | Private | ✅ | `hex-32-chars` |
| `NEXT_PUBLIC_API_URL` | Public | ✅ | `https://app.vercel.app` |
| `NODE_ENV` | Public | ✅ | `production` |

---

## Database Migrations

### Create Migration
```bash
npm run prisma:migrate -- --name add_feature
```

### Apply Migrations
```bash
# Local
npm run prisma:migrate

# Production
vercel env pull
npm run prisma:migrate
```

### Seed Database
```bash
npm run prisma:seed
```

---

## Scaling Considerations

### For 10,000 Concurrent Users

1. **Database Optimization**
   - Enable query caching in TiDB
   - Add indexes on frequently queried columns
   - Use connection pooling

2. **API Optimization**
   - Enable Vercel Edge Caching
   - Use response compression
   - Implement rate limiting per IP

3. **Frontend Optimization**
   - Enable CDN (automatic with Vercel)
   - Use image optimization
   - Implement code splitting

---

## Monitoring & Logs

### Vercel Logs
```bash
vercel logs
vercel logs --tail
```

### Database Monitoring
- TiDB Dashboard: https://tidbcloud.com
- Monitor query performance
- Check connection limits

### Application Monitoring
```bash
# Health check endpoint
curl https://your-domain.vercel.app/api/health
```

---

## Security Checklist

- [ ] Change `AUTH_SECRET` to secure random value
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Set up WAF rules
- [ ] Enable database backups
- [ ] Rotate OpenAI API keys regularly
- [ ] Monitor audit logs
- [ ] Set up error tracking (Sentry)

---

## Troubleshooting

### Database Connection Failed
```bash
# Test connection
npm run prisma:db:push

# Check environment variables
vercel env list
```

### OpenAI API Errors
- Verify API key is valid
- Check quota limits
- Review error response for rate limiting

### Build Failures
```bash
# Local build test
npm run build

# Check logs
vercel logs --tail
```

### Performance Issues
- Check Vercel Analytics dashboard
- Review database query logs
- Enable query caching
- Reduce API payload sizes

---

## Custom Domain

### Add Custom Domain to Vercel
1. Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records per Vercel instructions
4. Wait 24-48 hours for propagation

---

## Continuous Deployment

### Automatic Deployments
- Push to `main` branch
- Vercel automatically builds and deploys
- Staging preview for PRs

### Manual Deployment
```bash
vercel deploy --prod
```

---

## Backup & Recovery

### Database Backup
- TiDB: Enable automated backups (24-hour retention)
- Manual: `mysqldump` via TiDB connection

### Code Recovery
```bash
# Rollback to previous deployment
vercel rollback
```

---

## Support

- **Docs**: https://docs.smartstadiums.dev
- **Issues**: GitHub Issues
- **Status**: https://status.smartstadiums.dev
