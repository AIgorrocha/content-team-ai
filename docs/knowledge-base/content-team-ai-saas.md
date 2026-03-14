---
tags:
  - projeto
  - saas
  - multi-tenant
  - content-team-ai
status: em-desenvolvimento
created: '2026-03-10'
---
# Content Team AI - SaaS Multi-Tenant

## Visão do Produto

Dashboard SaaS onde qualquer pessoa conecta e tem uma equipe completa de 13 agentes de IA criando conteúdo personalizado para ela. Os agentes analisam automaticamente as redes sociais, site e vídeos do cliente para clonar seu tom de voz e estilo.

## Arquitetura Híbrida (Implementada)

### Banco Central (nosso)
- `ct_users` — contas de usuário (email/senha, bcrypt + JWT)
- `ct_tenants` — workspaces com database_url do cliente
- `ct_tenant_members` — quem pertence a qual workspace
- `ct_api_keys` — chaves API para OpenClaw

### Banco do Cliente (Supabase dele)
- Todas as 18 tabelas de conteúdo + `ct_brand_profile` (onboarding)
- Schema criado automaticamente na primeira conexão

### Modelo de Negócio
- NÓS fornecemos TODAS as APIs (IA, imagem, vídeo, scraping)
- Cliente SÓ conecta seu banco Supabase (segurança/isolamento)
- Custo por onboarding: ~$0.50

## Projeto Supabase Central
- ID: `gfzmlxzxsvjfkujhiqdz` (us-east-1)
- DB URL: `postgresql://postgres:sistemasia2026.@db.gfzmlxzxsvjfkujhiqdz.supabase.co:5432/postgres`

## Conta de Teste
- Email: igorrocha.iaparanegocios@gmail.com
- Senha: igorrs1994
- Tenant: igor-rocha (owner, ID: 7e7dc643-51bb-447e-9082-a06337e29129)

## Status do Projeto

| Sprint | Foco | Status |
|--------|------|--------|
| 1 | Foundation & Core (auth, sidebar, dashboard, agentes) | ✅ Completo (24pts) |
| 2 | Content Management (calendário, lista, aprovação) | ✅ Completo (24pts) |
| 3 | CRM & Email (kanban, contatos, email, concorrentes) | ✅ Completo (29pts) |
| 4 | Intelligence & Settings (influencers, design, settings) | ✅ Completo (13pts) |
| 5 | Multi-tenant SaaS (auth, signup, onboarding básico) | ✅ Completo |
| 6 | **Onboarding Inteligente** (análise redes, vídeos, brand profile) | 📋 Planejado |
| - | Deploy Replit + Testes | ⏳ Pendente |
| - | Planos e billing | ⏳ Pendente |

## Documentação
- [[content-team-ai-plano-onboarding-inteligente]] — Plano Sprint 6 (onboarding inteligente)
- [[content-team-ai-onboarding-inteligente]] — Visão do produto
- [[../content-team/PLANO-CONTENT-TEAM]] — Plano original (13 agentes)
- [[../content-team/bmad/project-context]] — Contexto BMAD
