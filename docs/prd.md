# Content Team AI Product Requirements Document (PRD)

**Date:** 2026-03-10
**Author:** Igor Rocha
**Version:** 1.0
**Status:** Draft

---

## Goals and Background Context

### Goals

- Automate content production cycle from research to publication across 5 platforms
- Provide a single dashboard to monitor, approve, and manage all 13 AI agents
- Replace manual content creation workflow (20h/week) with review-only workflow (5h/week)
- Build CRM pipeline to convert content audience into paying clients
- Enable email marketing with automated sequences and lead magnets
- Monitor competitors daily for content inspiration and trend detection

### Background Context

Igor Rocha is a solo content creator in the AI/tech niche who needs to scale from 3-4 posts/week to daily multi-platform publishing. Current tools handle scheduling but not the full content lifecycle. This project creates 13 specialized AI agents coordinated through a Next.js dashboard, solving the scaling problem without hiring a team. The approach uses a hierarchical agent structure where only the content-director communicates with Igor, delegating all work to specialized agents.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-03-10 | 1.0 | Initial PRD creation | Igor Rocha |

---

## Requirements

### Functional

- **FR1:** The system shall display a dashboard overview showing agent statuses (idle/active/error), upcoming scheduled content, CRM pipeline summary, and key performance stats.
- **FR2:** The system shall provide a content calendar with month and week views, supporting drag-and-drop to reschedule content items.
- **FR3:** The system shall list all content items with filters by status (idea/draft/review/approved/published), platform (Instagram/YouTube/LinkedIn/X/Email), and content type (post/carousel/video/story/email).
- **FR4:** The system shall display content detail pages with preview, caption, hashtags, script, media, and approve/reject actions with notes.
- **FR5:** The system shall show all 13 agent statuses, task queues, recent activity history, and workload distribution.
- **FR6:** The system shall provide a CRM Kanban board (Pipedrive-style) with 6 stages (Lead, Qualified, Proposal, Negotiation, Won, Lost) supporting drag-and-drop between stages.
- **FR7:** The system shall manage contacts with name, email, phone, Instagram, LinkedIn, company, source, tags, and notes.
- **FR8:** The system shall manage email subscribers with segmentation by tags, status tracking (active/unsubscribed), and source attribution.
- **FR9:** The system shall create and manage email campaigns with HTML/text body, recipient tag filtering, scheduling, and delivery stats from Mailjet.
- **FR10:** The system shall manage email sequences (drip campaigns) with configurable delay between steps and trigger events.
- **FR11:** The system shall display competitor monitoring with scraped posts, engagement metrics, viral detection, and analysis summaries.
- **FR12:** The system shall manage influencer profiles with handles across platforms, follower counts, niche, status, and collaboration tracking.
- **FR13:** The system shall provide a design system editor to configure brand colors, fonts, logo, carousel style, and brand voice.
- **FR14:** The system shall provide a settings page for managing API key integrations (Mailjet, Manychat, HeyGen, RapidAPI), cron job schedules, and agent configurations.
- **FR15:** The system shall authenticate users via a simple token-based mechanism (single user for MVP).
- **FR16:** The content-director agent shall orchestrate all other agents, delegating tasks and being the sole interface with Igor.
- **FR17:** The editor-chief agent shall manage the content calendar, cron schedules, and publication reminders.
- **FR18:** The content-searcher agent shall scrape 8 competitor Instagram accounts daily and search YouTube/Reddit/LinkedIn for trending content.
- **FR19:** The copywriter agent shall generate captions, scripts, emails, and CTAs following brand voice, delivering 2-3 options per request.
- **FR20:** The carousel-creator agent shall generate Instagram carousels (1080x1350px, dark theme, max 30 words/slide) via Playwright HTML-to-image.
- **FR21:** The audience-director agent shall manage email marketing via Mailjet API including subscriber management, campaign sending, and sequence automation.
- **FR22:** The listening-director agent shall handle social interactions exclusively via Manychat API with humanized responses and welcome sequences for new followers.

### Non Functional

- **NFR1:** Dashboard pages shall load within 2 seconds on standard broadband connections.
- **NFR2:** API endpoints shall respond within 500ms for standard CRUD operations.
- **NFR3:** The system shall support the full 18-table ct_* PostgreSQL schema with proper indexing.
- **NFR4:** All API keys and secrets shall be stored in environment variables, never in source code.
- **NFR5:** The system shall be responsive, working on desktop (1920px), tablet (768px), and mobile (375px).
- **NFR6:** Agent task queue shall process tasks sequentially per agent to prevent race conditions.
- **NFR7:** The system shall use polling at 30-second intervals for dashboard updates (no WebSocket required).
- **NFR8:** The codebase shall be a single Next.js monorepo deployable to Vercel free tier.

---

## User Interface Design Goals

### Overall UX Vision

Dark, minimalist dashboard inspired by tools like Linear and Vercel. Clean typography with Inter font, generous whitespace, and subtle surface elevation (#1A1A1A on #0D0D0D). Accent colors (blue #4A90D9, purple #7C3AED) used sparingly for interactive elements. The experience should feel like a command center where Igor can quickly review, approve, and monitor without cognitive overload.

### Key Interaction Paradigms

- **Kanban drag-and-drop** for CRM pipeline and content status management
- **Calendar drag-and-drop** for content scheduling
- **Approve/Reject workflow** for content items (quick actions from list and detail views)
- **Filter + Search** pattern across all list pages
- **Status badges** with color coding across agents, content, deals, and campaigns
- **Sidebar navigation** with active state indicators

### Core Screens and Views

1. Overview Dashboard (stats cards, agent status grid, upcoming content, pipeline summary)
2. Content Calendar (month/week toggle, drag-and-drop, content type color coding)
3. Content List (filterable table with status/platform/type filters)
4. Content Detail (preview panel, metadata, approve/reject actions)
5. Agents Dashboard (13 agent cards with status, last active, task count)
6. CRM Kanban (6-column board, deal cards with value/contact/date)
7. Contacts List (searchable table with tags and source filters)
8. Subscribers List (segmented view with tag filters)
9. Campaigns Manager (list + create/edit forms)
10. Competitor Dashboard (cards per competitor with latest posts and engagement)
11. Influencer Manager (table with collaboration status tracking)
12. Design System Editor (live preview of color/font/carousel changes)
13. Settings (tabbed interface: Integrations, Cron Jobs, Agent Config)

### Accessibility: None

MVP does not require WCAG compliance. Focus on usability and visual clarity.

### Branding

Dark minimalist theme. Background #0D0D0D, surface #1A1A1A, text white. Inter font family. Brand voice: direct, practical, no jargon. Visual identity aligned with @igorrocha.ia Instagram aesthetic.

### Target Device and Platforms: Web Responsive

Desktop-first responsive design. Functional on tablet and mobile but optimized for desktop workflows.

---

## Technical Assumptions

### Repository Structure: Monorepo

Single Next.js 14 project. Frontend (App Router pages) and backend (API routes) in same codebase. Shared types in `src/lib/types.ts`.

### Service Architecture

Modular monolith. Single Next.js application with domain-organized modules:
- Content module (calendar, items, series)
- CRM module (pipeline, contacts, deals)
- Email module (subscribers, campaigns, sequences)
- Intelligence module (competitors, influencers)
- Agent module (status, tasks, configuration)
- Design module (design system editor)
- Settings module (integrations, cron)

### Testing Requirements

Unit tests for critical business logic (agent task processing, email sequence logic). Integration tests for API routes. No E2E tests for MVP. Testing framework: Jest + React Testing Library.

### Additional Technical Assumptions

- PostgreSQL accessed directly via `pg` library (no ORM) for full SQL control
- Supabase used as PostgreSQL host with connection pooling
- shadcn/ui components installed via CLI (`npx shadcn-ui@latest add`)
- Lucide React for all icons
- Zod for input validation on API routes
- Date formatting with native Intl API (no date library needed)
- Agent cron jobs run on separate VPS, not on Vercel

---

## Epic List

### Epic 1: Foundation & Core Infrastructure
Establish project setup, authentication, sidebar layout, database connection, and initial dashboard overview with agent status display.

### Epic 2: Content Management
Build content calendar, content list with filters, content detail with approve/reject workflow, and content creation pipeline.

### Epic 3: CRM & Email Marketing
Implement CRM Kanban pipeline, contact management, email subscriber management, campaign creation, and email sequence automation.

### Epic 4: Intelligence & Settings
Build competitor monitoring dashboard, influencer management, design system editor, and settings page with integrations.

---

## Epic 1: Foundation & Core Infrastructure

Establish the foundational project infrastructure including authentication, navigation, database connectivity, and the overview dashboard. This epic delivers a working authenticated app with sidebar navigation and real agent status monitoring.

### Story 1.1: Project Setup & Authentication

As a user,
I want to access the dashboard securely with a token,
so that only I can see my content team data.

**Acceptance Criteria:**
1. Next.js 14 App Router project builds and runs with `npm run dev`
2. shadcn/ui is initialized with dark theme configuration
3. Login page at `/login` accepts a token and stores it in localStorage
4. Protected API middleware validates AUTH_TOKEN on all `/api/*` routes
5. Unauthenticated requests redirect to `/login`
6. Environment variables are loaded from `.env.local`
7. Database connection pool is established and tested with a health check query
8. All 18 ct_* tables exist in the database (migration applied)

### Story 1.2: Sidebar Layout & Navigation

As a user,
I want a persistent sidebar with navigation to all 13 pages,
so that I can quickly switch between dashboard sections.

**Acceptance Criteria:**
1. Sidebar component renders on all authenticated pages
2. Navigation items: Overview, Calendar, Content, Agents, Pipeline, Contacts, Subscribers, Campaigns, Competitors, Influencers, Design, Settings
3. Each nav item has a Lucide icon and label
4. Active page is visually highlighted in the sidebar
5. Sidebar is collapsible on mobile (hamburger menu)
6. Layout uses dark theme colors (#0D0D0D background, #1A1A1A sidebar)
7. Sidebar width: 256px expanded, 64px collapsed (icons only)

### Story 1.3: Overview Dashboard

As a user,
I want to see a dashboard overview with agent statuses and key metrics,
so that I can quickly understand the state of my content team.

**Acceptance Criteria:**
1. Overview page at `/` shows 4 stat cards: Total Content, Scheduled This Week, Active Agents, Pipeline Value
2. Agent status grid shows all 13 agents with name, status badge (idle/active/error), and last active time
3. Upcoming content section shows next 5 scheduled items with title, platform, and date
4. Pipeline summary shows deal count and total value per stage
5. All data is fetched from the database via API routes
6. Page refreshes data on 30-second polling interval

### Story 1.4: Agent Monitoring Page

As a user,
I want to see detailed status of all 13 agents and their task history,
so that I can monitor agent performance and troubleshoot issues.

**Acceptance Criteria:**
1. Agents page at `/agents` displays a card for each of the 13 agents
2. Each card shows: display name, role, status badge, last active time, pending task count
3. Clicking an agent card shows its recent task history (last 20 tasks)
4. Task history shows: title, status, created/completed timestamps, result summary
5. Agent cards are sorted by status (active first, then idle, then error)
6. API route `/api/agents` returns all agents with task counts

---

## Epic 2: Content Management

Build the content creation and approval workflow including calendar visualization, content listing, and detail views with approve/reject actions.

### Story 2.1: Content Calendar

As a user,
I want to see my content in a calendar view with drag-and-drop scheduling,
so that I can plan and organize my content pipeline visually.

**Acceptance Criteria:**
1. Calendar page at `/calendar` shows content items plotted on a calendar grid
2. Month and week view toggle
3. Content items show title, platform icon, and status color
4. Drag-and-drop to reschedule content (updates scheduled_at in database)
5. Click on a day to create a new content item with that date pre-filled
6. API route `/api/content` supports GET with date range filter and PATCH for rescheduling

### Story 2.2: Content List & Filters

As a user,
I want to browse all content items with filters,
so that I can find and manage specific content quickly.

**Acceptance Criteria:**
1. Content page at `/content` shows a table/list of all content items
2. Filters: status (idea/draft/review/approved/published), platform (Instagram/YouTube/LinkedIn/X/Email), content type (post/carousel/video/story/email)
3. Search by title
4. Table columns: title, type, platform, status, scheduled date, approval status
5. Pagination (20 items per page)
6. Click row navigates to content detail

### Story 2.3: Content Detail & Approval

As a user,
I want to preview content and approve or reject it with notes,
so that I maintain quality control over all published content.

**Acceptance Criteria:**
1. Content detail page at `/content/[id]` shows full content information
2. Preview section shows: caption, hashtags, script, visual notes, media
3. Approve button sets approval_status to 'approved' and status to 'approved'
4. Reject button prompts for notes and sets approval_status to 'rejected'
5. Metadata section shows: source agent, created date, series info
6. Engagement section shows metrics if content is published

---

## Epic 3: CRM & Email Marketing

Implement the sales pipeline, contact management, and email marketing capabilities.

### Story 3.1: CRM Kanban Pipeline

As a user,
I want a Kanban board for my sales pipeline,
so that I can track leads from first contact to close.

**Acceptance Criteria:**
1. Pipeline page at `/pipeline` shows 6 columns (Lead, Qualified, Proposal, Negotiation, Won, Lost)
2. Deal cards show: contact name, deal title, value, expected close date
3. Drag-and-drop deals between stages (updates stage_id in database)
4. Click deal card opens detail drawer with full information
5. "New Deal" button creates a deal in the Lead stage
6. Column headers show deal count and total value

### Story 3.2: Contact Management

As a user,
I want to manage my contacts with details and tags,
so that I can organize leads and track relationship history.

**Acceptance Criteria:**
1. Contacts page at `/contacts` shows searchable contact table
2. Contact fields: name, email, phone, Instagram, LinkedIn, company, source, tags
3. Filter by tags and source
4. Click contact opens detail view with deal history and activity log
5. CRUD operations via API routes
6. Import contacts from CSV (optional, nice-to-have)

### Story 3.3: Email Subscribers & Campaigns

As a user,
I want to manage email subscribers and send campaigns,
so that I can nurture my audience via email.

**Acceptance Criteria:**
1. Subscribers page at `/subscribers` shows subscriber list with tag filters
2. Subscriber fields: email, name, source, lead magnet, tags, status
3. Campaigns page at `/campaigns` shows campaign list with status
4. Campaign creation form: name, subject, body (HTML editor), recipient tags, schedule
5. Campaign detail shows delivery stats (sent, opened, clicked) from Mailjet
6. API integrates with Mailjet for actual email sending

### Story 3.4: Competitor Monitoring

As a user,
I want to see competitor activity and engagement metrics,
so that I can identify trends and content inspiration.

**Acceptance Criteria:**
1. Competitors page at `/competitors` shows cards for each monitored competitor
2. Each card shows: handle, platform, last scraped time, post count
3. Clicking a competitor shows their recent posts with engagement metrics
4. Viral posts (high engagement) are highlighted
5. Analysis summaries show competitor content patterns
6. Data is populated by content-searcher agent via cron

---

## Epic 4: Intelligence & Settings

Build the influencer management, design system editor, and settings configuration.

### Story 4.1: Influencer Management

As a user,
I want to track influencers and manage collaborations,
so that I can build strategic partnerships for content growth.

**Acceptance Criteria:**
1. Influencers page at `/influencers` shows influencer table
2. Fields: name, handles (multi-platform), niche, followers, status, last contact
3. Collaboration tracking: type, status, scheduled date, linked content
4. Filter by status (prospect/contacted/active/inactive) and niche
5. CRUD operations via API routes

### Story 4.2: Design System Editor

As a user,
I want to edit my brand's design system with live preview,
so that my content maintains consistent visual identity.

**Acceptance Criteria:**
1. Design page at `/design` shows current design system configuration
2. Editable fields: colors (bg, surface, text, accent), fonts (primary, secondary, mono), logo URL, brand voice
3. Carousel style editor: bg color, text color, font, profile photo position, slide dimensions
4. Live preview of carousel with current settings
5. Save updates the ct_design_system table
6. Design tokens are exported for agent consumption

### Story 4.3: Settings & Integrations

As a user,
I want to configure integrations, API keys, and cron schedules,
so that I can manage the technical aspects of my content team.

**Acceptance Criteria:**
1. Settings page at `/settings` with tabbed interface
2. Integrations tab: Mailjet, Manychat, HeyGen, RapidAPI key configuration
3. Cron Jobs tab: view and edit cron schedules for each agent
4. Agent Config tab: enable/disable agents, set model preferences
5. API keys are stored securely (masked display, encrypted storage)
6. Changes take effect on next cron cycle

---

## Checklist Results Report

PRD covers all 22 functional requirements and 8 non-functional requirements. All 4 epics with 11 stories have acceptance criteria. Technical assumptions are documented. UI design goals align with dark minimalist brand.

## Next Steps

### Architect Prompt

Create the fullstack architecture for Content Team AI based on this PRD. The stack is Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + PostgreSQL (Supabase). Focus on: modular monolith structure, API route organization, database access patterns, authentication middleware, and component architecture. Address all 22 FRs and 8 NFRs.
