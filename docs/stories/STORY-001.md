# STORY-001: Project Setup & Authentication

**Epic:** Epic 1 - Foundation & Core Infrastructure
**Sprint:** 1
**Priority:** Must Have
**Story Points:** 8
**Status:** Todo

---

## User Story

As a **content creator (Igor)**,
I want to **access the dashboard securely with a token**,
so that **only I can see my content team data**.

## Acceptance Criteria

- [ ] Next.js 14 App Router project builds and runs with `npm run dev`
- [ ] shadcn/ui initialized with dark theme (bg: #0D0D0D, surface: #1A1A1A)
- [ ] Login page at `/login` accepts AUTH_TOKEN and stores in httpOnly cookie
- [ ] Protected API middleware validates AUTH_TOKEN on all `/api/*` routes
- [ ] Unauthenticated requests redirect to `/login`
- [ ] Environment variables loaded from `.env.local`
- [ ] Database connection pool established via `pg` library
- [ ] Health check endpoint at `/api/health` returns database status
- [ ] All 18 ct_* tables exist (migration `001_content_team.sql` applied)
- [ ] Seed data loaded (13 agents, 6 pipeline stages, 8 competitors, design system)

## Technical Notes

### Files to Create/Modify
- `src/app/login/page.tsx` - Login form with token input
- `src/app/api/auth/route.ts` - POST endpoint to validate token and set cookie
- `src/middleware.ts` - Route protection middleware
- `src/lib/auth.ts` - Token validation helper
- `src/app/api/health/route.ts` - Health check endpoint
- `src/lib/db.ts` - Already exists, verify connection pooling

### Implementation Guidance
- Use `cookies()` from `next/headers` for httpOnly cookie management
- Middleware matcher: `['/((?!_next/static|_next/image|favicon.ico|login).*)']`
- shadcn/ui init: `npx shadcn-ui@latest init` with dark theme
- Install core shadcn components: button, input, card, badge, table

### Dependencies
- None (first story)

### Environment Variables Required
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
AUTH_TOKEN=your-secret-token-here
```

## Definition of Done

- [ ] Code complete and builds without errors
- [ ] Login flow works end-to-end
- [ ] API routes are protected
- [ ] Database connection verified
- [ ] All ct_* tables accessible via queries
