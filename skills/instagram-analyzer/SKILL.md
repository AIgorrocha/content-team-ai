---
name: instagram-analyzer
description: "Analisar perfis e posts do Instagram usando RapidAPI"
---
# Instagram Analyzer - Analise de Perfis

Analisa perfis, posts e engagement do Instagram usando RapidAPI.

## Variavel Necessaria

- `RAPIDAPI_KEY` — Chave do RapidAPI

## Fluxo

1. Buscar dados do perfil via RapidAPI (`instagram-data1.p.rapidapi.com`)
2. Buscar posts recentes (ultimos 12)
3. Calcular metricas (engagement rate, media de likes)
4. Analisar padroes de conteudo
5. Apresentar relatorio em PT-BR

## Metricas

- **Engagement rate:** (likes + comments) / followers * 100
- **Media de likes** por post
- **Media de comentarios** por post
- **Tipo de conteudo** mais performante (foto, carrossel, reel)

## Notas

- Perfis privados nao podem ser analisados
- Rate limits dependem do plano RapidAPI
- Sempre responder em portugues
