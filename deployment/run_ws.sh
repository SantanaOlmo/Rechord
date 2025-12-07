#!/bin/bash
# Script to run WebSocket Server in background

# Ensure we are in the project root or adjust paths
# Usage: ./deployment/run_ws.sh

echo "Starting WebSocket Server..."
nohup php backend/server/WebSocketServer.php > ws_output.log 2>&1 &
echo "WebSocket Server started in background. Check ws_output.log for details."
