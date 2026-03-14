---
tags:
  - content-team
  - bmad
  - architecture
date: '2026-03-10'
---
# Architecture Resumo: Content Team AI

## Padrao
Modular Monolith - Next.js 14 App Router (frontend + API routes em um so deploy)

## Stack
- Next.js 14 + TypeScript + Tailwind + shadcn/ui
- PostgreSQL (Supabase) via pg library (sem ORM)
- Vercel (dashboard) + VPS (agentes)
- Autenticacao: token simples em httpOnly cookie

## Padroes
- Server Components para data fetching
- Client Components para interatividade (drag-and-drop, forms)
- Repository Pattern: queries em `src/lib/queries/`
- Task Queue: agentes comunicam via tabela ct_tasks
- Polling 30s para atualizacoes

## APIs Externas
- Mailjet (email)
- Manychat (DMs sociais)
- HeyGen (videos avatar)
- RapidAPI (scraping Instagram)

## Estrutura
```
src/app/ → Pages + API Routes
src/components/ → React components
src/lib/ → db, types, utils, queries
supabase/migrations/ → SQL schema
docs/ → BMAD artifacts
```

## Documento Completo
Ver repo: `docs/architecture.md`

[[prd-resumo]] | [[brief]]
