import { createServer } from 'http'

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET
const REDIRECT_URI = 'http://95.216.184.147:3000/callback'
const SCOPES = 'openid,profile,w_member_social'

// Step 1: Generate auth URL
const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`

console.log('\n🔗 Abra este link no navegador e autorize:\n')
console.log(authUrl)
console.log('\n⏳ Aguardando callback...\n')

// Step 2: Start local server to catch the callback
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `https://localhost:3000`)

  if (url.pathname === '/callback') {
    const code = url.searchParams.get('code')

    if (!code) {
      res.writeHead(400)
      res.end('Erro: código não recebido')
      return
    }

    console.log('📥 Código recebido:', code.substring(0, 20) + '...')

    // Step 3: Exchange code for access token
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI
      })
    })

    const tokenData = await tokenRes.json()

    if (tokenData.access_token) {
      // Step 4: Get user profile to find person URN
      const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
      })
      const profile = await profileRes.json()

      console.log('\n✅ Token obtido com sucesso!')
      console.log(`👤 Nome: ${profile.name}`)
      console.log(`🆔 Sub (person ID): ${profile.sub}`)
      console.log(`⏰ Expira em: ${tokenData.expires_in} segundos (${Math.round(tokenData.expires_in/86400)} dias)`)
      console.log(`\n🔑 Access Token:\n${tokenData.access_token}`)
      console.log(`\n📋 Adicione ao .env:`)
      console.log(`LINKEDIN_ACCESS_TOKEN=${tokenData.access_token}`)
      console.log(`LINKEDIN_PERSON_ID=${profile.sub}`)

      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end('<h1>Token obtido!</h1><p>Pode fechar esta aba.</p>')
    } else {
      console.log('❌ Erro:', JSON.stringify(tokenData))
      res.writeHead(400)
      res.end('Erro ao obter token')
    }

    server.close()
  }
})

server.listen(3000, () => {
  console.log('🖥️ Servidor local rodando em https://localhost:3000')
})
