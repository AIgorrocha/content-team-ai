/**
 * scrape-competitors.mjs
 * Scraping diario dos concorrentes em Instagram, LinkedIn, X e Reddit.
 * Salva resultados em ct_competitor_posts no Supabase.
 *
 * Uso: node scripts/scrape-competitors.mjs
 * Cron: 0 6 * * * (diario 6h BRT)
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Faltam SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const COMPETITORS_IG = [
  'adamstewartmarketing', 'divyannshisharma', 'oalanicolas', 'charlieautomates',
  'noevarner.ai', 'liamjohnston.ai', 'odanilogato', 'thaismartan'
]

const COMPETITORS_LINKEDIN = [
  'Adam Stewart AI marketing', 'Divyannshi Sharma AI automation',
  'Alani Nicolas AI', 'Charlie automates AI',
  'Noe Varner AI tools', 'Liam Johnston AI agency',
  'Danilo Gato AI', 'Thais Marta AI'
]

const COMPETITORS_X = [
  'adamstewartmktg', 'divyannshi', 'oalanicolas', 'charlieautomates',
  'noevarner', 'liamjohnston_ai', 'odanilogato', 'thaismartan'
]

const REDDIT_TERMS = [
  'AI automation business', 'AI agents for business', 'Claude AI tools',
  'inteligencia artificial negocios', 'AI content creation'
]

async function webSearch(query) {
  try {
    const res = await fetch(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbs=qdr:d`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ContentTeamBot/1.0)' }
    })
    const html = await res.text()
    return html.substring(0, 5000)
  } catch (err) {
    console.warn(`  Busca falhou: ${query} — ${err.message}`)
    return ''
  }
}

function extractInsights(html, source) {
  const snippets = []
  const matches = html.match(/<span[^>]*>(.*?)<\/span>/g) || []
  for (const m of matches) {
    const text = m.replace(/<[^>]+>/g, '').trim()
    if (text.length > 30 && text.length < 500) {
      snippets.push(text)
    }
  }
  return snippets.slice(0, 5)
}

async function savePost(data) {
  const { error } = await supabase
    .from('ct_competitor_posts')
    .upsert(data, { onConflict: 'external_id' })

  if (error) {
    console.warn(`  Erro salvando: ${error.message}`)
  }
}

async function scrapeInstagram() {
  console.log('\n📸 Instagram — scraping via WebSearch...')
  for (const handle of COMPETITORS_IG) {
    console.log(`  @${handle}...`)
    const html = await webSearch(`site:instagram.com ${handle} post`)
    const snippets = extractInsights(html, 'instagram')
    for (const snippet of snippets) {
      await savePost({
        external_id: `ig_${handle}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        competitor_handle: handle,
        platform: 'instagram',
        content_preview: snippet,
        scraped_at: new Date().toISOString()
      })
    }
  }
}

async function scrapeLinkedIn() {
  console.log('\n💼 LinkedIn — scraping via WebSearch...')
  for (const name of COMPETITORS_LINKEDIN) {
    console.log(`  ${name}...`)
    const html = await webSearch(`site:linkedin.com/posts "${name}"`)
    const snippets = extractInsights(html, 'linkedin')
    for (const snippet of snippets) {
      await savePost({
        external_id: `li_${name.replace(/\s/g, '_')}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        competitor_handle: name,
        platform: 'linkedin',
        content_preview: snippet,
        scraped_at: new Date().toISOString()
      })
    }
  }
}

async function scrapeX() {
  console.log('\n🐦 X/Twitter — scraping via WebSearch...')
  for (const handle of COMPETITORS_X) {
    console.log(`  @${handle}...`)
    const html = await webSearch(`site:x.com ${handle}`)
    const snippets = extractInsights(html, 'x')
    for (const snippet of snippets) {
      await savePost({
        external_id: `x_${handle}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        competitor_handle: handle,
        platform: 'x',
        content_preview: snippet,
        scraped_at: new Date().toISOString()
      })
    }
  }
}

async function scrapeReddit() {
  console.log('\n🟠 Reddit — scraping via WebSearch...')
  for (const term of REDDIT_TERMS) {
    console.log(`  "${term}"...`)
    const html = await webSearch(`site:reddit.com ${term}`)
    const snippets = extractInsights(html, 'reddit')
    for (const snippet of snippets) {
      await savePost({
        external_id: `rd_${term.replace(/\s/g, '_')}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        competitor_handle: term,
        platform: 'reddit',
        content_preview: snippet,
        scraped_at: new Date().toISOString()
      })
    }
  }
}

async function main() {
  console.log('🔍 Content Team — Scraping de Concorrentes')
  console.log(`📅 ${new Date().toISOString()}\n`)

  await scrapeInstagram()
  await scrapeLinkedIn()
  await scrapeX()
  await scrapeReddit()

  // Contar resultados do dia
  const today = new Date().toISOString().split('T')[0]
  const { count } = await supabase
    .from('ct_competitor_posts')
    .select('*', { count: 'exact', head: true })
    .gte('scraped_at', `${today}T00:00:00`)

  console.log(`\n✅ Scraping completo! ${count || 0} posts salvos hoje.`)
}

main().catch(err => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
