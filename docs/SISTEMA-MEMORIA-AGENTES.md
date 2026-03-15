# Sistema de Memoria dos Agentes — Content Team AI

Data: 2026-03-15

## Visao Geral

Sistema de memoria persistente em 2 camadas, inspirado no OpenClaw. Permite que os 13 agentes lembrem de execucoes anteriores e passem contexto entre si.

## Camada 1 — Arquivos Locais

| Arquivo | O que faz |
|---------|-----------|
| `memory/MEMORY.md` | Memoria de longo prazo (regras, preferencias, decisoes) |
| `memory/YYYY-MM-DD.md` | Log automatico do dia (append-only) |

## Camada 2 — Supabase

Tabela: `ct_agent_memory`

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | uuid | PK |
| agent | text | Nome do agente (ct-scout, ct-quill, etc) |
| category | text | resultado, decisao, aprendizado, contexto, handoff |
| content | text | Conteudo da memoria |
| metadata | jsonb | Dados extras (key_data, to_agent, etc) |
| session_id | text | Agrupa memorias de uma mesma execucao |
| created_at | timestamptz | Data/hora |

## 3 Tools Disponíveis

### memory_write
Salva uma memoria no log do dia + Supabase.
```json
{ "content": "texto", "category": "resultado", "agent": "ct-scout" }
```

### memory_read
Busca memorias por palavras-chave (arquivos + Supabase).
```json
{ "query": "concorrentes tendencias" }
```

### memory_handoff
Passa contexto estruturado entre agentes.
```json
{ "from_agent": "ct-scout", "to_agent": "ct-quill", "summary": "..." }
```

## Automatismos

- **loadMemoryContext()** — injeta MEMORY.md + ultimos 3 dias + handoffs no system prompt
- **flushAgentMemory()** — salva resumo ao encerrar cada agente
- **Graceful degradation** — se Supabase falhar, Camada 1 continua

## Testes

```bash
node scripts/sdk/tests/test-memory.mjs
# 66 testes passando
```

## Deploy na VPS

Os arquivos de memoria ficam em `/root/content-team-ai/memory/`.
Ao fazer `git pull`, tudo funciona automaticamente.
A tabela `ct_agent_memory` ja esta no Supabase (compartilhada).
