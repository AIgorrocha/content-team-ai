/**
 * Memory Tool — Sistema de memoria persistente estilo OpenClaw
 *
 * Duas operacoes:
 * - memory_read: busca memorias por palavras-chave
 * - memory_write: salva nova memoria no log do dia
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const memoryDir = path.resolve(__dirname, '../../../memory')

// Supabase client (Camada 2)
const supabase = (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null

// Session ID unico por execucao (agrupa memorias de uma mesma rodada)
const SESSION_ID = `session-${new Date().toISOString().replace(/[:.]/g, '-')}-${Math.random().toString(36).slice(2, 8)}`

// --- Tool Definitions ---

export const memoryReadToolDefinition = {
  name: 'memory_read',
  description: 'Busca memorias salvas por palavras-chave. Retorna trechos relevantes do MEMORY.md e dos logs recentes.',
  input_schema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Palavras-chave para buscar nas memorias (ex: "concorrentes", "decisao carrossel")'
      }
    },
    required: ['query']
  }
}

export const memoryWriteToolDefinition = {
  name: 'memory_write',
  description: 'Salva uma memoria no log do dia. Use para registrar decisoes, aprendizados, resultados importantes.',
  input_schema: {
    type: 'object',
    properties: {
      content: {
        type: 'string',
        description: 'O conteudo da memoria a salvar (em PT-BR)'
      },
      category: {
        type: 'string',
        enum: ['resultado', 'decisao', 'aprendizado', 'contexto'],
        description: 'Tipo da memoria'
      },
      agent: {
        type: 'string',
        description: 'Nome do agente que esta salvando (ex: ct-scout)'
      }
    },
    required: ['content', 'category']
  }
}

export const memoryHandoffToolDefinition = {
  name: 'memory_handoff',
  description: 'Passa contexto estruturado para o proximo agente no pipeline. Salva no Supabase para persistencia.',
  input_schema: {
    type: 'object',
    properties: {
      from_agent: {
        type: 'string',
        description: 'Agente que esta enviando (ex: ct-scout)'
      },
      to_agent: {
        type: 'string',
        description: 'Agente que vai receber (ex: ct-quill). Use "all" para todos.'
      },
      summary: {
        type: 'string',
        description: 'Resumo estruturado do que foi feito e do que o proximo agente precisa saber'
      },
      key_data: {
        description: 'Dados estruturados opcionais (JSON) — IDs de items criados, metricas, etc.'
      }
    },
    required: ['from_agent', 'to_agent', 'summary']
  }
}

// --- Helpers ---

function todayFilename() {
  return `${new Date().toISOString().split('T')[0]}.md`
}

function getRecentDays(count = 3) {
  const files = []
  for (let i = 0; i < count; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const filename = `${date.toISOString().split('T')[0]}.md`
    const filepath = path.join(memoryDir, filename)
    if (fs.existsSync(filepath)) {
      files.push({ date: filename, content: fs.readFileSync(filepath, 'utf-8') })
    }
  }
  return files
}

function searchInText(text, keywords) {
  const lower = text.toLowerCase()
  const terms = keywords.toLowerCase().split(/\s+/)
  const lines = text.split('\n')

  const matches = []
  for (const line of lines) {
    const lineLower = line.toLowerCase()
    const score = terms.filter(t => lineLower.includes(t)).length
    if (score > 0) {
      matches.push({ line: line.trim(), score })
    }
  }

  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, 15)
    .map(m => m.line)
}

// --- Handlers ---

export async function handleMemoryRead(input) {
  const { query } = input

  try {
    const results = []

    // 1. Buscar no MEMORY.md (longo prazo)
    const memoryPath = path.join(memoryDir, 'MEMORY.md')
    if (fs.existsSync(memoryPath)) {
      const content = fs.readFileSync(memoryPath, 'utf-8')
      const matches = searchInText(content, query)
      if (matches.length > 0) {
        results.push({ source: 'MEMORY.md (longo prazo)', matches })
      }
    }

    // 2. Buscar nos logs recentes (ultimos 3 dias)
    const recentFiles = getRecentDays(3)
    for (const file of recentFiles) {
      const matches = searchInText(file.content, query)
      if (matches.length > 0) {
        results.push({ source: `${file.date} (log diario)`, matches })
      }
    }

    // 3. Buscar no Supabase (Camada 2)
    const supabaseResults = await querySupabaseMemory({}, 20)
    if (supabaseResults.length > 0) {
      // Filtrar por keyword nos resultados do Supabase
      const terms = query.toLowerCase().split(/\s+/)
      const matched = supabaseResults.filter(row => {
        const text = `${row.agent} ${row.category} ${row.content}`.toLowerCase()
        return terms.some(t => text.includes(t))
      })
      if (matched.length > 0) {
        results.push({
          source: 'Supabase (ct_agent_memory)',
          matches: matched.slice(0, 10).map(r =>
            `[${r.agent}/${r.category}] ${r.content.substring(0, 200)}`
          )
        })
      }
    }

    if (results.length === 0) {
      return { success: true, data: 'Nenhuma memoria encontrada para: ' + query }
    }

    return { success: true, data: results }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function handleMemoryWrite(input) {
  const { content, category, agent = 'unknown' } = input

  try {
    if (!fs.existsSync(memoryDir)) {
      fs.mkdirSync(memoryDir, { recursive: true })
    }

    const filepath = path.join(memoryDir, todayFilename())
    const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

    const isNew = !fs.existsSync(filepath)
    const header = isNew
      ? `# Log — ${new Date().toISOString().split('T')[0]}\n\n`
      : ''

    const entry = `${header}### [${timestamp}] ${agent} — ${category}\n${content}\n\n`

    fs.appendFileSync(filepath, entry, 'utf-8')

    // Camada 2: persistir no Supabase
    await persistToSupabase(agent, category, content)

    return { success: true, data: `Memoria salva em ${todayFilename()} (${category})` }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// --- Camada 2: Supabase Persistence ---

async function persistToSupabase(agent, category, content, metadata = {}) {
  if (!supabase) return // Graceful degradation se nao tiver Supabase

  try {
    const { error } = await supabase
      .from('ct_agent_memory')
      .insert({
        agent,
        category,
        content: content.substring(0, 10000), // Limitar tamanho
        metadata,
        session_id: SESSION_ID
      })

    if (error) {
      // Tabela pode nao existir ainda — nao quebrar o fluxo
      if (error.message.includes('does not exist') || error.code === '42P01') {
        console.log('  ⚠️  ct_agent_memory nao existe. Execute: node scripts/sdk/migrations/001_create_ct_agent_memory.mjs')
      }
    }
  } catch {
    // Silencioso — Camada 2 e opcional, nao pode quebrar Camada 1
  }
}

async function querySupabaseMemory(filters = {}, limit = 10) {
  if (!supabase) return []

  try {
    let query = supabase
      .from('ct_agent_memory')
      .select('agent, category, content, metadata, created_at')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (filters.agent) query = query.eq('agent', filters.agent)
    if (filters.category) query = query.eq('category', filters.category)
    if (filters.session_id) query = query.eq('session_id', filters.session_id)

    const { data, error } = await query
    if (error) return []
    return data || []
  } catch {
    return []
  }
}

// --- Handoff Handler ---

export async function handleMemoryHandoff(input) {
  const { from_agent, to_agent, summary, key_data = {} } = input

  try {
    // 1. Salvar no arquivo local (Camada 1)
    await handleMemoryWrite({
      content: `HANDOFF ${from_agent} → ${to_agent}:\n${summary}\nDados: ${JSON.stringify(key_data).substring(0, 500)}`,
      category: 'contexto',
      agent: from_agent
    })

    // 2. Persistir no Supabase (Camada 2)
    await persistToSupabase(from_agent, 'handoff', summary, {
      to_agent,
      key_data,
      session_id: SESSION_ID
    })

    return {
      success: true,
      data: `Handoff salvo: ${from_agent} → ${to_agent}. Session: ${SESSION_ID}`
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// --- Memory Loader (para injetar no system prompt) ---

export async function loadMemoryContext() {
  const parts = []

  // MEMORY.md — longo prazo
  const memoryPath = path.join(memoryDir, 'MEMORY.md')
  if (fs.existsSync(memoryPath)) {
    const content = fs.readFileSync(memoryPath, 'utf-8')
    parts.push(`## Memoria de Longo Prazo\n${content}`)
  }

  // Ultimos 3 dias de logs
  const recentFiles = getRecentDays(3)
  if (recentFiles.length > 0) {
    parts.push('## Memorias Recentes')
    for (const file of recentFiles) {
      // Limitar a 2000 chars por dia para nao estourar contexto
      const trimmed = file.content.length > 2000
        ? file.content.substring(0, 2000) + '\n...(truncado)'
        : file.content
      parts.push(`### ${file.date}\n${trimmed}`)
    }
  }

  // Handoffs recentes do Supabase (Camada 2)
  const recentHandoffs = await querySupabaseMemory({ category: 'handoff' }, 5)
  if (recentHandoffs.length > 0) {
    parts.push('## Handoffs Recentes (entre agentes)')
    for (const h of recentHandoffs) {
      const age = Math.round((Date.now() - new Date(h.created_at).getTime()) / 3600000)
      parts.push(`- **${h.agent}** (${age}h atras): ${h.content.substring(0, 300)}`)
    }
  }

  return parts.join('\n\n')
}

// Exportar session ID para uso externo
export function getSessionId() {
  return SESSION_ID
}

// --- Memory Flush (salvar resumo antes de encerrar) ---

export async function flushAgentMemory(agentName, result) {
  if (!result || result.length < 50) return

  // Extrair as primeiras 500 chars como resumo
  const summary = result.length > 500
    ? result.substring(0, 500) + '...'
    : result

  await handleMemoryWrite({
    content: summary,
    category: 'resultado',
    agent: agentName
  })
}
