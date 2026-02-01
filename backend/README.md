# Aprove-me Backend

API Backend para Aprove-me - Desafio técnico Bankme

## Descrição

API RESTful construída com NestJS para gerenciamento de recebíveis (payables) e cedentes (assignors).

## Tecnologias

- NestJS 10+
- TypeScript 5+
- Prisma ORM
- SQLite
- Autenticação JWT
- Jest para testes

## Instalação

```bash
yarn install
```

## Executando a aplicação

```bash
# desenvolvimento
yarn start:dev

# modo produção
yarn build
yarn start:prod
```

## Testes

```bash
# testes unitários
yarn test

# cobertura de testes
yarn test:cov
```

## Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-secret-key-here"
JWT_EXPIRATION="60s"
PORT=3000
NODE_ENV="development"
```

## Estrutura do Projeto

```
backend/
├── src/
│   ├── modules/          # Módulos de funcionalidades
│   │   ├── payable/      # Módulo de recebíveis
│   │   ├── assignor/     # Módulo de cedentes
│   │   └── integrations/ # Endpoints de integração
│   ├── common/           # Utilitários compartilhados
│   │   ├── filters/      # Filtros de exceção
│   │   ├── interceptors/ # Interceptadores
│   │   └── pipes/        # Pipes de validação
│   ├── config/           # Configurações
│   ├── app.module.ts     # Módulo raiz
│   └── main.ts           # Ponto de entrada da aplicação
├── prisma/               # Schema e migrations do banco
└── test/                 # Arquivos de teste
```

## Documentação da API

Após iniciar a aplicação, acesse a documentação Swagger em:

```
http://localhost:3000/api
```

## Licença

MIT
