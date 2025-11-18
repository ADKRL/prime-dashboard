# Prime Dashboard - Deployment Guide

This guide explains how to make your prime-dashboard publicly accessible to your team in real-time.

## Overview

The dashboard monitors real-time progress of workers and the coordinator. It's deployed on Netlify and connected to your local coordinator via an Ngrok tunnel.

- **Dashboard URL:** https://prime-dashboard.netlify.app
- **Coordinator:** Running locally
- **Tunnel:** Ngrok (exposes local coordinator to internet)

## Prerequisites

1. **Ngrok Account** - Sign up at https://dashboard.ngrok.com/signup
2. **Ngrok CLI** - Install via `brew install ngrok`
3. **Node.js** - v20.19+ or v22.12+ (for local development)
4. **Netlify Account** - Sign up at https://netlify.com

## Quick Start (Every Time)

Follow these 3 terminal steps to make the dashboard public:

### Terminal 1: Start Coordinator

```bash
cd /Users/adityamazumdar/Downloads/DS_CW/prime-coordinator
/Users/adityamazumdar/Downloads/DS_CW/prime-coordinator/bin/coordinator -config configs/config.yaml
```

Keep this running. You'll see coordinator status output.

### Terminal 2: Start Ngrok Tunnel

```bash
ngrok http 9000
```

You'll see output like:
```
Forwarding    https://abc123def456.ngrok-free.dev -> http://localhost:9000
```

**Copy the `https://` URL** - you'll need it in the next step.

### Terminal 3: Build & Deploy Dashboard

```bash
cd /Users/adityamazumdar/Downloads/DS_CW/prime-dashboard

# Update .env with your Ngrok URL (replace with your actual URL from Terminal 2)
echo "VITE_COORDINATOR_HOST=abc123def456.ngrok-free.dev" > .env
echo "VITE_COORDINATOR_PORT=443" >> .env

# Build for production
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

---

## Share with Team

Once deployed, share this URL with your team:

```
https://prime-dashboard.netlify.app
```

Your team can now view:
- Total jobs and completion progress
- Active workers and dead workers
- Total primes found
- System alerts in real-time

---

## File Descriptions

| File | Purpose |
|------|---------|
| `.env` | Environment variables (Ngrok URL and port) |
| `src/App.jsx` | Main dashboard component |
| `vite.config.js` | Vite build configuration |
| `netlify.toml` | Netlify deployment settings (optional) |

## Environment Variables

The dashboard uses these environment variables:

```
VITE_COORDINATOR_HOST = your-ngrok-url.ngrok-free.dev
VITE_COORDINATOR_PORT = 443
```

These are read from the `.env` file during the build process.

---

## Troubleshooting

### Dashboard shows "Failed to connect to API"

**Cause:** Ngrok tunnel is not running or URL is outdated.

**Solution:**
1. Make sure Ngrok is running in Terminal 2
2. Copy the new Ngrok URL
3. Update `.env` with the new URL
4. Run `npm run build && netlify deploy --prod --dir=dist`

### Ngrok says "authentication failed"

**Cause:** Ngrok authtoken is not set.

**Solution:**
```bash
ngrok config add-authtoken YOUR_TOKEN
```
Get your token at: https://dashboard.ngrok.com/get-started/your-authtoken

### Netlify deployment fails

**Cause:** Node.js version is too old.

**Solution:**
1. Check your Node version: `node --version`
2. Upgrade to v20.19+ or v22.12+
3. Retry deployment

---

## Architecture

```
Local Machine
├── Coordinator (port 9000)
│   └── Ngrok Tunnel (https://xxx.ngrok-free.dev)
│       └── Internet
│           └── Netlify Deployment
│               └── https://prime-dashboard.netlify.app
│                   └── Team Members
```

---

## Advanced: Setting Up Netlify Environment Variables

If you want Netlify to automatically use your Ngrok URL:

1. Go to https://app.netlify.com/sites/prime-dashboard
2. Click **Settings** → **Environment variables**
3. Add:
   - `VITE_COORDINATOR_HOST` = your-ngrok-url
   - `VITE_COORDINATOR_PORT` = 443

Then Netlify will rebuild with these variables on each deploy.

---

## Notes

- **Ngrok URL changes every restart** - You'll need to update `.env` and redeploy
- **Keep terminals running** - Coordinator and Ngrok must stay active
- **Team access** - Only works when both coordinator and Ngrok are running

---

## Next Steps

For a production setup:
1. Deploy coordinator to a cloud server (Google Cloud Run, AWS, DigitalOcean)
2. Use a permanent domain for the coordinator
3. Remove dependency on Ngrok

See the main README for more details.
