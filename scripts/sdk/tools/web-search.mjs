/**
 * Tool: Web Search + Web Fetch
 * Busca via SearXNG local (porta 8888) e carrega páginas.
 */

const SEARXNG_URL = process.env.SEARXNG_URL || 'http://localhost:8888'

export const webSearchToolDefinition = {
  name: 'web_search',
  description: 'Busca na web via SearXNG. Use para pesquisar tendências, concorrentes, notícias sobre IA e automação.',
  input_schema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Termo de busca'
      },
      max_results: {
        type: 'number',
        description: 'Máximo de resultados (default: 8)'
      }
    },
    required: ['query']
  }
}

export const webFetchToolDefinition = {
  name: 'web_fetch',
  description: 'Carrega o conteúdo de uma URL. Retorna o texto da página (máximo 5000 chars).',
  input_schema: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'URL para carregar'
      }
    },
    required: ['url']
  }
}

export async function handleWebSearchTool(input) {
  const { query, max_results = 8 } = input

  try {
    // SearXNG JSON API
    const url = `${SEARXNG_URL}/search?q=${encodeURIComponent(query)}&format=json&language=pt-BR`
    const response = await fetch(url, { signal: AbortSignal.timeout(15000) })
    const data = await response.json()

    const results = (data.results || []).slice(0, max_results).map(r => ({
      title: r.title || '',
      url: r.url || '',
      snippet: r.content || ''
    }))

    return { success: true, count: results.length, results }
  } catch (error) {
    // Fallback: DuckDuckGo HTML
    try {
      const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
      const resp = await fetch(ddgUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        signal: AbortSignal.timeout(10000)
      })
      const html = await resp.text()

      const results = []
      const regex = /<a rel="nofollow" class="result__a" href="([^"]+)"[^>]*>(.+?)<\/a>/g
      let match
      while ((match = regex.exec(html)) !== null && results.length < max_results) {
        results.push({
          url: match[1],
          title: match[2].replace(/<[^>]*>/g, '').trim(),
          snippet: ''
        })
      }
      return { success: true, count: results.length, results, source: 'duckduckgo_fallback' }
    } catch (fallbackErr) {
      return { success: false, error: `SearXNG: ${error.message} | DDG: ${fallbackErr.message}` }
    }
  }
}

export async function handleWebFetchTool(input) {
  const { url } = input

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml'
      },
      signal: AbortSignal.timeout(10000)
    })
    const html = await response.text()

    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 5000)

    return { success: true, content: text, url }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
