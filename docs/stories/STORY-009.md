# STORY-009: Contact Management

**Epic:** Epic 3 - CRM & Email Marketing
**Sprint:** 3
**Priority:** Must Have
**Story Points:** 5
**Status:** Todo

---

## User Stories

- As a user, I want to see a list of all contacts with search
- As a user, I want to filter contacts by tags and source
- As a user, I want to view contact details with activity history

## Acceptance Criteria

- [ ] Contact table with name, email, phone, company, tags, source
- [ ] Search by name/email (debounce 300ms)
- [ ] Filter by source
- [ ] Click opens contact detail with all fields
- [ ] Activity history timeline (calls, emails, meetings, notes)
- [ ] Pagination (20 per page)

## API Endpoints

- `GET /api/crm/contacts` - List with filters and pagination
- `GET /api/crm/contacts/:id` - Detail with activities

## Technical Notes

- Tables: ct_contacts, ct_deal_activities
- Reuse pagination and filter patterns from content module
