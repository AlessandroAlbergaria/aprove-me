# 🚀 Aprove-me Backend

> API RESTful para gerenciamento de recebíveis e cedentes - Bankme Technical Challenge

[![NestJS](https://img.shields.io/badge/NestJS-11.x-E0234E?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?logo=prisma)](https://www.prisma.io/)
[![Jest](https://img.shields.io/badge/Jest-29.x-C21325?logo=jest)](https://jestjs.io/)

## 📋 Sobre o Projeto

API Backend desenvolvida com NestJS para gerenciamento de recebíveis (payables) e cedentes (assignors). Sistema completo com autenticação JWT, validações robustas, persistência em banco de dados e documentação interativa via Swagger.

### ✨ Funcionalidades Implementadas

- ✅ **Nível 1 - Validação**: Validação completa de dados com class-validator
- ✅ **Nível 2 - Persistência**: Banco de dados SQLite com Prisma ORM
- ✅ **Nível 3 - Testes**: Testes unitários com Jest (43 testes, 7 suites)
- ✅ **Nível 4 - Autenticação**: Sistema JWT com expiração de 1 minuto
- ✅ **Nível 5 - Permissões**: Gerenciamento de usuários com bcrypt
- ✅ **Nível 6 - Infra**: Docker, Docker Compose e Swagger

## 🛠️ Stack Tecnológica

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Node.js** | 18+ | Runtime JavaScript |
| **NestJS** | 11.x | Framework backend |
| **TypeScript** | 5.x | Tipagem estática |
| **Prisma** | 7.x | ORM para banco de dados |
| **SQLite** | 3.x | Banco de dados |
| **JWT** | - | Autenticação |
| **Passport** | - | Estratégias de autenticação |
| **bcrypt** | 6.x | Hash de senhas |
| **class-validator** | - | Validação de DTOs |
| **class-transformer** | - | Transformação de dados |
| **Jest** | 29.x | Framework de testes |
| **Swagger** | 11.x | Documentação da API |

## 📦 Pré-requisitos

- **Node.js** 18.x ou superior
- **Yarn** 1.22.x ou superior
- **Docker** (opcional, para execução via container)

## 🚀 Instalação e Configuração

### 1️⃣ Clonar o Repositório

```bash
git clone <repository-url>
cd aprove-me/backend
```

### 2️⃣ Instalar Dependências

```bash
yarn install
```

### 3️⃣ Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# Porta da aplicação
PORT=3000

# Ambiente (development | production)
NODE_ENV=development

# URL do banco de dados SQLite
DATABASE_URL="file:./dev.db"

# Chave secreta para JWT (MUDE EM PRODUÇÃO!)
JWT_SECRET=your-super-secret-key-here

# Tempo de expiração do token JWT
JWT_EXPIRATION=60s
```

### 4️⃣ Configurar Banco de Dados

```bash
# Executar migrations
npx prisma migrate deploy

# Gerar Prisma Client
npx prisma generate

# Criar usuário padrão (aprovame/aprovame)
yarn seed
```

## 🏃 Executando a Aplicação

### Modo Desenvolvimento

```bash
yarn start:dev
```

A aplicação estará disponível em `http://localhost:3000`

### Modo Produção

```bash
# Build da aplicação
yarn build

# Executar build
yarn start:prod
```

### Com Docker

```bash
# Na raiz do projeto
docker-compose up -d
```

## 🧪 Testes

### Executar Todos os Testes

```bash
yarn test
```

### Testes em Modo Watch

```bash
yarn test:watch
```

### Cobertura de Testes

```bash
yarn test:cov
```

**Resultados dos Testes:**

```
Test Suites: 7 passed, 7 total
Tests:       43 passed, 43 total
Coverage:    ~57% (Services: 100%)
```

### Testes E2E

```bash
yarn test:e2e
```

## 📚 Documentação da API

A documentação interativa da API está disponível via **Swagger/OpenAPI**.

### Acessar Documentação

Após iniciar a aplicação, acesse:

```
http://localhost:3000/api
```

### Como Usar o Swagger

1. **Autenticar**: Clique no botão "Authorize" no topo
2. **Login**: Execute `POST /integrations/auth` com credenciais `aprovame/aprovame`
3. **Copiar Token**: Copie o `access_token` da resposta
4. **Autorizar**: Cole o token no campo "Value" do modal Authorize
5. **Testar**: Agora você pode testar todos os endpoints protegidos

## 🔐 Autenticação

A API usa **JWT (JSON Web Token)** para autenticação.

### Credenciais Padrão

```json
{
  "login": "aprovame",
  "password": "aprovame"
}
```

### Obter Token

```bash
POST /integrations/auth
Content-Type: application/json

{
  "login": "aprovame",
  "password": "aprovame"
}
```

**Resposta:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Usar Token

Adicione o token no header de todas as requisições protegidas:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Importante:** O token expira em **1 minuto** conforme requisito do desafio.

## 📡 Endpoints da API

### Autenticação

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `POST` | `/integrations/auth` | Login e geração de JWT | ❌ Pública |

### Recebíveis (Payables)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `POST` | `/integrations/payable` | Criar recebível + cedente | ✅ JWT |
| `GET` | `/integrations/payable/:id` | Buscar recebível por ID | ✅ JWT |
| `PUT` | `/integrations/payable/:id` | Atualizar recebível | ✅ JWT |
| `DELETE` | `/integrations/payable/:id` | Excluir recebível | ✅ JWT |

### Cedentes (Assignors)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `GET` | `/integrations/assignor/:id` | Buscar cedente por ID | ✅ JWT |
| `PUT` | `/integrations/assignor/:id` | Atualizar cedente | ✅ JWT |
| `DELETE` | `/integrations/assignor/:id` | Excluir cedente | ✅ JWT |

## 📝 Exemplos de Requisições

### Criar Recebível com Cedente

```bash
POST /integrations/payable
Authorization: Bearer <token>
Content-Type: application/json

{
  "payable": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "value": 1500.50,
    "emissionDate": "2026-02-02T00:00:00.000Z",
    "assignor": "987fcdeb-51a2-43d7-b123-123456789abc"
  },
  "assignor": {
    "id": "987fcdeb-51a2-43d7-b123-123456789abc",
    "document": "12345678901",
    "email": "contato@empresa.com.br",
    "phone": "(11) 98765-4321",
    "name": "Empresa LTDA"
  }
}
```

### Buscar Recebível

```bash
GET /integrations/payable/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <token>
```

### Atualizar Recebível

```bash
PUT /integrations/payable/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <token>
Content-Type: application/json

{
  "value": 2000.00
}
```

### Excluir Recebível

```bash
DELETE /integrations/payable/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <token>
```

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── modules/                    # Módulos de funcionalidades
│   │   ├── auth/                   # Autenticação JWT
│   │   │   ├── constants/          # Constantes (secret, expiration)
│   │   │   ├── decorators/         # @Public() decorator
│   │   │   ├── dto/                # DTOs (LoginDto, AuthResponseDto)
│   │   │   ├── guards/             # JwtAuthGuard
│   │   │   ├── strategies/         # JwtStrategy
│   │   │   ├── auth.controller.ts  # Controller de autenticação
│   │   │   ├── auth.service.ts     # Lógica de autenticação
│   │   │   └── auth.module.ts      # Módulo de autenticação
│   │   ├── users/                  # Gerenciamento de usuários
│   │   │   ├── dto/                # DTOs (CreateUserDto)
│   │   │   ├── users.service.ts    # Lógica de usuários
│   │   │   └── users.module.ts     # Módulo de usuários
│   │   ├── payable/                # Recebíveis
│   │   │   ├── dto/                # DTOs (Create, Update, Response)
│   │   │   ├── payable.repository.ts # Repository pattern
│   │   │   ├── payable.service.ts  # Lógica de negócio
│   │   │   └── payable.module.ts   # Módulo de payables
│   │   ├── assignor/               # Cedentes
│   │   │   ├── dto/                # DTOs (Create, Update, Response)
│   │   │   ├── assignor.repository.ts # Repository pattern
│   │   │   ├── assignor.service.ts # Lógica de negócio
│   │   │   └── assignor.module.ts  # Módulo de assignors
│   │   └── integrations/           # Endpoints de integração
│   │       ├── dto/                # DTOs (CreateIntegrationDto)
│   │       ├── integrations.controller.ts # Controller principal
│   │       ├── integrations.service.ts    # Orquestração
│   │       └── integrations.module.ts     # Módulo de integração
│   ├── common/                     # Utilitários compartilhados
│   │   ├── dto/                    # DTOs comuns (UuidParamDto)
│   │   └── filters/                # Exception filters
│   │       ├── http-exception.filter.ts
│   │       └── validation-exception.filter.ts
│   ├── config/                     # Configurações
│   │   └── configuration.ts        # ConfigModule setup
│   ├── database/                   # Banco de dados
│   │   ├── prisma.service.ts       # PrismaService
│   │   └── prisma.module.ts        # PrismaModule global
│   ├── test/                       # Helpers de teste
│   │   ├── factories/              # Factories para dados de teste
│   │   └── mocks/                  # Mocks (PrismaService)
│   ├── app.module.ts               # Módulo raiz
│   ├── main.ts                     # Bootstrap da aplicação
│   └── seed.ts                     # Seed do banco de dados
├── prisma/
│   ├── schema.prisma               # Schema do Prisma
│   └── migrations/                 # Migrations do banco
├── test/                           # Testes E2E
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── Dockerfile                      # Dockerfile multi-stage
├── .dockerignore                   # Exclusões do Docker
├── .env.example                    # Template de variáveis
├── package.json                    # Dependências e scripts
├── tsconfig.json                   # Configuração TypeScript
├── nest-cli.json                   # Configuração NestJS
└── README.md                       # Este arquivo
```

## 🗄️ Modelos de Dados

### Payable (Recebível)

```typescript
{
  id: string           // UUID v4
  value: number        // Valor em reais (positivo)
  emissionDate: Date   // Data de emissão
  assignorId: string   // ID do cedente (FK)
  createdAt: Date      // Data de criação
  updatedAt: Date      // Data de atualização
}
```

### Assignor (Cedente)

```typescript
{
  id: string           // UUID v4
  document: string     // CPF/CNPJ (único, max 30 chars)
  email: string        // Email (max 140 chars)
  phone: string        // Telefone (max 20 chars)
  name: string         // Nome/Razão Social (max 140 chars)
  createdAt: Date      // Data de criação
  updatedAt: Date      // Data de atualização
}
```

### User (Usuário)

```typescript
{
  id: string           // UUID v4
  login: string        // Login único
  password: string     // Hash bcrypt
  createdAt: Date      // Data de criação
  updatedAt: Date      // Data de atualização
}
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
yarn start:dev          # Inicia em modo watch
yarn start:debug        # Inicia com debugger

# Build e Produção
yarn build              # Compila TypeScript
yarn start:prod         # Executa build compilado

# Testes
yarn test               # Testes unitários
yarn test:watch         # Testes em modo watch
yarn test:cov           # Cobertura de testes
yarn test:e2e           # Testes end-to-end

# Qualidade de Código
yarn lint               # ESLint
yarn format             # Prettier

# Banco de Dados
yarn seed               # Criar usuário padrão
npx prisma studio       # Interface visual do banco
npx prisma migrate dev  # Criar nova migration
```

## 🐳 Docker e Infraestrutura Local

### 🏠 Infraestrutura Completa (Recomendado)

Para rodar **toda a infraestrutura localmente** (PostgreSQL, Redis, RabbitMQ, Backend):

```bash
# Da raiz do projeto
./scripts/start-local.sh
```

Isso irá subir:
- ✅ **PostgreSQL** (porta 5432) - Simula Cloud SQL
- ✅ **Redis** (porta 6379) - Simula Cloud Memorystore
- ✅ **RabbitMQ** (portas 5672, 15672) - Simula Cloud Pub/Sub
- ✅ **Backend** (porta 3000) - Simula Cloud Run

**Acessar serviços:**
- Backend API: http://localhost:3000
- Swagger UI: http://localhost:3000/api
- RabbitMQ Management: http://localhost:15672 (admin/admin)

**Ver logs:**
```bash
./scripts/logs.sh          # Todos os serviços
./scripts/logs.sh backend  # Apenas backend
```

**Parar infraestrutura:**
```bash
./scripts/stop-local.sh
```

📚 **Documentação completa:** `infrastructure/local/README.md`

### 🔧 Build da Imagem (Standalone)

```bash
docker build -t aprove-me-backend .
```

### 🚀 Executar Container (Standalone)

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:5432/aprove-me" \
  -e JWT_SECRET="your-secret-key" \
  aprove-me-backend
```

### ☁️ Infraestrutura GCP (Futuro)

O projeto está preparado para deploy no GCP com Terraform:

```bash
cd infrastructure/terraform
terraform init
terraform plan
```

📚 **Documentação Terraform:** `infrastructure/terraform/README.md`

## 🔍 Validações Implementadas

### Payable

- ✅ `id`: UUID v4 válido
- ✅ `value`: Número positivo
- ✅ `emissionDate`: Data válida (ISO 8601)
- ✅ `assignor`: UUID v4 válido

### Assignor

- ✅ `id`: UUID v4 válido
- ✅ `document`: String (max 30 caracteres, único)
- ✅ `email`: Email válido (max 140 caracteres)
- ✅ `phone`: String (max 20 caracteres)
- ✅ `name`: String (max 140 caracteres)

### Mensagens de Erro

Todas as validações retornam mensagens descritivas indicando:
- Qual campo está inválido
- Qual o problema encontrado
- Como corrigir (quando aplicável)

## 🚨 Tratamento de Erros

A API retorna erros padronizados com os seguintes status codes:

| Status | Descrição | Exemplo |
|--------|-----------|---------|
| `400` | Bad Request | Dados inválidos, validação falhou |
| `401` | Unauthorized | Token JWT inválido ou expirado |
| `404` | Not Found | Recurso não encontrado |
| `409` | Conflict | Documento de cedente duplicado |
| `500` | Internal Server Error | Erro interno do servidor |

**Formato de Erro:**

```json
{
  "statusCode": 400,
  "message": [
    "value deve ser um número positivo",
    "email deve ser um endereço de email válido"
  ],
  "error": "Bad Request"
}
```

## 🎯 Decisões Técnicas

Todas as decisões técnicas estão documentadas em detalhes no arquivo `DECISOES_TECNICAS.md` na raiz do projeto, incluindo:

- Justificativas de cada escolha
- Alternativas consideradas
- Trade-offs avaliados
- Comparações com outras abordagens

## 📈 Performance

### Otimizações Implementadas

- ✅ Repository Pattern para queries otimizadas
- ✅ Índice único em `assignor.document`
- ✅ Prisma Client gerado e otimizado
- ✅ Validações em camadas apropriadas
- ✅ Docker multi-stage para imagens menores

### Métricas

- **Tempo de startup**: ~2s
- **Tempo de resposta médio**: <50ms
- **Tamanho da imagem Docker**: ~210MB

## 🔒 Segurança

### Implementações

- ✅ Senhas hasheadas com bcrypt (salt rounds: 10)
- ✅ JWT com expiração configurável (1 minuto)
- ✅ Validação de entrada em todas as rotas
- ✅ Guards globais para proteção de rotas
- ✅ Variáveis sensíveis em `.env` (não commitadas)
- ✅ SQL injection prevenido (Prisma ORM)

### Boas Práticas

- ✅ Princípio do menor privilégio
- ✅ Validação whitelist (forbidNonWhitelisted)
- ✅ Transformação automática de tipos
- ✅ Logs de erros (sem expor detalhes sensíveis)

## 🤝 Contribuindo

Este é um projeto de desafio técnico, mas sugestões são bem-vindas!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'feat: add amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ para o desafio técnico Bankme**
