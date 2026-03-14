---
tags:
  - sessao
  - content-team-ai
  - multi-tenant
  - saas
date: '2026-03-10'
---
# Sessão: Content Team AI → SaaS Multi-Tenant (Híbrido)

## O que foi feito

Implementação completa da arquitetura multi-tenant híbrida:
- **Banco central (nosso)**: auth, tenants, api_keys
- **Banco do cliente (Supabase dele)**: todas as 18 tabelas de conteúdo

### Arquivos criados
- `src/lib/tenant-db.ts` — Pool manager dinâmico (conecta no banco de cada cliente)
- `src/lib/api-key.ts` — Gerar, validar, listar, revogar API keys (SHA-256)
- `src/lib/api-auth.ts` — Resolver tenant via cookie JWT ou X-API-Key
- `src/lib/route-helper.ts` — withTenantDB() helper para todas as rotas
- `src/app/signup/page.tsx` — Página de criar conta
- `src/app/onboarding/page.tsx` — Wizard: nome workspace → URL banco → gera API key
- `src/app/api/auth/signup/route.ts` — Endpoint de signup
- `src/app/api/auth/onboarding/route.ts` — Cria tenant + roda schema no banco do cliente
- `src/app/api/auth/api-keys/route.ts` — CRUD de API keys
- `src/app/api/webhook/openclaw/route.ts` — Webhook para OpenClaw (task_update, content_push, agent_status)
- `supabase/migrations/002_multi_tenant.sql` — Tabelas centrais

### Arquivos modificados
- `src/lib/types.ts` — Removido tenant_id das interfaces de conteúdo, adicionado User/Tenant/ApiKey/TenantMember
- `src/lib/auth.ts` — Reescrito: bcrypt + JWT (sem mais token fixo)
- `src/middleware.ts` — JWT + X-API-Key, public paths atualizados
- `src/app/login/page.tsx` — Email/senha ao invés de token
- Todas as 10 queries em `src/lib/queries/` — Recebem `db: TenantDB` como parâmetro
- Todas as 21 API routes — Usam `withTenantDB()` 
- `.env.example` — JWT_SECRET, removido AUTH_TOKEN
- `package.json` — Adicionado bcryptjs, jsonwebtoken

### Dependências novas
- bcryptjs + @types/bcryptjs
- jsonwebtoken + @types/jsonwebtoken

## Decisões
- Arquitetura híbrida: banco central para auth, banco do cliente para dados
- Sem tenant_id nas tabelas de conteúdo (cada cliente tem banco isolado)
- initTenantSchema() roda migration 001 automaticamente no banco do cliente
- API keys com prefixo `ctak_` e hash SHA-256

## Próximos passos
- Rodar migration 002 no banco central
- Testar fluxo completo: signup → onboarding → dashboard
- Adicionar aba "API Keys" na página de settings
- Deploy
