#!/bin/bash

set -e

echo "🚀 Testando TUDO Localmente - Aprove-me"
echo "========================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Contadores
TESTS_PASSED=0
TESTS_FAILED=0

# Função para testar e registrar resultado
test_step() {
    local name="$1"
    local command="$2"
    
    echo ""
    echo "========================================"
    echo -e "${BLUE}🧪 $name${NC}"
    echo "========================================"
    
    if eval "$command"; then
        echo -e "${GREEN}✅ $name - PASSOU${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}❌ $name - FALHOU${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

echo -e "${BLUE}📋 Plano de Testes:${NC}"
echo "  1. Validar workflows GitHub Actions"
echo "  2. Validar Terraform"
echo "  3. Lint (ESLint)"
echo "  4. Build TypeScript"
echo "  5. Testes Unitários"
echo "  6. Testes E2E"
echo "  7. Docker Compose"
echo "  8. Infraestrutura Local (opcional)"
echo ""

read -p "Continuar? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Abortado pelo usuário"
    exit 1
fi

# ============================================
# TESTE 1: Workflows GitHub Actions
# ============================================
test_step "Workflows GitHub Actions" '
cd .github/workflows
WORKFLOW_COUNT=$(ls -1 *.yml 2>/dev/null | wc -l | tr -d " ")
if [ "$WORKFLOW_COUNT" -eq 0 ]; then
    echo "❌ Nenhum workflow encontrado"
    exit 1
fi
echo "✅ Encontrados $WORKFLOW_COUNT workflows"

for file in *.yml; do
    echo "  Validando: $file"
    if grep -q "^name:" "$file" && grep -q "^on:" "$file" && grep -q "^jobs:" "$file"; then
        echo "  ✅ $file válido"
    else
        echo "  ❌ $file inválido"
        exit 1
    fi
done
'

# ============================================
# TESTE 2: Terraform
# ============================================
test_step "Terraform" '
cd infrastructure/terraform
if [ -f "provider.tf" ] && [ -f "variables.tf" ] && [ -f "main.tf" ] && [ -f "outputs.tf" ]; then
    echo "✅ Todos os arquivos Terraform existem"
    
    if command -v terraform &> /dev/null; then
        echo "✅ Terraform instalado, validando..."
        terraform fmt -check -recursive
        terraform init -backend=false > /dev/null 2>&1
        terraform validate
    else
        echo "⚠️  Terraform não instalado (estrutura OK)"
    fi
else
    echo "❌ Arquivos Terraform não encontrados"
    exit 1
fi
'

# ============================================
# TESTE 3: Lint
# ============================================
test_step "Lint (ESLint)" '
cd backend
echo "🔍 Rodando ESLint..."
yarn lint
'

# ============================================
# TESTE 4: Build
# ============================================
test_step "Build TypeScript" '
cd backend
echo "🔨 Compilando TypeScript..."
yarn build
'

# ============================================
# TESTE 5: Testes Unitários
# ============================================
test_step "Testes Unitários" '
cd backend
echo "🧪 Rodando testes unitários..."
yarn test --passWithNoTests
'

# ============================================
# TESTE 6: Testes E2E
# ============================================
test_step "Testes E2E" '
cd backend

echo "🐳 Iniciando PostgreSQL temporário..."
docker run -d \
    --name aprove-me-test-db \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=aprove-me-test \
    -p 5433:5432 \
    postgres:15-alpine > /dev/null 2>&1

sleep 5

echo "🔄 Rodando migrations..."
export DATABASE_URL="postgresql://postgres:postgres@localhost:5433/aprove-me-test?schema=public"
npx prisma migrate deploy > /dev/null 2>&1

echo "🧪 Rodando testes E2E..."
yarn test:e2e

echo "🧹 Limpando..."
docker stop aprove-me-test-db > /dev/null 2>&1
docker rm aprove-me-test-db > /dev/null 2>&1
'

# ============================================
# TESTE 7: Docker Compose
# ============================================
test_step "Docker Compose" '
cd infrastructure/local
echo "🔍 Validando docker-compose.full.yml..."
docker compose -f docker-compose.full.yml config > /dev/null
echo "✅ Docker Compose válido"
'

# ============================================
# TESTE 8: Infraestrutura Local (Opcional)
# ============================================
echo ""
echo "========================================"
echo -e "${YELLOW}🐳 Teste Infraestrutura Local (Opcional)${NC}"
echo "========================================"
echo "Este teste inicia toda a infraestrutura Docker"
echo "e pode demorar ~2 minutos."
echo ""
read -p "Testar infraestrutura local? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    test_step "Infraestrutura Local" '
    cd infrastructure/local
    
    echo "🐳 Iniciando infraestrutura..."
    docker compose -f docker-compose.full.yml up -d
    
    echo "⏳ Aguardando serviços ficarem prontos (30s)..."
    sleep 30
    
    echo "🔍 Testando serviços..."
    
    # PostgreSQL
    echo "  Testando PostgreSQL..."
    docker compose -f docker-compose.full.yml exec -T postgres pg_isready -U postgres
    echo "  ✅ PostgreSQL OK"
    
    # Redis
    echo "  Testando Redis..."
    docker compose -f docker-compose.full.yml exec -T redis redis-cli -a redis123 ping > /dev/null
    echo "  ✅ Redis OK"
    
    # RabbitMQ
    echo "  Testando RabbitMQ..."
    docker compose -f docker-compose.full.yml exec -T rabbitmq rabbitmq-diagnostics -q ping
    echo "  ✅ RabbitMQ OK"
    
    echo "🧹 Parando infraestrutura..."
    docker compose -f docker-compose.full.yml down
    '
fi

# ============================================
# RESUMO FINAL
# ============================================
echo ""
echo "========================================"
if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ TODOS OS TESTES PASSARAM! 🎉${NC}"
else
    echo -e "${RED}❌ ALGUNS TESTES FALHARAM${NC}"
fi
echo "========================================"
echo ""

echo "📊 Resumo:"
echo -e "  ${GREEN}✅ Passaram: $TESTS_PASSED${NC}"
if [ $TESTS_FAILED -gt 0 ]; then
    echo -e "  ${RED}❌ Falharam: $TESTS_FAILED${NC}"
fi
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo "🎯 Próximos Passos:"
    echo "  1. Fazer commit das mudanças"
    echo "  2. Push para GitHub (CI rodará automaticamente)"
    echo "  3. Configurar secrets GCP para CD"
    echo ""
    
    echo "💡 Comandos úteis:"
    echo "  ./scripts/start-local.sh  - Iniciar infraestrutura"
    echo "  ./scripts/stop-local.sh   - Parar infraestrutura"
    echo "  ./scripts/logs.sh         - Ver logs"
    echo ""
    
    exit 0
else
    echo "❌ Corrija os erros antes de fazer commit"
    exit 1
fi
