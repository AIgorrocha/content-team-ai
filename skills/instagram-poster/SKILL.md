---
name: instagram-poster
description: "Post images, carousels and reels to Instagram via official Meta Graph API"
homepage: https://developers.facebook.com/docs/instagram-platform/instagram-graph-api
metadata: { "openclaw": { "emoji": "📲", "requires": { "bins": ["curl", "jq"], "env": ["INSTAGRAM_ACCESS_TOKEN", "INSTAGRAM_USER_ID", "SUPABASE_URL", "SUPABASE_SERVICE_KEY"] } } }
---
# Instagram Poster - Publicar no Instagram via Graph API

Publica fotos, carrosseis e reels no Instagram usando a API oficial do Meta (Graph API).
Registra tudo no Supabase (tabela `ct_instagram_posts`).

## Usage

Quando o Content Team ou o usuario pedir para publicar no Instagram.
A imagem PRECISA estar em uma URL publica acessivel (Supabase Storage, Imgur, etc).

## IMPORTANTE - Regras

- **NUNCA** publicar sem confirmacao do usuario (a menos que seja um cron agendado)
- A legenda (caption) pode ter ate 2200 caracteres
- Hashtags: maximo 30 por post
- Imagens: JPEG ou PNG, max 8MB, min 320x320px
- A URL da imagem precisa ser publica (acessivel sem login)

## Step 1: Registrar no Supabase (status = draft)

```bash
POST_ID=$(curl -s "$SUPABASE_URL/rest/v1/ct_instagram_posts" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "{
    \"caption\": \"$CAPTION\",
    \"image_url\": \"$IMAGE_URL\",
    \"media_type\": \"IMAGE\",
    \"hashtags\": $HASHTAGS_JSON,
    \"status\": \"draft\"
  }" | jq -r '.[0].id')

echo "Post registrado no Supabase: $POST_ID"
```

## Step 2: Criar Container no Instagram (prepara o post)

```bash
# Atualizar status para uploading
curl -s "$SUPABASE_URL/rest/v1/ct_instagram_posts?id=eq.$POST_ID" \
  -X PATCH \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status": "uploading", "updated_at": "now()"}'

# Criar container (foto + legenda juntos)
CONTAINER=$(curl -s -X POST "https://graph.instagram.com/v21.0/$INSTAGRAM_USER_ID/media" \
  -d "image_url=$IMAGE_URL" \
  --data-urlencode "caption=$CAPTION" \
  -d "access_token=$INSTAGRAM_ACCESS_TOKEN")

CREATION_ID=$(echo "$CONTAINER" | jq -r '.id')
ERROR=$(echo "$CONTAINER" | jq -r '.error.message // empty')

if [ -n "$ERROR" ] || [ "$CREATION_ID" = "null" ]; then
  echo "ERRO ao criar container: $ERROR"
  curl -s "$SUPABASE_URL/rest/v1/ct_instagram_posts?id=eq.$POST_ID" \
    -X PATCH \
    -H "apikey: $SUPABASE_SERVICE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"status\": \"failed\", \"error_message\": \"$ERROR\", \"updated_at\": \"now()\"}"
  exit 1
fi

echo "Container criado: $CREATION_ID"

# Salvar container ID no Supabase
curl -s "$SUPABASE_URL/rest/v1/ct_instagram_posts?id=eq.$POST_ID" \
  -X PATCH \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"ig_container_id\": \"$CREATION_ID\", \"updated_at\": \"now()\"}"
```

## Step 3: Verificar se o Container esta Pronto

```bash
# Aguardar processamento (pode levar alguns segundos)
for i in 1 2 3 4 5; do
  STATUS_CHECK=$(curl -s "https://graph.instagram.com/v21.0/$CREATION_ID?fields=status_code&access_token=$INSTAGRAM_ACCESS_TOKEN")
  STATUS_CODE=$(echo "$STATUS_CHECK" | jq -r '.status_code')

  if [ "$STATUS_CODE" = "FINISHED" ]; then
    echo "Container pronto para publicar!"
    break
  elif [ "$STATUS_CODE" = "ERROR" ]; then
    echo "ERRO no processamento da imagem"
    exit 1
  fi

  echo "Processando... tentativa $i/5 (status: $STATUS_CODE)"
  sleep 3
done
```

## Step 4: Publicar!

```bash
PUBLISH=$(curl -s -X POST "https://graph.instagram.com/v21.0/$INSTAGRAM_USER_ID/media_publish" \
  -d "creation_id=$CREATION_ID" \
  -d "access_token=$INSTAGRAM_ACCESS_TOKEN")

MEDIA_ID=$(echo "$PUBLISH" | jq -r '.id')
ERROR=$(echo "$PUBLISH" | jq -r '.error.message // empty')

if [ -n "$ERROR" ] || [ "$MEDIA_ID" = "null" ]; then
  echo "ERRO ao publicar: $ERROR"
  curl -s "$SUPABASE_URL/rest/v1/ct_instagram_posts?id=eq.$POST_ID" \
    -X PATCH \
    -H "apikey: $SUPABASE_SERVICE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"status\": \"failed\", \"error_message\": \"$ERROR\", \"updated_at\": \"now()\"}"
  exit 1
fi

echo "PUBLICADO com sucesso! Media ID: $MEDIA_ID"
```

## Step 5: Buscar Permalink e Atualizar Supabase

```bash
PERMALINK=$(curl -s "https://graph.instagram.com/v21.0/$MEDIA_ID?fields=permalink&access_token=$INSTAGRAM_ACCESS_TOKEN" | jq -r '.permalink')

curl -s "$SUPABASE_URL/rest/v1/ct_instagram_posts?id=eq.$POST_ID" \
  -X PATCH \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"ig_media_id\": \"$MEDIA_ID\",
    \"ig_permalink\": \"$PERMALINK\",
    \"status\": \"published\",
    \"published_at\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
    \"updated_at\": \"now()\"
  }"

echo "Link do post: $PERMALINK"
```

## Carousel (Carrossel - Multiplas Imagens)

Para postar carrossel, o fluxo muda um pouco:

```bash
# 1. Criar container para CADA imagem (sem caption)
IMG1_ID=$(curl -s -X POST "https://graph.instagram.com/v21.0/$INSTAGRAM_USER_ID/media" \
  -d "image_url=$IMAGE_URL_1" \
  -d "is_carousel_item=true" \
  -d "access_token=$INSTAGRAM_ACCESS_TOKEN" | jq -r '.id')

IMG2_ID=$(curl -s -X POST "https://graph.instagram.com/v21.0/$INSTAGRAM_USER_ID/media" \
  -d "image_url=$IMAGE_URL_2" \
  -d "is_carousel_item=true" \
  -d "access_token=$INSTAGRAM_ACCESS_TOKEN" | jq -r '.id')

# 2. Criar container do carrossel (com caption aqui)
CAROUSEL_ID=$(curl -s -X POST "https://graph.instagram.com/v21.0/$INSTAGRAM_USER_ID/media" \
  -d "media_type=CAROUSEL" \
  -d "children=$IMG1_ID,$IMG2_ID" \
  --data-urlencode "caption=$CAPTION" \
  -d "access_token=$INSTAGRAM_ACCESS_TOKEN" | jq -r '.id')

# 3. Publicar
curl -s -X POST "https://graph.instagram.com/v21.0/$INSTAGRAM_USER_ID/media_publish" \
  -d "creation_id=$CAROUSEL_ID" \
  -d "access_token=$INSTAGRAM_ACCESS_TOKEN"
```

## Reels (Video)

```bash
# Container para video
# COVER_URL = URL publica de imagem JPEG/PNG para capa (opcional)
# THUMB_OFFSET = tempo em milissegundos do video para usar como capa (opcional, padrao 0)
# Use COVER_URL *ou* THUMB_OFFSET, nao ambos

COVER_ARGS=""
if [ -n "$COVER_URL" ]; then
  COVER_ARGS="-d cover_url=$COVER_URL"
elif [ -n "$THUMB_OFFSET" ]; then
  COVER_ARGS="-d thumb_offset=$THUMB_OFFSET"
fi

REEL_ID=$(curl -s -X POST "https://graph.instagram.com/v21.0/$INSTAGRAM_USER_ID/media" \
  -d "video_url=$VIDEO_URL" \
  -d "media_type=REELS" \
  --data-urlencode "caption=$CAPTION" \
  $COVER_ARGS \
  -d "access_token=$INSTAGRAM_ACCESS_TOKEN" | jq -r '.id')

# Aguardar processamento (videos demoram mais)
for i in $(seq 1 20); do
  STATUS_CODE=$(curl -s "https://graph.instagram.com/v21.0/$REEL_ID?fields=status_code&access_token=$INSTAGRAM_ACCESS_TOKEN" | jq -r '.status_code')
  [ "$STATUS_CODE" = "FINISHED" ] && break
  sleep 5
done

# Publicar
curl -s -X POST "https://graph.instagram.com/v21.0/$INSTAGRAM_USER_ID/media_publish" \
  -d "creation_id=$REEL_ID" \
  -d "access_token=$INSTAGRAM_ACCESS_TOKEN"
```

## Token Refresh (Token Dura 60 Dias)

O token de longa duracao dura ~60 dias. Para renovar antes de expirar:

```bash
NEW_TOKEN=$(curl -s "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=$INSTAGRAM_ACCESS_TOKEN" | jq -r '.access_token')
echo "Novo token (atualizar no env): $NEW_TOKEN"
```

**DICA:** Criar um cron no OpenClaw para renovar automaticamente a cada 50 dias.

## Error Handling

- **OAuthException (code 190):** Token expirado - renovar token
- **Invalid image:** URL inacessivel ou formato invalido - verificar URL
- **Rate limit (code 4):** Maximo ~25 posts/dia - aguardar
- **Permission denied (code 10):** App sem permissao `instagram_content_publish`
- Se qualquer erro, atualizar status para `failed` no Supabase com a mensagem

## Workflow Completo

1. Content Team gera legenda + hashtags + imagem
2. Imagem eh enviada pro Supabase Storage (URL publica)
3. Skill registra post como `draft` no Supabase
4. Cria container na Graph API com imagem + legenda
5. Aguarda processamento
6. Publica
7. Salva permalink e media_id no Supabase
8. Confirma para o usuario com o link do post

## Variaveis de Ambiente Necessarias

| Variavel | Onde Conseguir |
|----------|---------------|
| `INSTAGRAM_ACCESS_TOKEN` | Meta for Developers > App > Token |
| `INSTAGRAM_USER_ID` | Graph API Explorer: `GET /me?fields=id` |
| `SUPABASE_URL` | Dashboard Supabase > Settings > API |
| `SUPABASE_SERVICE_KEY` | Dashboard Supabase > Settings > API > service_role |
