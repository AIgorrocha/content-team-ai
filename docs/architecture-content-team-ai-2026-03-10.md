# System Architecture: Content Team AI

**Date:** 2026-03-10
**Architect:** Igor Rocha
**Version:** 1.0
**Project Type:** web-app
**Project Level:** 3
**Status:** Draft

---

## Document Overview

This document defines the system architecture for Content Team AI. It provides the technical blueprint for implementation, addressing all functional and non-functional requirements from the PRD.

**Related Documents:**
- Product Requirements Document: docs/prd-content-team-ai-2026-03-10.md
- Product Brief: docs/product-brief-content-team-ai-2026-03-10.md

---

## Executive Summary

Content Team AI é um dashboard Next.js 14 com 13 páginas conectado a um banco PostgreSQL (18 tabelas ct_*) e 13 agentes de IA. A arquitetura segue o padrão **Modular Monolith** — um único app Next.js com App Router que serve tanto as páginas quanto as API routes. Os agentes rodam externamente (VPS/OpenClaw) e se comunicam via banco de dados (tabela ct_tasks). Integrações externas (Mailjet, Manychat, HeyGen, RapidAPI) são acessadas via API routes do Next.js, nunca diretamente do frontend.

---

## Architectural Drivers

1. **NFR-005: Simplicidade** — Usuário não-técnico. Interface deve ser intuitiva, ações em ≤3 cliques. Isso direciona: shadcn/ui components, layouts consistentes, feedback visual em toda ação.
2. **NFR-003: Segurança (Auth)** — Token simples mas efetivo. API keys nunca no frontend. Direciona: middleware de auth, server-side API calls.
3. **NFR-001: Performance (Page Load)** — FCP < 1.5s, TTI < 2s. Direciona: Server Components do Next.js, SSR seletivo, paginação.
4. **NFR-006: Data Integrity** — Transactions, audit log. Direciona: queries com transaction, triggers de audit.
5. **Integração com 4 APIs externas** — Mailjet, Manychat, HeyGen, RapidAPI. Direciona: abstração de integrações, error handling robusto.

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│              Next.js 14 App Router (SSR + CSR)               │
│        13 Pages │ shadcn/ui │ Tailwind │ Dark Theme          │
└──────────────────────┬──────────────────────────────────────┘
                       │ fetch / Server Actions
┌──────────────────────▼──────────────────────────────────────┐
│                     API LAYER                                │
│              Next.js API Routes (/app/api/)                   │
│         Auth Middleware │ Validation │ Error Handling         │
└───┬──────────┬──────────┬──────────┬────────────────────────┘
    │          │          │          │
    ▼          ▼          ▼          ▼
┌───────┐ ┌────────┐ ┌────────┐ ┌──────────────────┐
│ PostgreSQL │ │ Mailjet │ │ HeyGen │ │ RapidAPI/Manychat│
│ 18 tabelas │ │  Email  │ │ Video  │ │  Scraping/DMs    │
│   ct_*     │ │   API   │ │  API   │ │                  │
└───────┘ └────────┘ └────────┘ └──────────────────┘
    ▲
    │ READ/WRITE ct_tasks
┌───┴──────────────────────────────────────────────────────────┐
│                    13 AI AGENTS (VPS/OpenClaw)                │
│  content-director │ editor-chief │ tech-chief │ ...          │
│  Comunicam via ct_tasks │ Cron jobs │ Async                  │
└──────────────────────────────────────────────────────────────┘
```

### Architecture Diagram

```mermaid
graph TB
    subgraph Frontend["Frontend (Next.js 14)"]
        Pages[13 Pages]
        Components[shadcn/ui Components]
        Layout[Layout + Sidebar]
    end

    subgraph API["API Layer (Next.js API Routes)"]
        Auth[Auth Middleware]
        ContentAPI[/api/content]
        AgentsAPI[/api/agents]
        CRMAPI[/api/crm]
        EmailAPI[/api/email]
        SettingsAPI[/api/settings]
    end

    subgraph Database["PostgreSQL (Supabase)"]
        Core[ct_agents, ct_tasks, ct_audit_log]
        Content[ct_content_items, ct_content_series]
        CRM[ct_contacts, ct_deals, ct_pipeline_stages]
        Email[ct_subscribers, ct_email_campaigns]
        Intel[ct_competitors, ct_influencers]
        Design[ct_design_system]
    end

    subgraph External["External Services"]
        Mailjet[Mailjet API]
        HeyGen[HeyGen API]
        RapidAPI[RapidAPI]
        Manychat[Manychat API]
    end

    subgraph Agents["AI Agents (VPS)"]
        Director[content-director]
        Workers[12 Worker Agents]
        Cron[Cron Jobs]
    end

    Frontend --> API
    API --> Database
    API --> External
    Agents --> Database
```

### Architectural Pattern

**Pattern:** Modular Monolith (Next.js Full-Stack)

**Rationale:** Um único app Next.js serve frontend + API. Simplicidade máxima de deploy (Vercel ou VPS). Os agentes são o único componente externo, comunicando via banco. Para o escopo atual (1 usuário, ~13 páginas), microservices seria over-engineering. Se precisar escalar para white-label, a separação em módulos internos facilita a futura extração.

---

## Technology Stack

### Frontend

**Choice:** Next.js 14 (App Router) + React 18 + TypeScript

**Rationale:** App Router permite Server Components (performance), layouts aninhados (sidebar consistente), e Server Actions (forms simples). React é o ecossistema mais rico para componentes UI. TypeScript garante type safety com as 18 tabelas.

**UI Library:** shadcn/ui + Tailwind CSS + Lucide React icons

**Rationale:** shadcn/ui oferece componentes acessíveis, customizáveis e dark-theme friendly. Não é uma dependência — os componentes são copiados para o projeto, permitindo customização total.

**Trade-offs:**
- ✓ Gain: SSR, Server Components, excelente DX, ecosystem rico
- ✗ Lose: Bundle size maior que frameworks mais leves (Svelte, Solid)

### Backend

**Choice:** Next.js API Routes (App Router /app/api/)

**Rationale:** Elimina necessidade de servidor separado. API routes colocadas no mesmo deploy. Middleware de auth centralizado. Para 1 usuário com ~50 endpoints, mais que suficiente.

**Trade-offs:**
- ✓ Gain: Deploy único, zero config de CORS, shared types
- ✗ Lose: Menos flexível que Express/Fastify para APIs complexas

### Database

**Choice:** PostgreSQL via Supabase (projeto ianapratica, us-east-1)

**Rationale:** PostgreSQL já disponível no Supabase. 18 tabelas ct_* com schema relacional bem definido. JSONB para campos flexíveis (config, metadata, engagement). Supabase oferece dashboard, migrations, e connection pooling grátis.

**ORM/Query:** SQL direto via `@vercel/postgres` ou `pg` driver

**Rationale:** Schema já definido com SQL puro. Para 18 tabelas com queries conhecidas, ORM adiciona complexidade desnecessária. Queries parametrizadas para SQL injection prevention.

**Trade-offs:**
- ✓ Gain: Performance máxima, controle total, sem overhead de ORM
- ✗ Lose: Sem migrations automáticas do ORM, queries escritas manualmente

### Infrastructure

**Choice:** Vercel (dashboard) + VPS existente (agentes)

**Rationale:** Vercel free tier suporta Next.js nativamente. VPS já existe para os agentes. Separação natural: dashboard stateless no Vercel, agentes stateful no VPS.

### Third-Party Services

| Service | Purpose | Cost | Integration |
|---------|---------|------|-------------|
| Mailjet | Email sending | Free (6k/mês) | REST API via API route |
| Manychat | DMs Instagram | $15/mês | REST API via API route |
| HeyGen | Avatar videos | Pay-as-you-go | REST API v2 via API route |
| RapidAPI | Instagram scraping | Variable | REST API via agent (cron) |
| Supabase | PostgreSQL hosting | Free tier | Direct connection |
| Vercel | Dashboard hosting | Free tier | Native Next.js deploy |

### Development & Deployment

- **VCS:** Git + GitHub
- **CI/CD:** Vercel auto-deploy on push to main
- **Package Manager:** npm
- **Linting:** ESLint + Prettier
- **Testing:** Vitest (unit) + Playwright (E2E)

---

## System Components

### Component 1: Layout Shell

**Purpose:** Estrutura base do dashboard — sidebar, header, main content area

**Responsibilities:**
- Renderizar sidebar com navegação
- Aplicar dark theme globalmente
- Gerenciar estado de collapse/expand no mobile
- Proteger rotas (redirect se não autenticado)

**Interfaces:** React layout component (app/layout.tsx)

**Dependencies:** Auth (cookie validation)

**FRs Addressed:** FR-019, FR-020, FR-022

---

### Component 2: Content Module

**Purpose:** Gestão completa do ciclo de conteúdo

**Responsibilities:**
- Listar, filtrar e buscar conteúdos
- Calendário com drag-and-drop
- Preview e aprovação de conteúdo
- Séries de conteúdo

**Interfaces:**
- Pages: /calendar, /content, /content/[id]
- API: /api/content/*, /api/calendar/*

**Dependencies:** PostgreSQL (ct_content_items, ct_content_series)

**FRs Addressed:** FR-002, FR-003, FR-004, FR-016

---

### Component 3: Agent Module

**Purpose:** Monitoramento e gestão dos 13 agentes

**Responsibilities:**
- Status real-time dos agentes
- CRUD de tarefas
- Visualização de workload e histórico
- Audit log viewer

**Interfaces:**
- Pages: /agents
- API: /api/agents/*, /api/tasks/*, /api/audit/*

**Dependencies:** PostgreSQL (ct_agents, ct_tasks, ct_audit_log)

**FRs Addressed:** FR-005, FR-006, FR-018

---

### Component 4: CRM Module

**Purpose:** Pipeline de vendas e gestão de contatos

**Responsibilities:**
- Kanban board com drag-and-drop
- CRUD de contatos e deals
- Atividades e notas
- Filtros e busca

**Interfaces:**
- Pages: /pipeline, /contacts
- API: /api/pipeline/*, /api/contacts/*, /api/deals/*

**Dependencies:** PostgreSQL (ct_pipeline_stages, ct_contacts, ct_deals, ct_deal_activities)

**FRs Addressed:** FR-007, FR-008

---

### Component 5: Email Marketing Module

**Purpose:** Assinantes, campanhas e sequences

**Responsibilities:**
- Lista e segmentação de assinantes
- Editor e envio de campanhas
- Configuração de sequences automáticas
- Lead magnets management
- Integração Mailjet

**Interfaces:**
- Pages: /subscribers, /campaigns
- API: /api/subscribers/*, /api/campaigns/*, /api/sequences/*, /api/lead-magnets/*

**Dependencies:** PostgreSQL (ct_subscribers, ct_email_campaigns, ct_email_sequences, ct_email_sequence_steps, ct_lead_magnets), Mailjet API

**FRs Addressed:** FR-009, FR-010, FR-011, FR-017

---

### Component 6: Intelligence Module

**Purpose:** Monitoramento de concorrentes e influenciadores

**Responsibilities:**
- Dashboard de concorrentes com posts recentes
- Destaque de posts virais
- Lista de influenciadores e colaborações

**Interfaces:**
- Pages: /competitors, /influencers
- API: /api/competitors/*, /api/influencers/*

**Dependencies:** PostgreSQL (ct_competitors, ct_competitor_posts, ct_influencers, ct_collaborations)

**FRs Addressed:** FR-012, FR-013

---

### Component 7: Settings Module

**Purpose:** Configuração do sistema

**Responsibilities:**
- Gerenciar API keys (mascaradas)
- Status de integrações
- Configuração de cron jobs
- Editor de design system

**Interfaces:**
- Pages: /design, /settings
- API: /api/settings/*, /api/design-system/*

**Dependencies:** PostgreSQL (ct_design_system, ct_agents), Environment variables

**FRs Addressed:** FR-014, FR-015

---

## Data Architecture

### Data Model

18 tabelas com prefixo `ct_` organizadas em 7 domínios:

**Core (3 tabelas):**
- `ct_agents` — 13 agentes com slug, status, config
- `ct_tasks` — Tarefas delegadas entre agentes (hierárquica via parent_task_id)
- `ct_audit_log` — Log de todas as ações

**Conteúdo (3 tabelas):**
- `ct_content_items` — Itens de conteúdo (posts, vídeos, carrosséis)
- `ct_content_series` — Séries agrupando conteúdos
- `ct_content_series_items` — Junction table (série ↔ conteúdo)

**CRM (4 tabelas):**
- `ct_pipeline_stages` — 6 stages (Lead → Won/Lost)
- `ct_contacts` — Contatos com tags e metadata
- `ct_deals` — Deals com valor e stage
- `ct_deal_activities` — Atividades dos deals

**Email (4 tabelas):**
- `ct_subscribers` — Lista de email
- `ct_email_campaigns` — Campanhas de email
- `ct_email_sequences` — Sequences automáticas
- `ct_email_sequence_steps` — Steps de cada sequence

**Lead Magnets (1 tabela):**
- `ct_lead_magnets` — Iscas digitais

**Design (1 tabela):**
- `ct_design_system` — Cores, fontes, carousel style, brand voice

**Inteligência (4 tabelas):**
- `ct_competitors` — 8 concorrentes
- `ct_competitor_posts` — Posts scraped
- `ct_influencers` — Influenciadores
- `ct_collaborations` — Colaborações

### Database Design

Schema SQL completo já definido no plano (ver PLANO-CONTENT-TEAM.md). Inclui:
- UUIDs como primary keys (gen_random_uuid())
- JSONB para campos flexíveis (config, metadata, engagement, stats)
- TEXT[] para arrays (hashtags, tags, platforms, media_urls)
- TIMESTAMPTZ para datas com timezone
- 9 índices para queries frequentes
- Seed data: 6 pipeline stages, 8 concorrentes, 1 design system

**Nota:** O schema SQL completo será incluído em `supabase/migrations/001_content_team.sql`.

### Data Flow

```
WRITE PATH:
  Dashboard Form → API Route → Validate → Transaction → PostgreSQL → Audit Log

READ PATH:
  Dashboard Page → Server Component → Direct Query → PostgreSQL → Render

AGENT PATH:
  Cron Trigger → Agent → Read ct_tasks → Execute → Write Result → Update ct_tasks
                                                  → Write ct_content_items (if content)
                                                  → Write ct_audit_log
```

---

## API Design

### API Architecture

- **Style:** REST (Next.js API Routes)
- **Format:** JSON request/response
- **Auth:** Bearer token via cookie (httpOnly)
- **Validation:** Zod schemas on all inputs
- **Pagination:** `?page=1&limit=20` with total count in response
- **Error Format:** `{ error: string, code: string }`

### Endpoints

```
AUTH
  POST   /api/auth/login          → Login com token
  POST   /api/auth/logout         → Logout (clear cookie)

DASHBOARD
  GET    /api/dashboard/stats     → Stats do overview

CONTENT
  GET    /api/content             → Lista (filtros: status, platform, type)
  POST   /api/content             → Criar conteúdo
  GET    /api/content/:id         → Detalhe
  PATCH  /api/content/:id         → Atualizar
  DELETE /api/content/:id         → Remover
  PATCH  /api/content/:id/approve → Aprovar
  PATCH  /api/content/:id/reject  → Rejeitar

CALENDAR
  GET    /api/calendar            → Conteúdos agendados (range: start, end)
  PATCH  /api/calendar/:id/move   → Reagendar (drag-and-drop)

AGENTS
  GET    /api/agents              → Lista de agentes com status
  GET    /api/agents/:slug        → Detalhe do agente

TASKS
  GET    /api/tasks               → Lista (filtros: agent, status)
  POST   /api/tasks               → Criar tarefa
  PATCH  /api/tasks/:id           → Atualizar
  DELETE /api/tasks/:id           → Cancelar

PIPELINE
  GET    /api/pipeline/stages     → Stages com deals
  PATCH  /api/deals/:id/move      → Mover deal entre stages

CONTACTS
  GET    /api/contacts            → Lista (filtros: tags, source)
  POST   /api/contacts            → Criar
  GET    /api/contacts/:id        → Detalhe com deals e atividades
  PATCH  /api/contacts/:id        → Atualizar
  DELETE /api/contacts/:id        → Remover

DEALS
  GET    /api/deals               → Lista
  POST   /api/deals               → Criar
  GET    /api/deals/:id           → Detalhe
  PATCH  /api/deals/:id           → Atualizar

SUBSCRIBERS
  GET    /api/subscribers         → Lista (filtros: status, tags)
  POST   /api/subscribers         → Adicionar
  POST   /api/subscribers/import  → Importar CSV
  GET    /api/subscribers/export  → Exportar

CAMPAIGNS
  GET    /api/campaigns           → Lista
  POST   /api/campaigns           → Criar
  GET    /api/campaigns/:id       → Detalhe
  PATCH  /api/campaigns/:id       → Atualizar
  POST   /api/campaigns/:id/send  → Enviar (via Mailjet)

SEQUENCES
  GET    /api/sequences           → Lista
  POST   /api/sequences           → Criar
  PATCH  /api/sequences/:id       → Atualizar (toggle active)

COMPETITORS
  GET    /api/competitors         → Lista com stats
  GET    /api/competitors/:id/posts → Posts do concorrente

INFLUENCERS
  GET    /api/influencers         → Lista
  POST   /api/influencers         → Criar
  PATCH  /api/influencers/:id     → Atualizar

COLLABORATIONS
  GET    /api/collaborations      → Lista
  POST   /api/collaborations      → Criar

DESIGN SYSTEM
  GET    /api/design-system       → Design system atual
  PATCH  /api/design-system       → Atualizar

LEAD MAGNETS
  GET    /api/lead-magnets        → Lista
  POST   /api/lead-magnets        → Criar

AUDIT
  GET    /api/audit               → Log (filtros: agent, action, period)

SETTINGS
  GET    /api/settings/integrations → Status das integrações
  POST   /api/settings/test/:service → Testar conexão
```

### Authentication & Authorization

- **Method:** Token simples (variável AUTH_TOKEN no .env)
- **Flow:** Login form → POST /api/auth/login → valida token → set httpOnly cookie → redirect to /
- **Middleware:** Todas as rotas /api/* (exceto /api/auth/login) validam cookie
- **Session:** Cookie httpOnly, secure, SameSite=Strict, expira em 7 dias
- **Single user:** Não há RBAC — apenas autenticado/não-autenticado

---

## Non-Functional Requirements Coverage

### NFR-001: Performance - Page Load

**Requirement:** FCP < 1.5s, TTI < 2s, client-side nav < 500ms

**Architecture Solution:**
- Next.js Server Components para renderização no servidor (zero JS sent for static parts)
- Client Components apenas para interatividade (drag-and-drop, forms)
- Paginação em todas as listas (20 itens/página)
- Lazy loading de componentes pesados (calendário, Kanban)

**Validation:** Lighthouse score, Web Vitals monitoring

---

### NFR-002: Performance - API Response

**Requirement:** CRUD < 500ms (p95), queries complexas < 1s (p95)

**Architecture Solution:**
- Índices no banco para queries frequentes (já definidos no schema)
- Connection pooling via Supabase
- Queries otimizadas com JOINs seletivos
- Paginação server-side

**Validation:** API response time logging

---

### NFR-003: Security - Authentication

**Requirement:** Todas as rotas protegidas, token em httpOnly cookie

**Architecture Solution:**
- Next.js middleware intercepta todas as rotas
- Cookie httpOnly + secure + SameSite=Strict
- Auth token em .env, nunca hardcoded
- Session expira em 7 dias

---

### NFR-004: Security - API Keys

**Requirement:** Keys apenas em .env, nunca no frontend

**Architecture Solution:**
- Chamadas a APIs externas APENAS via API routes (server-side)
- Frontend nunca acessa Mailjet/HeyGen/RapidAPI diretamente
- Settings page mostra keys mascaradas

---

### NFR-005: Usability - Simplicity

**Requirement:** Ações em ≤3 cliques, labels descritivos, feedback visual

**Architecture Solution:**
- shadcn/ui toast para feedback em todas as ações
- Loading skeletons em todas as listas
- Sidebar com links diretos para todas as páginas
- Formulários simples com validação inline

---

### NFR-006: Data Integrity

**Requirement:** Transactions, audit log

**Architecture Solution:**
- Todas as mutations dentro de BEGIN/COMMIT transaction
- Trigger ou application-level audit log em ct_audit_log
- Soft delete para contatos e deals (status = 'deleted')

---

### NFR-007: Compatibility - Browsers

**Requirement:** Chrome 90+, Firefox 90+, Safari 15+, Edge 90+

**Architecture Solution:**
- Next.js com browserslist configurado
- Tailwind CSS (cross-browser por padrão)
- shadcn/ui baseado em Radix (acessível e cross-browser)

---

### NFR-008: Maintainability - Code Quality

**Requirement:** TypeScript strict, componentes < 200 linhas, types para todas as entidades

**Architecture Solution:**
- `types.ts` com interfaces para todas as 18 tabelas
- Componentes separados por módulo (components/content/, components/pipeline/, etc.)
- Utilitários compartilhados em lib/
- ESLint + Prettier configurados

---

## Security Architecture

### Authentication

- Token simples validado contra AUTH_TOKEN env var
- Cookie httpOnly com 7 dias de expiração
- Middleware em todas as rotas

### Authorization

- Single user system — sem RBAC
- Autenticado = acesso total
- Futuro white-label adicionará multi-tenancy

### Data Encryption

- **In transit:** HTTPS (Vercel provides TLS)
- **At rest:** Supabase encrypts at rest by default
- **API keys:** Apenas em environment variables

### Security Best Practices

- Queries parametrizadas (previne SQL injection)
- Zod validation em todos os inputs (previne injection)
- Content Security Policy headers
- Rate limiting nas API routes (optional, single user)
- .env.example sem valores reais

---

## Scalability & Performance

### Scaling Strategy

**Fase atual (1 usuário):** Vercel free tier é mais que suficiente. Serverless functions auto-escalam.

**Futuro (white-label):**
- Vercel Pro para mais executions
- Supabase Pro para mais connections
- CDN para assets estáticos

### Performance Optimization

- Server Components por padrão (menos JS no cliente)
- Queries com SELECT apenas campos necessários
- Índices nos campos mais filtrados
- Paginação em todas as listas

### Caching Strategy

- Next.js built-in caching (ISR para páginas estáticas)
- Revalidação on-demand para dados que mudam por agentes
- Client-side: SWR ou React Query para polling de status dos agentes

### Load Balancing

- Vercel gerencia automaticamente (serverless)
- Não necessário para fase atual

---

## Reliability & Availability

### High Availability Design

- Vercel: Multi-region by default (CDN edge)
- Supabase: Managed PostgreSQL com replication
- Agentes VPS: Single point of failure (aceitável para MVP)

### Disaster Recovery

- **RPO:** 24 horas (backup diário Supabase)
- **RTO:** 1 hora (redeploy Vercel + restore Supabase)
- Git como source of truth para código

### Backup Strategy

- Supabase automated daily backups (free tier: 7 days retention)
- Git repository como backup do código
- Export de dados críticos (contacts, deals) via API

### Monitoring & Alerting

- Vercel Analytics (performance)
- Supabase Dashboard (database metrics)
- ct_audit_log para auditoria de agentes
- Console errors via Vercel logs

---

## Integration Architecture

### External Integrations

| Service | Integration Pattern | Auth | Error Handling |
|---------|-------------------|------|----------------|
| Mailjet | REST API via server-side fetch | API Key + Secret | Retry 3x, log error |
| Manychat | REST API via agent (VPS) | API Token | Log error, skip |
| HeyGen | REST API v2 via server-side | API Key | Queue-based, check status |
| RapidAPI | REST API via agent (VPS) | API Key | Retry, cache, reduce freq |

### Internal Integrations

- **Dashboard ↔ Database:** Direct PostgreSQL connection via API routes
- **Agents ↔ Database:** Direct PostgreSQL connection from VPS
- **Dashboard ↔ Agents:** Indireto via ct_tasks (write task → agent reads → agent writes result → dashboard reads)

### Message/Event Architecture

Não há message broker. Comunicação é via polling no banco:
- Agentes fazem polling em ct_tasks (status = 'pending') a cada 30s
- Dashboard faz polling no status dos agentes a cada 30s
- Cron jobs disparam tarefas em horários definidos

---

## Development Architecture

### Code Organization

```
content-team-ai/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout (sidebar, dark theme)
│   │   ├── page.tsx             # Overview dashboard (/)
│   │   ├── login/page.tsx       # Login page
│   │   ├── calendar/page.tsx    # Calendar view
│   │   ├── content/
│   │   │   ├── page.tsx         # Content list
│   │   │   └── [id]/page.tsx    # Content detail
│   │   ├── agents/page.tsx      # Agents panel
│   │   ├── pipeline/page.tsx    # CRM Kanban
│   │   ├── contacts/page.tsx    # Contacts list
│   │   ├── subscribers/page.tsx # Subscribers
│   │   ├── campaigns/page.tsx   # Email campaigns
│   │   ├── competitors/page.tsx # Competitors
│   │   ├── influencers/page.tsx # Influencers
│   │   ├── design/page.tsx      # Design system editor
│   │   ├── settings/page.tsx    # Settings
│   │   └── api/                 # API routes
│   │       ├── auth/
│   │       ├── content/
│   │       ├── calendar/
│   │       ├── agents/
│   │       ├── tasks/
│   │       ├── pipeline/
│   │       ├── contacts/
│   │       ├── deals/
│   │       ├── subscribers/
│   │       ├── campaigns/
│   │       ├── sequences/
│   │       ├── competitors/
│   │       ├── influencers/
│   │       ├── collaborations/
│   │       ├── design-system/
│   │       ├── lead-magnets/
│   │       ├── audit/
│   │       ├── settings/
│   │       └── dashboard/
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── layout/              # Sidebar, Header, Shell
│   │   ├── dashboard/           # Stats cards, charts
│   │   ├── calendar/            # Calendar grid, event cards
│   │   ├── content/             # Content list, preview, form
│   │   ├── agents/              # Agent cards, task list
│   │   ├── pipeline/            # Kanban board, deal cards
│   │   ├── contacts/            # Contact list, detail
│   │   ├── email/               # Campaign editor, subscriber list
│   │   ├── competitors/         # Competitor cards, post list
│   │   ├── influencers/         # Influencer list, collab form
│   │   └── settings/            # API key forms, cron list
│   └── lib/
│       ├── db.ts                # PostgreSQL connection
│       ├── types.ts             # TypeScript interfaces (all 18 tables)
│       ├── utils.ts             # Shared utilities
│       ├── auth.ts              # Auth helpers
│       ├── design-system.ts     # Design tokens
│       └── integrations/
│           ├── mailjet.ts       # Mailjet API client
│           ├── heygen.ts        # HeyGen API client
│           ├── manychat.ts      # Manychat API client
│           └── rapidapi.ts      # RapidAPI client
├── supabase/
│   └── migrations/
│       └── 001_content_team.sql # Complete schema
├── public/
│   ├── icons/                   # PWA icons
│   └── manifest.json            # PWA manifest
├── tailwind.config.ts
├── package.json
├── tsconfig.json
├── .env.example
├── next.config.js
└── README.md
```

### Module Structure

Cada módulo (content, pipeline, email, etc.) segue o padrão:
- **Page:** Server Component que carrega dados
- **Components:** Client Components para interatividade
- **API Route:** CRUD + business logic
- **Types:** Importados de lib/types.ts

### Testing Strategy

- **Unit:** Vitest para utils e lib functions
- **Integration:** Vitest para API routes
- **E2E:** Playwright para fluxos críticos (login, aprovar conteúdo, mover deal)
- **Coverage target:** 80%+

### CI/CD Pipeline

```
Push to main → Vercel auto-build → Type check → Lint → Deploy
```

---

## Deployment Architecture

### Environments

| Environment | URL | Database | Purpose |
|-------------|-----|----------|---------|
| Development | localhost:3000 | Supabase (dev branch) | Local dev |
| Production | content-team-ai.vercel.app | Supabase (main) | Live |

### Deployment Strategy

- **Dashboard:** Vercel auto-deploy on push to main
- **Agents:** Manual deploy via SSH to VPS (scripts Python/paramiko)
- **Database:** Supabase migrations via CLI

### Infrastructure as Code

- Vercel: vercel.json (minimal config)
- Supabase: SQL migrations in supabase/migrations/
- No Terraform/Pulumi needed for current scale

---

## Requirements Traceability

### Functional Requirements Coverage

| FR ID | FR Name | Component | API Routes |
|-------|---------|-----------|------------|
| FR-001 | Dashboard Overview | Dashboard Module | /api/dashboard/stats |
| FR-002 | Calendário | Content Module | /api/calendar |
| FR-003 | Lista Conteúdos | Content Module | /api/content |
| FR-004 | Detalhe Conteúdo | Content Module | /api/content/:id |
| FR-005 | Painel Agentes | Agent Module | /api/agents |
| FR-006 | Gestão Tarefas | Agent Module | /api/tasks |
| FR-007 | CRM Kanban | CRM Module | /api/pipeline, /api/deals |
| FR-008 | Contatos | CRM Module | /api/contacts |
| FR-009 | Assinantes | Email Module | /api/subscribers |
| FR-010 | Campanhas | Email Module | /api/campaigns |
| FR-011 | Sequences | Email Module | /api/sequences |
| FR-012 | Concorrentes | Intelligence Module | /api/competitors |
| FR-013 | Influenciadores | Intelligence Module | /api/influencers |
| FR-014 | Design System | Settings Module | /api/design-system |
| FR-015 | Settings | Settings Module | /api/settings |
| FR-016 | Séries Conteúdo | Content Module | /api/content-series |
| FR-017 | Lead Magnets | Email Module | /api/lead-magnets |
| FR-018 | Audit Log | Agent Module | /api/audit |
| FR-019 | Sidebar Nav | Layout Shell | N/A (client) |
| FR-020 | Auth | Layout Shell | /api/auth |
| FR-021 | Responsividade/PWA | Layout Shell | N/A (client) |
| FR-022 | Dark Theme | Layout Shell | N/A (client) |

### Non-Functional Requirements Coverage

| NFR ID | NFR Name | Solution | Validation |
|--------|----------|----------|------------|
| NFR-001 | Page Load | Server Components, lazy loading | Lighthouse |
| NFR-002 | API Response | Indexes, connection pooling | Response time logs |
| NFR-003 | Auth Security | httpOnly cookie, middleware | Security audit |
| NFR-004 | API Keys | Server-side only, .env | Code review |
| NFR-005 | Simplicity | shadcn/ui, 3-click rule | User testing |
| NFR-006 | Data Integrity | Transactions, audit log | Integration tests |
| NFR-007 | Browsers | Modern stack, Radix | Cross-browser test |
| NFR-008 | Code Quality | TypeScript strict, ESLint | CI checks |

---

## Trade-offs & Decision Log

**Decision 1: Modular Monolith vs Microservices**
- ✓ Gain: Simplicidade de deploy, shared types, zero latência inter-serviço
- ✗ Lose: Scaling independente de módulos, team autonomy
- **Rationale:** 1 usuário, 1 desenvolvedor. Microservices é over-engineering.

**Decision 2: SQL direto vs ORM (Prisma/Drizzle)**
- ✓ Gain: Performance máxima, controle total, schema já escrito em SQL
- ✗ Lose: Migrations automáticas, type inference do Prisma
- **Rationale:** Schema fixo com 18 tabelas. types.ts manual é suficiente.

**Decision 3: Polling vs WebSocket para status dos agentes**
- ✓ Gain: Simplicidade (polling a cada 30s), sem infra de WebSocket
- ✗ Lose: Real-time instantâneo
- **Rationale:** Agentes atualizam a cada minuto. 30s de polling é aceitável.

**Decision 4: Vercel vs VPS para dashboard**
- ✓ Gain: Zero config, auto-deploy, SSL grátis, CDN global
- ✗ Lose: Cold starts em serverless, menos controle
- **Rationale:** Free tier suporta o uso. Cold starts aceitáveis para single user.

---

## Open Issues & Risks

1. **RapidAPI provider:** Qual exatamente usar para scraping Instagram? Testar reliability.
2. **HeyGen rate limits:** Verificar limites e custos antes de automatizar.
3. **Supabase free tier limits:** 500MB storage, 2GB bandwidth. Monitorar.
4. **Vercel serverless timeout:** 10s no free tier. Queries pesadas podem estourar.

---

## Assumptions & Constraints

- Supabase PostgreSQL disponível e funcional
- Vercel free tier suficiente para 1 usuário
- APIs externas estáveis e documentadas
- Single user (sem multi-tenancy no MVP)
- Agentes rodam no VPS separado do dashboard

---

## Future Considerations

- Multi-tenancy para white-label (tenant_id em todas as tabelas)
- WebSocket para real-time updates
- Redis para caching se necessário
- Prisma/Drizzle se schema crescer muito
- React Native para mobile nativo
- Stripe para billing do white-label

---

## Approval & Sign-off

**Review Status:**
- [ ] Igor Rocha (Product Owner)

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-10 | Igor Rocha | Initial architecture |

---

## Next Steps

### Phase 4: Sprint Planning & Implementation

Run `/sprint-planning` to:
- Break epics into detailed user stories
- Estimate story complexity
- Plan sprint iterations
- Begin implementation following this architectural blueprint

---

**This document was created using BMAD Method v6 - Phase 3 (Solutioning)**

---

## Appendix A: Technology Evaluation Matrix

| Category | Chosen | Alternative 1 | Alternative 2 | Why Chosen |
|----------|--------|---------------|---------------|------------|
| Framework | Next.js 14 | Remix | SvelteKit | Ecosystem, Vercel native, Server Components |
| UI Library | shadcn/ui | Material UI | Chakra UI | Customizable, dark theme, copy-paste model |
| CSS | Tailwind | CSS Modules | Styled Components | DX, performance, shadcn compatibility |
| Database | PostgreSQL | MongoDB | MySQL | Relational model fits, JSONB for flexibility |
| Hosting | Vercel | Netlify | Railway | Native Next.js support, free tier |
| Icons | Lucide React | Heroicons | Phosphor | shadcn default, consistent, tree-shakeable |

---

## Appendix B: Capacity Planning

| Resource | Current Need | Free Tier Limit | Threshold for Upgrade |
|----------|-------------|-----------------|----------------------|
| Supabase DB | ~50MB | 500MB | 400MB |
| Supabase Bandwidth | ~1GB/month | 2GB | 1.5GB |
| Vercel Serverless | ~1000 invocations/day | 100k/month | 80k/month |
| Mailjet | ~500 emails/month | 6000/month | 5000/month |

---

## Appendix C: Cost Estimation

| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| Vercel | $0 | Free tier (Hobby) |
| Supabase | $0 | Free tier |
| Mailjet | $0 | Free tier (6k emails) |
| Manychat | $15 | Business plan required for API |
| HeyGen | ~$20-50 | Pay-as-you-go, depends on usage |
| RapidAPI | ~$0-10 | Depends on scraping volume |
| VPS (agents) | Already paid | Existing server |
| **Total** | **~$35-75/month** | |
