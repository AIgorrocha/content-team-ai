---
tags:
  - content-team-ai
  - fase7
  - billing
  - kiwify
date: '2026-03-11'
---
# 2026-03-11 - Content Team AI: Fase 7 (Billing + Permissões)

## O que foi feito

### Migration 005_billing.sql
- Tabela `ct_plans` com 4 planos seed (free, starter R$97, pro R$297, enterprise)
- Tabela `ct_subscriptions` (1 por tenant, suporte Kiwify/Stripe/manual)
- Tabela `ct_usage` (snapshots mensais de uso)

### Backend
- `src/lib/queries/billing.ts` - CRUD planos, assinaturas, uso, verificação de limites
- `src/lib/plan-guard.ts` - Middleware para enforçar limites de plano nos endpoints
- `src/app/api/billing/plans/route.ts` - GET planos disponíveis
- `src/app/api/billing/subscription/route.ts` - GET/POST/DELETE assinatura
- `src/app/api/billing/usage/route.ts` - GET uso + limites
- `src/app/api/webhook/kiwify/route.ts` - Webhook Kiwify (order.paid, subscription.cancelled, renewed, refund)

### Frontend
- `src/components/billing/pricing-card.tsx` - Card de plano com toggle mensal/anual
- `src/components/billing/usage-bar.tsx` - Barra de uso com cores (verde/amarelo/vermelho)
- `src/components/billing/billing-tab.tsx` - Tab completa de billing nas configurações
- `src/app/(dashboard)/pricing/page.tsx` - Página standalone de pricing
- Tab "Plano & Billing" adicionada nas Configurações

### Integrações
- API client atualizado com `api.billing.*`
- Middleware atualizado para permitir `/api/billing/plans` público
- Webhook Kiwify com verificação HMAC-SHA256

## Arquivos criados/modificados
- NOVO: `supabase/migrations/005_billing.sql`
- NOVO: `src/lib/queries/billing.ts`
- NOVO: `src/lib/plan-guard.ts`
- NOVO: `src/app/api/billing/plans/route.ts`
- NOVO: `src/app/api/billing/subscription/route.ts`
- NOVO: `src/app/api/billing/usage/route.ts`
- NOVO: `src/app/api/webhook/kiwify/route.ts`
- NOVO: `src/components/billing/pricing-card.tsx`
- NOVO: `src/components/billing/usage-bar.tsx`
- NOVO: `src/components/billing/billing-tab.tsx`
- NOVO: `src/app/(dashboard)/pricing/page.tsx`
- EDIT: `src/lib/types.ts` (tipos Plan, Subscription, Usage)
- EDIT: `src/lib/api.ts` (api.billing.*)
- EDIT: `src/middleware.ts` (rota pública billing/plans)
- EDIT: `src/components/settings/settings-tabs.tsx` (tab billing)
- EDIT: `src/app/(dashboard)/settings/page.tsx` (BillingTab)

## Build: LIMPO (zero erros)

## Próximos passos
- Fase 8: Deploy Vercel + Smoke Test
- Configurar env vars Kiwify (KIWIFY_WEBHOOK_SECRET, KIWIFY_PRODUCT_STARTER, KIWIFY_PRODUCT_PRO)
- Integrar `trackAndEnforce()` nos endpoints de criação de conteúdo/tarefas/emails

## Tags
#content-team-ai #fase7 #billing #kiwify
