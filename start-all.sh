#!/bin/bash

# Prime Dashboard - Start All Services
# This script starts the coordinator, Ngrok tunnel, and deploys the dashboard

set -e

COORDINATOR_PATH="/Users/adityamazumdar/Downloads/DS_CW/prime-coordinator"
COORDINATOR_BIN="$COORDINATOR_PATH/bin/coordinator"
COORDINATOR_CONFIG="$COORDINATOR_PATH/configs/config.yaml"
DASHBOARD_URL="https://prime-dashboard.netlify.app"

echo "🚀 Starting Prime Dashboard Services"
echo "===================================="
echo ""

# Check if coordinator binary exists
if [ ! -f "$COORDINATOR_BIN" ]; then
    echo "❌ Coordinator binary not found at $COORDINATOR_BIN"
    exit 1
fi

# Check if Ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ Ngrok not found. Install it with: brew install ngrok"
    exit 1
fi

echo "Step 1: Starting Coordinator..."
echo "Command: $COORDINATOR_BIN -config $COORDINATOR_CONFIG"
osascript -e "tell app \"Terminal\" to do script \"cd '$COORDINATOR_PATH' && '$COORDINATOR_BIN' -config '$COORDINATOR_CONFIG'\""
sleep 3
echo "✅ Coordinator started in new terminal"
echo ""

echo "Step 2: Starting Ngrok Tunnel..."
echo "Command: ngrok http 8080"
osascript -e "tell app \"Terminal\" to do script \"ngrok http 9000\""
sleep 5
echo "✅ Ngrok tunnel started in new terminal"
echo ""

echo "Step 3: Deploying Dashboard..."
echo "Running: ./deploy.sh"
./deploy.sh
echo ""

echo "🎉 All Services Started!"
echo "===================================="
echo ""
echo "Dashboard URL: $DASHBOARD_URL"
echo ""
echo "Running Services:"
echo "  ✅ Coordinator (Terminal window)"
echo "  ✅ Ngrok Tunnel (Terminal window)"
echo "  ✅ Dashboard (Deployed to Netlify)"
echo ""
echo "Next Steps:"
echo "  1. Keep both terminal windows open"
echo "  2. Share the dashboard URL with your team"
echo "  3. Team can access at: $DASHBOARD_URL"
echo ""
echo "To stop services:"
echo "  - Close the terminal windows or press Ctrl+C"
