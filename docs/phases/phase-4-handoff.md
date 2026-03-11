# Phase 4 Handoff - Frontend Onboarding Wizard

## O que foi feito

Wizard de onboarding com 6 etapas integrado com APIs da Fase 3.

### Componentes criados (6):
| Componente | O que faz |
|-----------|-----------|
| `step-indicator.tsx` | Indicador visual dos 6 passos |
| `social-links-form.tsx` | Formulário para links de redes sociais + site |
| `video-upload.tsx` | 1-5 URLs de vídeo, dispara análise após envio |
| `analysis-progress.tsx` | Spinner + polling a cada 4s até análise terminar |
| `brand-profile-review.tsx` | Cards editáveis com perfil gerado pela IA |
| `agent-questions.tsx` | Perguntas dinâmicas (text/select/multiselect/scale) |

### Página reescrita:
- `src/app/onboarding/page.tsx` - Mantém setup original (workspace + apikey) + wizard de 6 etapas

## Fluxo do usuário

1. Setup workspace + API key (existente)
2. Cola links das redes sociais → POST /social-links
3. Cola URLs de vídeos → POST /upload-videos + POST /analyze
4. Aguarda análise (polling /status a cada 4s)
5. Revisa perfil gerado (cards editáveis) → POST /review
6. Responde perguntas extras → POST /questionnaire
7. Redirecionado para dashboard

## Decisões

- Wizard retoma de onde parou (GET /status no mount)
- Setup e brand profile são fases separadas na mesma página
- Mensagens rotativas durante análise para dar feedback visual
- Mínimo 1 rede social obrigatória, site é opcional

## Para a Fase 5

- Onboarding completo gera brand_profile acessível via GET /api/brand-profile
- Componentes reutilizáveis em `src/components/onboarding/`
- Próximo: integrações externas (email Mailjet, calendário, upload de mídia)
