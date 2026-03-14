---
tags:
  - projeto
  - content-team-ai
  - onboarding
  - brand-voice
  - product-vision
status: planejado
created: '2026-03-10'
---
# Content Team AI - Onboarding Inteligente

## Conceito

Cada novo cliente passa por um processo de "clonagem de personalidade digital". Os agentes analisam tudo sobre a pessoa pra criar conteúdo que parece que ELA escreveu.

## 4 Etapas do Onboarding

### Etapa 1: Redes Sociais (análise automática)
**Input**: Cliente cola links das redes sociais
**Processo**:
- Raspagem dos últimos 30-50 posts de cada rede
- APIs: RapidAPI (Instagram), LinkedIn API, YouTube Data API
- Análise por IA (GPT/Claude):
  - Tom de voz (formal/informal, técnico/casual)
  - Emojis mais usados
  - Hashtags recorrentes
  - Tipo de conteúdo que mais posta (carrossel, vídeo, texto)
  - Frequência de postagem
  - Horários de maior engajamento
  - Temas principais
  - Como interage nos comentários

### Etapa 2: Site/Portfólio (análise automática)
**Input**: URL do site
**Processo**:
- Scraping do site (textos, meta tags, cores, fontes)
- Análise por IA:
  - Identidade visual (paleta de cores, tipografia)
  - Posicionamento de mercado
  - Público-alvo implícito
  - Proposta de valor
  - Palavras-chave do negócio
- Extração automática para Design System

### Etapa 3: Vídeos de Referência (DNA de comunicação)
**Input**: 3 vídeos do cliente falando (upload ou link YouTube)
**Processo**:
- Transcrição com Whisper (OpenAI)
- Análise profunda por IA:
  - **Vocabulário**: palavras mais frequentes, gírias, expressões
  - **Ritmo**: frases curtas ou longas, pausas
  - **Formalidade**: escala de 1-10
  - **Catchphrases**: bordões, frases de efeito
  - **Palavras proibidas**: o que nunca diz
  - **Estilo de explicação**: usa analogias? exemplos? dados?
  - **Energia**: motivacional, técnico, calmo, intenso
- Resultado: "Brand Voice DNA" — prompt personalizado para todos os agentes

### Etapa 4: Questionário Complementar
**Input**: Perguntas dos agentes (só o que não descobriu automaticamente)
**Agentes perguntam**:
- Content Director: "Qual seu objetivo principal? Vender, educar, ou inspirar?"
- Copywriter: "Como você chama seus seguidores/clientes?"
- Design Director: "Prefere visual clean ou chamativo?"
- Audience Director: "Qual o perfil do seu cliente ideal?"
- Listening Director: "Quem são seus 3 maiores concorrentes?"

## Output: Brand Profile (salvo no banco do cliente)

```json
{
  "brand_voice": {
    "tone": "direto, confiante, prático",
    "formality": 4,
    "energy": "motivacional mas acessível",
    "favorite_words": ["na prática", "resultado", "simplificar", "implementar"],
    "forbidden_words": ["basicamente", "tipo assim", "acredito que"],
    "catchphrases": ["IA na prática", "sem enrolação"],
    "emoji_style": "minimal",
    "favorite_emojis": ["🚀", "✅", "💡"],
    "explanation_style": "analogias do dia a dia",
    "audience_name": "profissionais"
  },
  "visual_identity": {
    "primary_colors": ["#0D0D0D", "#4A90D9", "#7C3AED"],
    "font_style": "moderna, sem serifa",
    "image_style": "dark, minimalista, tech",
    "carousel_style": "quote-minimalist"
  },
  "content_strategy": {
    "platforms": ["instagram", "linkedin", "youtube"],
    "frequency": {"instagram": 5, "linkedin": 2, "youtube": 1},
    "best_times": {"instagram": "18:00-20:00", "linkedin": "08:00-09:00"},
    "content_mix": {"educational": 40, "promotional": 20, "entertainment": 20, "personal": 20},
    "themes": ["IA aplicada", "produtividade", "automação", "marketing digital"]
  },
  "audience": {
    "description": "Empreendedores e profissionais 25-45 anos, interessados em tecnologia",
    "pain_points": ["falta de tempo", "não sabe usar IA", "conteúdo inconsistente"],
    "goals": ["automatizar", "crescer no digital", "economizar tempo"]
  },
  "competitors": [
    {"handle": "@concorrente1", "platform": "instagram"},
    {"handle": "@concorrente2", "platform": "instagram"}
  ]
}
```

## APIs Necessárias

| Função | API | Quem fornece |
|--------|-----|-------------|
| Transcrição de vídeo | Whisper (OpenAI) | Nós |
| Análise de texto/tom | GPT-4 / Claude | Nós |
| Scraping Instagram | RapidAPI | Nós |
| Scraping LinkedIn | Proxycurl / RapidAPI | Nós |
| YouTube Data | YouTube Data API v3 | Nós |
| Scraping site | Playwright / Cheerio | Nós |
| Geração de imagem | NanoBanana / DALL-E | Nós |
| Avatar vídeo | HeyGen | Nós |

## Tabela Nova no Banco do Cliente

```sql
CREATE TABLE ct_brand_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_voice JSONB DEFAULT '{}',
  visual_identity JSONB DEFAULT '{}',
  content_strategy JSONB DEFAULT '{}',
  audience JSONB DEFAULT '{}',
  social_links JSONB DEFAULT '{}',
  video_transcripts TEXT[],
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Fluxo UX Simplificado

```
1. Criar conta (email/senha) .............. 30 seg
2. Conectar banco Supabase ................ 2 min
3. Colar links redes sociais .............. 1 min
4. Subir 3 vídeos ......................... 2 min
5. Aguardar análise (loading animado) ..... 3-5 min
6. Revisar perfil gerado .................. 2 min
7. Responder perguntas extras ............. 3 min
8. Dashboard pronto! ...................... ✅

Total: ~15 minutos para setup completo
```

## Diferencial Competitivo

Nenhuma ferramenta de conteúdo faz isso hoje. Elas pedem pra você ESCREVER como quer. A gente DESCOBRE como você é e replica. É a diferença entre "me diga seu tom" e "eu já sei seu tom".

## Links
- [[content-team-ai-saas]] — Projeto principal
- [[../sessoes/2026-03-10-content-team-saas-multitenant]] — Sessão de implementação
