# STORY-014: Settings & Integrations

**Epic:** Epic 4 - Intelligence & Settings
**Sprint:** 4
**Priority:** Must Have
**Story Points:** 5
**Status:** Todo

---

## User Stories

1. As a user, I want to see all integration statuses (connected/disconnected)
2. As a user, I want to manage API keys for external services
3. As a user, I want to configure general platform settings

## Acceptance Criteria

- [ ] Settings page with tabs: General, Integrations, API Keys, Notifications
- [ ] General tab: platform name, timezone, language, default content settings
- [ ] Integrations tab: cards for each integration (Instagram, YouTube, n8n, Supabase, email provider) with status badge
- [ ] API Keys tab: masked key display with copy/regenerate buttons
- [ ] Notifications tab: toggle switches for email/push notification preferences
- [ ] Save settings with PATCH API
- [ ] API: GET /api/settings, PATCH /api/settings

## Technical Notes

- Settings stored in a ct_settings table or similar key-value store
- Components: settings-tabs.tsx, integration-card.tsx, api-key-row.tsx
- Page: /settings
