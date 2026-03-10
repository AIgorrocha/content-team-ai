# Content Team AI

Dashboard para gerenciamento de 13 agentes de IA especializados em automacao de conteudo.

## Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **UI:** Tailwind CSS + shadcn/ui (dark theme)
- **Database:** PostgreSQL (Supabase)
- **Icons:** Lucide React

## Setup (Replit)

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variaveis de ambiente
Copie `.env.example` para `.env` e preencha:
```bash
cp .env.example .env
```

Variaveis obrigatorias:
- `DATABASE_URL` - String de conexao PostgreSQL (Supabase)
- `AUTH_TOKEN` - Token para proteger o dashboard

### 3. Criar tabelas no banco
Execute o SQL em `supabase/migrations/001_content_team.sql` no Supabase SQL Editor.

### 4. Rodar o projeto
```bash
npm run dev
```

## Estrutura do Projeto

```
src/
├── app/                    # Pages (Next.js App Router)
│   ├── page.tsx            # / - Overview dashboard
│   ├── calendar/           # Calendario de conteudo
│   ├── content/            # Lista + detalhe de conteudos
│   ├── agents/             # Status dos 13 agentes
│   ├── pipeline/           # CRM Kanban
│   ├── contacts/           # Lista de contatos
│   ├── subscribers/        # Assinantes de email
│   ├── campaigns/          # Campanhas de email
│   ├── competitors/        # Monitoramento concorrentes
│   ├── influencers/        # Influenciadores
│   ├── design/             # Editor design system
│   ├── settings/           # Configuracoes
│   └── api/                # API routes
├── components/
│   ├── ui/                 # shadcn/ui (instalar com npx shadcn-ui@latest add)
│   ├── layout/             # Sidebar, Header
│   └── [module]/           # Componentes por modulo
├── lib/
│   ├── types.ts            # Interfaces TypeScript (18 tabelas)
│   ├── db.ts               # Conexao PostgreSQL
│   ├── utils.ts            # Utilitarios
│   └── design-system.ts    # Tokens de design
```

## Design System

- **Background:** #0D0D0D
- **Surface:** #1A1A1A
- **Text:** #FFFFFF / #A0A0A0 (secondary)
- **Accent:** #4A90D9 (blue) / #7C3AED (purple)
- **Font:** Inter (primary), Space Grotesk (secondary)
- **Theme:** Dark only

## Paginas (13)

| Rota | Descricao | Sprint |
|------|-----------|--------|
| `/` | Overview (status agentes, stats, proximo conteudo) | 1 |
| `/calendar` | Calendario mensal/semanal com drag-and-drop | 2 |
| `/content` | Lista de conteudos com filtros | 2 |
| `/content/[id]` | Detalhe + aprovar/rejeitar | 2 |
| `/agents` | Status dos 13 agentes + tarefas | 1 |
| `/pipeline` | CRM Kanban (Lead -> Won/Lost) | 3 |
| `/contacts` | Contatos com tags e busca | 3 |
| `/subscribers` | Assinantes de email | 3 |
| `/campaigns` | Campanhas de email (Mailjet) | 3 |
| `/competitors` | Posts dos concorrentes | 4 |
| `/influencers` | Influenciadores e colaboracoes | 4 |
| `/design` | Editor design system (cores, fontes) | 2 |
| `/settings` | API keys, integracoes, cron jobs | 4 |

## Database

18 tabelas com prefixo `ct_*` no PostgreSQL. Schema completo em `supabase/migrations/001_content_team.sql`.

Dominos: Core (agents, tasks, audit), Content (items, series), CRM (stages, contacts, deals), Email (subscribers, campaigns, sequences), Intelligence (competitors, influencers).

## Instrucoes para o Replit Agent

1. **Instalar shadcn/ui:** `npx shadcn-ui@latest init` (dark theme, New York style)
2. **Adicionar componentes:** `npx shadcn-ui@latest add button card input table dialog tabs toast badge separator dropdown-menu popover select`
3. **Implementar sidebar:** Criar componente em `components/layout/Sidebar.tsx` com links para todas as 13 rotas, usando icones Lucide
4. **Seguir os docs:** Documentacao completa em `docs/` (PRD, Architecture, Sprint Plan)
5. **API Routes:** Cada modulo tem CRUD em `/app/api/[modulo]/route.ts`
6. **Auth:** Middleware que valida cookie com AUTH_TOKEN em todas as rotas
7. **Types:** Importar de `@/lib/types` para type safety

## Docs BMAD

- `docs/product-brief-*.md` - Visao geral do produto
- `docs/prd-*.md` - Requisitos funcionais e nao-funcionais
- `docs/architecture-*.md` - Arquitetura do sistema
- `docs/sprint-plan-*.md` - Plano de sprints com stories
