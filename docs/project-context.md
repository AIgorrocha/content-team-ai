# Project Context: Content Team AI

**Date:** 2026-03-10
**Version:** 1.0
**Owner:** Igor Rocha (@igorrocha.ia)

---

## What Is This Project?

Content Team AI is a dashboard + 13 AI agents that automate the entire content production cycle for a solo content creator. Instead of hiring 13 people, Igor uses 13 specialized AI agents that research, write, design, publish, and manage audience - all coordinated through a central dashboard.

## The Problem

Igor Rocha creates content about AI systems for non-technical managers. Currently he:
- Manually researches competitors and trends (2-3h/day)
- Writes all copy himself (posts, scripts, emails, landing pages)
- Designs carousels manually in Canva
- Manages email subscribers in spreadsheets
- Has no CRM for leads
- Cannot scale content across 5 platforms (Instagram, YouTube, LinkedIn, X, Email)

**Impact:** Limited to 3-4 posts/week when competitors publish daily across multiple platforms.

## The Solution

A team of 13 AI agents organized hierarchically:

```
         Igor (Founder)
              |
      content-director (orchestrator)
         /        |         \
  editor-chief  tech-chief  design-director
      |
  +-- copywriter          (text, copy, scripts, CTAs)
  +-- content-curator     (cross-platform repurposing)
  +-- carousel-creator    (Instagram carousels)
  +-- clone-agent         (HeyGen avatar videos)
  +-- content-searcher    (scraping & research)
  +-- listening-director  (social listening via Manychat)
  +-- audience-director   (email marketing via Mailjet)
  +-- channel-controller  (per-platform optimization)
  +-- relations-manager   (influencer partnerships)
```

Only the **content-director** talks to Igor. All other agents communicate via task queue (`ct_tasks` table in PostgreSQL).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| UI | Tailwind CSS + shadcn/ui (dark theme) |
| Database | PostgreSQL (Supabase) - 18 tables with `ct_*` prefix |
| Icons | Lucide React |
| Fonts | Inter (primary), Space Grotesk (headings), JetBrains Mono (code) |
| Email | Mailjet API (free 6k/month) |
| Social | Manychat API ($15/mo) |
| Video | HeyGen API (pay-as-you-go) |
| Scraping | RapidAPI (Instagram) |
| Auth | Simple token-based |
| Deploy | Vercel (dashboard) + VPS (agents) |

## Design System

- **Background:** #0D0D0D (almost black)
- **Surface:** #1A1A1A
- **Text:** #FFFFFF / #A0A0A0 (secondary)
- **Accent:** #4A90D9 (blue) / #7C3AED (purple)
- **Success/Error:** #10B981 / #EF4444
- **Theme:** Dark only, minimalist

## Database Schema (18 Tables)

**Core:** ct_agents, ct_tasks, ct_audit_log
**Content:** ct_content_items, ct_content_series, ct_content_series_items
**CRM:** ct_pipeline_stages, ct_contacts, ct_deals, ct_deal_activities
**Email:** ct_subscribers, ct_email_campaigns, ct_email_sequences, ct_email_sequence_steps, ct_lead_magnets
**Design:** ct_design_system
**Intelligence:** ct_competitors, ct_competitor_posts
**Relationships:** ct_influencers, ct_collaborations

## 13 Dashboard Pages

| Route | Description | Phase |
|-------|-------------|-------|
| `/` | Overview (agent status, next content, pipeline, stats) | 1 |
| `/calendar` | Content calendar (month/week, drag-and-drop) | 1 |
| `/content` | Content list with filters (status, platform, type) | 1 |
| `/content/[id]` | Content detail (preview, approve/reject) | 2 |
| `/agents` | Agent status, task history, workload | 1 |
| `/pipeline` | CRM Kanban (Pipedrive-style, drag deals between stages) | 3 |
| `/contacts` | Contact list + details | 3 |
| `/subscribers` | Email subscribers + segments | 3 |
| `/campaigns` | Email campaigns + create/edit | 3 |
| `/competitors` | Competitor monitoring dashboard | 3 |
| `/influencers` | Influencer list + collaborations | 4 |
| `/design` | Design system editor (colors, fonts, logo, carousel preview) | 2 |
| `/settings` | Integrations, API keys, cron jobs, skills, plugins, docs | 4 |

## Implementation Phases

1. **Infrastructure:** DB, first 3 agents, dashboard skeleton, cron jobs
2. **Content Production:** Design, copywriting, carousels, videos, curation
3. **Audience & Listening:** Email marketing, CRM, competitor monitoring
4. **Relationships:** Influencers, partnerships, settings

## Competitors Monitored

@adamstewartmarketing, @divyannshisharma, @oalanicolas, @charlieautomates, @noevarner.ai, @liamjohnston.ai, @odanilogato, @thaismartan

## Brand Voice

Direto, pratico, sem rodeios. Fala como consultor senior que ja implementou. Nao ensina ferramenta, entrega resultado. Tom confiante mas acessivel. Usa analogias do dia a dia. Evita jargao tecnico desnecessario.

## Key Constraints

- **Budget:** Minimal (free tiers where possible)
- **Team:** Solo developer (Igor) + AI agents
- **Timeline:** 8 weeks (4 sprints x 2 weeks)
- **Users:** Initially just Igor, later white-label SaaS
- **Social interactions:** ONLY via Manychat (never direct API)

## Source Documents

- Obsidian: `content-team/PLANO-CONTENT-TEAM.md`
- Obsidian: `content-team/AGENTES-DEFINICOES.md`
- Obsidian: `content-team/DASHBOARD-SPECS.md`
- GitHub: https://github.com/AIgorrocha/content-team-ai
