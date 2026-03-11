# STORY-008: CRM Kanban Pipeline

**Epic:** Epic 3 - CRM & Email Marketing
**Sprint:** 3
**Priority:** Must Have
**Story Points:** 8
**Status:** Todo

---

## User Stories

- As a user, I want to see deals organized in a Kanban board by pipeline stage
- As a user, I want to drag deals between stages to update their status
- As a user, I want to see deal value and contact info on each card
- As a user, I want to add new deals to the pipeline

## Acceptance Criteria

- [ ] Kanban board with columns for each pipeline stage
- [ ] Deal cards show title, value, contact name, expected close date
- [ ] Cards are draggable between columns (HTML5 drag & drop)
- [ ] Moving a card updates the deal's stage via PATCH API
- [ ] "Add Deal" button opens a form to create new deals
- [ ] Column headers show count and total value
- [ ] Color-coded columns matching stage colors
- [ ] Loading skeleton while data loads

## API Endpoints

- `GET /api/crm/pipeline` - List stages with deals
- `PATCH /api/crm/deals/:id` - Update deal stage/status
- `POST /api/crm/deals` - Create new deal

## Technical Notes

- Tables: ct_pipeline_stages, ct_deals, ct_contacts
- Drag & drop with native HTML5 API (no external lib)
- Optimistic UI update on drag
