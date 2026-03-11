# STORY-012: Influencer Management

**Epic:** Epic 4 - Intelligence & Settings
**Sprint:** 4
**Priority:** Must Have
**Story Points:** 3
**Status:** Todo

---

## User Stories

1. As a user, I want to see a list of influencers with their status, niche, and follower count
2. As a user, I want to view influencer details with their collaborations history
3. As a user, I want to filter influencers by status (prospect, contacted, active, inactive)

## Acceptance Criteria

- [ ] Grid of influencer cards with avatar placeholder, name, niche, followers, status badge
- [ ] Filter by status (all, prospect, contacted, active, inactive)
- [ ] Search by name
- [ ] Click card opens detail page with collaborations list
- [ ] Collaboration items show type, status, date, and linked content
- [ ] API: GET /api/influencers (list with filters), GET /api/influencers/[id] (detail + collaborations)

## Technical Notes

- Types: Influencer, Collaboration (already in types.ts)
- Query: src/lib/queries/influencers.ts
- Components: influencer-card.tsx, influencer-detail.tsx
- Pages: /influencers, /influencers/[id]
