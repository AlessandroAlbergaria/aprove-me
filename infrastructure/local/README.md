# 🏠 Local Infrastructure - Aprove-me

Infraestrutura completa para rodar **100% localmente** sem custos de cloud.

## 🎯 O que está incluído?

| Serviço | Container | Porta | Simula |
|---------|-----------|-------|--------|
| **PostgreSQL** | `aprove-me-postgres` | 5432 | Cloud SQL |
| **Redis** | `aprove-me-redis` | 6379 | Cloud Memorystore |
| **RabbitMQ** | `aprove-me-rabbitmq` | 5672, 15672 | Cloud Pub/Sub |
| **Backend** | `aprove-me-backend` | 3000 | Cloud Run |
| **PgAdmin** | `aprove-me-pgadmin` | 5050 | (Opcional) |

## 🚀 Quick Start

### 1. Copiar arquivo de ambiente

```bash
cd infrastructure/local
cp .env.example .env
```

### 2. Editar variáveis (opcional)

```bash
nano .env
```

### 3. Subir todos os serviços

```bash
docker-compose -f docker-compose.full.yml up -d
```

### 4. Ver logs

```bash
docker-compose -f docker-compose.full.yml logs -f
```

### 5. Verificar saúde

```bash
docker-compose -f docker-compose.full.yml ps
```

## 📊 Acessar Serviços

### Backend API
```
http://localhost:3000
```

**Swagger UI:**
```
http://localhost:3000/api
```

**Health Check:**
```
http://localhost:3000/health-check
```

### RabbitMQ Management
```
http://localhost:15672
User: admin
Pass: admin
```

### PgAdmin (Opcional)
```
http://localhost:5050
Email: admin@aprove-me.com
Pass: admin
```

**Conectar ao PostgreSQL no PgAdmin:**
- Host: `postgres`
- Port: `5432`
- Database: `aprove-me`
- User: `postgres`
- Pass: `postgres`

## 🔧 Comandos Úteis

### Subir apenas serviços essenciais

```bash
docker-compose -f docker-compose.full.yml up -d postgres redis rabbitmq
```

### Subir com PgAdmin

```bash
docker-compose -f docker-compose.full.yml --profile tools up -d
```

### Parar todos os serviços

```bash
docker-compose -f docker-compose.full.yml down
```

### Parar e remover volumes (CUIDADO: perde dados)

```bash
docker-compose -f docker-compose.full.yml down -v
```

### Ver logs de um serviço específico

```bash
docker-compose -f docker-compose.full.yml logs -f backend
docker-compose -f docker-compose.full.yml logs -f postgres
docker-compose -f docker-compose.full.yml logs -f rabbitmq
```

### Reiniciar um serviço

```bash
docker-compose -f docker-compose.full.yml restart backend
```

### Rebuild do backend

```bash
docker-compose -f docker-compose.full.yml up -d --build backend
```

### Executar comando no backend

```bash
docker-compose -f docker-compose.full.yml exec backend yarn prisma migrate dev
docker-compose -f docker-compose.full.yml exec backend yarn test
docker-compose -f docker-compose.full.yml exec backend yarn lint
```

### Acessar shell do backend

```bash
docker-compose -f docker-compose.full.yml exec backend sh
```

### Acessar PostgreSQL CLI

```bash
docker-compose -f docker-compose.full.yml exec postgres psql -U postgres -d aprove-me
```

### Acessar Redis CLI

```bash
docker-compose -f docker-compose.full.yml exec redis redis-cli -a redis123
```

## 🗄️ Gerenciamento de Dados

### Backup do PostgreSQL

```bash
docker-compose -f docker-compose.full.yml exec postgres pg_dump -U postgres aprove-me > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restaurar backup

```bash
cat backup_20260202_120000.sql | docker-compose -f docker-compose.full.yml exec -T postgres psql -U postgres -d aprove-me
```

### Limpar banco de dados

```bash
docker-compose -f docker-compose.full.yml exec postgres psql -U postgres -d aprove-me -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

### Rodar migrations

```bash
cd ../../backend
yarn prisma migrate dev
```

### Seed do banco

```bash
cd ../../backend
yarn prisma db seed
```

## 🔍 Monitoramento

### Ver uso de recursos

```bash
docker stats
```

### Ver volumes

```bash
docker volume ls | grep aprove-me
```

### Ver tamanho dos volumes

```bash
docker system df -v
```

### Limpar recursos não utilizados

```bash
docker system prune -a --volumes
```

## 🐛 Troubleshooting

### Porta já em uso

**Erro:** `Bind for 0.0.0.0:5432 failed: port is already allocated`

**Solução:**
```bash
lsof -ti:5432 | xargs kill -9
```

Ou alterar porta no `.env`:
```env
POSTGRES_PORT=5433
```

### Container não inicia

**Ver logs:**
```bash
docker-compose -f docker-compose.full.yml logs backend
```

**Rebuild:**
```bash
docker-compose -f docker-compose.full.yml up -d --build --force-recreate backend
```

### Backend não conecta no banco

**Verificar se PostgreSQL está rodando:**
```bash
docker-compose -f docker-compose.full.yml ps postgres
```

**Verificar health check:**
```bash
docker inspect aprove-me-postgres | grep -A 10 Health
```

**Testar conexão:**
```bash
docker-compose -f docker-compose.full.yml exec backend sh -c 'nc -zv postgres 5432'
```

### RabbitMQ não aceita conexões

**Aguardar inicialização completa (30s):**
```bash
docker-compose -f docker-compose.full.yml logs -f rabbitmq
```

**Verificar health:**
```bash
docker-compose -f docker-compose.full.yml exec rabbitmq rabbitmq-diagnostics status
```

### Redis requer senha

**Conectar com senha:**
```bash
docker-compose -f docker-compose.full.yml exec redis redis-cli -a redis123
```

**Ou desabilitar senha no docker-compose.full.yml:**
```yaml
command: redis-server --appendonly yes
```

### Volumes corrompidos

**Remover e recriar:**
```bash
docker-compose -f docker-compose.full.yml down -v
docker volume rm $(docker volume ls -q | grep aprove-me)
docker-compose -f docker-compose.full.yml up -d
```

## 🔐 Segurança Local

### Alterar senhas padrão

Editar `.env`:
```env
POSTGRES_PASSWORD=senha_forte_aqui
REDIS_PASSWORD=senha_forte_aqui
RABBITMQ_PASS=senha_forte_aqui
JWT_SECRET=chave_secreta_longa_aqui
```

Recriar containers:
```bash
docker-compose -f docker-compose.full.yml down
docker-compose -f docker-compose.full.yml up -d
```

### Isolar rede

Por padrão, todos os containers estão na rede `aprove-me-network` isolada.

Para expor apenas o backend:
```yaml
services:
  postgres:
    ports: []  # Remove exposição de porta
```

## 📈 Performance

### Ajustar recursos do PostgreSQL

Editar `docker-compose.full.yml`:
```yaml
postgres:
  environment:
    POSTGRES_SHARED_BUFFERS: 256MB
    POSTGRES_EFFECTIVE_CACHE_SIZE: 1GB
    POSTGRES_MAX_CONNECTIONS: 200
```

### Ajustar recursos do Redis

```yaml
redis:
  command: redis-server --appendonly yes --maxmemory 512mb --maxmemory-policy allkeys-lru
```

### Ajustar recursos do RabbitMQ

```yaml
rabbitmq:
  environment:
    RABBITMQ_VM_MEMORY_HIGH_WATERMARK: 1GB
```

## 🔄 Hot Reload

O backend está configurado com hot reload:

```yaml
volumes:
  - ../../backend/src:/app/src:ro
```

Qualquer alteração em `backend/src` será refletida automaticamente.

## 🧪 Testes

### Rodar testes dentro do container

```bash
docker-compose -f docker-compose.full.yml exec backend yarn test
```

### Rodar testes com cobertura

```bash
docker-compose -f docker-compose.full.yml exec backend yarn test:cov
```

### Rodar testes e2e

```bash
docker-compose -f docker-compose.full.yml exec backend yarn test:e2e
```

## 📦 Dependências

### Adicionar nova dependência

```bash
cd ../../backend
yarn add nova-dependencia
docker-compose -f ../../infrastructure/local/docker-compose.full.yml restart backend
```

### Rebuild após adicionar dependência

```bash
docker-compose -f docker-compose.full.yml up -d --build backend
```

## 🌐 Acessar de outro dispositivo na rede

1. **Descobrir IP da máquina:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

2. **Acessar:**
```
http://192.168.x.x:3000
```

3. **Permitir conexões externas (opcional):**

Editar `docker-compose.full.yml`:
```yaml
ports:
  - "0.0.0.0:3000:3000"
```

## 🎓 Comparação Local vs GCP

| Aspecto | Local | GCP |
|---------|-------|-----|
| **Custo** | R$ 0 | ~R$ 100-300/mês |
| **Setup** | 5 minutos | 1-2 horas |
| **Performance** | Depende do PC | Alta |
| **Escalabilidade** | Limitada | Automática |
| **Backup** | Manual | Automático |
| **Monitoramento** | Logs | Cloud Monitoring |
| **Alta Disponibilidade** | Não | Sim |
| **Segurança** | Básica | Avançada |

## 🚀 Próximos Passos

Após validar localmente:

1. ✅ Desenvolvimento e testes locais
2. ⏳ Configurar CI/CD
3. ⏳ Deploy staging no GCP
4. ⏳ Testes de carga
5. ⏳ Deploy produção no GCP

## 📚 Recursos

- [Docker Compose Docs](https://docs.docker.com/compose/)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
- [Redis Docker](https://hub.docker.com/_/redis)
- [RabbitMQ Docker](https://hub.docker.com/_/rabbitmq)
