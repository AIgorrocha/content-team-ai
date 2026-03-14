---
tags:
  - content-team
  - bmad
  - prd
date: '2026-03-10'
---
# PRD Resumo: Content Team AI

## Requisitos Funcionais (22 FRs)
- FR1-FR5: Dashboard, calendario, lista conteudo, detalhe, agentes
- FR6-FR10: CRM Kanban, contatos, assinantes, campanhas, sequencias email
- FR11-FR14: Concorrentes, influencers, design system, settings
- FR15: Autenticacao token
- FR16-FR22: 7 agentes com funcoes especificas

## Requisitos Nao Funcionais (8 NFRs)
- Paginas < 2s, API < 500ms
- 18 tabelas ct_* com indexes
- Segredos em env vars
- Responsive (desktop-first)
- Task queue sequencial
- Polling 30s
- Monorepo Next.js em Vercel free

## 4 Epics
1. Foundation (setup, auth, sidebar, overview, agents)
2. Content Management (calendario, lista, detalhe)
3. CRM & Email (pipeline, contatos, assinantes, concorrentes)
4. Intelligence & Settings (influencers, design, settings)

## 11 Stories Total (89 pontos)

## Documento Completo
Ver repo: `docs/prd.md`

[[brief]] | [[project-context]]
