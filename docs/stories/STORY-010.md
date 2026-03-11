# STORY-010: Email Subscribers & Campaigns

**Epic:** Epic 3 - CRM & Email Marketing
**Sprint:** 3
**Priority:** Must Have
**Story Points:** 8
**Status:** Todo

---

## User Stories

- As a user, I want to see all email subscribers with stats
- As a user, I want to view and manage email campaigns
- As a user, I want to see campaign stats (open rate, clicks)

## Acceptance Criteria

- [ ] Subscribers tab: table with email, name, status, tags, subscribed date
- [ ] Subscriber search by email/name
- [ ] Filter by status (active, unsubscribed, bounced)
- [ ] Campaigns tab: list with name, status, subject, sent date, stats
- [ ] Campaign detail with HTML preview and stats
- [ ] Stats summary cards (total subscribers, active, campaigns sent)
- [ ] Pagination on both tabs

## API Endpoints

- `GET /api/email/subscribers` - List with filters
- `GET /api/email/campaigns` - List campaigns
- `GET /api/email/campaigns/:id` - Campaign detail

## Technical Notes

- Tables: ct_subscribers, ct_email_campaigns
- Tab navigation between Subscribers and Campaigns
