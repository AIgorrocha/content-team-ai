# Arquitetura - Content Team AI

## Visao Geral

```
┌─────────────────────────────────────────────┐
│              Claude Code (CLI)               │
│                                              │
│  ┌──────────┐   spawna    ┌──────────────┐  │
│  │ Maestro  │ ──────────> │ Sub-agentes  │  │
│  │(ct-maestro)│           │ (12 agentes) │  │
│  └──────────┘             └──────────────┘  │
│       │                         │            │
│       v                         v            │
│  ┌──────────┐            ┌──────────────┐   │
│  │  Skills  │            │  MCP Servers  │   │
│  │ (7 skills)│           │(Supabase,etc)│   │
│  └──────────┘            └──────────────┘   │
└─────────────────────────────────────────────┘
         │                        │
         v                        v
┌────────────────┐    ┌────────────────────┐
│ APIs Externas  │    │     Supabase       │
│ (Instagram,    │    │  (30 tabelas ct_*) │
│  HeyGen, etc)  │    │                    │
└────────────────┘    └────────────────────┘
```

## Como Funciona a Orquestracao

1. Usuario faz pedido no Claude Code
2. CLAUDE.md direciona para ct-maestro
3. Maestro usa Agent tool para spawnar sub-agente correto
4. Sub-agente executa usando skills e MCP servers
5. Resultado volta para Maestro → Usuario

## MCP Servers

| Server | Funcao |
|--------|--------|
| Supabase | Banco de dados - 30 tabelas ct_* |
| Playwright | Screenshots para carrosseis |
| Obsidian | Knowledge base persistente |
| n8n | Crons e automacoes |

## Skills vs MCP

- **Skills** = instrucoes em .md que o agente segue (como receitas)
- **MCP Servers** = ferramentas externas que o agente pode chamar diretamente

## Banco de Dados

Supabase (PostgreSQL gerenciado) com 30 tabelas prefixadas `ct_*`.
Ver `references/database-schema.md` para schema completo.

## Crons

Claude Code nao tem crons nativos. Opcoes:
1. n8n workflows (recomendado)
2. crontab do sistema chamando `claude --agent`

Ver `crons/README.md` para detalhes.
