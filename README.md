# 💰 Aprove-me - Sistema de Gerenciamento de Recebíveis

<div align="center">

![Logo Bankme](./assets/logo-bankme.png)

**Sistema fullstack para gerenciamento de recebíveis (payables) e cedentes (assignors)**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)

</div>

---

## 📋 Sobre o Projeto

O **Aprove-me** é uma aplicação fullstack desenvolvida para gerenciar recebíveis financeiros e seus respectivos cedentes. O sistema oferece uma API REST robusta com autenticação JWT, processamento em lote com filas, e uma interface web moderna e responsiva.

### 🎯 Funcionalidades Principais

- ✅ **CRUD Completo** de Recebíveis (Payables) e Cedentes (Assignors)
- ✅ **Autenticação JWT** com gerenciamento de usuários
- ✅ **Processamento em Lote** com RabbitMQ e retry automático
- ✅ **Notificações por Email** para operações em lote
- ✅ **Interface Web** moderna e responsiva
- ✅ **Documentação Swagger** interativa
- ✅ **Testes Automatizados** (unitários e integração)
- ✅ **Docker** para desenvolvimento e produção
- ✅ **CI/CD** com GitHub Actions
- ✅ **Infrastructure as Code** com Terraform

---

## 🏗️ Arquitetura

```
aprove-me/
├── backend/              # API NestJS
│   ├── src/
│   │   ├── modules/      # Módulos da aplicação
│   │   │   ├── auth/     # Autenticação JWT
│   │   │   ├── users/    # Gerenciamento de usuários
│   │   │   ├── payable/  # Recebíveis
│   │   │   ├── assignor/ # Cedentes
│   │   │   ├── integrations/ # Endpoints de integração
│   │   │   ├── queue/    # Filas RabbitMQ
│   │   │   └── mail/     # Notificações por email
│   │   ├── common/       # Filtros, pipes, guards
│   │   ├── config/       # Configurações
│   │   └── database/     # Prisma ORM
│   ├── prisma/           # Schema e migrations
│   └── test/             # Testes E2E
│
├── frontend/             # Interface Next.js
│   ├── src/
│   │   ├── app/          # App Router (Next.js 14+)
│   │   ├── components/   # Componentes React
│   │   ├── contexts/     # Context API (Auth)
│   │   ├── lib/          # Utilitários e API client
│   │   └── types/        # TypeScript types
│
├── infrastructure/       # Infraestrutura
│   ├── terraform/        # IaC para GCP
│   └── local/            # Docker Compose local
│
├── .github/              # CI/CD
│   └── workflows/        # GitHub Actions
│
└── scripts/              # Scripts auxiliares
```

---

## 🚀 Tecnologias

### Backend

| Tecnologia     | Versão | Descrição                     |
| -------------- | ------ | ----------------------------- |
| **Node.js**    | 18+    | Runtime JavaScript            |
| **NestJS**     | 10+    | Framework backend progressivo |
| **TypeScript** | 5+     | Superset JavaScript tipado    |
| **Prisma**     | 7+     | ORM moderno para Node.js      |
| **SQLite**     | 3+     | Banco de dados (dev)          |
| **PostgreSQL** | 15+    | Banco de dados (prod)         |
| **JWT**        | -      | Autenticação stateless        |
| **Passport**   | -      | Estratégias de autenticação   |
| **bcrypt**     | -      | Hash de senhas                |
| **RabbitMQ**   | 3.12+  | Message broker para filas     |
| **Nodemailer** | -      | Envio de emails               |
| **Jest**       | -      | Framework de testes           |
| **Swagger**    | -      | Documentação OpenAPI          |

### Frontend

| Tecnologia          | Versão | Descrição                    |
| ------------------- | ------ | ---------------------------- |
| **Next.js**         | 14+    | Framework React (App Router) |
| **React**           | 18+    | Biblioteca UI                |
| **TypeScript**      | 5+     | Tipagem estática             |
| **Tailwind CSS**    | 3+     | Framework CSS utility-first  |
| **React Hook Form** | 7+     | Gerenciamento de formulários |
| **Zod**             | 3+     | Validação de schemas         |
| **Axios**           | 1+     | Cliente HTTP                 |
| **js-cookie**       | 3+     | Gerenciamento de cookies     |
| **Jest**            | 29+    | Framework de testes          |
| **Testing Library** | -      | Testes de componentes        |

### DevOps

| Tecnologia         | Descrição                 |
| ------------------ | ------------------------- |
| **Docker**         | Containerização           |
| **Docker Compose** | Orquestração local        |
| **GitHub Actions** | CI/CD                     |
| **Terraform**      | Infrastructure as Code    |
| **GCP**            | Cloud provider (opcional) |

---

## 📦 Pré-requisitos

- **Node.js** 18+ e **Yarn**
- **Docker** e **Docker Compose** (recomendado)
- **Git**

---

## 🔧 Instalação e Configuração

### Opção 1: Docker Compose (Recomendado) 🐳

A forma mais rápida de rodar o projeto completo:

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/aprove-me.git
cd aprove-me

# 2. Configure as variáveis de ambiente
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Suba os containers
docker compose up -d

# 4. Aguarde os serviços ficarem prontos (~30s)
docker compose ps

# 5. Acesse a aplicação
# Frontend: http://localhost:3001
# Backend: http://localhost:3000
# Swagger: http://localhost:3000/api-docs
# RabbitMQ: http://localhost:15672 (admin/admin)
```

**Pronto!** O sistema está rodando com:

- ✅ Backend NestJS (porta 3000)
- ✅ Frontend Next.js (porta 3001)
- ✅ RabbitMQ (porta 5672, UI: 15672)
- ✅ Banco SQLite persistente
- ✅ Hot reload habilitado

---

### Opção 2: Instalação Local (Desenvolvimento)

Para desenvolvimento sem Docker:

#### Backend

```bash
cd backend

# Instalar dependências
yarn install

# Configurar ambiente
cp .env.example .env

# Gerar Prisma Client
yarn prisma generate

# Executar migrations
yarn prisma migrate dev

# Criar usuário padrão
yarn seed

# Iniciar servidor de desenvolvimento
yarn start:dev

# Backend rodando em http://localhost:3000
```

#### Frontend

```bash
cd frontend

# Instalar dependências
yarn install

# Configurar ambiente
cp .env.example .env

# Iniciar servidor de desenvolvimento
yarn dev

# Frontend rodando em http://localhost:3001
```

#### RabbitMQ (Opcional - para processamento em lote)

```bash
docker run -d \
  --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=admin \
  -e RABBITMQ_DEFAULT_PASS=admin \
  rabbitmq:3-management-alpine
```

---

## 🏃 Como Executar

### Com Docker Compose

```bash
# Iniciar todos os serviços
docker compose up -d

# Ver logs em tempo real
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs -f backend
docker compose logs -f frontend

# Parar todos os serviços
docker compose down

# Parar e remover volumes (limpar dados)
docker compose down -v

# Rebuild de um serviço
docker compose up -d --build backend
```

### Localmente

```bash
# Backend
cd backend
yarn start:dev

# Frontend (em outro terminal)
cd frontend
yarn dev
```

---

## 🧪 Testes

### Backend

```bash
cd backend

# Testes unitários
yarn test

# Testes em watch mode
yarn test:watch

# Cobertura de testes
yarn test:cov

# Testes E2E
yarn test:e2e
```

**Resultados:**

- ✅ 67 testes passando
- ✅ 10 test suites
- ✅ Cobertura: 70%+

### Frontend

```bash
cd frontend

# Testes unitários
yarn test

# Testes em watch mode
yarn test:watch

# Cobertura de testes
yarn test --coverage
```

**Resultados:**

- ✅ 69 testes passando
- ✅ 15 test suites
- ✅ Cobertura: 50%+

---

## 🔑 Autenticação

### Credenciais Padrão

```
Login: aprovame
Senha: aprovame
```

### Obter Token JWT

```bash
curl -X POST http://localhost:3000/integrations/auth \
  -H "Content-Type: application/json" \
  -d '{
    "login": "aprovame",
    "password": "aprovame"
  }'
```

**Resposta:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Usar Token nas Requisições

```bash
curl -X GET http://localhost:3000/integrations/payable \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 📡 Endpoints da API

### Autenticação

| Método | Endpoint             | Descrição                 | Auth |
| ------ | -------------------- | ------------------------- | ---- |
| POST   | `/integrations/auth` | Login e obtenção de token | ❌   |
| POST   | `/users`             | Cadastro de novo usuário  | ❌   |

### Recebíveis (Payables)

| Método | Endpoint                          | Descrição                  | Auth |
| ------ | --------------------------------- | -------------------------- | ---- |
| POST   | `/integrations/payable`           | Criar recebível            | ✅   |
| GET    | `/integrations/payable/:id`       | Buscar recebível por ID    | ✅   |
| GET    | `/integrations/payable`           | Listar todos os recebíveis | ✅   |
| PATCH  | `/integrations/payable/:id`       | Atualizar recebível        | ✅   |
| DELETE | `/integrations/payable/:id`       | Excluir recebível          | ✅   |
| POST   | `/integrations/payable/batch`     | Criar lote de recebíveis   | ✅   |
| GET    | `/integrations/payable/batch/dlq` | Listar falhas (DLQ)        | ✅   |

### Cedentes (Assignors)

| Método | Endpoint                     | Descrição                | Auth |
| ------ | ---------------------------- | ------------------------ | ---- |
| POST   | `/integrations/assignor`     | Criar cedente            | ✅   |
| GET    | `/integrations/assignor/:id` | Buscar cedente por ID    | ✅   |
| GET    | `/integrations/assignor`     | Listar todos os cedentes | ✅   |
| PATCH  | `/integrations/assignor/:id` | Atualizar cedente        | ✅   |
| DELETE | `/integrations/assignor/:id` | Excluir cedente          | ✅   |

**Documentação completa:** http://localhost:3000/api-docs

---

## 📝 Exemplos de Uso

### 1. Criar um Cedente

```bash
curl -X POST http://localhost:3000/integrations/assignor \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "document": "12345678901",
    "email": "cedente@example.com",
    "phone": "11999999999",
    "name": "João Silva"
  }'
```

### 2. Criar um Recebível

```bash
curl -X POST http://localhost:3000/integrations/payable \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "payable": {
      "id": "223e4567-e89b-12d3-a456-426614174000",
      "value": 1500.50,
      "emissionDate": "2024-01-15"
    },
    "assignor": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "document": "12345678901",
      "email": "cedente@example.com",
      "phone": "11999999999",
      "name": "João Silva"
    }
  }'
```

### 3. Listar Recebíveis

```bash
curl -X GET http://localhost:3000/integrations/payable \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 4. Criar Lote de Recebíveis (até 10.000)

```bash
curl -X POST http://localhost:3000/integrations/payable/batch \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "payables": [
      {
        "id": "323e4567-e89b-12d3-a456-426614174000",
        "value": 1000.00,
        "emissionDate": "2024-01-15",
        "assignor": "123e4567-e89b-12d3-a456-426614174000"
      },
      {
        "id": "423e4567-e89b-12d3-a456-426614174000",
        "value": 2000.00,
        "emissionDate": "2024-01-16",
        "assignor": "123e4567-e89b-12d3-a456-426614174000"
      }
    ]
  }'
```

**Resposta:**

```json
{
  "batchId": "523e4567-e89b-12d3-a456-426614174000",
  "totalPayables": 2,
  "status": "queued",
  "message": "Batch queued for processing",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

## 🌐 Interface Web

### Páginas Disponíveis

| Rota              | Descrição             | Auth |
| ----------------- | --------------------- | ---- |
| `/login`          | Página de login       | ❌   |
| `/register`       | Cadastro de usuário   | ❌   |
| `/payables`       | Lista de recebíveis   | ✅   |
| `/payables/new`   | Criar recebível       | ✅   |
| `/payables/[id]`  | Detalhes do recebível | ✅   |
| `/assignors`      | Lista de cedentes     | ✅   |
| `/assignors/new`  | Criar cedente         | ✅   |
| `/assignors/[id]` | Detalhes do cedente   | ✅   |

### Funcionalidades da Interface

- ✅ **Autenticação** com JWT e cookies seguros
- ✅ **Formulários** com validação em tempo real (Zod)
- ✅ **Listagem** com paginação client-side
- ✅ **CRUD Completo** de recebíveis e cedentes
- ✅ **Responsivo** (desktop e mobile)
- ✅ **Loading States** e feedback visual
- ✅ **Proteção de Rotas** automática
- ✅ **Formatação** de moeda e datas

---

## 🗄️ Modelos de Dados

### User (Usuário)

```typescript
{
  id: string; // UUID
  login: string; // Único, 3-50 caracteres
  password: string; // Hash bcrypt
  createdAt: Date;
  updatedAt: Date;
}
```

### Assignor (Cedente)

```typescript
{
  id: string; // UUID
  document: string; // CPF/CNPJ, único, max 30 chars
  email: string; // Email válido, max 140 chars
  phone: string; // Telefone, max 20 chars
  name: string; // Nome, max 140 chars
  createdAt: Date;
  updatedAt: Date;
}
```

### Payable (Recebível)

```typescript
{
  id: string; // UUID
  value: number; // Valor positivo
  emissionDate: Date; // Data de emissão
  assignorId: string; // FK para Assignor
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔒 Segurança

- ✅ **Senhas** hasheadas com bcrypt (salt rounds: 10)
- ✅ **JWT** com expiração configurável (padrão: 24h)
- ✅ **Rotas protegidas** com guards
- ✅ **Validação** em todas as camadas
- ✅ **CORS** configurado
- ✅ **Helmet** para headers de segurança
- ✅ **Rate Limiting** (opcional)
- ✅ **SQL Injection** prevenido (Prisma ORM)
- ✅ **XSS** prevenido (validações + sanitização)

---

## 📊 Processamento em Lote

### Como Funciona

1. **Envio**: Cliente envia lote de até 10.000 recebíveis
2. **Enfileiramento**: Lote é enfileirado no RabbitMQ
3. **Processamento**: Worker processa item por item
4. **Retry**: Até 4 tentativas com backoff exponencial
5. **DLQ**: Falhas permanentes vão para Dead Letter Queue
6. **Notificação**: Email enviado ao finalizar

### Configuração

```bash
# backend/.env
RABBITMQ_URL=amqp://admin:admin@rabbitmq:5672
RABBITMQ_QUEUE=payable-batch
RABBITMQ_DLQ=payable-batch-dlq

# Email (opcional)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=seu-usuario
SMTP_PASS=sua-senha
EMAIL_FROM="Aprove-me <noreply@aprove-me.com>"
EMAIL_TO_OPS=ops@aprove-me.com
```

### Monitoramento

- **RabbitMQ UI**: http://localhost:15672
- **Logs**: `docker compose logs -f backend`
- **DLQ Endpoint**: `GET /integrations/payable/batch/dlq`

---

## 🐳 Docker

### Comandos Úteis

```bash
# Ver status dos containers
docker compose ps

# Ver logs
docker compose logs -f

# Entrar em um container
docker compose exec backend sh
docker compose exec frontend sh

# Executar comandos no backend
docker compose exec backend yarn test
docker compose exec backend npx prisma migrate dev

# Rebuild completo
docker compose down -v
docker compose build --no-cache
docker compose up -d

# Ver uso de recursos
docker stats
```

### Healthchecks

Todos os serviços possuem healthchecks configurados:

```bash
# Verificar saúde
docker compose ps

# Status esperado: healthy
```

---

## 🚀 Deploy

### Opção 1: Docker Compose (Produção)

```bash
# Build de produção
docker compose -f docker-compose.prod.yml up -d

# Variáveis de ambiente de produção
cp .env.example .env.production
# Editar .env.production com valores reais
```

### Opção 2: Cloud (GCP)

O projeto inclui configuração Terraform para GCP:

```bash
cd infrastructure/terraform

# Inicializar Terraform
terraform init

# Planejar mudanças
terraform plan

# Aplicar infraestrutura
terraform apply

# Ver documentação completa
cat README.md
```

**Recursos criados:**

- Cloud Run (Backend)
- Cloud SQL (PostgreSQL)
- Cloud Memorystore (Redis)
- Cloud Storage (Assets)
- VPC e redes

---

## 📚 Documentação Adicional

- 📖 [Backend README](./backend/README.md) - Documentação detalhada do backend
- 📖 [Decisões Técnicas](./DECISOES_TECNICAS.md) - Justificativas e trade-offs
- 📖 [Plano de Implementação](./PLANO_IMPLEMENTACAO.md) - Roadmap e checklist
- 📖 [Docker Setup](./DOCKER_SETUP.md) - Guia completo de Docker
- 📖 [Testing Guide](./TESTING.md) - Guia de testes
- 📖 [Infrastructure](./infrastructure/README.md) - Documentação de infra

---

## 🛠️ Scripts Disponíveis

### Backend

```bash
yarn start:dev      # Desenvolvimento com hot reload
yarn start:prod     # Produção
yarn build          # Build
yarn test           # Testes unitários
yarn test:watch     # Testes em watch mode
yarn test:cov       # Cobertura de testes
yarn test:e2e       # Testes E2E
yarn lint           # ESLint
yarn format         # Prettier
yarn prisma:studio  # Prisma Studio (UI do banco)
yarn seed           # Seed do banco
```

### Frontend

```bash
yarn dev            # Desenvolvimento
yarn build          # Build de produção
yarn start          # Servidor de produção
yarn test           # Testes
yarn test:watch     # Testes em watch mode
yarn lint           # ESLint
yarn format         # Prettier
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: add amazing feature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrão de Commits

Seguimos o [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(escopo): descrição

feat: nova funcionalidade
fix: correção de bug
docs: documentação
test: testes
chore: tarefas de build, configs
refactor: refatoração
style: formatação
perf: performance
ci: CI/CD
```

---

## 🐛 Troubleshooting

### Backend não inicia

```bash
# Verificar logs
docker compose logs backend

# Executar migrations manualmente
docker compose exec backend npx prisma migrate deploy

# Executar seed
docker compose exec backend yarn seed
```

### Frontend não conecta no Backend

```bash
# Verificar variável de ambiente
cat frontend/.env
# Deve ser: NEXT_PUBLIC_API_URL=http://localhost:3000

# Verificar se backend está rodando
curl http://localhost:3000/api-docs
```

### RabbitMQ não fica healthy

```bash
# Ver logs
docker compose logs rabbitmq

# Aguardar até ver: "Server startup complete"
# Pode demorar até 40 segundos na primeira vez
```

### Porta já em uso

```bash
# Mudar portas no .env
# backend/.env
PORT=3010

# Restart
docker compose down
docker compose up -d
```

---

## 📄 Licença

Este projeto foi desenvolvido como parte de um teste técnico para a Bankme.

---

<div align="center">

**Desenvolvido por Alessandro Albergaria Filho**

[⬆ Voltar ao topo](#-aprove-me---sistema-de-gerenciamento-de-recebíveis)

</div>
