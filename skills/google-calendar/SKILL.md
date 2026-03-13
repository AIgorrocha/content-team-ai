---
name: google-calendar
description: "Gerenciar eventos do Google Calendar via REST API"
---
# Google Calendar - Gerenciamento de Eventos

Gerencia eventos do Google Calendar usando a REST API com OAuth2.

## Variaveis Necessarias

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`

## Operacoes

### Listar Proximos Eventos
GET `/calendars/primary/events?timeMin=NOW&maxResults=10&singleEvents=true&orderBy=startTime`

### Criar Evento
POST `/calendars/primary/events` com JSON (summary, start, end, location)

### Atualizar Evento
PATCH `/calendars/primary/events/{eventId}` com campos a atualizar

### Deletar Evento
DELETE `/calendars/primary/events/{eventId}`

## Notas

- Timezone padrao: America/Sao_Paulo (-03:00)
- Sempre obter access token fresco antes de chamar API
- Confirmar com usuario antes de criar/atualizar eventos
