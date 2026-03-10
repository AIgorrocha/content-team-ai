# STORY-003: Overview Dashboard

**Epic:** Epic 1 - Foundation & Core Infrastructure
**Sprint:** 1
**Priority:** Must Have
**Story Points:** 8
**Status:** Todo

---

## User Story

As a **content creator (Igor)**,
I want to **see a dashboard overview with agent statuses and key metrics**,
so that **I can quickly understand the state of my content team**.

## Acceptance Criteria

- [ ] Overview page at `/` shows 4 stat cards:
  - Total Content (count from ct_content_items)
  - Scheduled This Week (content with scheduled_at in current week)
  - Active Agents (agents with status='active')
  - Pipeline Value (sum of ct_deals.value where status='open')
- [ ] Agent status grid shows all 13 agents with:
  - Display name and role
  - Status badge: idle (gray), active (green), error (red)
  - Last active time (relative: "2h ago", "just now")
- [ ] Upcoming content section shows next 5 scheduled items:
  - Title, platform icon, scheduled date
  - Click navigates to /content/[id]
- [ ] Pipeline summary shows deal count and total value per stage
- [ ] All data fetched via API routes (/api/stats, /api/agents)
- [ ] Auto-refresh every 30 seconds via polling
- [ ] Loading skeletons while data loads

## Technical Notes

### Files to Create
- `src/app/(dashboard)/page.tsx` - Overview page (Server Component shell)
- `src/components/dashboard/stat-card.tsx` - Reusable stat card
- `src/components/dashboard/agent-grid.tsx` - Agent status grid (Client Component)
- `src/components/dashboard/upcoming-content.tsx` - Upcoming content list
- `src/components/dashboard/pipeline-summary.tsx` - Pipeline summary
- `src/components/shared/status-badge.tsx` - Reusable status badge
- `src/components/shared/polling-wrapper.tsx` - 30s polling hook
- `src/app/api/stats/route.ts` - Dashboard stats endpoint
- `src/app/api/agents/route.ts` - Agents list endpoint
- `src/lib/queries/stats.ts` - Stats query functions
- `src/lib/queries/agents.ts` - Agent query functions

### API: GET /api/stats
```json
{
  "totalContent": 0,
  "scheduledThisWeek": 0,
  "activeAgents": 0,
  "pipelineValue": 0,
  "pipelineByStage": [
    { "name": "Lead", "count": 0, "value": 0 }
  ]
}
```

### API: GET /api/agents
```json
[
  {
    "slug": "content-director",
    "display_name": "Diretor de Conteúdo",
    "role": "Orquestrador",
    "status": "idle",
    "last_active_at": null,
    "pending_tasks": 0
  }
]
```

### Dependencies
- STORY-001 (auth, database)
- STORY-002 (sidebar layout)

## Definition of Done

- [ ] All 4 stat cards display correct data
- [ ] Agent grid shows all 13 agents with status
- [ ] Upcoming content section works (empty state if no content)
- [ ] Pipeline summary displays correctly
- [ ] 30-second polling works
- [ ] Loading states present
