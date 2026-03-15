/**
 * telegram-send.mjs - Enviar mensagens/fotos pro Telegram
 */

import { sendMessage, sendPhoto } from '../telegram.mjs'

export const definition = {
  name: 'telegram_send',
  description: 'Envia mensagem de texto ou foto pro chat do Igor no Telegram. Use para enviar resultados, previews, imagens de carrossel.',
  input_schema: {
    type: 'object',
    properties: {
      text: {
        type: 'string',
        description: 'Texto da mensagem (suporta HTML: <b>, <i>, <code>, <pre>)',
      },
      photo_url: {
        type: 'string',
        description: 'URL da foto para enviar (opcional)',
      },
      caption: {
        type: 'string',
        description: 'Legenda da foto (max 1024 chars)',
      },
    },
    required: ['text'],
  },
}

export async function execute(input) {
  try {
    if (input.photo_url) {
      const result = await sendPhoto(input.photo_url, input.caption || input.text)
      return { sent: true, type: 'photo', ok: result.ok }
    }
    const results = await sendMessage(input.text)
    return { sent: true, type: 'text', chunks: results.length }
  } catch (err) {
    return { error: err.message }
  }
}
