/**
 * scrape-playwright.mjs
 *
 * Scraping real com Playwright (navegador headless).
 * Funciona sem login pra Instagram, Reddit, X (via Nitter), LinkedIn (via Google).
 *
 * TRACKING: 9 concorrentes no Instagram (perfis publicos)
 * PESQUISA: Tendencias de agentes IA, sistemas IA, cases gestores
 *
 * Uso: node scripts/scrape-playwright.mjs
 * Cron: 0 6 * * * (diario 6h BRT)
 */
import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Faltam SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// --- Config ---
const COMPETITORS_IG = [
  'adamstewartmarketing', 'divyannshisharma', 'oalanicolas', 'charlieautomates',
  'noevarner.ai', 'liamjohnston.ai', 'odanilogato', 'thaismartan', 'forgoodcode'
]

const RESEARCH_QUERIES = {
  linkedin: [
    'site:linkedin.com/posts "agentes de IA" OR "AI agents" gestores',
    'site:linkedin.com/posts "automacao com IA" OR "AI automation" empresas resultados',
    'site:linkedin.com/pulse "inteligencia artificial" negocios cases'
  ],
  x_nitter: [
    // Nitter mirrors publicos (sem login)
    'AI agents business automation',
    'Claude Code AI agent',
    'multi agent system real use case'
  ],
  reddit: [
    { sub: 'ClaudeAI', sort: 'hot' },
    { sub: 'artificial', sort: 'hot' },
    { sub: 'ChatGPT', query: 'automation business' },
    { sub: 'AutomateYourself', sort: 'hot' },
    { sub: 'smallbusiness', query: 'AI automation' }
  ],
  github: [
    'Claude Code AI agent',
    'multi agent AI system',
    'AI agent framework business',
    'n8n AI agent workflow',
    'AI automation open source'
  ]
}

// --- Helpers ---
async function savePost(data) {
  const { error } = await supabase
    .from('ct_competitor_posts')
    .upsert(data, { onConflict: 'external_id' })
  if (error) console.warn(`  DB: ${error.message}`)
  else return true
}

function uid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

// --- INSTAGRAM: Scraping de perfis publicos ---
async function scrapeInstagram(page) {
  console.log('\n📸 TRACKING — 9 concorrentes no Instagram')
  let count = 0

  for (const handle of COMPETITORS_IG) {
    console.log(`  @${handle}...`)
    try {
      await page.goto(`https://www.instagram.com/${handle}/`, { waitUntil: 'domcontentloaded', timeout: 15000 })
      await page.waitForTimeout(2000)

      // Tentar pegar posts do feed
      const posts = await page.evaluate(() => {
        const articles = document.querySelectorAll('article a[href*="/p/"]')
        const results = []
        articles.forEach(a => {
          const href = a.getAttribute('href')
          const img = a.querySelector('img')
          const alt = img ? img.getAttribute('alt') : ''
          if (href && alt) {
            results.push({ url: `https://www.instagram.com${href}`, caption: alt })
          }
        })
        return results.slice(0, 6)
      })

      // Se nao achou via articles, tenta meta tags
      if (posts.length === 0) {
        const metaPosts = await page.evaluate(() => {
          const metas = document.querySelectorAll('meta[property="og:description"], meta[name="description"]')
          const results = []
          metas.forEach(m => {
            const content = m.getAttribute('content')
            if (content && content.length > 20) {
              results.push({ caption: content, url: window.location.href })
            }
          })
          return results.slice(0, 3)
        })
        posts.push(...metaPosts)
      }

      for (const post of posts) {
        const saved = await savePost({
          external_id: `ig_${handle}_${uid()}`,
          competitor_handle: handle,
          platform: 'instagram',
          source_type: 'competitor_tracking',
          content_preview: post.caption.substring(0, 500),
          scraped_at: new Date().toISOString()
        })
        if (saved) count++
      }

      if (posts.length === 0) {
        // Fallback: pegar bio/descricao da pagina
        const bio = await page.evaluate(() => {
          const spans = Array.from(document.querySelectorAll('span'))
          return spans.filter(s => s.textContent.length > 30 && s.textContent.length < 300)
            .map(s => s.textContent).slice(0, 2)
        })
        for (const text of bio) {
          await savePost({
            external_id: `ig_bio_${handle}_${uid()}`,
            competitor_handle: handle,
            platform: 'instagram',
            source_type: 'competitor_tracking',
            content_preview: text,
            scraped_at: new Date().toISOString()
          })
          count++
        }
      }

      console.log(`    ${posts.length || 'bio'} posts encontrados`)
    } catch (err) {
      console.warn(`    Erro: ${err.message.substring(0, 80)}`)
    }

    await page.waitForTimeout(1500 + Math.random() * 1500) // anti-rate-limit
  }
  return count
}

// --- LINKEDIN: Via Google (sem login) ---
async function scrapeLinkedIn(page) {
  console.log('\n💼 PESQUISA — LinkedIn (via Google, sem login)')
  let count = 0

  for (const query of RESEARCH_QUERIES.linkedin) {
    console.log(`  "${query.substring(0, 60)}..."`)
    try {
      await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbs=qdr:w`, {
        waitUntil: 'domcontentloaded', timeout: 15000
      })
      await page.waitForTimeout(2000)

      const results = await page.evaluate(() => {
        const items = []
        document.querySelectorAll('div.g, div[data-sokoban-container]').forEach(el => {
          const titleEl = el.querySelector('h3')
          const snippetEl = el.querySelector('div[data-sncf], span[style*="line-clamp"], div.VwiC3b')
          const linkEl = el.querySelector('a[href*="linkedin.com"]')

          if (titleEl && snippetEl) {
            items.push({
              title: titleEl.textContent.trim(),
              snippet: snippetEl.textContent.trim(),
              url: linkEl ? linkEl.href : ''
            })
          }
        })
        return items.slice(0, 5)
      })

      for (const r of results) {
        const text = `${r.title}\n${r.snippet}`
        if (text.length > 30) {
          const saved = await savePost({
            external_id: `li_${uid()}`,
            competitor_handle: query.substring(0, 50),
            platform: 'linkedin',
            source_type: 'trend_research',
            content_preview: text.substring(0, 500),
            scraped_at: new Date().toISOString()
          })
          if (saved) count++
        }
      }

      console.log(`    ${results.length} resultados`)
    } catch (err) {
      console.warn(`    Erro: ${err.message.substring(0, 80)}`)
    }
    await page.waitForTimeout(2000 + Math.random() * 2000)
  }
  return count
}

// --- X/TWITTER: Via Nitter (sem login) ---
async function scrapeX(page) {
  console.log('\n🐦 PESQUISA — X/Twitter (via Google, sem login)')
  let count = 0

  // Nitter mirrors mudam frequentemente, usar Google como fallback
  const queries = RESEARCH_QUERIES.x_nitter.map(q => `site:x.com OR site:nitter.net "${q}"`)

  for (const query of queries) {
    console.log(`  "${query.substring(0, 60)}..."`)
    try {
      await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbs=qdr:w`, {
        waitUntil: 'domcontentloaded', timeout: 15000
      })
      await page.waitForTimeout(2000)

      const results = await page.evaluate(() => {
        const items = []
        document.querySelectorAll('div.g').forEach(el => {
          const titleEl = el.querySelector('h3')
          const snippetEl = el.querySelector('div.VwiC3b, span[style*="line-clamp"]')
          if (titleEl && snippetEl) {
            items.push({
              title: titleEl.textContent.trim(),
              snippet: snippetEl.textContent.trim()
            })
          }
        })
        return items.slice(0, 5)
      })

      for (const r of results) {
        const text = `${r.title}\n${r.snippet}`
        if (text.length > 30) {
          const saved = await savePost({
            external_id: `x_${uid()}`,
            competitor_handle: query.substring(0, 50),
            platform: 'x',
            source_type: 'trend_research',
            content_preview: text.substring(0, 500),
            scraped_at: new Date().toISOString()
          })
          if (saved) count++
        }
      }

      console.log(`    ${results.length} resultados`)
    } catch (err) {
      console.warn(`    Erro: ${err.message.substring(0, 80)}`)
    }
    await page.waitForTimeout(2000 + Math.random() * 2000)
  }
  return count
}

// --- REDDIT: Direto (publico, sem login) ---
async function scrapeReddit(page) {
  console.log('\n🟠 PESQUISA — Reddit (direto, sem login)')
  let count = 0

  for (const config of RESEARCH_QUERIES.reddit) {
    const url = config.query
      ? `https://old.reddit.com/r/${config.sub}/search?q=${encodeURIComponent(config.query)}&restrict_sr=on&sort=relevance&t=week`
      : `https://old.reddit.com/r/${config.sub}/${config.sort || 'hot'}/`

    console.log(`  r/${config.sub}${config.query ? ` "${config.query}"` : ''}...`)
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 })
      await page.waitForTimeout(2000)

      const posts = await page.evaluate(() => {
        const items = []
        document.querySelectorAll('div.thing[data-type="link"]').forEach(el => {
          const titleEl = el.querySelector('a.title')
          const scoreEl = el.querySelector('div.score.unvoted')
          if (titleEl) {
            items.push({
              title: titleEl.textContent.trim(),
              score: scoreEl ? scoreEl.textContent.trim() : '0',
              url: titleEl.href
            })
          }
        })
        return items.slice(0, 8)
      })

      for (const post of posts) {
        if (post.title.length > 15) {
          const saved = await savePost({
            external_id: `rd_${config.sub}_${uid()}`,
            competitor_handle: `r/${config.sub}`,
            platform: 'reddit',
            source_type: 'trend_research',
            content_preview: `[${post.score} pts] ${post.title}`.substring(0, 500),
            scraped_at: new Date().toISOString()
          })
          if (saved) count++
        }
      }

      console.log(`    ${posts.length} posts`)
    } catch (err) {
      console.warn(`    Erro: ${err.message.substring(0, 80)}`)
    }
    await page.waitForTimeout(1500 + Math.random() * 1500)
  }
  return count
}

// --- GITHUB: API oficial (ja funciona sem browser) ---
async function scrapeGitHub() {
  console.log('\n🐙 PESQUISA — GitHub Repos (API oficial)')
  let count = 0

  for (const query of RESEARCH_QUERIES.github) {
    console.log(`  "${query}"...`)
    try {
      const res = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=5`,
        { headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'ContentTeamAI/1.0' } }
      )
      const data = await res.json()

      for (const repo of (data.items || [])) {
        const saved = await savePost({
          external_id: `gh_${repo.full_name.replace('/', '_')}_${uid()}`,
          competitor_handle: repo.full_name,
          platform: 'github',
          source_type: 'repo_research',
          content_preview: `⭐ ${repo.stargazers_count} | ${repo.language || 'n/a'} | ${repo.description || ''} | ${repo.html_url}`.substring(0, 500),
          scraped_at: new Date().toISOString()
        })
        if (saved) count++
        console.log(`    ⭐ ${repo.stargazers_count} — ${repo.full_name}`)
      }
    } catch (err) {
      console.warn(`    Erro: ${err.message.substring(0, 80)}`)
    }
  }
  return count
}

// --- MAIN ---
async function main() {
  console.log('🔍 Content Team — Scraping com Playwright')
  console.log(`📅 ${new Date().toISOString()}`)
  console.log('='.repeat(60))

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  })

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    locale: 'pt-BR'
  })

  const page = await context.newPage()

  let igCount = 0, liCount = 0, xCount = 0, rdCount = 0, ghCount = 0

  try {
    igCount = await scrapeInstagram(page)
    liCount = await scrapeLinkedIn(page)
    xCount = await scrapeX(page)
    rdCount = await scrapeReddit(page)
    ghCount = await scrapeGitHub() // Nao precisa de browser
  } finally {
    await browser.close()
  }

  const total = igCount + liCount + xCount + rdCount + ghCount

  console.log('\n' + '='.repeat(60))
  console.log('📊 Resumo:')
  console.log(`  📸 Instagram (tracking): ${igCount}`)
  console.log(`  💼 LinkedIn (pesquisa): ${liCount}`)
  console.log(`  🐦 X/Twitter (pesquisa): ${xCount}`)
  console.log(`  🟠 Reddit (pesquisa): ${rdCount}`)
  console.log(`  🐙 GitHub (repos): ${ghCount}`)
  console.log(`  📦 Total: ${total}`)

  // Notificar Telegram
  const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN
  const TG_CHAT = process.env.TELEGRAM_CHAT_ID
  if (TG_TOKEN && TG_CHAT) {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT,
        text: `Scraping diario completo (Playwright)\n\nIG tracking: ${igCount}\nLinkedIn: ${liCount}\nX: ${xCount}\nReddit: ${rdCount}\nGitHub: ${ghCount}\nTotal: ${total}`
      })
    }).catch(() => {})
  }
}

main().catch(err => {
  console.error('❌ Erro fatal:', err.message)
  process.exit(1)
})
