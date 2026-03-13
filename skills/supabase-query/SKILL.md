---
name: supabase-query
description: "Consultar e gerenciar dados nas tabelas ct_* via Supabase MCP"
---
# Supabase Query - Acesso ao Banco de Dados

Consulta e gerencia dados nas 30 tabelas `ct_*` usando o Supabase MCP server.

## Como Usar

Use as ferramentas do Supabase MCP (execute_sql, list_tables, etc.) para interagir com o banco.

## Tabelas Principais

| Tabela | Funcao |
|--------|--------|
| ct_agents | 13 agentes cadastrados |
| ct_content_items | Conteudos (posts, carrosseis, videos) |
| ct_tasks | Tarefas delegadas entre agentes |
| ct_competitors | 8 concorrentes monitorados |
| ct_design_system | Identidade visual |
| ct_pipeline_stages | Etapas CRM (Lead→Won) |
| ct_contacts | Contatos CRM |
| ct_deals | Negocios |
| ct_subscribers | Assinantes email |
| ct_email_campaigns | Campanhas email |
| ct_email_sequences | Sequencias automaticas |
| ct_influencers | Influenciadores |

## Regras

- Preferir queries READ-ONLY (SELECT) por seguranca
- Sempre usar LIMIT em SELECTs
- Confirmar com usuario antes de INSERT/UPDATE/DELETE
- Nunca expor senhas ou API keys do banco
- Nunca rodar DROP ou TRUNCATE sem confirmacao explicita

## Exemplos

```sql
-- Listar conteudos agendados
SELECT title, platform, scheduled_at FROM ct_content_items WHERE status = 'scheduled' ORDER BY scheduled_at;

-- Contar agentes ativos
SELECT COUNT(*) FROM ct_agents WHERE status = 'idle';

-- Buscar concorrentes
SELECT handle, niche FROM ct_competitors WHERE is_active = true;

-- Pipeline CRM
SELECT name, position, color FROM ct_pipeline_stages ORDER BY position;
```
