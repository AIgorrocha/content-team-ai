---
tags:
  - projeto
  - content-team
  - bmad
  - contexto
date: '2026-03-10'
status: em-andamento
---
# Project Context: Content Team AI

**Date:** 2026-03-10
**Version:** 1.0
**Owner:** Igor Rocha (@igorrocha.ia)

---

## What Is This Project?

Content Team AI is a dashboard + 13 AI agents that automate the entire content production cycle for a solo content creator. Instead of hiring 13 people, Igor uses 13 specialized AI agents that research, write, design, publish, and manage audience - all coordinated through a central dashboard.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| UI | Tailwind CSS + shadcn/ui (dark theme) |
| Database | PostgreSQL (Supabase) - 18 tables `ct_*` |
| Email | Mailjet API (free 6k/month) |
| Social | Manychat API ($15/mo) |
| Video | HeyGen API (pay-as-you-go) |
| Scraping | RapidAPI (Instagram) |
| Deploy | Vercel (dashboard) + VPS (agents) |

## 13 Agents

1. content-director (orquestrador)
2. editor-chief (calendario)
3. tech-chief (integracoes)
4. design-director (identidade visual)
5. copywriter (textos)
6. content-curator (reaproveitamento)
7. clone-agent (videos HeyGen)
8. carousel-creator (carrosseis)
9. listening-director (Manychat)
10. audience-director (email Mailjet)
11. channel-controller (otimizacao)
12. relations-manager (influencers)
13. content-searcher (scraping)

## GitHub

https://github.com/AIgorrocha/content-team-ai

## BMAD Status

- [x] Project Context criado
- [x] Product Brief criado (docs/brief.md)
- [ ] PRD (docs/prd.md)
- [ ] Architecture (docs/architecture.md)
- [ ] Sprint Planning (docs/sprint-plan.md)
- [ ] Stories Sprint 1
- [ ] 13 Agentes BMAD via BMB

## Links

- [[PLANO-CONTENT-TEAM]]
- [[AGENTES-DEFINICOES]]
- [[DASHBOARD-SPECS]]
