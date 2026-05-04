# EitaCraque

Rede social para olheiros de futebol. Atletas postam lances, IA + comunidade avaliam, olheiros e clubes prospectam.

## Stack

- **Frontend** Vue 3 + TypeScript + Vite + Pinia + Tailwind ([apps/web](apps/web))
- **API** NestJS + Prisma + PostgreSQL + JWT ([apps/api](apps/api))
- **Tipos compartilhados** ([packages/shared](packages/shared))
- **Vídeo** MUX (Direct Upload + HLS)
- **IA** Grok (xAI) — análise técnica de lances
- **Infra** EC2 m5.xlarge + Postgres + Redis (filas)

## Estrutura do monorepo

```
eitacraque/
├── apps/
│   ├── api/        NestJS backend (REST /api/v1)
│   └── web/        Vue 3 PWA mobile-first
├── packages/
│   └── shared/     Enums, DTOs e domain types compartilhados
├── docker-compose.yml
├── .env.example
└── package.json    (workspaces)
```

## Pré-requisitos

- Node 20+ (testado em 24)
- npm 10+
- Docker Desktop (Postgres + Redis locais)

## Setup inicial

```bash
# 1. Instalar dependências de todos os workspaces
npm install

# 2. Copiar .env e preencher segredos
cp .env.example .env

# 3. Subir Postgres + Redis
npm run db:up

# 4. Build do pacote shared (API e web dependem dele)
npm run build:shared

# 5. Gerar client Prisma + rodar migrations
cd apps/api
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
cd ../..

# 6. Subir API + frontend em paralelo
npm run dev
```

API: http://localhost:3333/api/v1 · Swagger: http://localhost:3333/docs · Web: http://localhost:5173

### Usuários de seed

| Tipo | E-mail | Senha |
|---|---|---|
| Atleta | joao@eitacraque.app | senha123! |
| Olheiro | olheiro@eitacraque.app | senha123! |
| Clube | clube@eitacraque.app | senha123! |

## Variáveis de ambiente

| Var | Para que serve |
|---|---|
| `DATABASE_URL` | Connection string do Postgres |
| `JWT_SECRET` | Assina os access tokens (use 64+ bytes em produção) |
| `MUX_TOKEN_ID` / `MUX_TOKEN_SECRET` | Credenciais MUX para upload + transcoding |
| `MUX_WEBHOOK_SECRET` | Verifica assinatura dos webhooks `asset.ready` |
| `GROK_API_KEY` | Chave xAI. Sem ela, a IA roda em modo stub |
| `WEB_ORIGIN` | Origem(ns) permitidas no CORS, separadas por vírgula |
| `VITE_API_URL` | URL da API consumida pelo front |

## Módulos da API

| Rota | Método | Quem pode | Descrição |
|---|---|---|---|
| `/auth/register` | POST | público | Cria conta (4 tipos) |
| `/auth/login` | POST | público | JWT + refresh token |
| `/auth/refresh` | POST | público | Rotaciona tokens |
| `/auth/logout` | POST | autenticado | Revoga refresh token |
| `/feed?tab=` | GET | público (auth opcional) | Pra Você / Seguindo / Em Alta |
| `/clips` | POST | atleta | Cria lance + upload URL MUX |
| `/clips/:uploadId/finalize` | POST | atleta | Conclui upload, dispara IA |
| `/clips/:id` | GET | público | Detalhes do lance |
| `/clips/:id/analysis` | GET | público | Relatório IA + média da comunidade |
| `/clips/:id/rate` | POST | autenticado | Nota (peso maior se olheiro) |
| `/clips/webhooks/mux` | POST | MUX | Eventos `asset.ready` |
| `/users/athletes/:id` | GET | público | Perfil atleta + radar agregado |
| `/notifications` | GET | autenticado | Inbox |
| `/notifications/:id/read` | POST | autenticado | Marca como lida |

## Telas do MVP (apps/web)

| Rota | Tela |
|---|---|
| `/login` | Login |
| `/register` | Cadastro com escolha de tipo de conta |
| `/feed` | Feed com 3 abas |
| `/upload` | Wizard 3 etapas (vídeo → tags → processando) |
| `/clip/:id` | Player + análise IA + radar + avaliação |
| `/athlete/:id` | Perfil do atleta + métricas |

## Roadmap pós-MVP

- Busca avançada com PostGIS (raio em km) + exportar CSV
- Ranking semanal/mensal/geral por posição
- Chat 1-1 + Proposta Oficial (clube verificado)
- Notificações push (Firebase / Web Push)
- Verificação de clube com upload de CNPJ
- Materialized view de percentil nacional (job diário)
- Live streaming via MUX

## Decisões de arquitetura

- **API desacoplada** para permitir múltiplos frontends futuros (mesmo domínio).
- **MUX em vez de S3 puro** porque queremos suportar live + adaptive streaming sem montar pipeline próprio.
- **Argon2** para hash de senhas (resistente a GPU).
- **Prisma** porque o schema é o coração do produto e a migração precisa ser auditável.
- **Pacote `shared`** evita drift de tipos entre back e front (DTOs e enums em um único lugar).

## Comandos úteis

```bash
npm run dev              # API + web em paralelo
npm run dev:api          # só API
npm run dev:web          # só web
npm run build            # build de todos os workspaces
npm run db:up            # docker compose up postgres + redis
npm run db:down          # derruba os containers
npm run db:migrate       # nova migration
npm run db:studio        # prisma studio (UI do banco)
```
