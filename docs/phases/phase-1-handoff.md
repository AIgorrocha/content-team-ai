# Phase 1 Handoff - Banco de Dados + Tipos

## O que foi feito

1. **Migration SQL** criada: `supabase/migrations/003_brand_profile.sql`
   - Tabela `ct_brand_profile` com 16 colunas (JSONB, TEXT[], VARCHAR, BOOLEAN)
   - Index em `onboarding_step` para buscas rápidas

2. **Tipos TypeScript** adicionados em `src/lib/types.ts`:
   - `OnboardingStep` (6 valores: social_links → completed)
   - `BrandProfile` (interface completa com todos os campos tipados)

3. **Query functions** criadas em `src/lib/queries/brand-profile.ts`:
   - `getBrandProfile` - busca perfil existente
   - `createBrandProfile` - cria novo perfil vazio
   - `getOrCreateBrandProfile` - busca ou cria (idempotente)
   - `updateBrandProfile` - update genérico (qualquer campo)
   - `updateOnboardingStep` - muda etapa do onboarding
   - `updateSocialLinks` - salva links sociais + avança etapa
   - `updateVideoUrls` - salva URLs de vídeo + avança etapa
   - `saveAnalysisResults` - salva resultado da análise IA
   - `saveQuestionnaire` - salva questionário + marca como completo
   - `deleteBrandProfile` - deleta perfil

4. **Tabela criada no Supabase** (projeto `gfzmlxzxsvjfkujhiqdz`)
   - Testado: INSERT, UPDATE, SELECT, DELETE - tudo OK

## Arquivos criados/modificados

| Arquivo | Ação |
|---------|------|
| `supabase/migrations/003_brand_profile.sql` | NOVO |
| `src/lib/types.ts` | EDITADO (adicionado OnboardingStep + BrandProfile) |
| `src/lib/queries/brand-profile.ts` | NOVO |
| `docs/phases/PHASE-STATUS.md` | NOVO |

## Decisões tomadas

- Migration numerada como `003` (001=content_team, 002=multi_tenant)
- Apenas 1 brand_profile por tenant (sem foreign key, busca com LIMIT 1)
- OnboardingStep como string union type (não enum SQL) - mais flexível
- Query functions seguem padrão existente (TenantDB, parameterized queries)

## Para a Fase 2

- Tipos `BrandProfile` e `OnboardingStep` prontos para importar
- Query functions prontas para usar nas API routes
- O `profile-builder.ts` deve gerar JSON compatível com a interface `BrandProfile`
- Campos JSONB permitem estrutura flexível - validar com zod no backend
