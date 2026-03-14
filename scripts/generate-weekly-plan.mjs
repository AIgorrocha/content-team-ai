/**
 * generate-weekly-plan.mjs
 * Gera plano semanal de conteudo baseado em tendencias dos concorrentes.
 * Salva em ct_content_items no Supabase + notifica via Telegram.
 *
 * Uso: node scripts/generate-weekly-plan.mjs
 * Cron: 0 7 * * 1 (segunda 7h BRT)
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

const CONTENT_TYPES = ['carousel', 'reels', 'linkedin_post', 'x_thread', 'youtube_short']
const PLATFORMS = ['instagram', 'linkedin', 'tiktok', 'youtube', 'x']
const PILLAR_THEMES = [
  'Automacao com IA para gestores',
  'Claude Code na pratica',
  'Ferramentas de IA que economizam tempo',
  'Cases reais de automacao',
  'Bastidores: como uso IA no dia a dia',
  'Agentes de IA para negocios',
  'IA para profissionais liberais',
  'Comparativo de ferramentas IA',
  'Erros comuns ao usar IA',
  'Dicas rapidas de produtividade com IA'
]

function getWeekDates() {
  const now = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() + (1 - now.getDay() + 7) % 7)
  if (now.getDay() === 1) monday.setDate(now.getDate())

  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

async function getTrends() {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: posts } = await supabase
    .from('ct_competitor_posts')
    .select('platform, content_preview, competitor_handle')
    .gte('scraped_at', sevenDaysAgo.toISOString())
    .order('scraped_at', { ascending: false })
    .limit(50)

  return posts || []
}

async function getPublishedThisWeek(weekDates) {
  const { data } = await supabase
    .from('ct_content_items')
    .select('title, platform, content_type, scheduled_at')
    .gte('scheduled_at', `${weekDates[0]}T00:00:00`)
    .lte('scheduled_at', `${weekDates[6]}T23:59:59`)

  return data || []
}

function generatePlan(trends, existingItems, weekDates) {
  const usedThemes = existingItems.map(i => i.title)
  const availableThemes = PILLAR_THEMES.filter(t => !usedThemes.includes(t))

  // Dias uteis pra publicar (seg, ter, qua, qui, sex)
  const publishDays = weekDates.filter((_, i) => i < 5)
  const planItems = []

  // 5-7 conteudos na semana
  const count = Math.min(7, Math.max(5, publishDays.length))

  for (let i = 0; i < count; i++) {
    const theme = availableThemes[i % availableThemes.length]
    const day = publishDays[i % publishDays.length]
    const type = CONTENT_TYPES[i % CONTENT_TYPES.length]
    const platform = PLATFORMS[i % PLATFORMS.length]

    planItems.push({
      title: theme,
      content_type: type,
      platform,
      status: 'planned',
      scheduled_at: `${day}T10:00:00-03:00`,
      created_by: 'kronos-auto',
      approval_notes: `Gerado automaticamente. Tendencias: ${trends.slice(0, 3).map(t => t.content_preview?.substring(0, 50)).join('; ')}`
    })
  }

  return planItems
}

async function savePlan(items) {
  const { data, error } = await supabase
    .from('ct_content_items')
    .insert(items)
    .select()

  if (error) {
    console.error('Erro salvando plano:', error.message)
    return []
  }
  return data
}

async function notifyTelegram(items) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('⚠️  Telegram nao configurado, pulando notificacao')
    return
  }

  const lines = items.map((item, i) =>
    `${i + 1}. ${item.scheduled_at.split('T')[0]} — ${item.title} (${item.platform}, ${item.content_type})`
  )

  const message = `📅 *Plano Semanal de Conteudo*\n\n${lines.join('\n')}\n\n_Gerado automaticamente pelo Content Team AI_`

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
    console.log('📱 Notificacao enviada pro Telegram')
  } catch (err) {
    console.warn('⚠️  Erro enviando Telegram:', err.message)
  }
}

async function main() {
  console.log('📅 Content Team — Geracao de Plano Semanal')
  console.log(`📅 ${new Date().toISOString()}\n`)

  const weekDates = getWeekDates()
  console.log(`Semana: ${weekDates[0]} a ${weekDates[6]}`)

  const trends = await getTrends()
  console.log(`📊 ${trends.length} posts de concorrentes nos ultimos 7 dias`)

  const existing = await getPublishedThisWeek(weekDates)
  console.log(`📝 ${existing.length} itens ja agendados esta semana`)

  if (existing.length >= 5) {
    console.log('✅ Ja tem 5+ itens agendados, pulando geracao.')
    return
  }

  const plan = generatePlan(trends, existing, weekDates)
  console.log(`\n🗓️  Plano gerado: ${plan.length} conteudos`)

  for (const item of plan) {
    console.log(`  ${item.scheduled_at.split('T')[0]} | ${item.platform} | ${item.content_type} | ${item.title}`)
  }

  const saved = await savePlan(plan)
  console.log(`\n💾 ${saved.length} itens salvos no Supabase`)

  await notifyTelegram(plan)

  console.log('\n✅ Plano semanal gerado com sucesso!')
}

main().catch(err => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
