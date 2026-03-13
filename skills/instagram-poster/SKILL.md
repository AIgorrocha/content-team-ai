---
name: instagram-poster
description: "Publicar no Instagram via Meta Graph API (fotos, carrosseis, reels)"
---
# Instagram Poster - Publicar via Graph API

Publica fotos, carrosseis e reels no Instagram usando a API oficial do Meta.

## Variaveis Necessarias

- `INSTAGRAM_ACCESS_TOKEN` — Token do Meta for Developers
- `INSTAGRAM_USER_ID` — ID do usuario Instagram

## Regras

- NUNCA publicar sem confirmacao do usuario
- Legenda max 2200 chars, max 30 hashtags
- Imagens: JPEG/PNG, max 8MB, min 320x320px
- URL da imagem precisa ser publica

## Fluxo - Foto Unica

1. Criar container: `POST /{user-id}/media` com `image_url` + `caption`
2. Aguardar status `FINISHED`
3. Publicar: `POST /{user-id}/media_publish` com `creation_id`
4. Buscar permalink do post publicado

## Fluxo - Carrossel

1. Criar container para CADA imagem com `is_carousel_item=true`
2. Criar container do carrossel com `media_type=CAROUSEL`, `children=id1,id2,...`, `caption`
3. Publicar o carrossel

## Fluxo - Reels

1. Criar container com `video_url`, `media_type=REELS`, `caption`
2. Aguardar processamento (pode demorar, polling a cada 5s)
3. Publicar

## Token

Token de longa duracao dura ~60 dias. Renovar antes de expirar:
```bash
curl "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=$TOKEN"
```

## Erros Comuns

- **OAuthException (190):** Token expirado
- **Rate limit (4):** Max ~25 posts/dia
- **Permission denied (10):** App sem permissao `instagram_content_publish`
