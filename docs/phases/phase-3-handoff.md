# Phase 3 Handoff - API Routes do Onboarding

## O que foi feito

Criadas 7 API routes (8 endpoints):

| Método | Rota | O que faz |
|--------|------|-----------|
| POST | `/api/onboarding/social-links` | Salva links das redes sociais + URL do site, avança para etapa upload_videos |
| POST | `/api/onboarding/upload-videos` | Salva URLs de vídeos (1-5), avança para etapa analyzing |
| POST | `/api/onboarding/analyze` | Dispara análise completa em background (fire-and-forget) |
| GET | `/api/onboarding/status` | Retorna status atual do onboarding (para polling) |
| POST | `/api/onboarding/review` | Cliente revisa/edita perfil gerado, avança para questionnaire |
| POST | `/api/onboarding/questionnaire` | Salva respostas extras, marca onboarding como completo |
| GET | `/api/brand-profile` | Retorna brand_profile completo |
| PATCH | `/api/brand-profile` | Edita qualquer campo do brand_profile |

## Fluxo completo

```
1. POST /social-links → salva links, step = upload_videos
2. POST /upload-videos → salva URLs, step = analyzing
3. POST /analyze → dispara análise async, step = analyzing
4. GET /status (polling) → quando step = review, análise terminou
5. POST /review → cliente aprova/edita, step = questionnaire
6. POST /questionnaire → salva respostas, step = completed
```

## Decisões

- Análise roda em background (fire-and-forget) - frontend faz polling via /status
- Se análise falhar, step volta para upload_videos (retry possível)
- Validação com Zod em todos os endpoints
- Usa getOrCreateBrandProfile (idempotente - pode chamar várias vezes)

## Para a Fase 4 (Frontend)

- Endpoints prontos para integrar
- Frontend deve fazer polling em /status a cada 3-5 segundos durante análise
- Dados do perfil gerado vêm em /brand-profile (GET)
- Perguntas complementares ficam em raw_social_data.questions
