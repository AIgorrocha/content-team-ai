# STORY-004: Agent Monitoring Page

**Epic:** Epic 1 - Foundation & Core Infrastructure
**Sprint:** 1
**Priority:** Must Have
**Story Points:** 3
**Status:** Todo

---

## User Story

As a **content creator (Igor)**,
I want to **see detailed status of all 13 agents and their task history**,
so that **I can monitor agent performance and troubleshoot issues**.

## Acceptance Criteria

- [ ] Agents page at `/agents` displays a card for each of the 13 agents
- [ ] Each card shows:
  - Display name and icon/emoji
  - Role description
  - Status badge (idle/active/error)
  - Last active time
  - Pending task count
- [ ] Clicking an agent card opens a detail drawer/panel showing:
  - Agent full info (config, model)
  - Recent task history (last 20 tasks)
  - Task: title, status, created_at, completed_at, result summary
- [ ] Agent cards sorted: active first, then idle, then error
- [ ] Search/filter agents by name or status
- [ ] Empty state for agents with no tasks

## Technical Notes

### Files to Create
- `src/app/(dashboard)/agents/page.tsx` - Agents page
- `src/components/agents/agent-card.tsx` - Agent status card
- `src/components/agents/agent-detail-drawer.tsx` - Detail drawer
- `src/components/agents/task-history.tsx` - Task history list
- `src/app/api/agents/[slug]/route.ts` - Single agent detail endpoint
- `src/lib/queries/agents.ts` - Add getAgentDetail query

### API: GET /api/agents/[slug]
```json
{
  "agent": {
    "slug": "content-director",
    "display_name": "Diretor de Conteúdo",
    "role": "Orquestrador",
    "status": "idle",
    "config": {}
  },
  "tasks": [
    {
      "id": "uuid",
      "title": "Weekly content plan",
      "status": "completed",
      "created_at": "2026-03-10T08:00:00Z",
      "completed_at": "2026-03-10T08:05:00Z",
      "result": { "summary": "Created 7 content items" }
    }
  ]
}
```

### Dependencies
- STORY-001 (auth, database)
- STORY-002 (sidebar layout)

## Definition of Done

- [ ] All 13 agents displayed as cards
- [ ] Status badges work correctly
- [ ] Detail drawer opens with task history
- [ ] Sorting and filtering work
- [ ] Empty states handled
