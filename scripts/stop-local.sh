#!/bin/bash

set -e

echo "🛑 Stopping Aprove-me Local Infrastructure..."
echo ""

cd "$(dirname "$0")/../infrastructure/local"

docker compose -f docker-compose.full.yml down

echo ""
echo "✅ All services stopped!"
echo ""
echo "💡 To remove volumes (data will be lost), run:"
echo "   docker compose -f infrastructure/local/docker-compose.full.yml down -v"
echo ""
