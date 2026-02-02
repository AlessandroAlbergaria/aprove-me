# 🎨 Aprove-me Frontend

> Interface web para gerenciamento de recebíveis e cedentes - Bankme Technical Challenge

[![Next.js](https://img.shields.io/badge/Next.js-16.x-000000?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## 📋 Sobre o Projeto

Interface web moderna desenvolvida com Next.js para consumir a API Aprove-me. Permite cadastro, listagem, edição e exclusão de recebíveis e cedentes com autenticação JWT.

### ✨ Funcionalidades Planejadas

- 🔐 **Autenticação**: Login com JWT
- 📝 **Cadastro**: Formulários validados para payables e assignors
- 📊 **Listagem**: Visualização de todos os registros
- ✏️ **Edição**: Atualização de dados
- 🗑️ **Exclusão**: Remoção de registros
- 🎨 **UI Moderna**: Interface responsiva com Tailwind CSS

## 🛠️ Stack Tecnológica

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Next.js** | 16.x | Framework React com App Router |
| **TypeScript** | 5.x | Tipagem estática |
| **Tailwind CSS** | 4.x | Estilização utility-first |
| **React Hook Form** | - | Gerenciamento de formulários |
| **Zod** | - | Validação de schemas |
| **Axios** | - | Cliente HTTP |
| **Jest** | - | Framework de testes |

## 📦 Pré-requisitos

- **Node.js** 18.x ou superior
- **Yarn** 1.22.x ou superior
- **Backend** rodando em `http://localhost:3000`

## 🚀 Instalação e Configuração

### 1️⃣ Instalar Dependências

```bash
cd frontend
yarn install
```

### 2️⃣ Configurar Variáveis de Ambiente

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3️⃣ Executar em Desenvolvimento

```bash
yarn dev
```

A aplicação estará disponível em `http://localhost:3001`

## 🏃 Scripts Disponíveis

```bash
# Desenvolvimento
yarn dev              # Inicia em modo desenvolvimento

# Build e Produção
yarn build            # Compila para produção
yarn start            # Executa build de produção

# Qualidade de Código
yarn lint             # ESLint
yarn format           # Prettier

# Testes
yarn test             # Testes unitários
yarn test:watch       # Testes em modo watch
yarn test:coverage    # Cobertura de testes
```

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/                    # App Router (Next.js 14+)
│   │   ├── layout.tsx          # Layout raiz
│   │   ├── page.tsx            # Página inicial
│   │   ├── login/              # Página de login
│   │   └── payables/           # Páginas de payables
│   ├── components/
│   │   ├── forms/              # Componentes de formulário
│   │   ├── layout/             # Componentes de layout
│   │   └── ui/                 # Componentes UI base
│   ├── lib/
│   │   ├── api/                # Cliente API (axios)
│   │   └── schemas/            # Schemas Zod
│   ├── hooks/                  # Custom hooks
│   ├── types/                  # TypeScript types
│   └── styles/                 # Estilos globais
├── public/                     # Assets estáticos
├── .prettierrc                 # Configuração Prettier
├── eslint.config.mjs           # Configuração ESLint
├── tailwind.config.ts          # Configuração Tailwind
├── tsconfig.json               # Configuração TypeScript
└── package.json                # Dependências e scripts
```

## 🎨 Padrões de Código

### TypeScript

- ✅ Modo estrito habilitado
- ✅ Tipagem explícita em funções públicas
- ✅ Interfaces para props de componentes
- ✅ Enums para valores fixos

### React

- ✅ Componentes funcionais com hooks
- ✅ Props tipadas com TypeScript
- ✅ Nomenclatura em PascalCase
- ✅ Arquivos `.tsx` para componentes

### Tailwind CSS

- ✅ Classes utility-first
- ✅ Responsive design (mobile-first)
- ✅ Tema customizado quando necessário
- ✅ Evitar CSS inline

## 🔗 Integração com Backend

A aplicação consome a API backend em `http://localhost:3000`:

### Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/integrations/auth` | Login |
| `POST` | `/integrations/payable` | Criar payable |
| `GET` | `/integrations/payable/:id` | Buscar payable |
| `PUT` | `/integrations/payable/:id` | Atualizar payable |
| `DELETE` | `/integrations/payable/:id` | Excluir payable |
| `GET` | `/integrations/assignor/:id` | Buscar assignor |
| `PUT` | `/integrations/assignor/:id` | Atualizar assignor |
| `DELETE` | `/integrations/assignor/:id` | Excluir assignor |

## 🧪 Testes

### Executar Testes

```bash
yarn test
```

### Cobertura

```bash
yarn test:coverage
```

## 📚 Documentação Adicional

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)

## 🤝 Contribuindo

Este é um projeto de desafio técnico. Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'feat: add amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para o desafio técnico Bankme**
