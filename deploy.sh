#!/bin/bash

# Prime Dashboard - Automated Deployment Script
# This script automates the entire process of deploying the dashboard to Netlify

set -e

echo "🚀 Prime Dashboard Deployment Script"
echo "===================================="
echo ""

# Check if Ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ Ngrok not found. Install it with: brew install ngrok"
    exit 1
fi

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Install it with: npm install -g netlify-cli"
    exit 1
fi

# Get the Ngrok URL
echo "📡 Fetching Ngrok tunnel URL..."
NGROK_URL=""
RETRY_COUNT=0
MAX_RETRIES=10

while [ -z "$NGROK_URL" ] && [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    NGROK_URL=$(curl -s http://127.0.0.1:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https://[^"]*"' | grep -o 'https://[^"]*' | head -1)
    if [ -z "$NGROK_URL" ]; then
        echo "⏳ Waiting for Ngrok tunnel to be available... (attempt $((RETRY_COUNT+1))/$MAX_RETRIES)"
        sleep 2
        RETRY_COUNT=$((RETRY_COUNT+1))
    fi
done

if [ -z "$NGROK_URL" ]; then
    echo "❌ Could not find Ngrok tunnel. Make sure Ngrok is running:"
    echo "   ngrok http 9000"
    exit 1
fi

# Extract the host from the URL
NGROK_HOST=$(echo "$NGROK_URL" | sed 's|https://||' | sed 's|/||g')

echo "✅ Found Ngrok URL: $NGROK_URL"
echo "✅ Host: $NGROK_HOST"
echo ""

# Update .env file
echo "📝 Updating .env file..."
cat > .env << EOF
VITE_COORDINATOR_HOST=$NGROK_HOST
VITE_COORDINATOR_PORT=443
EOF
echo "✅ .env updated"
echo ""

# Build the dashboard
echo "🔨 Building dashboard..."
npm run build > /dev/null 2>&1
echo "✅ Build complete"
echo ""

# Deploy to Netlify
echo "🚀 Deploying to Netlify..."
netlify deploy --prod --dir=dist
echo ""

echo "🎉 Deployment Complete!"
echo "===================================="
echo "Dashboard URL: https://prime-dashboard.netlify.app"
echo ""
echo "⚠️  Important:"
echo "  - Keep Ngrok running: ngrok http 9000"
echo "  - Keep Coordinator running"
echo "  - If Ngrok URL changes, run this script again"
