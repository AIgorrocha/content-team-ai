/**
 * Tool: Telegram - Notificar Igor via bot
 * Envia mensagens para o chat do Igor no Telegram.
 */
import 'dotenv/config'

export const telegramToolDefinition = {
  name: 'telegram_notify',
  description: 'Envia mensagem para o Igor via Telegram. Use para notificar sobre tarefas concluídas, relatórios prontos, ou pedir aprovação.',
  input_schema: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensagem a enviar (suporta HTML: <b>, <i>, <code>)'
      }
    },
    required: ['message']
  }
}

export async function handleTelegramTool(input) {
  const { message } = input
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    return { success: false, error: 'TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID não configurado' }
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    })

    const result = await response.json()
    if (!result.ok) {
      throw new Error(result.description)
    }

    return { success: true, message_id: result.result.message_id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
