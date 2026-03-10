# Product Requirements Document: Content Team AI

**Date:** 2026-03-10
**Author:** Igor Rocha
**Version:** 1.0
**Project Type:** web-app
**Project Level:** 3
**Status:** Draft

---

## Document Overview

This Product Requirements Document (PRD) defines the functional and non-functional requirements for Content Team AI. It serves as the source of truth for what will be built and provides traceability from requirements through implementation.

**Related Documents:**
- Product Brief: docs/product-brief-content-team-ai-2026-03-10.md

---

## Executive Summary

Content Team AI é um dashboard web com 13 agentes de IA especializados que automatizam o ciclo completo de produção de conteúdo: pesquisa de concorrentes, criação de copys/carrosséis/vídeos, agendamento, CRM de leads, email marketing e monitoramento de influenciadores. O sistema é construído com Next.js 14, PostgreSQL (18 tabelas ct_*) e integrações com Mailjet, Manychat, HeyGen e RapidAPI.

---

## Product Goals

### Business Objectives

- Automatizar 80% das tarefas operacionais de conteúdo em 60 dias
- Publicar conteúdo diário em 5 plataformas (Instagram, YouTube, LinkedIn, X, Email)
- Capturar e nutrir leads automaticamente via email sequences e DMs
- Monitorar 8 concorrentes diariamente
- Preparar para oferta white-label como SaaS

### Success Metrics

- Frequência de publicação: de 3-4/semana para 1+/dia por plataforma
- Taxa de aprovação de conteúdo gerado: >70% aprovado de primeira
- Leads capturados/mês via lead magnets e DMs: crescimento 50% MoM
- Taxa de abertura de emails: >25%
- Tempo em tarefas operacionais: redução de 80% para 20%

---

## Functional Requirements

Functional Requirements (FRs) define **what** the system does - specific features and behaviors.

---

### FR-001: Dashboard Overview

**Priority:** Must Have

**Description:**
Página principal (/) mostra visão geral: status dos 13 agentes (online/idle/error), próximo conteúdo agendado, resumo do pipeline CRM (deals por stage), e stats gerais (posts esta semana, leads capturados, emails enviados).

**Acceptance Criteria:**
- [ ] Cards de status para cada agente com indicador visual (verde/amarelo/vermelho)
- [ ] Widget "Próximo Conteúdo" com título, plataforma e horário
- [ ] Mini pipeline mostrando contagem de deals por stage
- [ ] Stats cards com números da semana atual
- [ ] Atualização automática a cada 30 segundos

---

### FR-002: Calendário de Conteúdo

**Priority:** Must Have

**Description:**
Página /calendar com visualização mensal e semanal do calendário editorial. Exibe conteúdos agendados por plataforma com cores distintas. Suporta drag-and-drop para reagendar.

**Acceptance Criteria:**
- [ ] Visualização mensal com grid de dias
- [ ] Visualização semanal com slots por hora
- [ ] Toggle entre mês/semana
- [ ] Cada item mostra: título, plataforma (ícone), status (cor)
- [ ] Drag-and-drop para mover conteúdo entre datas
- [ ] Click abre detalhes do conteúdo

---

### FR-003: Lista de Conteúdos

**Priority:** Must Have

**Description:**
Página /content com lista filtrada de todos os conteúdos (ct_content_items). Filtros por status (idea, draft, review, approved, scheduled, published), plataforma, tipo de conteúdo e data.

**Acceptance Criteria:**
- [ ] Tabela/lista com: título, tipo, plataforma, status, data agendada
- [ ] Filtros: status, plataforma, tipo, data range
- [ ] Busca por texto no título/caption
- [ ] Ordenação por data, status, plataforma
- [ ] Botão criar novo conteúdo
- [ ] Paginação (20 itens por página)

---

### FR-004: Detalhe do Conteúdo

**Priority:** Must Have

**Description:**
Página /content/[id] mostra preview completo do conteúdo com opções de aprovar/rejeitar. Exibe caption, mídia, hashtags, script, notas visuais. Permite editar antes de aprovar.

**Acceptance Criteria:**
- [ ] Preview do conteúdo (texto + mídia se disponível)
- [ ] Campos editáveis: caption, hashtags, script, visual notes
- [ ] Botões: Aprovar, Rejeitar (com motivo), Editar
- [ ] Histórico de alterações
- [ ] Status do agente que criou
- [ ] Link para publicação se já publicado

---

### FR-005: Painel de Agentes

**Priority:** Must Have

**Description:**
Página /agents mostra status detalhado de cada um dos 13 agentes. Inclui: status atual, última atividade, tarefas pendentes, tarefas concluídas, workload (tarefas ativas).

**Acceptance Criteria:**
- [ ] Card por agente com: nome, role, status, último ativo
- [ ] Contadores: tarefas pendentes, em andamento, concluídas
- [ ] Indicador de workload (baixo/médio/alto)
- [ ] Click expande histórico de tarefas do agente
- [ ] Filtro por status do agente (all, active, idle, error)

---

### FR-006: Gestão de Tarefas dos Agentes

**Priority:** Must Have

**Description:**
Dentro de /agents, visualizar e criar tarefas (ct_tasks) para agentes. Tarefas têm hierarquia (parent_task_id), prioridade e resultado.

**Acceptance Criteria:**
- [ ] Lista de tarefas por agente com status
- [ ] Criar tarefa manual: título, descrição, agente, prioridade, prazo
- [ ] Visualizar resultado (JSONB) de tarefas concluídas
- [ ] Tarefas filhas aninhadas sob tarefa pai
- [ ] Cancelar tarefa pendente

---

### FR-007: CRM Pipeline Kanban

**Priority:** Must Have

**Description:**
Página /pipeline com board Kanban estilo Pipedrive. Colunas = stages (Lead, Qualified, Proposal, Negotiation, Won, Lost). Cards = deals com drag-and-drop entre colunas.

**Acceptance Criteria:**
- [ ] 6 colunas representando stages com cores distintas
- [ ] Card de deal mostra: contato, título, valor, data esperada
- [ ] Drag-and-drop move deal entre stages
- [ ] Somatório de valor por stage no header da coluna
- [ ] Click no card abre detalhes do deal
- [ ] Botão adicionar novo deal

---

### FR-008: Gestão de Contatos

**Priority:** Must Have

**Description:**
Página /contacts com lista de contatos (ct_contacts). CRUD completo com filtros por tags, fonte e busca.

**Acceptance Criteria:**
- [ ] Lista: nome, email, Instagram, empresa, tags, fonte
- [ ] Criar/editar contato com todos os campos
- [ ] Filtros: tags, fonte (instagram, email, manual, etc.)
- [ ] Busca por nome, email, empresa
- [ ] Ver deals associados ao contato
- [ ] Ver atividades recentes do contato

---

### FR-009: Lista de Assinantes

**Priority:** Must Have

**Description:**
Página /subscribers mostra assinantes de email (ct_subscribers) com segmentação por tags e status.

**Acceptance Criteria:**
- [ ] Lista: email, nome, fonte, lead magnet, tags, status, data
- [ ] Filtros: status (active, unsubscribed), tags, fonte
- [ ] Busca por email/nome
- [ ] Importar assinantes (CSV)
- [ ] Exportar lista
- [ ] Ver de qual lead magnet veio

---

### FR-010: Campanhas de Email

**Priority:** Must Have

**Description:**
Página /campaigns para criar e gerenciar campanhas de email (ct_email_campaigns). Editor de email com preview. Envio via Mailjet.

**Acceptance Criteria:**
- [ ] Lista de campanhas: nome, status, data envio, stats
- [ ] Criar campanha: nome, subject, body (HTML editor simples), tags destinatários
- [ ] Preview do email antes de enviar
- [ ] Agendar envio
- [ ] Stats pós-envio: enviados, abertos, clicados (via Mailjet)
- [ ] Status: draft, scheduled, sending, sent

---

### FR-011: Sequences de Email

**Priority:** Should Have

**Description:**
Dentro de /campaigns, gerenciar sequences automáticas (ct_email_sequences + ct_email_sequence_steps). Cada sequence tem trigger, steps com delay.

**Acceptance Criteria:**
- [ ] Lista de sequences: nome, trigger, steps, ativa/inativa
- [ ] Criar sequence: nome, trigger event, ativar/desativar
- [ ] Adicionar steps: ordem, delay (horas), subject, body
- [ ] Visualização timeline dos steps
- [ ] Toggle ativar/desativar sequence

---

### FR-012: Monitoramento de Concorrentes

**Priority:** Must Have

**Description:**
Página /competitors mostra dashboard de monitoramento dos 8 concorrentes. Posts recentes, análise de engajamento, posts virais destacados.

**Acceptance Criteria:**
- [ ] Card por concorrente: handle, último scrape, post count
- [ ] Lista de posts recentes com: caption (truncada), tipo, engajamento, data
- [ ] Destaque para posts virais (is_viral = true)
- [ ] Filtro por concorrente, tipo de post, período
- [ ] Análise textual do post (campo analysis)
- [ ] Indicador de última atualização do scraping

---

### FR-013: Gestão de Influenciadores

**Priority:** Should Have

**Description:**
Página /influencers com lista de influenciadores (ct_influencers) e colaborações (ct_collaborations).

**Acceptance Criteria:**
- [ ] Lista: nome, handles, nicho, seguidores, status, último contato
- [ ] CRUD de influenciador
- [ ] Criar colaboração: tipo, status, data, notas
- [ ] Filtro por status (prospect, contacted, active, inactive)
- [ ] Link para conteúdo gerado em colaboração

---

### FR-014: Editor de Design System

**Priority:** Should Have

**Description:**
Página /design para visualizar e editar o design system (ct_design_system). Cores, fontes, estilo de carrossel, brand voice. Preview em tempo real.

**Acceptance Criteria:**
- [ ] Color pickers para todas as cores do sistema
- [ ] Seletor de fontes (primary, secondary, mono)
- [ ] Editor de estilo de carrossel com preview
- [ ] Editor de brand voice (textarea)
- [ ] Botão salvar alterações
- [ ] Preview de carrossel com design atual

---

### FR-015: Página de Settings

**Priority:** Should Have

**Description:**
Página /settings com configurações: API keys, integrações, cron jobs, informações dos agentes.

**Acceptance Criteria:**
- [ ] Seção API Keys: HeyGen, RapidAPI, Mailjet, Manychat (mascaradas)
- [ ] Seção Integrações: status de cada serviço (conectado/desconectado)
- [ ] Seção Cron Jobs: lista com horário, agente, descrição, ativo/inativo
- [ ] Seção Agentes: configuração JSONB de cada agente
- [ ] Testar conexão com cada API

---

### FR-016: Séries de Conteúdo

**Priority:** Could Have

**Description:**
Gerenciar séries de conteúdo (ct_content_series) para agrupar posts relacionados em sequência.

**Acceptance Criteria:**
- [ ] CRUD de séries: nome, descrição, frequência, plataformas
- [ ] Associar conteúdos a uma série com número de sequência
- [ ] Visualizar série como timeline
- [ ] Ativar/desativar série

---

### FR-017: Lead Magnets

**Priority:** Should Have

**Description:**
Gerenciar lead magnets (ct_lead_magnets) usados para capturar assinantes.

**Acceptance Criteria:**
- [ ] Lista: nome, URL, downloads, ativo/inativo
- [ ] CRUD com: nome, descrição, arquivo URL, landing page URL
- [ ] Contagem de downloads
- [ ] Ver assinantes que vieram de cada lead magnet

---

### FR-018: Audit Log

**Priority:** Should Have

**Description:**
Visualizar log de auditoria (ct_audit_log) para rastrear ações dos agentes.

**Acceptance Criteria:**
- [ ] Lista cronológica: agente, ação, alvo, detalhes, data
- [ ] Filtro por agente, ação, período
- [ ] Busca nos detalhes
- [ ] Exportar logs

---

### FR-019: Sidebar Navigation

**Priority:** Must Have

**Description:**
Sidebar fixa com navegação para todas as 13 páginas. Collapsible, com ícones Lucide, indicador de página ativa.

**Acceptance Criteria:**
- [ ] Links para todas as rotas com ícones
- [ ] Indicador visual da página atual
- [ ] Collapse/expand no mobile
- [ ] Agrupamento: Main (overview, calendar, content, agents), CRM (pipeline, contacts), Marketing (subscribers, campaigns), Intelligence (competitors, influencers), System (design, settings)

---

### FR-020: Autenticação Simples

**Priority:** Must Have

**Description:**
Proteção por token simples. Tela de login com senha/token que libera acesso ao dashboard.

**Acceptance Criteria:**
- [ ] Tela de login com campo de token
- [ ] Validação contra variável de ambiente AUTH_TOKEN
- [ ] Cookie/session para manter autenticado
- [ ] Redirect para login se não autenticado
- [ ] Botão logout

---

### FR-021: Responsividade e PWA

**Priority:** Should Have

**Description:**
Dashboard responsivo para mobile e configurado como PWA para instalação.

**Acceptance Criteria:**
- [ ] Layout adapta para mobile (sidebar vira menu hamburger)
- [ ] Tabelas viram cards no mobile
- [ ] Manifest.json para PWA
- [ ] Ícone e splash screen

---

### FR-022: Dark Theme Padrão

**Priority:** Must Have

**Description:**
Todo o dashboard usa tema dark por padrão com as cores do design system (#0D0D0D bg, #1A1A1A surface, etc.).

**Acceptance Criteria:**
- [ ] Background #0D0D0D
- [ ] Surface/cards #1A1A1A
- [ ] Texto primário #FFFFFF
- [ ] Texto secundário #A0A0A0
- [ ] Accent #4A90D9
- [ ] Fonte Inter como padrão

---

## Non-Functional Requirements

Non-Functional Requirements (NFRs) define **how** the system performs - quality attributes and constraints.

---

### NFR-001: Performance - Page Load

**Priority:** Must Have

**Description:**
Todas as páginas do dashboard devem carregar em menos de 2 segundos na primeira visita e menos de 500ms em navegação subsequente (client-side routing).

**Acceptance Criteria:**
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 2s
- [ ] Client-side navigation < 500ms

**Rationale:** Usuário não-técnico espera interface rápida e responsiva.

---

### NFR-002: Performance - API Response

**Priority:** Must Have

**Description:**
API routes devem responder em menos de 500ms para operações CRUD simples. Queries com joins complexos (pipeline, dashboard) em menos de 1s.

**Acceptance Criteria:**
- [ ] CRUD simples < 500ms (p95)
- [ ] Queries complexas < 1000ms (p95)
- [ ] Paginação obrigatória para listas > 50 itens

**Rationale:** Dashboard precisa ser fluido para uso diário.

---

### NFR-003: Security - Authentication

**Priority:** Must Have

**Description:**
Acesso protegido por token. Nenhuma rota de API acessível sem autenticação válida.

**Acceptance Criteria:**
- [ ] Todas as rotas /api/* validam token
- [ ] Token armazenado em httpOnly cookie
- [ ] Session expira após 7 dias
- [ ] Variáveis sensíveis apenas em .env (nunca no código)

**Rationale:** Dashboard contém dados de negócio e credenciais de APIs externas.

---

### NFR-004: Security - API Keys

**Priority:** Must Have

**Description:**
API keys de serviços externos (HeyGen, Mailjet, etc.) armazenadas apenas em variáveis de ambiente. Nunca expostas no frontend.

**Acceptance Criteria:**
- [ ] API keys apenas em .env
- [ ] Frontend nunca recebe keys — chamadas via API routes do Next.js
- [ ] Settings mostra keys mascaradas (****xxx)

**Rationale:** Proteger credenciais contra exposição.

---

### NFR-005: Usability - Simplicity

**Priority:** Must Have

**Description:**
Interface projetada para usuário não-técnico. Ações em no máximo 3 cliques. Textos claros sem jargão.

**Acceptance Criteria:**
- [ ] Qualquer ação principal alcançável em ≤3 cliques
- [ ] Labels descritivos (não técnicos)
- [ ] Feedback visual para todas as ações (toast/notification)
- [ ] Loading states para operações assíncronas

**Rationale:** O usuário principal não é programador.

---

### NFR-006: Reliability - Data Integrity

**Priority:** Must Have

**Description:**
Todas as operações de escrita no banco usam transactions. Audit log registra todas as ações dos agentes.

**Acceptance Criteria:**
- [ ] Mutations em transaction
- [ ] Audit log para todas as ações de agentes
- [ ] Soft delete para dados críticos (deals, contacts)

**Rationale:** Dados de CRM e conteúdo são ativos do negócio.

---

### NFR-007: Compatibility - Browsers

**Priority:** Should Have

**Description:**
Dashboard funciona nos browsers modernos: Chrome 90+, Firefox 90+, Safari 15+, Edge 90+.

**Acceptance Criteria:**
- [ ] Funcional nos 4 browsers listados
- [ ] Sem erros de console críticos
- [ ] Layout consistente

**Rationale:** Usuário pode acessar de qualquer dispositivo.

---

### NFR-008: Maintainability - Code Quality

**Priority:** Should Have

**Description:**
TypeScript strict mode. Componentes React pequenos e reutilizáveis. Types para todas as 18 tabelas.

**Acceptance Criteria:**
- [ ] TypeScript strict: true
- [ ] Interfaces para todas as entidades do banco
- [ ] Componentes < 200 linhas
- [ ] Utilitários compartilhados em /lib

**Rationale:** Facilitar manutenção e evolução do sistema.

---

## Epics

---

### EPIC-001: Dashboard Core & Navigation

**Description:**
Estrutura base do dashboard: layout, sidebar, autenticação, dark theme, overview page.

**Functional Requirements:**
- FR-001 (Dashboard Overview)
- FR-019 (Sidebar Navigation)
- FR-020 (Autenticação Simples)
- FR-022 (Dark Theme)

**Story Count Estimate:** 5-7

**Priority:** Must Have

**Business Value:**
Base para todo o sistema. Sem isso, nenhuma outra feature funciona.

---

### EPIC-002: Content Management

**Description:**
Calendário de conteúdo, lista, detalhe com aprovação, séries de conteúdo.

**Functional Requirements:**
- FR-002 (Calendário)
- FR-003 (Lista de Conteúdos)
- FR-004 (Detalhe do Conteúdo)
- FR-016 (Séries de Conteúdo)

**Story Count Estimate:** 6-8

**Priority:** Must Have

**Business Value:**
Core do produto — onde o conteúdo é visualizado, aprovado e agendado.

---

### EPIC-003: Agent Management

**Description:**
Painel de status dos 13 agentes, criação/visualização de tarefas, workload monitoring.

**Functional Requirements:**
- FR-005 (Painel de Agentes)
- FR-006 (Gestão de Tarefas)
- FR-018 (Audit Log)

**Story Count Estimate:** 4-6

**Priority:** Must Have

**Business Value:**
Visibilidade e controle sobre o que os agentes estão fazendo.

---

### EPIC-004: CRM Pipeline

**Description:**
Board Kanban para deals, gestão de contatos, atividades.

**Functional Requirements:**
- FR-007 (Pipeline Kanban)
- FR-008 (Gestão de Contatos)

**Story Count Estimate:** 5-7

**Priority:** Must Have

**Business Value:**
Converter audiência em clientes. Pipeline = receita.

---

### EPIC-005: Email Marketing

**Description:**
Assinantes, campanhas, sequences, lead magnets. Integração Mailjet.

**Functional Requirements:**
- FR-009 (Assinantes)
- FR-010 (Campanhas)
- FR-011 (Sequences)
- FR-017 (Lead Magnets)

**Story Count Estimate:** 6-8

**Priority:** Must Have

**Business Value:**
Email é o canal com maior ROI. Nurture automatizado = vendas.

---

### EPIC-006: Competitive Intelligence

**Description:**
Dashboard de monitoramento de concorrentes, posts scraped, análise de virais.

**Functional Requirements:**
- FR-012 (Monitoramento Concorrentes)

**Story Count Estimate:** 3-4

**Priority:** Must Have

**Business Value:**
Saber o que funciona no mercado antes de criar conteúdo.

---

### EPIC-007: Influencer Relations

**Description:**
Lista de influenciadores, colaborações, tracking de parcerias.

**Functional Requirements:**
- FR-013 (Gestão de Influenciadores)

**Story Count Estimate:** 2-3

**Priority:** Should Have

**Business Value:**
Parcerias ampliam alcance sem custo de ads.

---

### EPIC-008: Design System & Settings

**Description:**
Editor de design system, settings de integração, API keys, cron jobs.

**Functional Requirements:**
- FR-014 (Editor Design System)
- FR-015 (Settings)
- FR-021 (Responsividade/PWA)

**Story Count Estimate:** 4-5

**Priority:** Should Have

**Business Value:**
Customização e configuração central do sistema.

---

## User Stories (High-Level)

### EPIC-001 Stories
- Como Igor, quero ver o status de todos os agentes na tela principal para saber se tudo está funcionando
- Como Igor, quero navegar entre as páginas do dashboard com um menu lateral para acessar qualquer seção em 1 clique
- Como Igor, quero que o dashboard seja protegido por senha para que só eu tenha acesso

### EPIC-002 Stories
- Como Igor, quero ver meu calendário de conteúdo do mês para planejar publicações
- Como Igor, quero aprovar ou rejeitar conteúdo gerado pelos agentes para manter controle de qualidade
- Como Igor, quero arrastar conteúdo no calendário para reagendar facilmente

### EPIC-003 Stories
- Como Igor, quero ver quais tarefas cada agente está executando para acompanhar o trabalho
- Como Igor, quero criar tarefas manuais para agentes quando preciso de algo específico

### EPIC-004 Stories
- Como Igor, quero mover deals entre colunas do Kanban arrastando para atualizar o status
- Como Igor, quero ver todos os dados de um contato (deals, atividades) em um lugar só

### EPIC-005 Stories
- Como Igor, quero criar e enviar campanhas de email para minha lista de assinantes
- Como Igor, quero configurar sequences automáticas para novos assinantes

### EPIC-006 Stories
- Como Igor, quero ver os posts mais recentes dos concorrentes para me inspirar
- Como Igor, quero saber quais posts viralizaram para entender o que funciona

### EPIC-007 Stories
- Como Igor, quero listar influenciadores do meu nicho para buscar parcerias

### EPIC-008 Stories
- Como Igor, quero editar as cores e fontes do design system para manter minha identidade visual
- Como Igor, quero ver e testar minhas integrações (Mailjet, HeyGen, etc.) na página de settings

---

## User Personas

### Igor Rocha (Primary)
- **Role:** Criador de conteúdo, fundador @igorrocha.ia
- **Tech Level:** Intermediário (entende lógica, não programa)
- **Goals:** Escalar produção de conteúdo, automatizar operacional
- **Frustrations:** Perder tempo em tarefas repetitivas, ferramentas fragmentadas
- **Platforms:** Instagram, YouTube, LinkedIn, X, Email

### Future White-Label User (Secondary)
- **Role:** Criador de conteúdo solo
- **Tech Level:** Baixo a intermediário
- **Goals:** Mesmos do Igor — automatizar conteúdo
- **Frustrations:** Não tem equipe, não sabe programar

---

## User Flows

### Flow 1: Aprovar Conteúdo
1. Igor abre Dashboard → vê card "3 conteúdos aguardando aprovação"
2. Clica → vai para /content com filtro status=review
3. Clica em um conteúdo → /content/[id]
4. Vê preview, edita caption se necessário
5. Clica "Aprovar" → status muda para approved, agenda automaticamente

### Flow 2: Gerenciar Pipeline
1. Igor abre /pipeline → vê board Kanban
2. Novo lead aparece na coluna "Lead"
3. Arrasta para "Qualified" após qualificação
4. Clica no card → vê detalhes, adiciona nota
5. Move para "Proposal" → "Negotiation" → "Won"

### Flow 3: Criar Campanha de Email
1. Igor abre /campaigns → clica "Nova Campanha"
2. Preenche: nome, subject, seleciona tags de destinatários
3. Escreve body no editor
4. Clica "Preview" → vê como fica
5. Clica "Agendar" → define data/hora → campanha salva

---

## Dependencies

### Internal Dependencies

- Banco PostgreSQL (Supabase) com 18 tabelas ct_* criadas
- 13 agentes de IA configurados e operacionais
- Cron jobs registrados e executando

### External Dependencies

- **Mailjet API** — Email sending (free 6k/mês)
- **Manychat API** — DMs Instagram ($15/mês)
- **HeyGen API** — Avatar video generation (pay-as-you-go)
- **RapidAPI** — Instagram scraping (variável)
- **Vercel/VPS** — Hosting do dashboard

---

## Assumptions

- Supabase PostgreSQL já disponível (projeto ianapratica)
- APIs externas estarão acessíveis e com preços estáveis
- Igor fornecerá API keys para todos os serviços
- shadcn/ui suporta todos os componentes necessários (Kanban, calendar, etc.)
- Replit conseguirá buildar e rodar o Next.js app

---

## Out of Scope

- App mobile nativo
- Publicação automática direta nas redes sociais
- Edição avançada de vídeo
- Integração com plataformas de pagamento
- Multi-tenancy completo
- Treinamento de modelos de IA custom
- Analytics avançado com BI

---

## Open Questions

1. Qual provider RapidAPI específico para scraping Instagram?
2. Limite de créditos HeyGen por mês?
3. Domínio personalizado para o dashboard?
4. Backup strategy para o banco?

---

## Approval & Sign-off

### Stakeholders

- **Igor Rocha (Fundador)** — Influência Alta. Único decisor e usuário principal.

### Approval Status

- [ ] Igor Rocha (Product Owner)

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-10 | Igor Rocha | Initial PRD |

---

## Next Steps

### Phase 3: Architecture

Run `/architecture` to create system architecture based on these requirements.

### Phase 4: Sprint Planning

After architecture is complete, run `/sprint-planning` to break epics into stories.

---

**This document was created using BMAD Method v6 - Phase 2 (Planning)**

---

## Appendix A: Requirements Traceability Matrix

| Epic ID | Epic Name | Functional Requirements | Story Count (Est.) |
|---------|-----------|-------------------------|-------------------|
| EPIC-001 | Dashboard Core & Navigation | FR-001, FR-019, FR-020, FR-022 | 5-7 |
| EPIC-002 | Content Management | FR-002, FR-003, FR-004, FR-016 | 6-8 |
| EPIC-003 | Agent Management | FR-005, FR-006, FR-018 | 4-6 |
| EPIC-004 | CRM Pipeline | FR-007, FR-008 | 5-7 |
| EPIC-005 | Email Marketing | FR-009, FR-010, FR-011, FR-017 | 6-8 |
| EPIC-006 | Competitive Intelligence | FR-012 | 3-4 |
| EPIC-007 | Influencer Relations | FR-013 | 2-3 |
| EPIC-008 | Design System & Settings | FR-014, FR-015, FR-021 | 4-5 |
| **TOTAL** | | **22 FRs** | **35-48 stories** |

---

## Appendix B: Prioritization Details

| Priority | FRs | NFRs | Total |
|----------|-----|------|-------|
| Must Have | 12 (FR-001 to FR-008, FR-012, FR-019, FR-020, FR-022) | 6 (NFR-001 to NFR-006) | 18 |
| Should Have | 7 (FR-009 to FR-011, FR-013 to FR-015, FR-017, FR-018, FR-021) | 2 (NFR-007, NFR-008) | 9 |
| Could Have | 1 (FR-016) | 0 | 1 |
| **Total** | **22** | **8** | **30** |
