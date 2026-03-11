# STORY-011: Competitor Monitoring

**Epic:** Epic 3 - CRM & Email Marketing
**Sprint:** 3
**Priority:** Must Have
**Story Points:** 8
**Status:** Todo

---

## User Stories

- As a user, I want to see a list of competitors being monitored
- As a user, I want to view competitor posts and engagement data
- As a user, I want to see which posts went viral

## Acceptance Criteria

- [ ] Competitor cards showing handle, platform, niche, last scraped
- [ ] Click opens competitor detail with their posts
- [ ] Posts table: caption preview, type, engagement, posted date, viral flag
- [ ] Viral posts highlighted with special badge
- [ ] Filter posts by type and viral status
- [ ] Post detail shows full caption and analysis
- [ ] "Add Competitor" placeholder button

## API Endpoints

- `GET /api/competitors` - List competitors
- `GET /api/competitors/:id` - Competitor with posts

## Technical Notes

- Tables: ct_competitors, ct_competitor_posts
- Viral posts have `is_viral = true`
