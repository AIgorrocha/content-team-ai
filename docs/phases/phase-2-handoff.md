# Phase 2 Handoff - Analysis Engine (Backend)

## O que foi feito

Criados 6 arquivos em `src/lib/analysis/`:

### 1. social-scraper.ts
- Funções para raspar 5 plataformas: Instagram, YouTube, TikTok, Twitter/X, LinkedIn
- Todas usam RapidAPI com hosts específicos por plataforma
- `scrapeAllSocials()` raspa todas em paralelo (Promise.allSettled)
- Retorna perfil (nome, bio, seguidores) + últimos 10-20 posts com engajamento
- Tratamento de erro por plataforma (se uma falha, as outras continuam)

### 2. site-analyzer.ts
- Usa Cheerio para parsear HTML do site
- Extrai: título, descrição, cores CSS, fontes, headings, OG tags, keywords
- Detecta tecnologias (WordPress, Shopify, Next.js, React, etc)
- Detecta se tem blog e e-commerce
- Extrai texto principal (até 5000 chars)

### 3. video-transcriber.ts
- Usa OpenAI Whisper para transcrever áudio/vídeo
- Suporta URLs diretas de áudio/vídeo (mp3, mp4, webm, wav)
- Limite: 25MB por arquivo
- `transcribeMultipleVideos()` processa sequencialmente (evita rate limit)

### 4. profile-builder.ts
- Recebe todos os dados (social + site + transcrições)
- Monta prompt detalhado para GPT-4o
- Gera brand profile completo como JSON
- Valida resultado com Zod (campos com defaults)
- `mergeProfileWithExisting()` para mesclar com dados manuais

### 5. question-generator.ts
- Usa GPT-4o-mini para gerar 5-10 perguntas complementares
- `identifyGaps()` detecta lacunas no perfil gerado
- Perguntas categorizadas (brand_voice, visual, strategy, audience, business)
- Cada pergunta tem tipo (text, select, multiselect, scale)

### 6. index.ts (barrel export)
- Exporta todas as funções e tipos dos 5 módulos

## Dependências instaladas
- `openai` (Whisper + GPT-4o)
- `cheerio` (parse HTML)

## Variáveis de ambiente necessárias
- `OPENAI_API_KEY` - Para Whisper e GPT-4o
- `RAPIDAPI_KEY` - Para scrapers de redes sociais

## Para a Fase 3 (API Routes)
- Importar tudo de `@/lib/analysis`
- Fluxo: social-links → scrapeAllSocials → analyzeSite → transcribeMultipleVideos → buildBrandProfile → generateQuestions
- Análise deve ser assíncrona (o frontend faz polling via GET /status)
- Salvar resultados via query functions da Fase 1
