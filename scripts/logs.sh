#!/bin/bash

cd "$(dirname "$0")/../infrastructure/local"

SERVICE=${1:-}

if [ -z "$SERVICE" ]; then
    echo "📋 Showing logs for all services..."
    echo "💡 Tip: Use './scripts/logs.sh backend' to see specific service logs"
    echo ""
    docker compose -f docker-compose.full.yml logs -f --tail=100
else
    echo "📋 Showing logs for $SERVICE..."
    echo ""
    docker compose -f docker-compose.full.yml logs -f --tail=100 "$SERVICE"
fi
