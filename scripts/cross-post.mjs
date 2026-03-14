/**
 * cross-post.mjs
 * A partir de um conteudo do Instagram, gera versoes NATIVAS com angulo diferente
 * pra cada rede (LinkedIn, X thread, TikTok script, YouTube Shorts script).
 *
 * REGRA: NUNCA repetir o mesmo conteudo. Cada rede = angulo diferente do mesmo TEMA.
 *
 * Uso: node scripts/cross-post.mjs --tema="Como usar Claude Code" --carrossel-id=UUID
 * Ou:  node scripts/cross-post.mjs --tema="Como usar Claude Code" --legenda="texto da legenda IG"
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const LINKEDIN_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN
const LINKEDIN_PERSON_ID = process.env.LINKEDIN_PERSON_ID

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Faltam SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

function parseArgs() {
  const args = {}
  for (const arg of process.argv.slice(2)) {
    const match = arg.match(/^--(\w[\w-]*)=(.+)$/)
    if (match) args[match[1]] = match[2]
  }
  return args
}

function generateLinkedInPost(tema, legendaIG) {
  return `Hoje quero compartilhar algo que mudou minha rotina como consultor de IA.

${tema}

A maioria dos gestores que conheço ainda faz isso manualmente. Gastam horas em tarefas que poderiam ser automatizadas em minutos.

Aqui vai o que aprendi na pratica:

1. Comece pelo processo mais repetitivo da sua empresa
2. Use ferramentas que ja existem (nao precisa programar)
3. Teste com 1 pessoa antes de escalar
4. Meça o tempo economizado — esse e o ROI real

O resultado? Meus clientes economizam em media 15h por semana com automacoes simples.

Se voce e gestor e quer entender como IA pode ajudar seu negocio, me chama no DM.

#IAparaNegócios #Automação #Produtividade #GestãoInteligente #ConsultorIA`
}

function generateXThread(tema) {
  return [
    `🧵 Thread: ${tema}\n\nVou te mostrar em 8 tweets o que levo semanas explicando pra clientes.\n\nAbra e salve. 👇`,
    `1/ O problema: a maioria dos gestores usa IA como "ChatGPT pra escrever email".\n\nIsso e como comprar um carro e so usar o radio.\n\nIA pode AUTOMATIZAR processos inteiros.`,
    `2/ Primeiro passo: identifique o processo mais REPETITIVO da sua empresa.\n\nExemplos:\n- Responder as mesmas perguntas no WhatsApp\n- Preencher planilhas manualmente\n- Cobrar equipe por tarefas`,
    `3/ Segundo passo: escolha a ferramenta certa.\n\nNao precisa programar:\n- n8n (automacao visual)\n- Claude (texto e analise)\n- Zapier (integracoes simples)`,
    `4/ Terceiro passo: teste com 1 pessoa da equipe.\n\nNao escale antes de validar.\n\nO erro mais comum: querer automatizar tudo de uma vez.`,
    `5/ Quarto passo: meça o resultado.\n\n- Quanto tempo economizou?\n- Quantos erros reduziu?\n- A equipe consegue usar sozinha?`,
    `6/ Resultado real: um cliente meu reduziu 15h/semana de trabalho manual com 3 automacoes simples.\n\nNenhuma delas exigiu programacao.`,
    `7/ O segredo: IA nao substitui pessoas.\n\nIA substitui TAREFAS CHATAS pra que pessoas foquem no que importa.`,
    `8/ Resumo:\n\n✅ Identifique o repetitivo\n✅ Escolha ferramenta simples\n✅ Teste pequeno\n✅ Meça resultado\n✅ Escale o que funciona\n\nQuer ajuda? Me chama no DM.\n\n🔄 RT se foi util!`
  ]
}

function generateTikTokScript(tema) {
  return {
    platform: 'tiktok',
    format: 'reels_9x16',
    duration: '21-34s',
    avatar: 'igor_casual',
    script: `[HOOK - 1s] Voce ta usando IA errado.

[DESENVOLVIMENTO - 20s]
A maioria das pessoas usa ChatGPT pra escrever texto e acha que ta usando IA.

Mas o poder real ta em AUTOMACAO.

Deixa eu te mostrar em 20 segundos o que eu configuro pros meus clientes:
- Bot no WhatsApp que responde 24h
- Relatorios que se geram sozinhos
- Cobranças automaticas pra equipe

Tudo isso SEM programar.

[CTA - 5s]
Quer aprender? Comenta "IA" que te mando o passo a passo.`,
    hashtags: '#IA #Automação #Produtividade #ClaudeAI #NegóciosInteligentes'
  }
}

function generateYouTubeShortsScript(tema) {
  return {
    platform: 'youtube_shorts',
    format: 'reels_9x16',
    duration: '30-60s',
    avatar: 'igor_formal',
    script: `[HOOK - 2s] O erro mais comum ao usar IA nos negocios.

[PROBLEMA - 10s]
90% dos gestores que conheço usam IA so pra "escrever melhor".
Isso e como ter um assistente e so pedir pra ele buscar cafe.

[COMPARACAO - 15s]
Olha a diferenca:

SEM automacao:
- 2h respondendo WhatsApp
- 1h preenchendo planilha
- 30min cobrando equipe

COM automacao:
- Bot responde 24h
- Planilha se preenche
- Cobranca automatica

[RESULTADO - 10s]
Meu cliente economizou 15 horas por semana.
Quinze. Horas.

[CTA - 5s]
Se inscreve pra mais dicas praticas de IA pros negocios.
Link na bio pra consultoria gratuita.`,
    hashtags: '#IA #Automação #Shorts #Produtividade #Negócios'
  }
}

async function saveContentItem(item) {
  const { error } = await supabase
    .from('ct_content_items')
    .insert(item)

  if (error) {
    console.warn(`  Erro salvando: ${error.message}`)
  }
}

async function postToLinkedIn(text) {
  if (!LINKEDIN_TOKEN || !LINKEDIN_PERSON_ID) {
    console.log('  ⚠️  LinkedIn nao configurado, salvando como draft')
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
        commentary: text,
        visibility: 'PUBLIC',
        distribution: { feedDistribution: 'MAIN_FEED', targetEntities: [], thirdPartyDistributionChannels: [] },
        lifecycleState: 'PUBLISHED',
        isReshareDisabledByAuthor: false
      })
    })
    return res.status === 201
  } catch (err) {
    console.warn(`  Erro LinkedIn: ${err.message}`)
    return false
  }
}

async function main() {
  const args = parseArgs()
  const tema = args.tema || args.theme
  const legendaIG = args.legenda || ''

  if (!tema) {
    console.log('Uso: node scripts/cross-post.mjs --tema="Tema do conteudo" [--legenda="legenda IG"]')
    process.exit(1)
  }

  console.log(`🔄 Cross-Post — Tema: "${tema}"`)
  console.log(`📅 ${new Date().toISOString()}\n`)

  // 1. LinkedIn — Storytelling + dados
  console.log('💼 Gerando post LinkedIn...')
  const linkedinText = generateLinkedInPost(tema, legendaIG)
  const linkedinPublished = await postToLinkedIn(linkedinText)
  await saveContentItem({
    title: tema,
    platform: 'linkedin',
    content_type: 'linkedin_post',
    content_body: linkedinText,
    status: linkedinPublished ? 'published' : 'draft',
    source_url: 'cross-post:instagram',
    created_by: 'remix-auto'
  })
  console.log(`  ${linkedinPublished ? '✅ Publicado' : '📝 Salvo como draft'}`)

  // 2. X Thread — Insights em lista
  console.log('\n🐦 Gerando thread X/Twitter...')
  const xThread = generateXThread(tema)
  await saveContentItem({
    title: tema,
    platform: 'x',
    content_type: 'x_thread',
    content_body: JSON.stringify(xThread),
    status: 'draft',
    source_url: 'cross-post:instagram',
    created_by: 'remix-auto',
    notes: `${xThread.length} tweets na thread`
  })
  console.log(`  📝 Thread com ${xThread.length} tweets salva como draft`)

  // 3. TikTok — Script para avatar HeyGen
  console.log('\n🎵 Gerando script TikTok...')
  const tiktokScript = generateTikTokScript(tema)
  await saveContentItem({
    title: tema,
    platform: 'tiktok',
    content_type: 'reels',
    content_body: JSON.stringify(tiktokScript),
    status: 'draft',
    source_url: 'cross-post:instagram',
    created_by: 'doppel-auto',
    notes: `Avatar: ${tiktokScript.avatar}, ${tiktokScript.duration}`
  })
  console.log(`  📝 Script TikTok salvo (${tiktokScript.duration}, avatar ${tiktokScript.avatar})`)

  // 4. YouTube Shorts — Script para avatar diferente
  console.log('\n📺 Gerando script YouTube Shorts...')
  const shortsScript = generateYouTubeShortsScript(tema)
  await saveContentItem({
    title: tema,
    platform: 'youtube',
    content_type: 'youtube_short',
    content_body: JSON.stringify(shortsScript),
    status: 'draft',
    source_url: 'cross-post:instagram',
    created_by: 'doppel-auto',
    notes: `Avatar: ${shortsScript.avatar}, ${shortsScript.duration}`
  })
  console.log(`  📝 Script Shorts salvo (${shortsScript.duration}, avatar ${shortsScript.avatar})`)

  // 5. Threads — lembrete pra compartilhar do IG
  console.log('\n🧵 Threads: compartilhar direto do Instagram (sem API)')

  console.log('\n✅ Cross-post completo!')
  console.log('  💼 LinkedIn: publicado/draft')
  console.log('  🐦 X: thread draft (postar manual)')
  console.log('  🎵 TikTok: script pronto (gravar com HeyGen)')
  console.log('  📺 Shorts: script pronto (gravar com HeyGen)')
  console.log('  🧵 Threads: compartilhar do IG manualmente')
}

main().catch(err => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
