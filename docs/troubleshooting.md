# Troubleshooting - Problemas e Solucoes

## Carrossel

| Problema | Solucao |
|----------|---------|
| Fonte Inter nao carrega | Verificar internet. Fallback: `Arial, sans-serif` |
| Playwright nao instalado | `npx playwright install chromium` |
| Imagem cortada | Viewport deve ser 1080x1350 |
| Texto muito longo | Reduzir font-size ou quebrar em 2 slides |

## Instagram

| Problema | Solucao |
|----------|---------|
| OAuthException (190) | Token expirado — renovar token |
| Rate limit (4) | Max ~25 posts/dia — aguardar |
| Permission denied (10) | App sem permissao `instagram_content_publish` |
| Imagem invalida | URL inacessivel ou formato errado |

## Supabase

| Problema | Solucao |
|----------|---------|
| Nao conecta | Verificar SUPABASE_URL e SUPABASE_SERVICE_KEY |
| Tabela nao existe | Rodar o script SQL de criacao (em references/database-schema.md) |
| Permissao negada | Verificar que esta usando service_role key |

## MCP Servers

| Problema | Solucao |
|----------|---------|
| MCP nao conecta | Verificar .mcp.json e que o server esta instalado |
| Obsidian nao encontra vault | Verificar OBSIDIAN_VAULT_PATH no .env |
| n8n nao responde | Verificar N8N_BASE_URL e N8N_API_KEY |

## Agentes

| Problema | Solucao |
|----------|---------|
| Agente nao encontrado | Verificar que .md esta em `agents/` |
| Delegacao nao funciona | Verificar que Maestro usa Agent tool corretamente |
| Resposta em ingles | Verificar CLAUDE.md tem regra de PT-BR |
