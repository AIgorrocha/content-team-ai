/**
 * web-search.mjs - Busca via SearXNG local
 */

export const definition = {
  name: 'web_search',
  description: 'Pesquisa na web via SearXNG local. Use para buscar tendencias, noticias, informacoes sobre concorrentes.',
  input_schema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Termo de busca',
      },
      max_results: {
        type: 'number',
        description: 'Numero maximo de resultados (default 5, max 10)',
      },
    },
    required: ['query'],
  },
}

export async function execute(input) {
  const { query, max_results = 5 } = input
  const limit = Math.min(max_results, 10)

  try {
    const url = `http://localhost:8888/search?q=${encodeURIComponent(query)}&format=json`
    const res = await fetch(url, { signal: AbortSignal.timeout(15_000) })

    if (!res.ok) {
      return { error: `SearXNG retornou ${res.status}` }
    }

    const data = await res.json()
    const results = (data.results || []).slice(0, limit).map((r) => ({
      title: r.title,
      url: r.url,
      snippet: r.content?.substring(0, 300) || '',
    }))

    return { count: results.length, results }
  } catch (err) {
    return { error: `Busca falhou: ${err.message}` }
  }
}
