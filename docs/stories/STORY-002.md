# STORY-002: Sidebar Layout & Navigation

**Epic:** Epic 1 - Foundation & Core Infrastructure
**Sprint:** 1
**Priority:** Must Have
**Story Points:** 5
**Status:** Todo

---

## User Story

As a **content creator (Igor)**,
I want to **see a persistent sidebar with navigation to all sections**,
so that **I can quickly switch between dashboard areas**.

## Acceptance Criteria

- [ ] Sidebar component renders on all authenticated pages
- [ ] Navigation items with Lucide icons:
  - LayoutDashboard → Overview (/)
  - Calendar → Calendar (/calendar)
  - FileText → Content (/content)
  - Bot → Agents (/agents)
  - Kanban → Pipeline (/pipeline)
  - Users → Contacts (/contacts)
  - Mail → Subscribers (/subscribers)
  - Send → Campaigns (/campaigns)
  - Eye → Competitors (/competitors)
  - UserPlus → Influencers (/influencers)
  - Palette → Design (/design)
  - Settings → Settings (/settings)
- [ ] Active page visually highlighted (accent color #4A90D9)
- [ ] Sidebar collapsible: 256px expanded, 64px collapsed (icons only)
- [ ] Mobile: hamburger menu toggles sidebar overlay
- [ ] Dark theme: sidebar bg #1A1A1A, page bg #0D0D0D
- [ ] Logo/brand at top of sidebar: "Content Team AI"
- [ ] User info at bottom: "Igor Rocha" with logout button

## Technical Notes

### Files to Create
- `src/components/layout/sidebar.tsx` - Main sidebar (Client Component)
- `src/components/layout/header.tsx` - Mobile header with hamburger
- `src/app/(dashboard)/layout.tsx` - Dashboard layout wrapping sidebar + content
- Move all page routes inside `(dashboard)` route group

### Implementation Guidance
- Use `usePathname()` from next/navigation for active detection
- Store collapsed state in localStorage for persistence
- Use shadcn/ui Sheet component for mobile sidebar overlay
- Transition animation on collapse/expand (200ms ease)

### Dependencies
- STORY-001 (authentication, shadcn/ui setup)

## Definition of Done

- [ ] Sidebar renders correctly on desktop and mobile
- [ ] All 12 navigation items present and clickable
- [ ] Active state works correctly
- [ ] Collapse/expand works with icon-only mode
- [ ] Mobile hamburger menu works
