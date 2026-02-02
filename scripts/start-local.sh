#!/bin/bash

set -e

echo "🚀 Starting Aprove-me Local Infrastructure..."
echo ""

cd "$(dirname "$0")/../infrastructure/local"

if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env created! Please edit it with your credentials."
    echo ""
fi

echo "🐳 Starting Docker containers..."
docker compose -f docker-compose.full.yml up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 5

echo ""
echo "🔍 Checking services status..."
docker compose -f docker-compose.full.yml ps

echo ""
echo "✅ Infrastructure is up!"
echo ""
echo "📊 Available services:"
echo "  - Frontend Web:     http://localhost:3001"
echo "  - Backend API:      http://localhost:3000"
echo "  - Swagger UI:       http://localhost:3000/api"
echo "  - Health Check:     http://localhost:3000/health-check"
echo "  - RabbitMQ Mgmt:    http://localhost:15672 (admin/admin)"
echo "  - PostgreSQL:       localhost:5432 (postgres/postgres)"
echo "  - Redis:            localhost:6379 (password: redis123)"
echo ""
echo "📝 Useful commands:"
echo "  - View logs:        ./scripts/logs.sh"
echo "  - Stop services:    ./scripts/stop-local.sh"
echo "  - Restart backend:  docker compose -f infrastructure/local/docker-compose.full.yml restart backend"
echo "  - Restart frontend: docker compose -f infrastructure/local/docker-compose.full.yml restart frontend"
echo ""
