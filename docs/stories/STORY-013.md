# STORY-013: Design System Editor

**Epic:** Epic 4 - Intelligence & Settings
**Sprint:** 4
**Priority:** Must Have
**Story Points:** 5
**Status:** Todo

---

## User Stories

1. As a user, I want to view my current brand design system (colors, fonts, carousel style)
2. As a user, I want to edit colors using color pickers
3. As a user, I want to see a live preview of my brand style

## Acceptance Criteria

- [ ] Display current design system with color swatches and font names
- [ ] Color picker inputs for all 8 brand colors (bg, surface, text, textSecondary, accent, accent2, success, error)
- [ ] Font selection inputs (primary, secondary, mono)
- [ ] Carousel style preview section (dimensions, style, colors)
- [ ] Brand voice textarea
- [ ] Save button with PATCH API
- [ ] Live preview panel showing sample content with current styles
- [ ] API: GET /api/design-system, PATCH /api/design-system

## Technical Notes

- Type: DesignSystem (already in types.ts)
- Query: src/lib/queries/design-system.ts
- Components: color-picker.tsx, font-selector.tsx, carousel-preview.tsx
- Page: /design
