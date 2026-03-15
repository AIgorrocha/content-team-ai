/**
 * telegram.mjs - Helpers Telegram (send, poll, typing, chunking)
 */

import { config } from './config.mjs'

const API = config.telegramApi
const CHAT = config.telegramChatId
const MAX_MSG = 4096

function escapeHtml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

async function sendMessage(text, chatId = CHAT) {
  const chunks = chunkText(text, MAX_MSG)
  const results = []
  for (const chunk of chunks) {
    const res = await fetch(`${API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: chunk, parse_mode: 'HTML' }),
    })
    const data = await res.json()
    if (!data.ok) {
      // Retry without parse_mode if HTML fails
      const res2 = await fetch(`${API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: chunk }),
      })
      results.push(await res2.json())
    } else {
      results.push(data)
    }
  }
  return results
}

async function sendPhoto(photoUrl, caption = '', chatId = CHAT) {
  const res = await fetch(`${API}/sendPhoto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      photo: photoUrl,
      caption: caption ? caption.substring(0, 1024) : undefined,
      parse_mode: 'HTML',
    }),
  })
  return res.json()
}

async function sendTypingAction(chatId = CHAT) {
  await fetch(`${API}/sendChatAction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, action: 'typing' }),
  })
}

async function getUpdates(offset) {
  const res = await fetch(`${API}/getUpdates?offset=${offset}&timeout=30`)
  const data = await res.json()
  return data.result || []
}

function chunkText(text, maxLen) {
  if (text.length <= maxLen) return [text]
  const chunks = []
  let remaining = text
  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining)
      break
    }
    let cut = remaining.lastIndexOf('\n', maxLen)
    if (cut < maxLen * 0.3) cut = maxLen
    chunks.push(remaining.substring(0, cut))
    remaining = remaining.substring(cut)
  }
  return chunks
}

export { sendMessage, sendPhoto, sendTypingAction, getUpdates, escapeHtml, chunkText }
