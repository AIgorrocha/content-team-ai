/**
 * auto-publish.mjs
 * Orquestrador de publicacao automatica.
 * Verifica ct_content_items com status='approved' e scheduled_at=hoje,
 * publica na rede correspondente e atualiza status.
 *
 * Uso: node scripts/auto-publish.mjs
 * Cron: */30 * * * * (a cada 30min)
 */
import { createClient } from '@supabase/supabase-js'
import { execSync } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

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
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return

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
    console.warn('⚠️  Telegram falhou:', err.message)
  }
}

async function updateStatus(id, status, notes) {
  const { error } = await supabase
    .from('ct_content_items')
    .update({ status, published_at: status === 'published' ? new Date().toISOString() : null, notes })
    .eq('id', id)

  if (error) console.warn(`  Erro atualizando ${id}: ${error.message}`)
}

async function publishInstagram(item) {
  // Instagram carrossel: precisa de imagens locais
  if (!item.media_urls || item.media_urls.length === 0) {
    console.log('  ⚠️  Sem imagens, notificando pra publicacao manual')
    await notifyTelegram(`📸 *Instagram pendente:* ${item.title}\n\nSem imagens associadas. Publique manualmente.`)
    await updateStatus(item.id, 'pending_manual', 'Sem imagens — publicar manual')
    return false
  }

  const images = item.media_urls.slice(0, 10)
  if (item.media_urls.length > 10) {
    await notifyTelegram(`⚠️ *Instagram:* ${item.title}\n\n${item.media_urls.length} imagens, mas API limita 10. Poste manual pra versao completa.`)
  }

  try {
    const script = resolve(__dirname, 'post-carousel.mjs')
    const caption = item.content_body || item.title
    execSync(`node "${script}" ${images.join(' ')} --caption="${caption.replace(/"/g, '\\"')}"`, {
      env: process.env,
      stdio: 'inherit'
    })
    return true
  } catch (err) {
    console.error(`  ❌ Erro IG: ${err.message}`)
    return false
  }
}

async function publishLinkedIn(item) {
  const LINKEDIN_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN
  const LINKEDIN_PERSON_ID = process.env.LINKEDIN_PERSON_ID

  if (!LINKEDIN_TOKEN || !LINKEDIN_PERSON_ID) {
    console.log('  ⚠️  LinkedIn nao configurado')
    await updateStatus(item.id, 'pending_manual', 'LinkedIn token ausente')
    return false
  }

  try {
    const res = await fetch('https://api.linkedin.com/rest/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LINKEDIN_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
        'LinkedIn-Version': '202401'
      },
      body: JSON.stringify({
        author: `urn:li:person:${LINKEDIN_PERSON_ID}`,
        commentary: item.content_body || item.title,
        visibility: 'PUBLIC',
        distribution: { feedDistribution: 'MAIN_FEED', targetEntities: [], thirdPartyDistributionChannels: [] },
        lifecycleState: 'PUBLISHED',
        isReshareDisabledByAuthor: false
      })
    })
    return res.status === 201
  } catch (err) {
    console.error(`  ❌ Erro LinkedIn: ${err.message}`)
    return false
  }
}

async function publishManualNotify(item) {
  const platformNames = {
    tiktok: 'TikTok',
    youtube: 'YouTube Shorts',
    x: 'X/Twitter',
    threads: 'Threads'
  }
  const name = platformNames[item.platform] || item.platform

  await notifyTelegram(
    `📢 *${name} — publicar manualmente:*\n\n*${item.title}*\n\n${(item.content_body || '').substring(0, 300)}...`
  )
  await updateStatus(item.id, 'pending_manual', `Notificado via Telegram — publicar manual em ${name}`)
  return true
}

async function main() {
  console.log('🚀 Auto-Publish — Verificando conteudos aprovados')
  console.log(`📅 ${new Date().toISOString()}\n`)

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString()

  const { data: items, error } = await supabase
    .from('ct_content_items')
    .select('*')
    .eq('status', 'approved')
    .gte('scheduled_at', todayStart)
    .lte('scheduled_at', todayEnd)

  if (error) {
    console.error('Erro consultando Supabase:', error.message)
    process.exit(1)
  }

  if (!items || items.length === 0) {
    console.log('✅ Nenhum conteudo aprovado pra publicar agora.')
    return
  }

  console.log(`📋 ${items.length} conteudo(s) pra publicar:\n`)

  for (const item of items) {
    console.log(`🔹 ${item.title} (${item.platform}, ${item.content_type})`)

    let published = false

    switch (item.platform) {
      case 'instagram':
        published = await publishInstagram(item)
        break
      case 'linkedin':
        published = await publishLinkedIn(item)
        break
      case 'tiktok':
      case 'youtube':
      case 'x':
      case 'threads':
        await publishManualNotify(item)
        published = false
        break
      default:
        console.log(`  ⚠️  Plataforma desconhecida: ${item.platform}`)
    }

    if (published) {
      await updateStatus(item.id, 'published', `Publicado automaticamente em ${new Date().toISOString()}`)
      await notifyTelegram(`✅ *Publicado:* ${item.title} no ${item.platform}`)
      console.log(`  ✅ Publicado!`)
    }
  }

  console.log('\n✅ Auto-publish completo!')
}

main().catch(err => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
