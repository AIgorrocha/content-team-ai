import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { basename } from 'path'

// --- Config ---
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const IG_USER_ID = process.env.INSTAGRAM_USER_ID
const IG_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN
const IG_API = 'https://graph.instagram.com/v21.0'
const BUCKET = 'instagram-posts'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// --- Helpers ---
async function uploadToSupabase(filePath) {
  const fileName = `${Date.now()}-${basename(filePath)}`
  const fileBuffer = readFileSync(filePath)
  const contentType = filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')
    ? 'image/jpeg'
    : 'image/png'

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, fileBuffer, { contentType, upsert: true })

  if (error) throw new Error(`Upload falhou: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName)
  return data.publicUrl
}

async function igApi(endpoint, body) {
  const res = await fetch(`${IG_API}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, access_token: IG_TOKEN })
  })
  const data = await res.json()
  if (data.error) throw new Error(`IG API: ${data.error.message}`)
  return data
}

async function waitForContainer(containerId) {
  for (let i = 0; i < 30; i++) {
    const res = await fetch(
      `${IG_API}/${containerId}?fields=status_code&access_token=${IG_TOKEN}`
    )
    const data = await res.json()
    if (data.status_code === 'FINISHED') return
    if (data.status_code === 'ERROR') throw new Error(`Container ${containerId} falhou`)
    await new Promise(r => setTimeout(r, 2000))
  }
  throw new Error('Timeout aguardando container')
}

async function postCarousel(imagePaths, caption) {
  console.log(`\n📤 Fazendo upload de ${imagePaths.length} imagens...`)

  // 1. Upload pro Supabase
  const urls = []
  for (const path of imagePaths) {
    const url = await uploadToSupabase(path)
    console.log(`  ✅ ${basename(path)} → ${url}`)
    urls.push(url)
  }

  // 2. Criar container pra cada imagem
  console.log('\n📦 Criando containers no Instagram...')
  const childIds = []
  for (const url of urls) {
    const { id } = await igApi(`/${IG_USER_ID}/media`, {
      image_url: url,
      is_carousel_item: true
    })
    console.log(`  📦 Container: ${id}`)
    childIds.push(id)
  }

  // 3. Aguardar cada container ficar pronto
  console.log('\n⏳ Aguardando processamento...')
  for (const id of childIds) {
    await waitForContainer(id)
  }

  // 4. Criar carrossel
  console.log('\n🎠 Criando carrossel...')
  const { id: carouselId } = await igApi(`/${IG_USER_ID}/media`, {
    media_type: 'CAROUSEL',
    children: childIds.join(','),
    caption
  })
  console.log(`  🎠 Carrossel: ${carouselId}`)
  await waitForContainer(carouselId)

  // 5. Publicar
  console.log('\n🚀 Publicando...')
  const { id: postId } = await igApi(`/${IG_USER_ID}/media_publish`, {
    creation_id: carouselId
  })

  // 6. Buscar permalink
  const res = await fetch(
    `${IG_API}/${postId}?fields=permalink&access_token=${IG_TOKEN}`
  )
  const post = await res.json()

  console.log(`\n✅ PUBLICADO!`)
  console.log(`📎 ${post.permalink}`)
  return post
}

// --- Main ---
const images = process.argv.slice(2).filter(a => !a.startsWith('--'))
const captionFlag = process.argv.find(a => a.startsWith('--caption='))
const caption = captionFlag ? captionFlag.replace('--caption=', '') : ''

if (images.length < 2) {
  console.log('Uso: node post-carousel.mjs img1.png img2.png ... --caption="Sua legenda"')
  console.log('Min 2 imagens, max 10.')
  process.exit(1)
}

if (images.length > 20) {
  console.log('Erro: Instagram permite no maximo 20 imagens por carrossel.')
  process.exit(1)
}

postCarousel(images, caption).catch(err => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
