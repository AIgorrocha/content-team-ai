# Automacao Completa — Content Team AI

## Visao Geral

Sistema automatizado de producao e publicacao de conteudo com:
- Scraping diario de concorrentes (Instagram) e tendencias (LinkedIn, X, Reddit, GitHub)
- Calendario editorial automatico (plano semanal + check diario)
- Cross-platform com angulos diferentes por rede
- Publicacao automatica no horario que o Igor definir
- Bot de aprovacao via Telegram
- Processamento de video (transcrever, cortar, gerar scripts)

## Scripts

### scrape-playwright.mjs (Cron: diario 6h)

Duas funcoes separadas:

**TRACKING (Instagram):** Monitora 9 concorrentes — posts, engagement, temas.
- @adamstewartmarketing, @divyannshisharma, @oalanicolas, @charlieautomates
- @noevarner.ai, @liamjohnston.ai, @odanilogato, @thaismartan, @forgoodcode

**PESQUISA (LinkedIn, X, Reddit, GitHub):** Busca tendencias filtradas pro publico-alvo.
- Foco: agentes IA, sistemas multiagente, cases pra gestores PME
- LinkedIn: automacao IA para empresas, cases reais
- X/Twitter: AI agents, Claude Code, ferramentas praticas
- Reddit: r/ClaudeAI, r/artificial, r/ChatGPT, r/AutomateYourself
- GitHub: repos bem avaliados de AI agents, Claude Code, n8n, automacao

Motor de busca: SearXNG local (Docker, porta 8888). Playwright pra Instagram.

### generate-weekly-plan.mjs (Cron: segunda 7h)

Gera plano semanal de 5-7 conteudos:
1. Le tendencias do scraping (ultimos 7 dias)
2. Verifica o que ja esta agendado
3. Distribui entre tipos (carrossel, reels, post, thread, short) e plataformas
4. Salva em `ct_content_items` com status `planned`
5. Notifica Igor via Telegram

### daily-publish-check.mjs (Cron: diario 8h)

Verifica publicacoes do dia e atrasos:
1. Lista tudo agendado pra hoje
2. Lista atrasados (data passada, nao publicado)
3. Envia resumo pro Telegram do Igor

### auto-publish.mjs (Cron: a cada 30min)

Publica conteudos aprovados no horario definido:
1. Busca `ct_content_items WHERE status='approved' AND scheduled_at=hoje`
2. Instagram: publica via Graph API (max 10 slides)
3. LinkedIn: publica via REST API
4. TikTok/X/YouTube/Threads: notifica Telegram pra publicar manual
5. Atualiza status pra `published`

### cross-post.mjs (Manual)

Gera versoes nativas a partir do tema do carrossel IG:
- LinkedIn: post storytelling + dados (1300+ chars)
- X/Twitter: thread 8-12 tweets
- TikTok: script avatar HeyGen casual (21-34s)
- YouTube Shorts: script avatar HeyGen formal (30-60s)

**Regra:** NUNCA repetir conteudo. Cada rede = angulo diferente do mesmo TEMA.

### process-video.mjs (Manual)

Processa video do YouTube Longo:
1. Transcreve (yt-dlp legendas ou Whisper API)
2. Identifica 4 momentos-chave
3. Gera scripts por plataforma com angulos diferentes
4. Salva em `content/videos/[slug]/`

### telegram-approve.mjs (Servico 24h)

Bot de aprovacao via Telegram. Igor recebe preview com legenda e decide:

```
/pendentes                    — lista conteudos pra aprovar
/preview [id]                 — preview completo com legenda
/aprovar [id] DD/MM HH:MM    — aprova e define data/hora de publicacao
/rejeitar [id] [motivo]       — rejeita
/editar [id]                  — marca pra edicao
/legenda [id] [nova legenda]  — altera legenda antes de aprovar
/agendar [id] DD/MM HH:MM    — muda data/hora
/semana                       — agenda da semana
/hoje                         — publicacoes de hoje
/ajuda                        — lista comandos
```

## Infraestrutura VPS

| Servico | Tipo | Detalhes |
|---------|------|----------|
| SearXNG | Docker (porta 8888) | Metabuscador local — pesquisa sem bloqueio |
| ct-approve-bot | systemd | Bot Telegram 24h |
| Cron 6h | crontab | scrape-playwright.mjs |
| Cron 7h seg | crontab | generate-weekly-plan.mjs |
| Cron 8h | crontab | daily-publish-check.mjs |
| Cron */30min | crontab | auto-publish.mjs |

## Variaveis de Ambiente (.env)

| Variavel | Obrigatoria | Uso |
|----------|-------------|-----|
| SUPABASE_URL | Sim | Banco de dados |
| SUPABASE_SERVICE_ROLE_KEY | Sim | Banco de dados |
| INSTAGRAM_USER_ID | Sim | Publicacao IG |
| INSTAGRAM_ACCESS_TOKEN | Sim | Publicacao IG |
| TELEGRAM_BOT_TOKEN | Sim | Notificacoes + bot aprovacao |
| TELEGRAM_CHAT_ID | Sim | Chat do Igor |
| LINKEDIN_ACCESS_TOKEN | Pra LinkedIn | Publicacao automatica |
| LINKEDIN_PERSON_ID | Pra LinkedIn | Publicacao automatica |
| OPENAI_API_KEY | Pra videos | Whisper transcricao |
| NOTION_TOKEN | Opcional | Criacao de guias |

## Uso via Termius (iPad/iPhone)

```bash
ssh root@100.84.154.51
cd /root/content-team-ai
set -a && source .env && set +a

# Rodar scripts manualmente
node scripts/scrape-playwright.mjs
node scripts/generate-weekly-plan.mjs
node scripts/daily-publish-check.mjs
node scripts/cross-post.mjs --tema="Tema aqui"
node scripts/process-video.mjs --url="https://youtube.com/watch?v=XXX"

# Ver logs
cat /tmp/scrape-competitors.log
cat /tmp/weekly-plan.log
cat /tmp/auto-publish.log

# Gerenciar servicos
systemctl status ct-approve-bot
systemctl restart ct-approve-bot
docker ps  # SearXNG
```

## Tabelas Supabase

### ct_competitor_posts
- `id`, `competitor_id`, `competitor_handle`, `platform`, `source_type`
- `content_preview`, `external_id`, `scraped_at`
- `source_type`: `competitor_tracking` | `trend_research` | `repo_research`

### ct_content_items
- `id`, `title`, `content_type`, `platform`, `status`, `scheduled_at`
- `caption`, `content_body`, `hashtags`, `media_urls`
- `published_at`, `source_url`, `created_by`, `approval_notes`
- Status: `planned` → `draft` → `approved` → `published` | `rejected` | `needs_edit`
