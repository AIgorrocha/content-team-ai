---
tags:
  - projeto
  - content-team
  - dashboard
created: '2026-03-06'
---
# Dashboard Content Team - Especificacoes

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui (dark theme default)
- PostgreSQL direto (milo_db, tabelas ct_*)
- Auth: token simples
- Deploy: Vercel (free) ou VPS porta 3100
- Mobile: Responsive + PWA

## Paginas

| Rota | Descricao | Fase |
|------|-----------|------|
| `/` | Visao geral (status agentes, proximo conteudo, pipeline, stats) | 1 |
| `/calendar` | Calendario de conteudo (mes/semana, drag-and-drop) | 1 |
| `/content` | Lista de conteudos com filtros (status, plataforma, tipo) | 1 |
| `/content/[id]` | Detalhe do conteudo (preview, aprovar/rejeitar) | 2 |
| `/agents` | Status dos agentes, historico de tarefas, workload | 1 |
| `/pipeline` | CRM Kanban (drag deals entre stages, estilo Pipedrive) | 3 |
| `/contacts` | Lista de contatos + detalhes | 3 |
| `/subscribers` | Assinantes de email + segmentos | 3 |
| `/campaigns` | Campanhas de email + criar/editar | 3 |
| `/competitors` | Dashboard monitoramento concorrentes | 3 |
| `/influencers` | Lista influenciadores + colaboracoes | 4 |
| `/design` | Editor design system (cores, fontes, logo, preview carrossel) | 2 |
| `/settings` | Integracoes, API keys, cron jobs, skills, plugins, docs | 4 |

## Design System Default

```json
{
  "colors": {
    "bg": "#0D0D0D",
    "surface": "#1A1A1A",
    "text": "#FFFFFF",
    "textSecondary": "#A0A0A0",
    "accent": "#4A90D9",
    "accent2": "#7C3AED",
    "success": "#10B981",
    "error": "#EF4444"
  },
  "fonts": {
    "primary": "Inter",
    "secondary": "Space Grotesk",
    "mono": "JetBrains Mono"
  },
  "carousel": {
    "bgColor": "#0D0D0D",
    "textColor": "#FFFFFF",
    "font": "Inter",
    "profilePhotoPosition": "bottom-left",
    "slideWidth": 1080,
    "slideHeight": 1350,
    "maxSlides": 10,
    "style": "quote-minimalist"
  }
}
```

## CRM Pipeline (Pipedrive-style)

Stages: Lead -> Qualified -> Proposal -> Negotiation -> Won / Lost
Kanban drag-and-drop entre colunas.
Cada deal mostra: contato, valor, data esperada, ultima atividade.
