# 🚀 CI/CD Pipelines - GitHub Actions

Pipelines automatizados para Continuous Integration e Continuous Deployment.

## 📋 Workflows Disponíveis

### 1. CI - Continuous Integration (`ci.yml`)

**Trigger:**
- Push em `main` ou `develop`
- Pull Requests para `main` ou `develop`

**Jobs:**

| Job | Descrição | Duração |
|-----|-----------|---------|
| **lint** | ESLint + TypeScript check | ~2 min |
| **test** | Testes unitários + coverage | ~3 min |
| **test-e2e** | Testes E2E com PostgreSQL | ~4 min |
| **security** | Audit de vulnerabilidades | ~1 min |
| **docker-build** | Build da imagem Docker | ~5 min |
| **summary** | Resumo dos resultados | ~10s |

**Badges:**
```markdown
![CI](https://github.com/seu-usuario/aprove-me/workflows/CI/badge.svg)
```

**Exemplo de uso:**
```bash
# Qualquer push ou PR automaticamente roda CI
git push origin feature/nova-funcionalidade
```

---

### 2. CD - Deploy to GCP (`cd-gcp.yml`)

**Trigger:**
- Push em `main` (deploy automático para staging)
- Manual via `workflow_dispatch` (staging ou production)

**Jobs:**

| Job | Descrição | Ambiente |
|-----|-----------|----------|
| **build** | Build e push da imagem Docker para GCR | - |
| **deploy-staging** | Deploy no Cloud Run (staging) | Staging |
| **deploy-production** | Deploy no Cloud Run (production) | Production |
| **rollback** | Rollback automático em caso de falha | Production |

**Ambientes:**
- **Staging**: Deploy automático a cada push em `main`
- **Production**: Deploy manual com aprovação

**Deploy Manual:**
```bash
# Via GitHub UI:
Actions → CD - Deploy to GCP → Run workflow → Select environment
```

**Secrets necessários:**

| Secret | Descrição | Exemplo |
|--------|-----------|---------|
| `GCP_PROJECT_ID` | ID do projeto GCP | `aprove-me-prod` |
| `GCP_SA_KEY` | Service Account Key (JSON) | `{ "type": "service_account", ... }` |
| `STAGING_DATABASE_URL` | PostgreSQL staging | `postgresql://...` |
| `STAGING_REDIS_HOST` | Redis staging | `10.0.0.1` |
| `STAGING_RABBITMQ_URL` | RabbitMQ staging | `amqp://...` |
| `PRODUCTION_DATABASE_URL` | PostgreSQL production | `postgresql://...` |
| `PRODUCTION_REDIS_HOST` | Redis production | `10.0.0.2` |
| `PRODUCTION_RABBITMQ_URL` | RabbitMQ production | `amqp://...` |
| `JWT_SECRET` | Chave secreta JWT | `your-super-secret-key` |

**Configurar Secrets:**
```bash
# Via GitHub UI:
Settings → Secrets and variables → Actions → New repository secret

# Ou via GitHub CLI:
gh secret set GCP_PROJECT_ID --body "aprove-me-prod"
gh secret set GCP_SA_KEY < service-account-key.json
```

---

### 3. Terraform - Infrastructure (`terraform.yml`)

**Trigger:**
- Push em `main` (mudanças em `infrastructure/terraform/**`)
- Pull Requests (mudanças em `infrastructure/terraform/**`)
- Manual via `workflow_dispatch` (plan, apply, destroy)

**Jobs:**

| Job | Descrição | Quando |
|-----|-----------|--------|
| **validate** | Valida sintaxe Terraform | Sempre |
| **plan** | Gera plano de execução | PR ou manual |
| **apply** | Aplica mudanças | Manual (main) |
| **destroy** | Destroi recursos | Manual (main) |

**Execução Manual:**
```bash
# Via GitHub UI:
Actions → Terraform - Infrastructure → Run workflow → Select action
```

**Ambientes protegidos:**
- `terraform-apply`: Requer aprovação manual
- `terraform-destroy`: Requer aprovação manual

---

## 🔐 Configuração de Secrets

### Criar Service Account no GCP

```bash
# 1. Criar Service Account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions"

# 2. Dar permissões
gcloud projects add-iam-policy-binding aprove-me-prod \
  --member="serviceAccount:github-actions@aprove-me-prod.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding aprove-me-prod \
  --member="serviceAccount:github-actions@aprove-me-prod.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding aprove-me-prod \
  --member="serviceAccount:github-actions@aprove-me-prod.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# 3. Criar chave JSON
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@aprove-me-prod.iam.gserviceaccount.com

# 4. Adicionar ao GitHub Secrets
cat key.json | gh secret set GCP_SA_KEY
```

### Lista Completa de Secrets

```bash
# GCP
gh secret set GCP_PROJECT_ID --body "aprove-me-prod"
gh secret set GCP_SA_KEY < key.json

# Staging
gh secret set STAGING_DATABASE_URL --body "postgresql://user:pass@host:5432/db"
gh secret set STAGING_REDIS_HOST --body "10.0.0.1"
gh secret set STAGING_RABBITMQ_URL --body "amqp://user:pass@host:5672"

# Production
gh secret set PRODUCTION_DATABASE_URL --body "postgresql://user:pass@host:5432/db"
gh secret set PRODUCTION_REDIS_HOST --body "10.0.0.2"
gh secret set PRODUCTION_RABBITMQ_URL --body "amqp://user:pass@host:5672"

# App
gh secret set JWT_SECRET --body "your-super-secret-jwt-key-change-in-production"
```

---

## 🎯 Fluxo de Trabalho

### Desenvolvimento

```mermaid
graph LR
    A[Feature Branch] --> B[Push]
    B --> C[CI: Lint + Tests]
    C --> D[Create PR]
    D --> E[CI: Full Suite]
    E --> F[Code Review]
    F --> G[Merge to Main]
```

### Deploy

```mermaid
graph LR
    A[Merge to Main] --> B[CI: Full Suite]
    B --> C[Build Docker Image]
    C --> D[Push to GCR]
    D --> E[Deploy Staging]
    E --> F[Health Check]
    F --> G{Manual Approval}
    G -->|Yes| H[Deploy Production]
    G -->|No| I[Stop]
    H --> J[Health Check]
    J --> K{Success?}
    K -->|Yes| L[Done]
    K -->|No| M[Rollback]
```

---

## 📊 Monitoramento

### Ver Status dos Workflows

```bash
# Via GitHub CLI
gh run list --workflow=ci.yml
gh run list --workflow=cd-gcp.yml
gh run list --workflow=terraform.yml

# Ver detalhes de um run
gh run view 1234567890

# Ver logs
gh run view 1234567890 --log
```

### Badges no README

```markdown
![CI](https://github.com/seu-usuario/aprove-me/workflows/CI/badge.svg)
![CD](https://github.com/seu-usuario/aprove-me/workflows/CD/badge.svg)
![Terraform](https://github.com/seu-usuario/aprove-me/workflows/Terraform/badge.svg)
```

---

## 🐛 Troubleshooting

### CI Falhando

**Problema:** Testes falhando
```bash
# Rodar localmente
cd backend
yarn test
```

**Problema:** Lint falhando
```bash
cd backend
yarn lint --fix
```

**Problema:** Docker build falhando
```bash
cd backend
docker build -t test .
```

### CD Falhando

**Problema:** Autenticação GCP
```bash
# Verificar Service Account
gcloud iam service-accounts list

# Verificar permissões
gcloud projects get-iam-policy aprove-me-prod
```

**Problema:** Deploy falhando
```bash
# Ver logs do Cloud Run
gcloud run services logs read aprove-me --region=us-central1

# Verificar revisões
gcloud run revisions list --service=aprove-me --region=us-central1
```

**Problema:** Health check falhando
```bash
# Testar endpoint
curl https://aprove-me-xxx.a.run.app/health-check
```

### Terraform Falhando

**Problema:** State lock
```bash
# Forçar unlock (cuidado!)
terraform force-unlock LOCK_ID
```

**Problema:** Recursos já existem
```bash
# Importar recursos existentes
terraform import google_sql_database_instance.postgres aprove-me-db
```

---

## 🔄 Rollback Manual

### Cloud Run

```bash
# Listar revisões
gcloud run revisions list --service=aprove-me --region=us-central1

# Voltar para revisão anterior
gcloud run services update-traffic aprove-me \
  --region=us-central1 \
  --to-revisions=aprove-me-00042-abc=100
```

### Terraform

```bash
# Ver histórico de state
terraform state list

# Rollback via Git
git revert <commit-hash>
git push origin main
```

---

## 📈 Melhorias Futuras

- [ ] Cache de dependências mais agressivo
- [ ] Testes de performance
- [ ] Deploy canary (gradual)
- [ ] Blue-green deployment
- [ ] Notificações Slack/Discord
- [ ] Métricas de deploy (DORA)
- [ ] Análise de código (SonarQube)
- [ ] SAST/DAST security scanning
- [ ] Terraform remote state (GCS)
- [ ] Multi-region deployment

---

## 📚 Recursos

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [Terraform Cloud Run](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloud_run_service)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
