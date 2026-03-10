# Sprint Plan: Content Team AI

**Date:** 2026-03-10
**Scrum Master:** Igor Rocha
**Project Level:** 3
**Total Stories:** 38
**Total Points:** 142
**Planned Sprints:** 4 (2 semanas cada)

---

## Executive Summary

Plano de implementação em 4 sprints de 2 semanas cada, alinhados às 4 fases do projeto. Sprint 1 cria a infraestrutura (DB, layout, auth, overview, agentes). Sprint 2 adiciona gestão de conteúdo (calendário, lista, aprovação, design). Sprint 3 implementa CRM e email marketing. Sprint 4 finaliza com inteligência competitiva, influenciadores e settings.

**Key Metrics:**
- Total Stories: 38
- Total Points: 142
- Sprints: 4
- Team Capacity: ~40 points per sprint (Replit Agent + Claude Code)
- Target Completion: 8 semanas (2026-05-05)

---

## Story Inventory

### EPIC-001: Dashboard Core & Navigation

#### STORY-001: Setup projeto Next.js com configs base
**Epic:** EPIC-001 | **Priority:** Must Have | **Points:** 3

**User Story:** Como desenvolvedor, quero o projeto Next.js configurado com TypeScript, Tailwind, shadcn/ui e dark theme para começar a construir as páginas.

**Acceptance Criteria:**
- [ ] Next.js 14 com App Router criado
- [ ] TypeScript strict mode
- [ ] Tailwind configurado com cores do design system
- [ ] shadcn/ui instalado e configurado (dark theme default)
- [ ] package.json com todas as dependências
- [ ] .env.example com variáveis necessárias

**Technical Notes:** tailwind.config.ts com cores custom (#0D0D0D, #1A1A1A, etc.), fonte Inter via next/font.

---

#### STORY-002: Criar types.ts com interfaces de todas as 18 tabelas
**Epic:** EPIC-001 | **Priority:** Must Have | **Points:** 3

**User Story:** Como desenvolvedor, quero interfaces TypeScript para todas as entidades do banco para ter type safety em todo o app.

**Acceptance Criteria:**
- [ ] Interface para cada uma das 18 tabelas ct_*
- [ ] Tipos para enums (status, priority, content_type, platform)
- [ ] Tipos para API responses (paginated list, single item)
- [ ] Exportados de src/lib/types.ts

---

#### STORY-003: Criar schema SQL e migration
**Epic:** EPIC-001 | **Priority:** Must Have | **Points:** 2

**User Story:** Como desenvolvedor, quero o schema SQL completo no repositório para criar as tabelas no Supabase.

**Acceptance Criteria:**
- [ ] supabase/migrations/001_content_team.sql com 18 tabelas
- [ ] Índices criados
- [ ] Seed data (6 stages, 8 competitors, 1 design system)
- [ ] Seed dos 13 agentes em ct_agents

---

#### STORY-004: Database connection helper
**Epic:** EPIC-001 | **Priority:** Must Have | **Points:** 2

**User Story:** Como desenvolvedor, quero um helper de conexão ao PostgreSQL para usar em todas as API routes.

**Acceptance Criteria:**
- [ ] src/lib/db.ts com pool de conexão
- [ ] Funções helper: query, transaction
- [ ] Connection string via DATABASE_URL env var
- [ ] Error handling na conexão

---

#### STORY-005: Layout shell com sidebar
**Epic:** EPIC-001 | **Priority:** Must Have | **Points:** 5

**User Story:** Como Igor, quero uma sidebar com links para todas as páginas para navegar no dashboard facilmente.

**Acceptance Criteria:**
- [ ] Sidebar fixa com ícones Lucide para cada rota
- [ ] Agrupamento: Main, CRM, Marketing, Intelligence, System
- [ ] Indicador visual da página ativa
- [ ] Collapse/hamburger no mobile
- [ ] Dark theme aplicado globalmente
- [ ] Logo/título no topo da sidebar

**Dependencies:** STORY-001

---

#### STORY-006: Autenticação por token
**Epic:** EPIC-001 | **Priority:** Must Have | **Points:** 3

**User Story:** Como Igor, quero proteger o dashboard com uma senha para que só eu tenha acesso.

**Acceptance Criteria:**
- [ ] Página /login com campo de token
- [ ] POST /api/auth/login valida contra AUTH_TOKEN env
- [ ] Cookie httpOnly setado após login
- [ ] Middleware protege todas as rotas /api/* e páginas
- [ ] Redirect para /login se não autenticado
- [ ] Botão logout no sidebar

**Dependencies:** STORY-005

---

#### STORY-007: Dashboard overview page
**Epic:** EPIC-001 | **Priority:** Must Have | **Points:** 5

**User Story:** Como Igor, quero ver na tela principal o status dos agentes, próximo conteúdo e stats gerais.

**Acceptance Criteria:**
- [ ] Cards de status dos 13 agentes (verde/amarelo/vermelho)
- [ ] Widget "Próximo Conteúdo" com título, plataforma, horário
- [ ] Mini pipeline com contagem de deals por stage
- [ ] Stats cards: posts esta semana, leads, emails enviados
- [ ] API GET /api/dashboard/stats

**Dependencies:** STORY-004, STORY-005

---

### EPIC-003: Agent Management

#### STORY-008: Página de agentes
**Epic:** EPIC-003 | **Priority:** Must Have | **Points:** 5

**User Story:** Como Igor, quero ver o status detalhado de cada agente para saber se estão funcionando.

**Acceptance Criteria:**
- [ ] Card por agente: nome, role, status, último ativo
- [ ] Contadores: pendentes, em andamento, concluídas
- [ ] Indicador de workload
- [ ] Click expande histórico de tarefas
- [ ] Filtro por status
- [ ] API GET /api/agents

**Dependencies:** STORY-004, STORY-005

---

#### STORY-009: Gestão de tarefas dos agentes
**Epic:** EPIC-003 | **Priority:** Must Have | **Points:** 5

**User Story:** Como Igor, quero criar tarefas para agentes e ver resultados para controlar o trabalho.

**Acceptance Criteria:**
- [ ] Lista de tarefas por agente
- [ ] Criar tarefa: título, descrição, agente, prioridade, prazo
- [ ] Ver resultado (JSON formatado) de tarefas concluídas
- [ ] Tarefas filhas aninhadas
- [ ] Cancelar tarefa pendente
- [ ] API CRUD /api/tasks

**Dependencies:** STORY-008

---

#### STORY-010: Audit log viewer
**Epic:** EPIC-003 | **Priority:** Should Have | **Points:** 3

**User Story:** Como Igor, quero ver o log de ações dos agentes para rastrear o que fizeram.

**Acceptance Criteria:**
- [ ] Lista cronológica: agente, ação, alvo, data
- [ ] Filtro por agente, ação, período
- [ ] Busca nos detalhes
- [ ] API GET /api/audit

**Dependencies:** STORY-004

---

### EPIC-002: Content Management

#### STORY-011: Lista de conteúdos
**Epic:** EPIC-002 | **Priority:** Must Have | **Points:** 5

**User Story:** Como Igor, quero ver todos os conteúdos com filtros para encontrar rapidamente o que preciso.

**Acceptance Criteria:**
- [ ] Tabela: título, tipo, plataforma, status, data
- [ ] Filtros: status, plataforma, tipo, date range
- [ ] Busca por texto
- [ ] Ordenação
- [ ] Paginação (20/página)
- [ ] Botão criar novo
- [ ] API GET /api/content

**Dependencies:** STORY-004, STORY-005

---

#### STORY-012: Detalhe e aprovação de conteúdo
**Epic:** EPIC-002 | **Priority:** Must Have | **Points:** 5

**User Story:** Como Igor, quero ver preview de um conteúdo e aprovar ou rejeitar para manter qualidade.

**Acceptance Criteria:**
- [ ] Preview: caption, mídia, hashtags, script, visual notes
- [ ] Campos editáveis
- [ ] Botões: Aprovar, Rejeitar (com motivo), Editar
- [ ] Histórico de alterações
- [ ] API GET/PATCH /api/content/:id, PATCH approve/reject

**Dependencies:** STORY-011

---

#### STORY-013: Calendário de conteúdo (visualização)
**Epic:** EPIC-002 | **Priority:** Must Have | **Points:** 5

**User Story:** Como Igor, quero ver meu calendário mensal/semanal de publicações para planejar.

**Acceptance Criteria:**
- [ ] Grid mensal com dias
- [ ] Visualização semanal
- [ ] Toggle mês/semana
- [ ] Items: título, plataforma (ícone), status (cor)
- [ ] Click abre detalhe
- [ ] API GET /api/calendar?start=&end=

**Dependencies:** STORY-011

---

#### STORY-014: Calendário drag-and-drop
**Epic:** EPIC-002 | **Priority:** Should Have | **Points:** 3

**User Story:** Como Igor, quero arrastar conteúdo no calendário para reagendar facilmente.

**Acceptance Criteria:**
- [ ] Drag-and-drop entre dias/slots
- [ ] PATCH /api/calendar/:id/move atualiza scheduled_at
- [ ] Feedback visual durante drag
- [ ] Confirmação após drop

**Dependencies:** STORY-013

---

#### STORY-015: Editor de design system
**Epic:** EPIC-008 | **Priority:** Should Have | **Points:** 5

**User Story:** Como Igor, quero editar cores, fontes e estilo do carrossel para manter minha identidade visual.

**Acceptance Criteria:**
- [ ] Color pickers para todas as cores
- [ ] Seletor de fontes
- [ ] Editor estilo carrossel
- [ ] Editor brand voice
- [ ] Preview em tempo real
- [ ] Botão salvar
- [ ] API GET/PATCH /api/design-system

**Dependencies:** STORY-004, STORY-005

---

### EPIC-004: CRM Pipeline

#### STORY-016: Pipeline Kanban board
**Epic:** EPIC-004 | **Priority:** Must Have | **Points:** 8

**User Story:** Como Igor, quero ver meus deals em colunas de Kanban e arrastar entre stages para gerenciar vendas.

**Acceptance Criteria:**
- [ ] 6 colunas com cores distintas
- [ ] Cards: contato, título, valor, data esperada
- [ ] Drag-and-drop entre stages
- [ ] Somatório de valor por stage no header
- [ ] Click abre detalhes do deal
- [ ] Botão novo deal
- [ ] API GET /api/pipeline/stages, PATCH /api/deals/:id/move

**Dependencies:** STORY-004, STORY-005

---

#### STORY-017: CRUD de deals
**Epic:** EPIC-004 | **Priority:** Must Have | **Points:** 3

**User Story:** Como Igor, quero criar e editar deals com valor, contato e stage.

**Acceptance Criteria:**
- [ ] Form: título, contato, valor, moeda, stage, data esperada, notas
- [ ] Criar/editar/deletar
- [ ] Associar a contato existente
- [ ] API CRUD /api/deals

**Dependencies:** STORY-016

---

#### STORY-018: Gestão de contatos
**Epic:** EPIC-004 | **Priority:** Must Have | **Points:** 5

**User Story:** Como Igor, quero gerenciar contatos com informações de redes sociais e tags.

**Acceptance Criteria:**
- [ ] Lista: nome, email, Instagram, empresa, tags
- [ ] CRUD completo
- [ ] Filtros: tags, fonte
- [ ] Busca por nome/email/empresa
- [ ] Ver deals associados
- [ ] Ver atividades recentes
- [ ] API CRUD /api/contacts

**Dependencies:** STORY-004, STORY-005

---

#### STORY-019: Atividades de deals
**Epic:** EPIC-004 | **Priority:** Should Have | **Points:** 3

**User Story:** Como Igor, quero registrar atividades nos deals para acompanhar o histórico.

**Acceptance Criteria:**
- [ ] Lista de atividades no detalhe do deal
- [ ] Adicionar: tipo, descrição
- [ ] Tipos: call, email, meeting, note, task
- [ ] API CRUD /api/deal-activities

**Dependencies:** STORY-017

---

### EPIC-005: Email Marketing

#### STORY-020: Lista de assinantes
**Epic:** EPIC-005 | **Priority:** Must Have | **Points:** 3

**User Story:** Como Igor, quero ver meus assinantes de email com filtros para segmentar.

**Acceptance Criteria:**
- [ ] Lista: email, nome, fonte, tags, status, data
- [ ] Filtros: status, tags, fonte
- [ ] Busca por email/nome
- [ ] Paginação
- [ ] API GET /api/subscribers

**Dependencies:** STORY-004, STORY-005

---

#### STORY-021: Import/export de assinantes
**Epic:** EPIC-005 | **Priority:** Should Have | **Points:** 3

**User Story:** Como Igor, quero importar assinantes via CSV e exportar minha lista.

**Acceptance Criteria:**
- [ ] Upload CSV com email, nome, tags
- [ ] Validação e deduplicação
- [ ] Export para CSV
- [ ] API POST /api/subscribers/import, GET /api/subscribers/export

**Dependencies:** STORY-020

---

#### STORY-022: CRUD de campanhas de email
**Epic:** EPIC-005 | **Priority:** Must Have | **Points:** 5

**User Story:** Como Igor, quero criar campanhas de email com editor e preview.

**Acceptance Criteria:**
- [ ] Lista: nome, status, data envio, stats
- [ ] Criar: nome, subject, body (editor HTML simples), tags destinatários
- [ ] Preview do email
- [ ] Status: draft, scheduled, sending, sent
- [ ] API CRUD /api/campaigns

**Dependencies:** STORY-020

---

#### STORY-023: Envio de campanhas via Mailjet
**Epic:** EPIC-005 | **Priority:** Must Have | **Points:** 5

**User Story:** Como Igor, quero enviar campanhas de email via Mailjet e ver stats.

**Acceptance Criteria:**
- [ ] Agendar envio (data/hora)
- [ ] Envio real via Mailjet API
- [ ] Stats: enviados, abertos, clicados
- [ ] src/lib/integrations/mailjet.ts
- [ ] API POST /api/campaigns/:id/send

**Dependencies:** STORY-022

---

#### STORY-024: Sequences de email
**Epic:** EPIC-005 | **Priority:** Should Have | **Points:** 5

**User Story:** Como Igor, quero configurar sequences automáticas para novos assinantes.

**Acceptance Criteria:**
- [ ] Lista: nome, trigger, steps, ativa/inativa
- [ ] Criar sequence com trigger event
- [ ] Adicionar steps: ordem, delay, subject, body
- [ ] Timeline visual dos steps
- [ ] Toggle ativar/desativar
- [ ] API CRUD /api/sequences

**Dependencies:** STORY-022

---

#### STORY-025: Lead magnets
**Epic:** EPIC-005 | **Priority:** Should Have | **Points:** 2

**User Story:** Como Igor, quero gerenciar meus lead magnets para capturar assinantes.

**Acceptance Criteria:**
- [ ] Lista: nome, URL, downloads, ativo
- [ ] CRUD com nome, descrição, URLs
- [ ] Contagem de downloads
- [ ] API CRUD /api/lead-magnets

**Dependencies:** STORY-020

---

### EPIC-006: Competitive Intelligence

#### STORY-026: Dashboard de concorrentes
**Epic:** EPIC-006 | **Priority:** Must Have | **Points:** 5

**User Story:** Como Igor, quero ver os posts mais recentes dos concorrentes para me inspirar.

**Acceptance Criteria:**
- [ ] Card por concorrente: handle, último scrape, post count
- [ ] Lista posts: caption (truncada), tipo, engajamento, data
- [ ] Filtro por concorrente, tipo, período
- [ ] Indicador de última atualização
- [ ] API GET /api/competitors, /api/competitors/:id/posts

**Dependencies:** STORY-004, STORY-005

---

#### STORY-027: Destaque de posts virais
**Epic:** EPIC-006 | **Priority:** Should Have | **Points:** 2

**User Story:** Como Igor, quero saber quais posts dos concorrentes viralizaram para entender o que funciona.

**Acceptance Criteria:**
- [ ] Seção "Posts Virais" com is_viral = true destacados
- [ ] Análise textual do post (campo analysis)
- [ ] Filtro apenas virais

**Dependencies:** STORY-026

---

### EPIC-007: Influencer Relations

#### STORY-028: Lista de influenciadores
**Epic:** EPIC-007 | **Priority:** Should Have | **Points:** 3

**User Story:** Como Igor, quero listar influenciadores do meu nicho para buscar parcerias.

**Acceptance Criteria:**
- [ ] Lista: nome, handles, nicho, seguidores, status, último contato
- [ ] CRUD completo
- [ ] Filtro por status
- [ ] API CRUD /api/influencers

**Dependencies:** STORY-004, STORY-005

---

#### STORY-029: Gestão de colaborações
**Epic:** EPIC-007 | **Priority:** Should Have | **Points:** 3

**User Story:** Como Igor, quero registrar colaborações com influenciadores para acompanhar parcerias.

**Acceptance Criteria:**
- [ ] Criar colaboração: influencer, tipo, status, data, notas
- [ ] Link para conteúdo associado
- [ ] Status: proposed, accepted, in_progress, completed
- [ ] API CRUD /api/collaborations

**Dependencies:** STORY-028

---

### EPIC-008: Design System & Settings

#### STORY-030: Séries de conteúdo
**Epic:** EPIC-002 | **Priority:** Could Have | **Points:** 3

**User Story:** Como Igor, quero agrupar conteúdos em séries para manter consistência.

**Acceptance Criteria:**
- [ ] CRUD de séries: nome, descrição, frequência, plataformas
- [ ] Associar conteúdos a série
- [ ] Timeline da série
- [ ] API CRUD /api/content-series

**Dependencies:** STORY-011

---

#### STORY-031: Página de settings - API Keys
**Epic:** EPIC-008 | **Priority:** Should Have | **Points:** 3

**User Story:** Como Igor, quero ver e gerenciar minhas API keys na página de settings.

**Acceptance Criteria:**
- [ ] Seção API Keys: HeyGen, RapidAPI, Mailjet, Manychat
- [ ] Keys mascaradas (****xxx)
- [ ] Editar key
- [ ] API GET/PATCH /api/settings

**Dependencies:** STORY-004, STORY-005

---

#### STORY-032: Settings - Status integrações
**Epic:** EPIC-008 | **Priority:** Should Have | **Points:** 3

**User Story:** Como Igor, quero ver o status de cada integração para saber se estão conectadas.

**Acceptance Criteria:**
- [ ] Card por integração: nome, status (conectado/desconectado)
- [ ] Botão "Testar Conexão"
- [ ] API POST /api/settings/test/:service

**Dependencies:** STORY-031

---

#### STORY-033: Settings - Cron jobs
**Epic:** EPIC-008 | **Priority:** Should Have | **Points:** 2

**User Story:** Como Igor, quero ver e configurar os cron jobs dos agentes.

**Acceptance Criteria:**
- [ ] Lista: horário, agente, descrição, ativo/inativo
- [ ] Toggle ativar/desativar
- [ ] Visualização do próximo trigger

**Dependencies:** STORY-031

---

#### STORY-034: Responsividade mobile
**Epic:** EPIC-008 | **Priority:** Should Have | **Points:** 3

**User Story:** Como Igor, quero acessar o dashboard no celular com layout adaptado.

**Acceptance Criteria:**
- [ ] Sidebar vira menu hamburger
- [ ] Tabelas viram cards
- [ ] Kanban scroll horizontal
- [ ] Touch-friendly interactions

**Dependencies:** STORY-005

---

#### STORY-035: PWA setup
**Epic:** EPIC-008 | **Priority:** Could Have | **Points:** 2

**User Story:** Como Igor, quero instalar o dashboard como app no celular.

**Acceptance Criteria:**
- [ ] manifest.json configurado
- [ ] Ícones PWA
- [ ] Splash screen
- [ ] Service worker básico

**Dependencies:** STORY-034

---

#### STORY-036: Criar novo conteúdo (form)
**Epic:** EPIC-002 | **Priority:** Must Have | **Points:** 3

**User Story:** Como Igor, quero criar conteúdo manualmente quando não for gerado por agente.

**Acceptance Criteria:**
- [ ] Form: título, tipo, plataforma, caption, hashtags, script, visual notes
- [ ] Seletor de plataforma e tipo
- [ ] Salvar como draft
- [ ] API POST /api/content

**Dependencies:** STORY-011

---

#### STORY-037: CRUD de assinantes
**Epic:** EPIC-005 | **Priority:** Must Have | **Points:** 2

**User Story:** Como Igor, quero adicionar e editar assinantes individualmente.

**Acceptance Criteria:**
- [ ] Form: email, nome, source, tags
- [ ] Editar assinante
- [ ] Unsubscribe
- [ ] API POST/PATCH /api/subscribers

**Dependencies:** STORY-020

---

#### STORY-038: Configuração de agentes
**Epic:** EPIC-008 | **Priority:** Should Have | **Points:** 2

**User Story:** Como Igor, quero ver a configuração de cada agente na página de settings.

**Acceptance Criteria:**
- [ ] Lista de agentes com config JSONB
- [ ] Visualização formatada do JSON
- [ ] Editar config básica

**Dependencies:** STORY-031

---

## Sprint Allocation

### Sprint 1 (Semanas 1-2): Infraestrutura e Core — 36/40 points

**Goal:** Projeto configurado, banco criado, dashboard com sidebar, auth, overview e painel de agentes funcionando.

**Stories:**
| # | Story | Points | Priority |
|---|-------|--------|----------|
| 1 | STORY-001: Setup projeto Next.js | 3 | Must |
| 2 | STORY-002: types.ts (18 tabelas) | 3 | Must |
| 3 | STORY-003: Schema SQL + migration | 2 | Must |
| 4 | STORY-004: DB connection helper | 2 | Must |
| 5 | STORY-005: Layout shell + sidebar | 5 | Must |
| 6 | STORY-006: Auth por token | 3 | Must |
| 7 | STORY-007: Dashboard overview | 5 | Must |
| 8 | STORY-008: Página de agentes | 5 | Must |
| 9 | STORY-009: Gestão de tarefas | 5 | Must |
| 10 | STORY-010: Audit log viewer | 3 | Should |
| | **Total** | **36** | |

**Risks:** Configuração do Supabase pode atrasar se houver problemas com o schema.

---

### Sprint 2 (Semanas 3-4): Gestão de Conteúdo — 34/40 points

**Goal:** Calendário de conteúdo, lista com filtros, aprovação, criação de conteúdo e editor de design system.

**Stories:**
| # | Story | Points | Priority |
|---|-------|--------|----------|
| 11 | STORY-011: Lista de conteúdos | 5 | Must |
| 12 | STORY-012: Detalhe + aprovação | 5 | Must |
| 13 | STORY-013: Calendário (view) | 5 | Must |
| 14 | STORY-014: Calendário drag-drop | 3 | Should |
| 15 | STORY-015: Editor design system | 5 | Should |
| 16 | STORY-036: Form criar conteúdo | 3 | Must |
| 17 | STORY-030: Séries de conteúdo | 3 | Could |
| 18 | STORY-034: Responsividade mobile | 3 | Should |
| 19 | STORY-035: PWA setup | 2 | Could |
| | **Total** | **34** | |

**Risks:** Calendário drag-and-drop pode ser complexo com shadcn/ui.

---

### Sprint 3 (Semanas 5-6): CRM + Email Marketing — 39/40 points

**Goal:** Pipeline Kanban, contatos, deals, assinantes, campanhas de email com envio via Mailjet.

**Stories:**
| # | Story | Points | Priority |
|---|-------|--------|----------|
| 20 | STORY-016: Pipeline Kanban | 8 | Must |
| 21 | STORY-017: CRUD deals | 3 | Must |
| 22 | STORY-018: Gestão contatos | 5 | Must |
| 23 | STORY-019: Atividades deals | 3 | Should |
| 24 | STORY-020: Lista assinantes | 3 | Must |
| 25 | STORY-037: CRUD assinantes | 2 | Must |
| 26 | STORY-022: CRUD campanhas | 5 | Must |
| 27 | STORY-023: Envio Mailjet | 5 | Must |
| 28 | STORY-024: Sequences email | 5 | Should |
| | **Total** | **39** | |

**Risks:** Integração Mailjet requer API key e testes. Kanban drag-drop é o componente mais complexo.

---

### Sprint 4 (Semanas 7-8): Inteligência + Settings — 33/40 points

**Goal:** Monitoramento de concorrentes, influenciadores, settings completo, import/export, lead magnets.

**Stories:**
| # | Story | Points | Priority |
|---|-------|--------|----------|
| 29 | STORY-026: Dashboard concorrentes | 5 | Must |
| 30 | STORY-027: Posts virais | 2 | Should |
| 31 | STORY-028: Lista influenciadores | 3 | Should |
| 32 | STORY-029: Colaborações | 3 | Should |
| 33 | STORY-031: Settings API Keys | 3 | Should |
| 34 | STORY-032: Status integrações | 3 | Should |
| 35 | STORY-033: Cron jobs | 2 | Should |
| 36 | STORY-038: Config agentes | 2 | Should |
| 37 | STORY-021: Import/export subs | 3 | Should |
| 38 | STORY-025: Lead magnets | 2 | Should |
| | **Total** | **33** | |**Risks:** RapidAPI scraping pode ter limitações. Funcionalidades desta sprint são menos críticas (Should/Could).

---

## Epic Traceability

| Epic ID | Epic Name | Stories | Points | Sprints |
|---------|-----------|---------|--------|---------|
| EPIC-001 | Dashboard Core & Nav | 001-007 | 23 | 1 |
| EPIC-002 | Content Management | 011-014, 030, 036 | 24 | 2 |
| EPIC-003 | Agent Management | 008-010 | 13 | 1 |
| EPIC-004 | CRM Pipeline | 016-019 | 19 | 3 |
| EPIC-005 | Email Marketing | 020-025, 037 | 25 | 3-4 |
| EPIC-006 | Competitive Intelligence | 026-027 | 7 | 4 |
| EPIC-007 | Influencer Relations | 028-029 | 6 | 4 |
| EPIC-008 | Design System & Settings | 015, 031-035, 038 | 20 | 2, 4 |
| **TOTAL** | | **38 stories** | **142 pts** | **4 sprints** |

---

## Requirements Coverage

| FR ID | FR Name | Story | Sprint |
|-------|---------|-------|--------|
| FR-001 | Dashboard Overview | STORY-007 | 1 |
| FR-002 | Calendário | STORY-013, 014 | 2 |
| FR-003 | Lista Conteúdos | STORY-011 | 2 |
| FR-004 | Detalhe Conteúdo | STORY-012 | 2 |
| FR-005 | Painel Agentes | STORY-008 | 1 |
| FR-006 | Gestão Tarefas | STORY-009 | 1 |
| FR-007 | Pipeline Kanban | STORY-016 | 3 |
| FR-008 | Contatos | STORY-018 | 3 |
| FR-009 | Assinantes | STORY-020, 037 | 3 |
| FR-010 | Campanhas | STORY-022 | 3 |
| FR-011 | Sequences | STORY-024 | 3 |
| FR-012 | Concorrentes | STORY-026, 027 | 4 |
| FR-013 | Influenciadores | STORY-028, 029 | 4 |
| FR-014 | Design System | STORY-015 | 2 |
| FR-015 | Settings | STORY-031, 032, 033, 038 | 4 |
| FR-016 | Séries Conteúdo | STORY-030 | 2 |
| FR-017 | Lead Magnets | STORY-025 | 4 |
| FR-018 | Audit Log | STORY-010 | 1 |
| FR-019 | Sidebar Nav | STORY-005 | 1 |
| FR-020 | Auth | STORY-006 | 1 |
| FR-021 | Responsividade/PWA | STORY-034, 035 | 2 |
| FR-022 | Dark Theme | STORY-001 | 1 |

**Coverage: 22/22 FRs (100%)**

---

## Risks and Mitigation

**High:**
- Kanban drag-and-drop (STORY-016): Componente mais complexo. **Mitigation:** Usar @hello-pangea/dnd ou dnd-kit com shadcn.
- Integração Mailjet (STORY-023): Depende de API key e testes reais. **Mitigation:** Testar com email pessoal primeiro.

**Medium:**
- Calendário drag-drop (STORY-014): Pode precisar lib externa. **Mitigation:** Pode ser adiado para Sprint 3 se necessário.
- Supabase free tier limits: 500MB storage. **Mitigation:** Monitorar uso, escalar se necessário.

**Low:**
- PWA (STORY-035): Nice-to-have, pode ser removido. **Mitigation:** Implementar apenas se sobrar tempo.

---

## Definition of Done

Para uma story ser considerada completa:
- [ ] Código implementado e commitado
- [ ] Funcionalidade testável no browser
- [ ] Layout consistente com dark theme
- [ ] Responsivo (desktop + mobile)
- [ ] API routes com validação de input
- [ ] Auth middleware aplicado
- [ ] Sem console.log em produção

---

## Next Steps

**Imediato:** Começar Sprint 1

Para implementar, executar na ordem:
1. STORY-001 → STORY-002 → STORY-003 → STORY-004 (infra, em paralelo possível)
2. STORY-005 → STORY-006 (layout + auth)
3. STORY-007, STORY-008, STORY-009, STORY-010 (páginas do Sprint 1)

**Sprint cadence:**
- Sprint length: 2 semanas
- Review: Final da sprint
- Cada sprint entrega valor usável

---

**This plan was created using BMAD Method v6 - Phase 4 (Implementation Planning)**
