/**
 * telegram-approve.mjs
 *
 * Bot de aprovacao de conteudo via Telegram.
 * Envia posts pendentes com legenda completa pro Igor aprovar.
 * Igor responde com comandos simples:
 *   /aprovar [id]     — aprova e agenda publicacao
 *   /rejeitar [id]    — rejeita com motivo opcional
 *   /editar [id]      — marca pra edicao
 *   /pendentes        — lista todos os pendentes
 *   /preview [id]     — mostra preview completo
 *
 * Uso: node scripts/telegram-approve.mjs
 * Roda como processo continuo (polling) ou via cron a cada 5min
 *
 * Modo cron: node scripts/telegram-approve.mjs --check
 *   Apenas envia pendentes, nao fica escutando
 *
 * Modo bot: node scripts/telegram-approve.mjs --bot
 *   Fica escutando comandos (precisa rodar como servico)
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TG_CHAT = process.env.TELEGRAM_CHAT_ID
const TG_API = `https://api.telegram.org/bot${TG_TOKEN}`

if (!SUPABASE_URL || !SUPABASE_KEY || !TG_TOKEN || !TG_CHAT) {
  console.error('Faltam variaveis: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// --- Telegram helpers ---
async function sendTelegram(text, replyMarkup) {
  const body = {
    chat_id: TG_CHAT,
    text,
    parse_mode: 'HTML'
  }
  if (replyMarkup) body.reply_markup = JSON.stringify(replyMarkup)

  const res = await fetch(`${TG_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  return res.json()
}

async function getUpdates(offset) {
  const res = await fetch(`${TG_API}/getUpdates?offset=${offset}&timeout=30`)
  const data = await res.json()
  return data.result || []
}

// --- Formatacao ---
function formatContentPreview(item) {
  const id = item.id.substring(0, 8)
  const platform = {
    instagram: '📸 Instagram',
    linkedin: '💼 LinkedIn',
    tiktok: '🎵 TikTok',
    youtube: '📺 YouTube',
    x: '🐦 X/Twitter',
    threads: '🧵 Threads'
  }[item.platform] || item.platform

  const type = {
    carousel: 'Carrossel',
    reels: 'Reels/Video',
    linkedin_post: 'Post texto',
    x_thread: 'Thread',
    youtube_short: 'Short'
  }[item.content_type] || item.content_type

  const date = item.scheduled_at
    ? new Date(item.scheduled_at).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    : 'Sem data'

  let body = item.content_body || '(sem legenda ainda)'
  // Truncar se muito longo
  if (body.length > 800) body = body.substring(0, 800) + '...'

  // Escapar HTML
  body = body.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  return `${platform} | ${type}
<b>${item.title}</b>
${date}

<pre>${body}</pre>

ID: <code>${id}</code>
/aprovar ${id}  |  /rejeitar ${id}  |  /editar ${id}`
}

// --- Comandos ---
async function listPendentes() {
  const { data: items } = await supabase
    .from('ct_content_items')
    .select('*')
    .in('status', ['planned', 'draft'])
    .order('scheduled_at', { ascending: true })
    .limit(10)

  if (!items || items.length === 0) {
    await sendTelegram('Nenhum conteudo pendente de aprovacao.')
    return
  }

  await sendTelegram(`<b>Conteudos pendentes: ${items.length}</b>\n${'—'.repeat(20)}`)

  for (const item of items) {
    const preview = formatContentPreview(item)
    await sendTelegram(preview)
    // Pausa pra nao floodar
    await new Promise(r => setTimeout(r, 500))
  }
}

async function showPreview(shortId) {
  const { data: items } = await supabase
    .from('ct_content_items')
    .select('*')
    .like('id', `${shortId}%`)
    .limit(1)

  if (!items || items.length === 0) {
    await sendTelegram(`Conteudo ${shortId} nao encontrado.`)
    return
  }

  const item = items[0]
  const preview = formatContentPreview(item)
  await sendTelegram(preview)

  // Se tem media_urls, mostrar
  if (item.media_urls && item.media_urls.length > 0) {
    await sendTelegram(`Imagens: ${item.media_urls.length}\n${item.media_urls.slice(0, 3).join('\n')}`)
  }
}

async function approveContent(shortId) {
  const { data: items } = await supabase
    .from('ct_content_items')
    .select('*')
    .like('id', `${shortId}%`)
    .limit(1)

  if (!items || items.length === 0) {
    await sendTelegram(`Conteudo ${shortId} nao encontrado.`)
    return
  }

  const item = items[0]
  const { error } = await supabase
    .from('ct_content_items')
    .update({ status: 'approved' })
    .eq('id', item.id)

  if (error) {
    await sendTelegram(`Erro ao aprovar: ${error.message}`)
    return
  }

  const platform = item.platform || 'desconhecido'
  const auto = ['instagram', 'linkedin'].includes(platform) ? ' (sera publicado automaticamente)' : ' (publicacao manual)'

  await sendTelegram(`<b>APROVADO</b> ${item.title}\n${platform}${auto}`)
}

async function rejectContent(shortId, reason) {
  const { data: items } = await supabase
    .from('ct_content_items')
    .select('*')
    .like('id', `${shortId}%`)
    .limit(1)

  if (!items || items.length === 0) {
    await sendTelegram(`Conteudo ${shortId} nao encontrado.`)
    return
  }

  const { error } = await supabase
    .from('ct_content_items')
    .update({ status: 'rejected', approval_notes: reason || 'Rejeitado pelo Igor' })
    .eq('id', items[0].id)

  if (error) {
    await sendTelegram(`Erro ao rejeitar: ${error.message}`)
    return
  }

  await sendTelegram(`<b>REJEITADO</b> ${items[0].title}\nMotivo: ${reason || 'nenhum'}`)
}

async function markForEdit(shortId) {
  const { data: items } = await supabase
    .from('ct_content_items')
    .select('*')
    .like('id', `${shortId}%`)
    .limit(1)

  if (!items || items.length === 0) {
    await sendTelegram(`Conteudo ${shortId} nao encontrado.`)
    return
  }

  const { error } = await supabase
    .from('ct_content_items')
    .update({ status: 'needs_edit' })
    .eq('id', items[0].id)

  if (error) {
    await sendTelegram(`Erro: ${error.message}`)
    return
  }

  await sendTelegram(`<b>MARCADO PRA EDICAO</b> ${items[0].title}\nEdite e depois use /aprovar ${shortId}`)
}

async function processCommand(text) {
  const parts = text.trim().split(/\s+/)
  const cmd = parts[0].toLowerCase()
  const arg = parts[1] || ''
  const rest = parts.slice(2).join(' ')

  switch (cmd) {
    case '/pendentes':
    case '/pending':
      await listPendentes()
      break
    case '/preview':
    case '/ver':
      if (!arg) { await sendTelegram('Use: /preview [id]'); break }
      await showPreview(arg)
      break
    case '/aprovar':
    case '/approve':
    case '/ok':
      if (!arg) { await sendTelegram('Use: /aprovar [id]'); break }
      await approveContent(arg)
      break
    case '/rejeitar':
    case '/reject':
    case '/nao':
      if (!arg) { await sendTelegram('Use: /rejeitar [id] [motivo]'); break }
      await rejectContent(arg, rest)
      break
    case '/editar':
    case '/edit':
      if (!arg) { await sendTelegram('Use: /editar [id]'); break }
      await markForEdit(arg)
      break
    case '/help':
    case '/ajuda':
      await sendTelegram(
        '<b>Comandos Content Team:</b>\n\n' +
        '/pendentes — Lista conteudos pra aprovar\n' +
        '/preview [id] — Preview completo com legenda\n' +
        '/aprovar [id] — Aprova pra publicacao\n' +
        '/rejeitar [id] [motivo] — Rejeita\n' +
        '/editar [id] — Marca pra edicao'
      )
      break
  }
}

// --- Modo check (cron) ---
async function modeCheck() {
  console.log('📋 Modo check — enviando pendentes pro Telegram')
  await listPendentes()
  console.log('✅ Done')
}

// --- Modo bot (polling continuo) ---
async function modeBot() {
  console.log('🤖 Modo bot — escutando comandos no Telegram...')
  console.log('   Ctrl+C pra parar\n')

  let offset = 0

  while (true) {
    try {
      const updates = await getUpdates(offset)

      for (const update of updates) {
        offset = update.update_id + 1

        const msg = update.message
        if (!msg || !msg.text) continue
        if (String(msg.chat.id) !== TG_CHAT) continue

        const text = msg.text.trim()
        if (text.startsWith('/')) {
          console.log(`  Comando: ${text}`)
          await processCommand(text)
        }
      }
    } catch (err) {
      console.warn('Erro polling:', err.message)
      await new Promise(r => setTimeout(r, 5000))
    }
  }
}

// --- Main ---
const mode = process.argv[2]

if (mode === '--check') {
  modeCheck().catch(err => { console.error('❌', err.message); process.exit(1) })
} else if (mode === '--bot') {
  modeBot().catch(err => { console.error('❌', err.message); process.exit(1) })
} else {
  console.log('Uso:')
  console.log('  node scripts/telegram-approve.mjs --check   (envia pendentes, sai)')
  console.log('  node scripts/telegram-approve.mjs --bot     (escuta comandos 24h)')
  process.exit(0)
}
