# Product Brief: Content Team AI

**Date:** 2026-03-10
**Author:** Igor Rocha
**Version:** 1.0
**Project Type:** web-app
**Project Level:** 3

---

## Executive Summary

Content Team AI é um time de 13 agentes de IA especializados que automatizam todo o ciclo de produção de conteúdo: pesquisa, criação, design, publicação, CRM e email marketing. O sistema é voltado para criadores de conteúdo e gestores não-técnicos que precisam escalar sua presença digital sem equipe humana. Após validação com o perfil @igorrocha.ia, será oferecido como produto white-label.

---

## Problem Statement

### The Problem

Criadores de conteúdo solo gastam 80%+ do tempo em tarefas operacionais (pesquisa, design, agendamento, email, CRM) e apenas 20% na estratégia e criação real. Não existe solução integrada que cubra todo o ciclo — da pesquisa de concorrentes até o envio de emails e gestão de leads — com automação inteligente por agentes especializados.

### Why Now?

- APIs de IA (HeyGen, LLMs, image generation) atingiram maturidade e custo acessível
- Criadores solo estão competindo contra equipes de 5-10 pessoas
- Ferramentas existentes são fragmentadas (Hootsuite, Mailchimp, Pipedrive separados)
- O nicho "IA na prática para gestores" está explodindo no Brasil

### Impact if Unsolved

- Criadores continuam limitados a 3-4 posts/semana em vez de diário multi-plataforma
- Leads esfriam por falta de follow-up automatizado
- Concorrentes com equipes maiores dominam o algoritmo
- Oportunidades de parceria e monetização são perdidas por falta de monitoramento

---

## Target Audience

### Primary Users

- **Igor Rocha (@igorrocha.ia)** — Criador de conteúdo sobre IA para gestores não-técnicos
- Perfil: Engenheiro civil, 30+, alto conhecimento de negócios, conhecimento técnico intermediário
- Publica em: Instagram, YouTube, LinkedIn, X, Email
- Estilo visual: Dark/minimalista (fundo #0D0D0D, fonte Inter)

### Secondary Users

- **Futuros clientes white-label** — Outros criadores de conteúdo solo que queiram o mesmo sistema
- Perfil: Não-técnicos, precisam de interface simples e visual
- Necessitam: Dashboard intuitivo, aprovação com 1 clique, métricas claras

### User Needs

1. **Automatizar pesquisa e criação** — Scraping de concorrentes, geração de copys, carrosséis e vídeos com avatar
2. **Gestão centralizada** — Dashboard único com calendário, CRM, email marketing e status dos agentes
3. **Controle sem complexidade** — Aprovar/rejeitar conteúdo, ver métricas, sem precisar programar

---

## Solution Overview

### Proposed Solution

Um dashboard Next.js com 13 páginas conectado a 13 agentes de IA especializados que se comunicam via banco de dados PostgreSQL. O content-director orquestra todos os agentes. O usuário interage apenas pelo dashboard (aprovar, agendar, configurar) e pelo content-director.

### Key Features

- **13 agentes especializados** com hierarquia clara (diretor → chefes → executores)
- **Dashboard dark/minimalista** com 13 páginas (overview, calendário, conteúdo, agentes, pipeline CRM, contatos, assinantes, campanhas, concorrentes, influenciadores, design system, settings)
- **Calendário de conteúdo** com drag-and-drop (mês/semana)
- **CRM Kanban** estilo Pipedrive (Lead → Won/Lost)
- **Email marketing** integrado com Mailjet (6k emails/mês grátis)
- **Scraping de concorrentes** diário (8 perfis Instagram)
- **Carrosséis automáticos** via Playwright (HTML→imagem, 1080x1350px)
- **Vídeos com avatar** via HeyGen API
- **Escuta social** via Manychat (DMs, welcome sequence)
- **Design system editável** (cores, fontes, logo, preview)
- **Cron jobs** para automações recorrentes

### Value Proposition

Transformar um criador solo em uma "equipe" de 13 especialistas por uma fração do custo, com controle total via interface visual simples.

---

## Business Objectives

### Goals

- Automatizar 80% das tarefas operacionais de conteúdo em 60 dias
- Publicar conteúdo diário em 5 plataformas (Instagram, YouTube, LinkedIn, X, Email)
- Capturar e nutrir leads automaticamente via email sequences e DMs
- Monitorar 8 concorrentes diariamente com análise de conteúdo viral
- Após validação, oferecer como SaaS white-label para outros criadores

### Success Metrics

- Frequência de publicação: de 3-4/semana para 1+/dia por plataforma
- Taxa de aprovação de conteúdo gerado: >70% aprovado de primeira
- Leads capturados/mês via lead magnets e DMs
- Taxa de abertura de emails: >25%
- Tempo do Igor em tarefas operacionais: redução de 80% para 20%

### Business Value

- **Curto prazo:** Escalar presença digital sem contratar equipe (economia de R$10-15k/mês)
- **Médio prazo:** Monetizar audiência maior com produtos e serviços
- **Longo prazo:** Receita recorrente como SaaS white-label

---

## Scope

### In Scope

- Dashboard Next.js 14 com App Router, TypeScript, Tailwind, shadcn/ui
- 18 tabelas PostgreSQL (prefixo ct_*) no Supabase
- 13 agentes de IA com hierarquia e comunicação via ct_tasks
- Integração Mailjet (email marketing gratuito)
- Integração Manychat (escuta social, DMs)
- Integração HeyGen (vídeos com avatar)
- Integração RapidAPI (scraping Instagram)
- Cron jobs para automações recorrentes
- Design system dark/minimalista editável
- CRM pipeline Kanban
- Calendário de conteúdo com agendamento

### Out of Scope

- App mobile nativo (será PWA responsivo)
- Publicação automática direta nas redes (apenas agendamento + links)
- Edição avançada de vídeo (apenas geração via HeyGen)
- Integração com plataformas de pagamento
- Multi-tenancy completo (apenas preparação para white-label)
- Treinamento de modelos de IA custom

### Future Considerations

- White-label SaaS com multi-tenancy
- Publicação automática via APIs oficiais (Meta, LinkedIn, X)
- Analytics avançado com BI integrado
- Marketplace de templates de conteúdo
- App mobile nativo (React Native)

---

## Key Stakeholders

- **Igor Rocha (Fundador/Usuário)** — Influência Alta. Único decisor, usuário principal, define prioridades e aprova conteúdo.

---

## Constraints and Assumptions

### Constraints

- Budget limitado: usar ferramentas gratuitas ou baixo custo (Mailjet free, Vercel free, Manychat $15/mo)
- Igor não é programador: interface deve ser extremamente simples
- HeyGen API é pay-as-you-go: controlar custos de geração de vídeo
- RapidAPI pode ter rate limits e custos variáveis
- Mailjet free tier: máximo 6.000 emails/mês

### Assumptions

- Supabase PostgreSQL já disponível (projeto ianapratica, us-east-1)
- APIs externas (HeyGen, RapidAPI, Mailjet, Manychat) estarão disponíveis e estáveis
- O usuário terá API keys válidas para todos os serviços
- Next.js + shadcn/ui no Replit consegue rodar o dashboard
- Agentes de IA rodarão via OpenClaw ou sistema custom no servidor VPS

---

## Success Criteria

- Dashboard funcional com todas as 13 páginas navegáveis
- 13 agentes operando com delegação automática via content-director
- Conteúdo sendo gerado, aprovado e agendado pelo dashboard
- CRM pipeline registrando leads e movendo entre stages
- Email marketing enviando campanhas e sequences automaticamente
- Scraping diário de 8 concorrentes com análise
- Cron jobs executando sem falhas
- Igor consegue operar tudo sozinho sem suporte técnico

---

## Timeline and Milestones

### Target Launch

MVP (Fase 1) em 2 semanas. Sistema completo (4 fases) em 6-8 semanas.

### Key Milestones

- **Fase 1 (Semanas 1-2):** Infraestrutura — DB, 3 primeiros agentes, dashboard skeleton (5 páginas)
- **Fase 2 (Semanas 3-4):** Produção — design-director, copywriter, carousel-creator, clone-agent, content-curator
- **Fase 3 (Semanas 5-6):** Audiência — listening-director, audience-director, channel-controller, CRM, email
- **Fase 4 (Semanas 7-8):** Monitoramento — relations-manager, tech-chief, settings completo, polish

---

## Risks and Mitigation

- **Risk:** APIs externas fora do ar ou mudanças de preço
  - **Likelihood:** Medium
  - **Mitigation:** Abstrair integrações com interface comum, ter fallbacks manuais

- **Risk:** Custos de HeyGen escalam rápido com muitos vídeos
  - **Likelihood:** High
  - **Mitigation:** Limitar geração de vídeos, aprovação obrigatória antes de gerar

- **Risk:** Scraping Instagram bloqueado ou limitado
  - **Likelihood:** Medium
  - **Mitigation:** Usar múltiplos providers RapidAPI, cache agressivo, reduzir frequência

- **Risk:** Qualidade do conteúdo gerado por IA insuficiente
  - **Likelihood:** Medium
  - **Mitigation:** Fluxo de aprovação obrigatório, feedback loop para melhorar prompts

- **Risk:** Complexidade de 13 agentes dificulta manutenção
  - **Likelihood:** Low
  - **Mitigation:** Hierarquia clara, comunicação apenas via ct_tasks, logs em ct_audit_log

---

## Next Steps

1. Create Product Requirements Document (PRD) - `/prd`
2. Create System Architecture - `/architecture`
3. Sprint Planning - `/sprint-planning`

---

**This document was created using BMAD Method v6 - Phase 1 (Analysis)**

*To continue: Run `/workflow-status` to see your progress and next recommended workflow.*
