# STORY-006: Content List & Filters

**Epic:** Epic 2 - Content Management
**Sprint:** 2
**Priority:** Must Have
**Story Points:** 8
**Status:** Todo

---

## User Story

As a **content manager (Igor)**,
I want to **see all content in a filterable list**,
so that **I can quickly find and manage specific content pieces**.

## Acceptance Criteria

- [ ] Content page at `/content` shows a table of all content items
- [ ] Table columns: Title, Type, Platform, Status, Scheduled Date, Agent
- [ ] Search by title (debounced input)
- [ ] Filter by status (all/idea/draft/review/approved/scheduled/published/rejected)
- [ ] Filter by platform (all/instagram/youtube/linkedin/x/email/tiktok)
- [ ] Filter by content type (all/post/carousel/reel/video/story/article/email/thread)
- [ ] Pagination with page size 20
- [ ] Sort by date (newest first by default)
- [ ] Clicking a row navigates to content detail
- [ ] Shows total count of filtered results
- [ ] API supports query params: search, status, platform, type, page, limit

## Technical Notes

### Files to Create/Modify
- `src/app/api/content/route.ts` - Extend with search/filter/pagination
- `src/lib/queries/content.ts` - Extend with filter queries
- `src/components/content/content-table.tsx` - Table with filters
- `src/components/shared/data-table.tsx` - Reusable table component
- `src/components/ui/select.tsx` - shadcn select component
- `src/app/(dashboard)/content/page.tsx` - Replace placeholder

### Dependencies
- STORY-005 (shares API endpoint)
