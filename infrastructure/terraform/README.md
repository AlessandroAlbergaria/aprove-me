# 🏗️ Terraform Infrastructure - Aprove-me

Esta infraestrutura está **preparada para GCP** mas configurada para **rodar localmente** por padrão.

## 📋 Visão Geral

A infraestrutura suporta dois modos:

### 🏠 Modo Local (Padrão)
- **Database**: PostgreSQL via Docker
- **Cache**: Redis via Docker
- **Queue**: RabbitMQ via Docker
- **Compute**: Docker Compose
- **Custo**: R$ 0,00

### ☁️ Modo GCP (Futuro)
- **Database**: Cloud SQL (PostgreSQL)
- **Cache**: Cloud Memorystore (Redis)
- **Queue**: Cloud Pub/Sub
- **Compute**: Cloud Run
- **Custo**: ~R$ 100-300/mês

## 🚀 Quick Start - Modo Local

**Não é necessário rodar Terraform para desenvolvimento local!**

Use o Docker Compose:

```bash
cd infrastructure/local
docker-compose -f docker-compose.full.yml up -d
```

## 🔧 Configuração GCP (Futuro)

### Pré-requisitos

1. **Instalar Terraform**:
```bash
brew install terraform
```

2. **Instalar Google Cloud SDK**:
```bash
brew install --cask google-cloud-sdk
```

3. **Autenticar no GCP**:
```bash
gcloud auth login
gcloud auth application-default login
```

4. **Criar projeto GCP**:
```bash
gcloud projects create aprove-me-prod --name="Aprove-me Production"
gcloud config set project aprove-me-prod
```

5. **Habilitar billing**:
```bash
gcloud beta billing projects link aprove-me-prod --billing-account=BILLING_ACCOUNT_ID
```

### Comandos Terraform

#### Inicializar

```bash
cd infrastructure/terraform
terraform init
```

#### Planejar (ver o que será criado)

```bash
terraform plan
```

#### Aplicar (criar recursos) - MODO LOCAL

```bash
terraform apply \
  -var="enable_cloud_sql=false" \
  -var="enable_memorystore=false" \
  -var="enable_cloud_run=false" \
  -var="enable_pubsub=false"
```

#### Aplicar (criar recursos) - MODO GCP

```bash
terraform apply \
  -var="project_id=aprove-me-prod" \
  -var="region=us-central1" \
  -var="environment=prod" \
  -var="enable_cloud_sql=true" \
  -var="enable_memorystore=true" \
  -var="enable_cloud_run=true" \
  -var="enable_pubsub=true"
```

#### Ver outputs

```bash
terraform output
```

#### Ver senha do banco (sensível)

```bash
terraform output -raw database_password
```

#### Destruir recursos

```bash
terraform destroy
```

## 📁 Estrutura de Arquivos

```
infrastructure/
├── terraform/
│   ├── provider.tf      # Configuração do provider GCP
│   ├── variables.tf     # Variáveis parametrizáveis
│   ├── main.tf          # Recursos principais
│   ├── outputs.tf       # Outputs da infraestrutura
│   └── README.md        # Esta documentação
└── local/
    ├── docker-compose.full.yml  # Todos os serviços locais
    └── README.md                # Documentação local
```

## 🔐 Variáveis Importantes

### Variáveis de Controle (Enable/Disable)

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `enable_cloud_sql` | `false` | Habilitar Cloud SQL |
| `enable_memorystore` | `false` | Habilitar Redis |
| `enable_cloud_run` | `false` | Habilitar Cloud Run |
| `enable_pubsub` | `false` | Habilitar Pub/Sub |

### Variáveis de Configuração

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `project_id` | `aprove-me-local` | ID do projeto GCP |
| `region` | `us-central1` | Região GCP |
| `environment` | `dev` | Ambiente (dev/staging/prod) |
| `database_tier` | `db-f1-micro` | Tier do Cloud SQL |
| `redis_memory_size_gb` | `1` | Memória do Redis (GB) |
| `cloud_run_cpu` | `1` | CPUs do Cloud Run |
| `cloud_run_memory` | `512Mi` | Memória do Cloud Run |

## 📊 Outputs

Após aplicar o Terraform, você pode ver os outputs:

```bash
terraform output summary
```

**Exemplo de output (modo local):**
```json
{
  "mode": "Local Docker",
  "database": "Local PostgreSQL",
  "cache": "Local Redis",
  "queue": "Local RabbitMQ",
  "compute": "Local Docker",
  "environment": "dev"
}
```

**Exemplo de output (modo GCP):**
```json
{
  "mode": "GCP Cloud",
  "database": "Cloud SQL",
  "cache": "Cloud Memorystore",
  "queue": "Cloud Pub/Sub",
  "compute": "Cloud Run",
  "environment": "prod"
}
```

## 🔄 Migração Local → GCP

Quando estiver pronto para migrar para GCP:

1. **Backup do banco local**:
```bash
docker exec aprove-me-postgres pg_dump -U postgres aprove-me > backup.sql
```

2. **Habilitar recursos GCP**:
```bash
terraform apply \
  -var="enable_cloud_sql=true" \
  -var="enable_memorystore=true" \
  -var="enable_cloud_run=true"
```

3. **Restaurar backup no Cloud SQL**:
```bash
gcloud sql import sql aprove-me-db-prod gs://bucket/backup.sql \
  --database=aprove-me
```

4. **Atualizar variáveis de ambiente**:
```bash
terraform output database_connection_name
terraform output redis_host
```

5. **Deploy da aplicação**:
```bash
gcloud run deploy aprove-me \
  --image gcr.io/aprove-me-prod/aprove-me:latest \
  --region us-central1
```

## 💰 Estimativa de Custos GCP

### Desenvolvimento (Tier Mínimo)

| Serviço | Configuração | Custo/mês |
|---------|--------------|-----------|
| Cloud Run | 1 CPU, 512Mi, 0-10 instâncias | ~R$ 20 |
| Cloud SQL | db-f1-micro, 10GB SSD | ~R$ 50 |
| Cloud Memorystore | 1GB Redis Basic | ~R$ 30 |
| Cloud Pub/Sub | < 1M mensagens/mês | ~R$ 5 |
| **Total** | | **~R$ 105/mês** |

### Produção (Tier Médio)

| Serviço | Configuração | Custo/mês |
|---------|--------------|-----------|
| Cloud Run | 2 CPU, 1Gi, 1-50 instâncias | ~R$ 100 |
| Cloud SQL | db-n1-standard-1, 50GB SSD | ~R$ 200 |
| Cloud Memorystore | 5GB Redis Standard | ~R$ 150 |
| Cloud Pub/Sub | < 10M mensagens/mês | ~R$ 20 |
| **Total** | | **~R$ 470/mês** |

## 🔒 Segurança

### Secrets Management

**Nunca commitar:**
- ❌ `terraform.tfstate` (contém senhas)
- ❌ `.terraform/` (cache local)
- ❌ Credenciais GCP
- ❌ Service Account Keys

**Usar:**
- ✅ Google Secret Manager
- ✅ Environment variables
- ✅ `.gitignore` configurado

### IAM Roles

Roles mínimos necessários:

```bash
gcloud projects add-iam-policy-binding aprove-me-prod \
  --member="serviceAccount:terraform@aprove-me-prod.iam.gserviceaccount.com" \
  --role="roles/editor"
```

## 🐛 Troubleshooting

### Erro: "APIs not enabled"

```bash
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  redis.googleapis.com \
  pubsub.googleapis.com
```

### Erro: "Quota exceeded"

Aumentar quotas no console GCP:
https://console.cloud.google.com/iam-admin/quotas

### Erro: "Permission denied"

Verificar IAM roles:
```bash
gcloud projects get-iam-policy aprove-me-prod
```

## 📚 Recursos

- [Terraform GCP Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [Cloud SQL Docs](https://cloud.google.com/sql/docs)
- [Cloud Memorystore Docs](https://cloud.google.com/memorystore/docs)
- [Cloud Pub/Sub Docs](https://cloud.google.com/pubsub/docs)

## 🎯 Próximos Passos

1. ✅ Desenvolvimento local com Docker
2. ⏳ Configurar CI/CD (GitHub Actions)
3. ⏳ Deploy staging no GCP
4. ⏳ Monitoramento (Cloud Monitoring)
5. ⏳ Deploy produção no GCP
