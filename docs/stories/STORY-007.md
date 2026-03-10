# STORY-007: Content Detail & Approval

**Epic:** Epic 2 - Content Management
**Sprint:** 2
**Priority:** Must Have
**Story Points:** 8
**Status:** Todo

---

## User Story

As a **content manager (Igor)**,
I want to **view content details and approve or reject content**,
so that **I can control what gets published**.

## Acceptance Criteria

- [ ] Content detail page at `/content/[id]` shows full content info
- [ ] Displays: title, type, platform, status, caption, hashtags, script, visual notes
- [ ] Shows media URLs as clickable links
- [ ] Shows source agent that created the content
- [ ] Shows scheduled/published dates
- [ ] Approve button changes approval_status to "approved" and status to "approved"
- [ ] Reject button shows textarea for rejection notes, sets status to "rejected"
- [ ] Back button returns to content list
- [ ] API endpoint `GET /api/content/[id]` returns single content item
- [ ] API endpoint `PATCH /api/content/[id]` updates content (approve/reject/reschedule)
- [ ] Success/error feedback after actions

## Technical Notes

### Files to Create/Modify
- `src/app/api/content/[id]/route.ts` - GET and PATCH for single content
- `src/components/content/content-detail.tsx` - Detail view component
- `src/components/content/approval-actions.tsx` - Approve/reject buttons
- `src/app/(dashboard)/content/[id]/page.tsx` - Detail page

### Dependencies
- STORY-006 (navigates from content list)
