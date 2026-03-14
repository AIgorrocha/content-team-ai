const LINKEDIN_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN
const LINKEDIN_PERSON_ID = process.env.LINKEDIN_PERSON_ID
const LINKEDIN_API = 'https://api.linkedin.com'

async function linkedinFetch(endpoint, method = 'GET', body = null) {
  const res = await fetch(`${LINKEDIN_API}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${LINKEDIN_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': '202401'
    },
    body: body ? JSON.stringify(body) : null
  })
  const text = await res.text()
  try { return JSON.parse(text) } catch { return { status: res.status, body: text } }
}

async function postText(caption) {
  console.log('\n📝 Publicando texto no LinkedIn...')

  const result = await linkedinFetch('/rest/posts', 'POST', {
    author: `urn:li:person:${LINKEDIN_PERSON_ID}`,
    commentary: caption,
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: [],
      thirdPartyDistributionChannels: []
    },
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: false
  })

  if (result.status === 201 || result.body?.includes('201')) {
    console.log('✅ Post publicado no LinkedIn!')
    return result
  } else {
    console.log('❌ Erro:', JSON.stringify(result))
    return result
  }
}

async function postWithImages(caption, imageUrls) {
  console.log(`\n📤 Publicando com ${imageUrls.length} imagem(ns) no LinkedIn...`)

  // Step 1: Initialize upload for each image
  const imageUrns = []
  for (const url of imageUrls) {
    // Initialize upload
    const initRes = await linkedinFetch('/rest/images?action=initializeUpload', 'POST', {
      initializeUploadRequest: {
        owner: `urn:li:person:${LINKEDIN_PERSON_ID}`
      }
    })

    const uploadUrl = initRes.value?.uploadUrl
    const imageUrn = initRes.value?.image

    if (!uploadUrl) {
      console.log('❌ Erro ao inicializar upload:', JSON.stringify(initRes))
      return
    }

    // Download image from URL
    const imgRes = await fetch(url)
    const imgBuffer = await imgRes.arrayBuffer()

    // Upload image
    await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${LINKEDIN_TOKEN}`,
        'Content-Type': 'application/octet-stream'
      },
      body: imgBuffer
    })

    console.log(`  ✅ Imagem enviada: ${imageUrn}`)
    imageUrns.push(imageUrn)
  }

  // Step 2: Create post with images
  const content = imageUrns.length === 1
    ? { media: { title: 'Post', id: imageUrns[0] } }
    : { multiImage: { images: imageUrns.map(id => ({ id, altText: '' })) } }

  const result = await linkedinFetch('/rest/posts', 'POST', {
    author: `urn:li:person:${LINKEDIN_PERSON_ID}`,
    commentary: caption,
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: [],
      thirdPartyDistributionChannels: []
    },
    content,
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: false
  })

  if (result.status === 201 || result.body?.includes('201')) {
    console.log('✅ Post com imagens publicado no LinkedIn!')
  } else {
    console.log('❌ Erro:', JSON.stringify(result))
  }
  return result
}

// --- Main ---
const caption = process.argv.slice(2).find(a => a.startsWith('--caption='))?.replace('--caption=', '')
const images = process.argv.slice(2).filter(a => !a.startsWith('--'))

if (!caption) {
  console.log('Uso:')
  console.log('  Texto: node post-linkedin.mjs --caption="Seu texto"')
  console.log('  Com imagens: node post-linkedin.mjs img1.png img2.png --caption="Seu texto"')
  console.log('  (imagens devem ser URLs públicas)')
  process.exit(1)
}

if (!LINKEDIN_TOKEN || !LINKEDIN_PERSON_ID) {
  console.log('❌ Configure LINKEDIN_ACCESS_TOKEN e LINKEDIN_PERSON_ID no .env')
  console.log('   Rode: node scripts/linkedin-auth.mjs')
  process.exit(1)
}

if (images.length > 0) {
  postWithImages(caption, images)
} else {
  postText(caption)
}
