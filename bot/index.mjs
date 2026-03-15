/**
 * index.mjs - Entrypoint: polling Telegram + dispatch
 *
 * Comandos rapidos (sem IA): /pendentes, /hoje, /semana, /ajuda
 * Tudo mais: envia pro Claude via agent.processMessage()
 */

import { config } from './config.mjs'
import { sendMessage, sendTypingAction, getUpdates } from './telegram.mjs'
import { processMessage } from './agent.mjs'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(config.supabaseUrl, config.supabaseKey)

// --- Atalhos rapidos (sem chamar Claude = economia de tokens) ---

const PLATFORM_EMOJI = {
  instagram: '📸', linkedin: '💼', tiktok: '🎵',
  youtube: '📺', x: '🐦', threads: '🧵',
}

function formatDate(isoStr) {
  if (!isoStr) return 'Sem data'
  return new Date(isoStr).toLocaleDateString('pt-BR', {
    weekday: 'short', day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
  })
}

function esc(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

async function cmdPendentes() {
  const { data: items } = await supabase
    .from('ct_content_items')
    .select('*')
    .in('status', ['planned', 'draft'])
    .order('scheduled_at', { ascending: true })
    .limit(10)

  if (!items?.length) {
    await sendMessage('Nenhum conteudo pendente.')
    return
  }

  let msg = `<b>${items.length} conteudo(s) pendente(s)</b>\n\n`
  for (const item of items) {
    const emoji = PLATFORM_EMOJI[item.platform] || '📄'
    const id = item.id.substring(0, 8)
    const date = formatDate(item.scheduled_at)
    msg += `${emoji} ${esc(item.title)}\n   ${date} | <code>${id}</code>\n\n`
  }
  await sendMessage(msg)
}

async function cmdHoje() {
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString()

  const { data: items } = await supabase
    .from('ct_content_items')
    .select('*')
    .gte('scheduled_at', start)
    .lte('scheduled_at', end)
    .order('scheduled_at', { ascending: true })

  if (!items?.length) {
    await sendMessage('Nada agendado pra hoje.')
    return
  }

  let msg = `<b>Publicacoes de Hoje</b>\n\n`
  for (const item of items) {
    const emoji = PLATFORM_EMOJI[item.platform] || '📄'
    const time = new Date(item.scheduled_at).toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
    })
    const id = item.id.substring(0, 8)
    msg += `${emoji} ${time} — ${esc(item.title)} (<code>${id}</code>)\n`
  }
  await sendMessage(msg)
}

async function cmdSemana() {
  const now = new Date()
  const monday = new Date(now)
  const dayOfWeek = now.getDay()
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  const { data: items } = await supabase
    .from('ct_content_items')
    .select('*')
    .gte('scheduled_at', monday.toISOString())
    .lte('scheduled_at', sunday.toISOString())
    .order('scheduled_at', { ascending: true })

  if (!items?.length) {
    await sendMessage('Nenhum conteudo agendado esta semana.')
    return
  }

  let msg = `<b>Agenda da Semana</b>\n\n`
  for (const item of items) {
    const emoji = PLATFORM_EMOJI[item.platform] || '📄'
    const status = { approved: '🟢', published: '✅', planned: '🟡', draft: '📝' }[item.status] || '❓'
    const date = formatDate(item.scheduled_at)
    const id = item.id.substring(0, 8)
    msg += `${status} ${emoji} ${date}\n   ${esc(item.title)} (<code>${id}</code>)\n\n`
  }
  await sendMessage(msg)
}

async function cmdAjuda() {
  await sendMessage(
    '<b>Comandos Rapidos</b>\n\n' +
    '/pendentes — Conteudos pra aprovar\n' +
    '/hoje — Publicacoes de hoje\n' +
    '/semana — Agenda da semana\n' +
    '/ajuda — Esta mensagem\n\n' +
    '<b>Conversa Natural</b>\n' +
    'Pode me perguntar qualquer coisa sobre conteudo!\n' +
    'Exemplos:\n' +
    '• "cria um post sobre agentes IA"\n' +
    '• "o que tem agendado pra amanha?"\n' +
    '• "gera um carrossel com 5 dicas"\n' +
    '• "pesquisa tendencias de IA no LinkedIn"'
  )
}

// --- Dispatch commands fixos vs conversa natural ---

const FAST_COMMANDS = {
  '/pendentes': cmdPendentes,
  '/pending': cmdPendentes,
  '/hoje': cmdHoje,
  '/today': cmdHoje,
  '/semana': cmdSemana,
  '/week': cmdSemana,
  '/ajuda': cmdAjuda,
  '/help': cmdAjuda,
}

async function handleMessage(text, chatId) {
  const cmd = text.trim().split(/\s+/)[0].toLowerCase()

  // Comandos rapidos (sem IA)
  if (FAST_COMMANDS[cmd]) {
    await FAST_COMMANDS[cmd]()
    return
  }

  // Comandos do bot antigo que agora passam pelo Claude
  // /aprovar, /rejeitar, /editar, /legenda, /agendar, /preview — Claude entende
  await sendTypingAction(chatId)

  console.log(`MSG: ${text.substring(0, 80)}`)
  const typingInterval = setInterval(() => sendTypingAction(chatId), 4000)

  try {
    const reply = await processMessage(text, chatId)
    clearInterval(typingInterval)
    await sendMessage(reply, chatId)
  } catch (err) {
    clearInterval(typingInterval)
    console.error('Erro processando:', err.message)
    await sendMessage(`Erro: ${err.message}`, chatId)
  }
}

// --- Polling loop ---

async function main() {
  console.log('Bot Content Team rodando (Claude + Telegram)...')
  console.log(`Modelo: ${config.model}`)
  let offset = 0

  while (true) {
    try {
      const updates = await getUpdates(offset)
      for (const update of updates) {
        offset = update.update_id + 1
        const msg = update.message
        if (!msg?.text) continue
        if (String(msg.chat.id) !== config.telegramChatId) continue
        await handleMessage(msg.text, String(msg.chat.id))
      }
    } catch (err) {
      console.warn('Polling erro:', err.message)
      await new Promise((r) => setTimeout(r, 5000))
    }
  }
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
