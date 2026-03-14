/**
 * daily-publish-check.mjs
 * Verifica publicacoes agendadas pra hoje e alerta atrasos via Telegram.
 *
 * Uso: node scripts/daily-publish-check.mjs
 * Cron: 0 8 * * * (diario 8h BRT)
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Faltam SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function notifyTelegram(message) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('⚠️  Telegram nao configurado')
    return
  }

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    })
  } catch (err) {
    console.warn('Telegram falhou:', err.message)
  }
}

async function main() {
  console.log('📋 Daily Publish Check')
  console.log(`📅 ${new Date().toISOString()}\n`)

  const today = new Date().toISOString().split('T')[0]

  // Publicacoes de hoje
  const { data: todayItems } = await supabase
    .from('ct_content_items')
    .select('*')
    .gte('scheduled_at', `${today}T00:00:00`)
    .lte('scheduled_at', `${today}T23:59:59`)
    .order('scheduled_at')

  // Atrasados (agendados antes de hoje, nao publicados)
  const { data: overdue } = await supabase
    .from('ct_content_items')
    .select('*')
    .lt('scheduled_at', `${today}T00:00:00`)
    .in('status', ['planned', 'approved', 'scheduled', 'draft'])
    .order('scheduled_at')

  const items = todayItems || []
  const overdueItems = overdue || []

  if (items.length === 0 && overdueItems.length === 0) {
    console.log('✅ Nada agendado e sem atrasos.')
    return
  }

  let msg = '📋 *Publicacoes do Dia*\n\n'

  if (items.length > 0) {
    msg += '*Hoje:*\n'
    for (const item of items) {
      const time = item.scheduled_at?.split('T')[1]?.substring(0, 5) || '??:??'
      const emoji = item.status === 'published' ? '✅' : item.status === 'approved' ? '🟢' : '🟡'
      msg += `${emoji} ${time} — ${item.title} (${item.platform}) [${item.status}]\n`
    }
  }

  if (overdueItems.length > 0) {
    msg += '\n🚨 *Atrasados:*\n'
    for (const item of overdueItems) {
      const date = item.scheduled_at?.split('T')[0] || '??'
      msg += `⚠️ ${date} — ${item.title} (${item.platform}) [${item.status}]\n`
    }
  }

  console.log(msg)
  await notifyTelegram(msg)

  console.log('\n✅ Check completo!')
}

main().catch(err => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
