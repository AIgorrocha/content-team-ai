---
tags:
  - projeto
  - content-team-ai
  - plano
  - onboarding
  - sprint-5
  - bmad
status: aprovado
created: '2026-03-10'
sprint: 5
points_estimated: 40
---
# Plano de Implementação: Onboarding Inteligente

## Contexto Atual

### O que já existe (4 sprints, 90 pontos, 14 stories):
- Dashboard completo: 11 páginas, 30+ componentes, 10 API routes
- 13 agentes BMAD definidos (YAML) + 6 workflows
- 18 tabelas ct_* no banco do cliente
- Multi-tenant híbrido: banco central (auth) + banco cliente (conteúdo)
- Signup → Onboarding (conectar banco) → Dashboard
- Design System editável + Brand Voice (texto livre)

### O que falta (este plano):
- Onboarding inteligente com análise automática de personalidade
- Tabela ct_brand_profile no banco do cliente
- APIs de análise (scraping, transcrição, IA)
- UI de onboarding em etapas (wizard expandido)
- Agentes usando brand_profile em todas as operações

---

## Arquitetura

```
┌─────────────────────────────────────────────┐
│              ONBOARDING WIZARD               │
│                                              │
│  Etapa 1: Conta + Banco ✅ (já existe)      │
│  Etapa 2: Redes Sociais + Site  ← NOVO      │
│  Etapa 3: Upload Vídeos         ← NOVO      │
│  Etapa 4: Análise IA (loading)  ← NOVO      │
│  Etapa 5: Revisar Perfil        ← NOVO      │
│  Etapa 6: Perguntas Extras      ← NOVO      │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│           BACKEND - API ROUTES               │
│                                              │
│  POST /api/onboarding/social-links          │
│  POST /api/onboarding/upload-videos         │
│  POST /api/onboarding/analyze               │
│  GET  /api/onboarding/status                │
│  POST /api/onboarding/review                │
│  POST /api/onboarding/questionnaire         │
│  GET  /api/brand-profile                    │
│  PATCH /api/brand-profile                   │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│         ANALYSIS ENGINE (server-side)        │
│                                              │
│  1. Social Scraper                          │
│     - Instagram: RapidAPI                   │
│     - LinkedIn: Proxycurl/RapidAPI          │
│     - YouTube: YouTube Data API v3          │
│     - TikTok: RapidAPI                      │
│     - X/Twitter: RapidAPI                   │
│                                              │
│  2. Site Analyzer                           │
│     - Cheerio (HTML parse, cores, fontes)   │
│     - Meta tags, OG tags, textos            │
│                                              │
│  3. Video Transcriber                       │
│     - Whisper API (OpenAI)                  │
│     - Upload via presigned URL (Supabase    │
│       Storage ou S3)                        │
│                                              │
│  4. Profile Builder (IA)                    │
│     - GPT-4 / Claude analisa TUDO           │
│     - Gera brand_profile JSON completo      │
│     - Gera perguntas complementares         │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│     ct_brand_profile (banco do cliente)      │
│                                              │
│  brand_voice      JSONB                     │
│  visual_identity  JSONB                     │
│  content_strategy JSONB                     │
│  audience         JSONB                     │
│  social_links     JSONB                     │
│  site_analysis    JSONB                     │
│  video_transcripts TEXT[]                   │
│  raw_social_data  JSONB                     │
│  questionnaire    JSONB                     │
│  onboarding_step  VARCHAR(20)               │
│  onboarding_completed BOOLEAN               │
└─────────────────────────────────────────────┘
```

---

## Fases de Implementação

### Fase 1: Banco de Dados (Migration)

**Arquivo**: `supabase/migrations/001_content_team.sql` (adicionar no final)

```sql
-- BRAND PROFILE (onboarding inteligente)
CREATE TABLE ct_brand_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_voice JSONB DEFAULT '{}',
  visual_identity JSONB DEFAULT '{}',
  content_strategy JSONB DEFAULT '{}',
  audience JSONB DEFAULT '{}',
  social_links JSONB DEFAULT '{}',
  site_url TEXT,
  site_analysis JSONB DEFAULT '{}',
  video_urls TEXT[],
  video_transcripts TEXT[],
  raw_social_data JSONB DEFAULT '{}',
  questionnaire JSONB DEFAULT '{}',
  onboarding_step VARCHAR(20) DEFAULT 'social_links',
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ONBOARDING STEPS ENUM:
-- social_links → upload_videos → analyzing → review → questionnaire → completed
```

**Tipo TypeScript**: Adicionar em `src/lib/types.ts`

```typescript
export type OnboardingStep =
  | "social_links"
  | "upload_videos"
  | "analyzing"
  | "review"
  | "questionnaire"
  | "completed"

export interface BrandProfile {
  id: string
  brand_voice: {
    tone: string
    formality: number
    energy: string
    favorite_words: string[]
    forbidden_words: string[]
    catchphrases: string[]
    emoji_style: string
    favorite_emojis: string[]
    explanation_style: string
    audience_name: string
  }
  visual_identity: {
    primary_colors: string[]
    font_style: string
    image_style: string
    carousel_style: string
  }
  content_strategy: {
    platforms: string[]
    frequency: Record<string, number>
    best_times: Record<string, string>
    content_mix: Record<string, number>
    themes: string[]
  }
  audience: {
    description: string
    pain_points: string[]
    goals: string[]
  }
  social_links: Record<string, string>
  site_url: string | null
  site_analysis: Record<string, unknown>
  video_urls: string[]
  video_transcripts: string[]
  raw_social_data: Record<string, unknown>
  questionnaire: Record<string, unknown>
  onboarding_step: OnboardingStep
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}
```

### Fase 2: Analysis Engine (Backend)

**Novos arquivos em `src/lib/analysis/`**:

| Arquivo | Função | API |
|---------|--------|-----|
| `social-scraper.ts` | Raspa posts das redes sociais | RapidAPI |
| `site-analyzer.ts` | Analisa site (cores, fontes, textos) | Cheerio + fetch |
| `video-transcriber.ts` | Transcreve vídeos | Whisper (OpenAI) |
| `profile-builder.ts` | IA analisa tudo e gera brand_profile | GPT-4 / Claude |
| `question-generator.ts` | Gera perguntas complementares | GPT-4 / Claude |

**Dependências novas**:
```
npm install openai cheerio
```

**Fluxo do `profile-builder.ts`**:
1. Recebe: posts raspados + site analysis + transcrições
2. Monta prompt mega-detalhado pro GPT-4/Claude
3. Pede pra gerar o JSON do brand_profile
4. Valida com zod
5. Salva no ct_brand_profile
6. Gera lista de perguntas que não conseguiu responder
7. Atualiza design_system e competitors automaticamente

### Fase 3: API Routes

**Novos endpoints**:

| Método | Rota | O que faz |
|--------|------|-----------|
| POST | `/api/onboarding/social-links` | Salva links + dispara scraping async |
| POST | `/api/onboarding/upload-videos` | Recebe URLs de vídeo (YouTube ou upload) |
| POST | `/api/onboarding/analyze` | Dispara análise completa (async job) |
| GET | `/api/onboarding/status` | Retorna status da análise (polling) |
| POST | `/api/onboarding/review` | Cliente aprova/edita perfil gerado |
| POST | `/api/onboarding/questionnaire` | Salva respostas das perguntas extras |
| GET | `/api/brand-profile` | Retorna brand_profile completo |
| PATCH | `/api/brand-profile` | Edita brand_profile |

### Fase 4: Frontend - Onboarding Wizard Expandido

**Reescrever `src/app/onboarding/page.tsx`** com 6 etapas:

| Etapa | UI | Componente |
|-------|----|-----------|
| 1. Workspace | Nome + URL banco (já existe) | `OnboardingWorkspace` |
| 2. Redes Sociais | Inputs pra cada rede + URL site | `OnboardingSocial` |
| 3. Vídeos | Drag & drop ou colar link YouTube (3 vídeos) | `OnboardingVideos` |
| 4. Análise | Tela de loading animada com progresso por etapa | `OnboardingAnalyzing` |
| 5. Revisão | Card com brand_profile editável | `OnboardingReview` |
| 6. Perguntas | Cards com perguntas dos agentes | `OnboardingQuestions` |

**Componentes novos em `src/components/onboarding/`**:
- `step-indicator.tsx` — Barra de progresso (6 steps)
- `social-links-form.tsx` — Formulário de redes sociais
- `video-upload.tsx` — Upload/link de vídeos
- `analysis-progress.tsx` — Loading com status por etapa
- `brand-profile-review.tsx` — Preview editável do perfil
- `agent-questions.tsx` — Cards de perguntas por agente

### Fase 5: Integração com Dashboard

Depois do onboarding completo, o brand_profile alimenta:

| Onde | O que muda |
|------|-----------|
| `ct_design_system` | Cores, fontes, estilo carrossel preenchidos automaticamente |
| `ct_competitors` | Concorrentes identificados automaticamente cadastrados |
| Agentes (via OpenClaw) | brand_voice incluído no contexto de cada agente |
| Webhook `/api/webhook/openclaw` | Novo type `brand_context` — agente pode pedir brand_profile |

### Fase 6: Página de Brand Profile no Dashboard

**Nova rota**: `/settings` → aba "Meu Perfil" ou rota dedicada `/brand`

- Exibe brand_profile completo
- Permite editar qualquer campo
- Botão "Reanalisar" (roda análise novamente)
- Histórico de mudanças

---

## Ordem de Implementação (Sprint 5)

```
DIA 1: Banco + Tipos
  ├── Migration ct_brand_profile
  ├── Tipos TypeScript (BrandProfile, OnboardingStep)
  └── Query functions (src/lib/queries/brand-profile.ts)

DIA 2: Analysis Engine
  ├── social-scraper.ts (RapidAPI)
  ├── site-analyzer.ts (Cheerio)
  ├── video-transcriber.ts (Whisper)
  └── profile-builder.ts (GPT-4/Claude)

DIA 3: API Routes
  ├── /api/onboarding/* (6 endpoints)
  ├── /api/brand-profile (GET + PATCH)
  └── Webhook update (brand_context type)

DIA 4: Frontend Wizard
  ├── Reescrever onboarding/page.tsx (6 etapas)
  ├── 6 componentes de onboarding
  └── Step indicator

DIA 5: Dashboard Integration
  ├── Auto-preencher design_system
  ├── Auto-cadastrar competitors
  ├── Aba brand profile em settings
  └── Testes E2E
```

---

## APIs e Custos Estimados

| API | Custo | Uso por cliente |
|-----|-------|----------------|
| RapidAPI (Instagram scraper) | ~$10/mo (500 req) | ~50 posts ≈ 5 requests |
| Proxycurl (LinkedIn) | $0.01/perfil | 1 request |
| YouTube Data API v3 | Grátis (10k/dia) | ~10 requests |
| OpenAI Whisper | $0.006/min | ~15 min (3 vídeos) ≈ $0.09 |
| GPT-4 (análise) | ~$0.03/1K tokens | ~10K tokens ≈ $0.30 |
| **Total por cliente** | | **~$0.50 por onboarding** |

---

## Variáveis de Ambiente Novas

```
OPENAI_API_KEY=sk-...
RAPIDAPI_KEY=... (já existe)
```

---

## Links
- [[content-team-ai-saas]] — Projeto SaaS
- [[content-team-ai-onboarding-inteligente]] — Visão do produto
- [[../sessoes/2026-03-10-content-team-saas-multitenant]] — Sessão multi-tenant
