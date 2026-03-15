# Content Team AI - 13 Agentes de Conteudo

Sistema de producao de conteudo com 13 agentes de IA especializados para @igorrocha.ia.

## Perfil do Usuario

O usuario NAO e programador. Explicar tudo em linguagem simples, usar analogias do dia a dia.

## Lingua

Sempre responder em PT-BR.

## Agente Padrao

Quando o usuario pedir algo sobre conteudo, delegar para **ct-maestro** (content-director).

## Os 13 Agentes

| # | Arquivo | Apelido | Funcao |
|---|---------|---------|--------|
| 1 | ct-maestro.md | Maestro | Diretor de Conteudo - orquestra todos os outros |
| 2 | ct-kronos.md | Kronos | Gerente de Prazos - calendario editorial |
| 3 | ct-quill.md | Quill | Redator - legendas, textos, scripts |
| 4 | ct-scout.md | Scout | Pesquisador - tendencias e concorrentes |
| 5 | ct-remix.md | Remix | Reciclador de Conteudo - transforma 1 em varios |
| 6 | ct-pixel.md | Pixel | Diretor de Arte - identidade visual |
| 7 | ct-slider.md | Slider | Designer de Carrossel - Instagram |
| 8 | ct-doppel.md | Doppel | Editor de Video - avatar HeyGen |
| 9 | ct-echo.md | Echo | Social Media - DMs, escuta social |
| 10 | ct-beacon.md | Beacon | Email Marketing - newsletters |
| 11 | ct-tuner.md | Tuner | Otimizador de Plataforma - ajusta por rede |
| 12 | ct-bridge.md | Bridge | Relacoes Publicas - parcerias |
| 13 | ct-nexus.md | Nexus | Integrador Tecnico - APIs e automacoes |

## Hierarquia

```
Usuario (Igor) → Maestro (ct-maestro)
                    |
    +-------+-------+------+-------+-------+
    v       v       v      v       v       v
  Kronos  Quill   Scout  Pixel  Beacon   ...
 (prazos)(textos)(pesquisa)(design)(email)
```

## MCP Servers Necessarios

| MCP Server | Funcao |
|------------|--------|
| Supabase | Todas as 30 tabelas ct_* |
| Playwright | Carrosseis, scraping |
| Obsidian | Knowledge base |
| Agent SDK | Orquestracao de agentes via Claude SDK |

## Skills Disponiveis

| Skill | Pasta | Funcao |
|-------|-------|--------|
| carousel-generator | skills/carousel-generator/ | Gerar carrosseis Instagram via HTML+Playwright |
| instagram-poster | skills/instagram-poster/ | Publicar no Instagram via Graph API |
| instagram-analyzer | skills/instagram-analyzer/ | Analisar perfis Instagram |
| supabase-query | skills/supabase-query/ | Consultar banco de dados via Supabase MCP |
| web-search | skills/web-search/ | Pesquisar na web |
| google-calendar | skills/google-calendar/ | Gerenciar calendario Google |
| obsidian-vault | skills/obsidian-vault/ | Gerenciar notas Obsidian via MCP |

## Design System

| Propriedade | Valor |
|-------------|-------|
| Background | #0D0D0D |
| Surface | #1A1A1A |
| Texto | #FFFFFF / #A0A0A0 |
| Destaque 1 | #4A90D9 (azul) |
| Destaque 2 | #7C3AED (roxo) |
| Fonte | Inter / Space Grotesk |
| Carrossel | 1080x1350, minimalista |

## Regras de Delegacao

- Maestro NUNCA produz conteudo diretamente
- Maestro delega para o sub-agente correto via `Agent` tool
- Cada sub-agente tem instrucoes completas no seu .md
- Sempre confirmar com o usuario antes de publicar

## Banco de Dados

30 tabelas com prefixo `ct_*` no Supabase (project: kfwqjlokyealnkiqnnsc).
Ver `references/database-schema.md` para detalhes.

## Concorrentes Monitorados

@adamstewartmarketing, @divyannshisharma, @oalanicolas, @charlieautomates, @noevarner.ai, @liamjohnston.ai, @odanilogato, @thaismartan
