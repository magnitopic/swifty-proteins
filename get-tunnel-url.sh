#!/bin/bash

# Script to automatically obtain localhost.run tunnel URL

echo "Searching for tunnel URL..."

# Wait for tunnel to establish
sleep 5

# Try to get URL from container logs
TUNNEL_URL=""
MAX_ATTEMPTS=20
ATTEMPT=0

while [ -z "$TUNNEL_URL" ] && [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    # Search for URL in tunnel container logs
    # Look specifically for the line with "tunneled with tls termination"
    TUNNEL_URL=$(docker logs tunnel 2>&1 | grep "tunneled with tls termination" | grep -oE 'https://[a-zA-Z0-9.-]+\.(localhost\.run|lhr\.life|lhrtunnel\.link)' | head -1)
    
    if [ -z "$TUNNEL_URL" ]; then
        echo "Waiting for tunnel... (attempt $((ATTEMPT+1))/$MAX_ATTEMPTS)"
        sleep 2
        ATTEMPT=$((ATTEMPT+1))
    fi
done

if [ -z "$TUNNEL_URL" ]; then
    echo "ERROR: Could not obtain tunnel URL"
    echo "Tunnel container logs:"
    docker logs tunnel --tail 20
    exit 1
fi

echo "Tunnel URL found: $TUNNEL_URL"
echo "$TUNNEL_URL"
