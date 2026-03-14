---
tags:
  - projeto
  - content-team
  - openclaw
  - plano
status: em-andamento
created: '2026-03-06'
---
# Plano: Content Team AI - OpenClaw

## Contexto

Igor Rocha (@igorrocha.ia) precisa de um time de 12 agentes de IA especializados em criacao de conteudo dentro do OpenClaw. O objetivo e automatizar todo o ciclo de conteudo: pesquisa, criacao, design, publicacao, CRM e email marketing. Depois de funcionar pro Igor, vira produto white-label.

**Nicho:** Sistemas de IA personalizados para gestores nao-tecnicos
**Plataformas:** Instagram, YouTube, LinkedIn, X, Email
**Estilo visual:** Dark/minimalista (fundo #0D0D0D, texto branco, fonte Inter)
**Concorrentes:** @adamstewartmarketing, @divyannshisharma, @oalanicolas, @charlieautomates, @noevarner.ai, @liamjohnston.ai, @odanilogato, @thaismartan

---

## Os 13 Agentes

| # | Agente | Funcao |
|---|--------|--------|
| 1 | content-director | Orquestrador. Delega tudo. Unico que fala com Igor |
| 2 | editor-chief | Calendario de conteudo, agendamentos, cron jobs, email campaigns |
| 3 | tech-chief | Integracoes, APIs, MCPs, skills, plugins, docs, otimizacao custos |
| 4 | design-director | Design system, fontes, logo, identidade visual |
| 5 | copywriter | Copys de posts, legendas, scripts, emails, landing pages, anuncios, CTAs |
| 6 | content-curator | Reaproveitamento cross-platform (YouTube->shorts, LinkedIn->IG) |
| 7 | clone-agent | Videos com avatar via HeyGen API, clonagem de voz |
| 8 | carousel-creator | Carrosseis Instagram via Playwright (dark/minimalist) |
| 9 | listening-director | Feedback leads/clientes via Manychat, DMs, comentarios |
| 10 | audience-director | Email marketing (Mailjet), sequencias, assinantes, CRM |
| 11 | channel-controller | Otimizacao por plataforma (SEO, hashtags, formatos) |
| 12 | relations-manager | Influenciadores e parcerias |
| 13 | content-searcher | Scraping concorrentes, YouTube, Reddit, LinkedIn, GitHub |

## Hierarquia

```
         Igor (Fundador)
              |
      content-director (orquestrador)
         /        |         \
  editor-chief  tech-chief  design-director
      |
  +-- copywriter          (textos, copys, scripts, CTAs)
  +-- content-curator     (reaproveitamento cross-platform)
  +-- carousel-creator    (carrosseis visuais)
  +-- clone-agent         (videos com avatar)
  +-- content-searcher    (pesquisa e scraping)
  +-- listening-director  (escuta social, DMs)
  +-- audience-director   (email marketing, CRM)
  +-- channel-controller  (otimizacao por rede)
  +-- relations-manager   (parcerias e influenciadores)
```

Comunicacao via tabela `ct_tasks` no PostgreSQL.
Persistencia de conhecimento via Obsidian.
Interacoes sociais APENAS via Manychat.

---

## Fase 1: Infraestrutura

### 1A. Banco de Dados (milo_db - tabelas ct_*)

18 tabelas com prefixo `ct_`:

**Core:** ct_agents, ct_tasks, ct_audit_log
**Conteudo:** ct_content_items, ct_content_series, ct_content_series_items
**CRM:** ct_pipeline_stages, ct_contacts, ct_deals, ct_deal_activities
**Email:** ct_subscribers, ct_email_campaigns, ct_email_sequences, ct_email_sequence_steps, ct_lead_magnets
**Design:** ct_design_system
**Monitoramento:** ct_competitors, ct_competitor_posts
**Influenciadores:** ct_influencers, ct_collaborations

Seed: 6 pipeline stages (Lead, Qualified, Proposal, Negotiation, Won, Lost), 8 concorrentes, design system dark minimalist.

### 1B. Primeiros 3 Agentes

1. content-director - em ~/.openclaw/agents/content-director/AGENT.md
2. editor-chief - em ~/.openclaw/agents/editor-chief/AGENT.md
3. content-searcher - em ~/.openclaw/agents/content-searcher/AGENT.md

Workspace: ~/.openclaw/workspace/content-team/ (INSTRUCTIONS.md, MEMORY.md, design-system.json)

Skills novas: content-db (CRUD ct_*), competitor-scraper (Instagram via RapidAPI)

### 1C. Dashboard Next.js

Stack: Next.js 14 + TypeScript + Tailwind + shadcn/ui (dark theme)
Deploy: Vercel ou VPS porta 3100
Auth: Token simples

Paginas iniciais: Overview, Calendar, Content list, Agents, Settings

### 1D. Cron Jobs Iniciais

- Seg 7h: plano semanal (content-director)
- Diario 6h: scraping concorrentes (content-searcher)
- Diario 8h: lembrete publicacao (editor-chief)

---

## Fase 2: Producao de Conteudo

Agentes: design-director, copywriter, carousel-creator, clone-agent, content-curator
Skills: carousel-generator (Playwright HTML->imagem), heygen-clone (API v2), youtube-search
Dashboard: Preview conteudo + aprovar/rejeitar, Editor design system

## Fase 3: Audiencia e Escuta

Agentes: listening-director, audience-director, channel-controller
Skills: mailjet-sender (free 6k emails/mes), manychat-api (Business $15/mo)
Dashboard: CRM Kanban (Pipedrive-style), Contacts, Subscribers, Campaigns, Competitors

## Fase 4: Monitoramento e Relacoes

Agentes: relations-manager, tech-chief
Dashboard: Influencers, Settings completo (integracoes, API keys, cron, skills, plugins, docs)

---

## Schema SQL Completo

```sql
-- CORE
CREATE TABLE ct_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'idle',
  last_active_at TIMESTAMPTZ,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ct_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_agent VARCHAR(50) REFERENCES ct_agents(slug),
  created_by VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  priority INT DEFAULT 0,
  due_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  result JSONB,
  parent_task_id UUID REFERENCES ct_tasks(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTENT CALENDAR
CREATE TABLE ct_content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content_type VARCHAR(30) NOT NULL,
  status VARCHAR(20) DEFAULT 'idea',
  platform VARCHAR(30),
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  publish_url TEXT,
  caption TEXT,
  hashtags TEXT[],
  script TEXT,
  visual_notes TEXT,
  media_urls TEXT[],
  source_url TEXT,
  source_agent VARCHAR(50),
  approval_status VARCHAR(20) DEFAULT 'pending',
  approval_notes TEXT,
  engagement JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ct_content_series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  frequency VARCHAR(30),
  platforms TEXT[],
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ct_content_series_items (
  series_id UUID REFERENCES ct_content_series(id),
  content_id UUID REFERENCES ct_content_items(id),
  sequence_num INT,
  PRIMARY KEY (series_id, content_id)
);

-- CRM (Pipedrive-style)
CREATE TABLE ct_pipeline_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  position INT NOT NULL,
  color VARCHAR(7),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ct_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200),
  phone VARCHAR(50),
  instagram VARCHAR(100),
  linkedin VARCHAR(200),
  company VARCHAR(200),
  source VARCHAR(50),
  tags TEXT[],
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ct_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES ct_contacts(id),
  title VARCHAR(255) NOT NULL,
  value DECIMAL(12,2),
  currency VARCHAR(3) DEFAULT 'BRL',
  stage_id UUID REFERENCES ct_pipeline_stages(id),
  status VARCHAR(20) DEFAULT 'open',
  expected_close_at DATE,
  closed_at TIMESTAMPTZ,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ct_deal_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES ct_deals(id),
  contact_id UUID REFERENCES ct_contacts(id),
  activity_type VARCHAR(30),
  description TEXT,
  performed_by VARCHAR(50),
  performed_at TIMESTAMPTZ DEFAULT NOW()
);

-- EMAIL MARKETING
CREATE TABLE ct_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(200) UNIQUE NOT NULL,
  name VARCHAR(200),
  source VARCHAR(50),
  lead_magnet_id UUID,
  tags TEXT[],
  status VARCHAR(20) DEFAULT 'active',
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

CREATE TABLE ct_email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  subject VARCHAR(300) NOT NULL,
  body_html TEXT,
  body_text TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  campaign_type VARCHAR(30),
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  recipient_tags TEXT[],
  stats JSONB,
  provider VARCHAR(30),
  provider_campaign_id VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ct_email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  trigger_event VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ct_email_sequence_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID REFERENCES ct_email_sequences(id),
  step_number INT NOT NULL,
  delay_hours INT DEFAULT 0,
  subject VARCHAR(300),
  body_html TEXT,
  body_text TEXT,
  metadata JSONB DEFAULT '{}'
);

-- LEAD MAGNETS
CREATE TABLE ct_lead_magnets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  file_url TEXT,
  landing_page_url TEXT,
  download_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DESIGN SYSTEM
CREATE TABLE ct_design_system (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner VARCHAR(100) DEFAULT 'igorrocha.ia',
  logo_url TEXT,
  fonts JSONB,
  colors JSONB,
  carousel_style JSONB,
  brand_voice TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- COMPETITORS
CREATE TABLE ct_competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handle VARCHAR(100) NOT NULL,
  platform VARCHAR(30) DEFAULT 'instagram',
  display_name VARCHAR(200),
  niche VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  last_scraped_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

CREATE TABLE ct_competitor_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_id UUID REFERENCES ct_competitors(id),
  platform_post_id VARCHAR(100),
  post_type VARCHAR(30),
  caption TEXT,
  media_urls TEXT[],
  engagement JSONB,
  posted_at TIMESTAMPTZ,
  analysis TEXT,
  is_viral BOOLEAN DEFAULT false,
  scraped_at TIMESTAMPTZ DEFAULT NOW()
);

-- INFLUENCERS
CREATE TABLE ct_influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  handles JSONB,
  niche VARCHAR(100),
  followers_approx INT,
  status VARCHAR(20) DEFAULT 'prospect',
  notes TEXT,
  last_contact_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ct_collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID REFERENCES ct_influencers(id),
  type VARCHAR(30),
  status VARCHAR(20) DEFAULT 'proposed',
  scheduled_at TIMESTAMPTZ,
  notes TEXT,
  content_id UUID REFERENCES ct_content_items(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AUDIT LOG
CREATE TABLE ct_audit_log (
  id BIGSERIAL PRIMARY KEY,
  agent VARCHAR(50),
  action VARCHAR(100),
  target_type VARCHAR(50),
  target_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_ct_tasks_status ON ct_tasks(status);
CREATE INDEX idx_ct_tasks_agent ON ct_tasks(assigned_agent);
CREATE INDEX idx_ct_content_status ON ct_content_items(status);
CREATE INDEX idx_ct_content_platform ON ct_content_items(platform);
CREATE INDEX idx_ct_content_scheduled ON ct_content_items(scheduled_at);
CREATE INDEX idx_ct_deals_stage ON ct_deals(stage_id);
CREATE INDEX idx_ct_subscribers_status ON ct_subscribers(status);
CREATE INDEX idx_ct_competitor_posts_competitor ON ct_competitor_posts(competitor_id);
CREATE INDEX idx_ct_audit_agent ON ct_audit_log(agent);

-- SEED DATA
INSERT INTO ct_pipeline_stages (name, position, color, is_default) VALUES
  ('Lead', 1, '#6B7280', true),
  ('Qualified', 2, '#3B82F6', false),
  ('Proposal', 3, '#F59E0B', false),
  ('Negotiation', 4, '#8B5CF6', false),
  ('Won', 5, '#10B981', false),
  ('Lost', 6, '#EF4444', false);

INSERT INTO ct_competitors (handle, platform, niche) VALUES
  ('@adamstewartmarketing', 'instagram', 'AI marketing'),
  ('@divyannshisharma', 'instagram', 'AI automation'),
  ('@oalanicolas', 'instagram', 'AI business BR'),
  ('@charlieautomates', 'instagram', 'AI automation'),
  ('@noevarner.ai', 'instagram', 'AI tools'),
  ('@liamjohnston.ai', 'instagram', 'AI agency'),
  ('@odanilogato', 'instagram', 'AI BR'),
  ('@thaismartan', 'instagram', 'AI BR');

INSERT INTO ct_design_system (owner, fonts, colors, carousel_style, brand_voice) VALUES
  ('igorrocha.ia',
   '{"primary":"Inter","secondary":"Space Grotesk","mono":"JetBrains Mono"}',
   '{"bg":"#0D0D0D","surface":"#1A1A1A","text":"#FFFFFF","textSecondary":"#A0A0A0","accent":"#4A90D9","accent2":"#7C3AED","success":"#10B981","error":"#EF4444"}',
   '{"bgColor":"#0D0D0D","textColor":"#FFFFFF","font":"Inter","profilePhotoPosition":"bottom-left","slideWidth":1080,"slideHeight":1350,"maxSlides":10,"style":"quote-minimalist"}',
   'Direto, pratico, sem rodeios. Fala como consultor senior que ja implementou. Nao ensina ferramenta, entrega resultado. Tom confiante mas acessivel. Usa analogias do dia a dia. Evita jargao tecnico desnecessario.'
  );
```

---

## Tecnologias e Custos

| Servico | Custo | Uso |
|---------|-------|-----|
| Mailjet | FREE (6k emails/mes) | Email marketing |
| Manychat | $15/mo (Business) | DMs e automacao social |
| HeyGen API | Pay-as-you-go | Videos com avatar |
| RapidAPI | Depende do uso | Scraping Instagram |
| Vercel | FREE | Dashboard hosting |
| Next.js + shadcn/ui | FREE | Dashboard stack |

## BMAD v6 Instalado

9 skills + 15 comandos de workflow disponiveis:
- /workflow-init, /product-brief, /prd, /architecture
- /sprint-planning, /create-story, /dev-story
- /brainstorm, /research, /create-agent, /create-workflow

## Status

- [x] BMAD v6 instalado no Claude Code
- [x] Plano completo desenhado
- [ ] Fase 1A: Criar tabelas no PostgreSQL
- [ ] Fase 1B: Criar primeiros 3 agentes
- [ ] Fase 1C: Dashboard Next.js skeleton
- [ ] Fase 1D: Registrar no Mission Control
- [ ] Fase 1E: Cron jobs iniciais
- [ ] Fase 2: Producao de conteudo
- [ ] Fase 3: Audiencia e escuta
- [ ] Fase 4: Monitoramento e relacoes
