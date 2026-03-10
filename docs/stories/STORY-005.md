# STORY-005: Content Calendar

**Epic:** Epic 2 - Content Management
**Sprint:** 2
**Priority:** Must Have
**Story Points:** 8
**Status:** Todo

---

## User Story

As a **content manager (Igor)**,
I want to **see all scheduled content on a monthly calendar**,
so that **I can visualize my content plan and identify gaps**.

## Acceptance Criteria

- [ ] Calendar page at `/calendar` shows monthly grid view
- [ ] Each day cell shows content items scheduled for that day
- [ ] Content items display title, platform icon, and status badge
- [ ] Month navigation (previous/next) works correctly
- [ ] "Today" button returns to current month
- [ ] Clicking a content item navigates to content detail page
- [ ] Empty days are clearly visible for gap identification
- [ ] API endpoint `GET /api/content?from=X&to=Y` returns content by date range
- [ ] Calendar refreshes via 30s polling
- [ ] Responsive: works on desktop and tablet

## Technical Notes

### Files to Create/Modify
- `src/app/api/content/route.ts` - Content API with date range filter
- `src/lib/queries/content.ts` - Content query functions
- `src/components/calendar/content-calendar.tsx` - Calendar grid component
- `src/components/calendar/calendar-day-cell.tsx` - Day cell with content items
- `src/app/(dashboard)/calendar/page.tsx` - Replace placeholder

### Dependencies
- Sprint 1 complete (auth, layout, sidebar)
