# Project Brief: Content Team AI

**Date:** 2026-03-10
**Author:** Igor Rocha
**Version:** 1.0

---

## Executive Summary

Content Team AI is a dashboard + 13 AI agents that automate the entire content production cycle for solo content creators. The primary problem is that creating consistent, multi-platform content requires a full team, which is unaffordable for individual creators. The target market is content creators in the AI/tech niche who want to scale without hiring. The key value proposition is replacing 13 human roles with 13 specialized AI agents coordinated through a single dashboard.

## Problem Statement

Solo content creators face an impossible choice: either limit output to 3-4 posts/week on 1-2 platforms, or hire a team of 10+ people costing R$30k+/month. Current tools (Buffer, Hootsuite, Later) handle scheduling but not creation, research, CRM, or audience management. The impact is significant: competitors publishing daily across 5+ platforms dominate algorithms and audience growth. Solving this now is critical because AI capabilities have reached the point where specialized agents can handle these roles effectively and affordably.

## Proposed Solution

A hierarchical team of 13 AI agents managed through a Next.js dashboard. One orchestrator agent (content-director) is the single point of contact for the creator. It delegates to specialized agents: editor-chief (calendar), tech-chief (integrations), design-director (visual identity), copywriter (all text), content-curator (repurposing), clone-agent (HeyGen videos), carousel-creator (Instagram), listening-director (Manychat DMs), audience-director (Mailjet email), channel-controller (platform optimization), relations-manager (influencer partnerships), and content-searcher (competitor scraping). The dashboard provides overview, calendar, content management, CRM pipeline, email marketing, competitor monitoring, and design system editing.

## Target Users

### Primary User Segment: Solo Content Creator

- **Profile:** Individual creator in AI/tech niche, 5k-50k followers, producing content across Instagram, YouTube, LinkedIn, X, and email
- **Current behavior:** Manually creates content, uses basic scheduling tools, no CRM, manages subscribers in spreadsheets
- **Pain points:** Cannot scale beyond 3-4 posts/week, no competitor intelligence, no automated email sequences, inconsistent visual identity across platforms
- **Goals:** Publish daily across 5 platforms, grow audience 10x, convert followers to paying clients

### Secondary User Segment: Small Agency Owner (Post-MVP)

- **Profile:** Agency with 2-5 clients needing white-label content automation
- **Current behavior:** Manually manages each client's content separately
- **Pain points:** Cannot scale operations without proportional hiring
- **Goals:** Manage multiple client brands with same AI team infrastructure

## Goals & Success Metrics

### Business Objectives
- Increase content output from 3-4 posts/week to 14+ posts/week (daily across platforms)
- Reduce content creation time from 20h/week to 5h/week (review/approve only)
- Build email list from 0 to 1,000 subscribers in first 3 months
- Generate R$5k/month in consulting leads through content pipeline

### User Success Metrics
- Time to approve content batch: < 15 minutes/day
- Agent task completion rate: > 90%
- Content approval rate (first draft): > 70%

### Key Performance Indicators (KPIs)
- **Content volume:** Posts published per week per platform
- **Engagement rate:** Average likes/comments/shares per post
- **Email growth:** New subscribers per week
- **Pipeline value:** Total deal value in CRM
- **Agent uptime:** Percentage of time agents are operational

## MVP Scope

### Core Features (Must Have)
- **Dashboard overview:** Agent status, upcoming content, pipeline summary, key stats
- **Content calendar:** Month/week view with drag-and-drop scheduling
- **Content management:** List, filter, preview, approve/reject content items
- **Agent monitoring:** Status of all 13 agents, task queue, recent activity
- **3 initial agents:** content-director, editor-chief, content-searcher (working via cron)
- **Database schema:** All 18 ct_* tables deployed and seeded

### Out of Scope for MVP
- White-label / multi-tenant support
- Mobile native app (responsive web is sufficient)
- Real-time WebSocket updates (polling at 30s is sufficient)
- Payment processing
- Advanced analytics/BI dashboards
- Automated social media posting (manual publishing initially)

### MVP Success Criteria
MVP is successful when Igor can: view all agent statuses, see content calendar with scheduled items, approve/reject content from the dashboard, view CRM pipeline with deals, and the 3 initial agents run autonomously via cron jobs.

## Post-MVP Vision

### Phase 2 Features
- Content detail view with approve/reject workflow
- Design system editor with carousel preview
- 5 additional agents: design-director, copywriter, carousel-creator, clone-agent, content-curator
- Automated carousel generation via Playwright

### Long-term Vision
- Full 13-agent team operational and autonomous
- White-label SaaS product for agencies
- Marketplace for custom agent templates
- Integration with 20+ content platforms

### Expansion Opportunities
- Vertical expansion: agents for real estate, healthcare, legal niches
- Horizontal expansion: sales automation, customer support agents
- API marketplace: sell specialized agent templates

## Technical Considerations

### Platform Requirements
- **Target Platforms:** Web (responsive, desktop-first, mobile-friendly)
- **Browser Support:** Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Performance Requirements:** Page load < 2s, API response < 500ms

### Technology Preferences
- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Next.js API Routes (same codebase)
- **Database:** PostgreSQL via Supabase (18 tables, ct_* prefix)
- **Hosting:** Vercel (free tier for dashboard), existing VPS for agents

### Architecture Considerations
- **Repository Structure:** Monorepo (single Next.js project)
- **Service Architecture:** Modular monolith - single app with domain modules
- **Integration Requirements:** Mailjet API, Manychat API, HeyGen API, RapidAPI (Instagram scraping)
- **Security:** Simple token auth (single user initially), environment variables for all API keys

## Constraints & Assumptions

### Constraints
- **Budget:** Minimal - use free tiers (Vercel, Mailjet 6k emails/month, Supabase free)
- **Timeline:** 8 weeks (4 sprints x 2 weeks each)
- **Resources:** Solo developer (Igor) + AI coding assistants (Claude Code, Replit Agent)
- **Technical:** PostgreSQL only (no Redis/cache layer needed at this scale)

### Key Assumptions
- Single user (Igor) for MVP - no multi-tenancy needed
- Polling at 30s intervals is sufficient (no WebSocket)
- Mailjet free tier (6k emails/month) covers initial needs
- RapidAPI Instagram scraping is reliable enough for daily competitor monitoring
- HeyGen API quality is sufficient for avatar videos
- Manychat Business plan ($15/mo) handles all social DM automation

## Risks & Open Questions

### Key Risks
- **RapidAPI reliability:** Instagram scraping APIs may break with platform changes. Mitigation: abstract scraping behind service layer, support multiple providers.
- **HeyGen quality:** Avatar video quality may not meet brand standards. Mitigation: approval workflow before publishing.
- **Manychat limitations:** API may not support all desired DM automation flows. Mitigation: start with basic welcome sequence, iterate.
- **Agent coordination:** 13 agents communicating via task queue may have race conditions. Mitigation: sequential task processing with status locks.

### Open Questions
- What is the exact Supabase project to use? (existing milo_db or new project?)
- Should agents run on the VPS as cron jobs or as long-running services?
- What is the priority order for the remaining 10 agents after MVP?

### Areas Needing Further Research
- HeyGen API v2 capabilities and pricing for avatar video generation
- Manychat API documentation for webhook integrations
- Best approach for carousel generation (Playwright HTML-to-image vs dedicated service)

## Appendices

### A. Research Summary
- 8 competitors analyzed in the AI content creator niche
- Market trend: solo creators increasingly adopting AI tools
- Gap identified: no existing tool combines content creation, CRM, and email in one AI-powered dashboard

### C. References
- Obsidian vault: `content-team/PLANO-CONTENT-TEAM.md`
- Obsidian vault: `content-team/AGENTES-DEFINICOES.md`
- Obsidian vault: `content-team/DASHBOARD-SPECS.md`
- GitHub: https://github.com/AIgorrocha/content-team-ai

## Next Steps

### Immediate Actions
1. Create PRD with detailed requirements using `/prd`
2. Design system architecture using `/architecture`
3. Plan sprints using `/sprint-planning`
4. Create Sprint 1 stories using `/create-story`

### PM Handoff
This Project Brief provides the full context for Content Team AI. Please start in 'PRD Generation Mode', review the brief thoroughly to work with the user to create the PRD section by section as the template indicates, asking for any necessary clarification or suggesting improvements.
