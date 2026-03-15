/**
 * Tool: Supabase - SELECT/INSERT/UPDATE no banco ct_*
 */
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export const supabaseToolDefinition = {
  name: 'supabase_query',
  description: `Executa operações no banco Supabase. Tabelas e colunas:

ct_content_items: title, content_type (carrossel|reel|post|newsletter|video), status (idea|draft|scheduled|published), platform (instagram|linkedin|tiktok|email), scheduled_at, caption, hashtags (text), script, content_body, source_agent, brand
ct_competitor_posts: competitor_handle (@handle), post_type, caption, engagement (jsonb), posted_at, analysis, is_viral, platform, content_preview, source_type (competitor_tracking|trend_research)
ct_competitors: handle, platform, niche, is_active

IMPORTANTE: Todos os textos devem ser em PT-BR.`,
  input_schema: {
    type: 'object',
    properties: {
      operation: {
        type: 'string',
        enum: ['select', 'insert', 'update', 'delete'],
        description: 'Operação a executar'
      },
      table: {
        type: 'string',
        description: 'Nome da tabela (ex: ct_content_items)'
      },
      data: {
        description: 'Dados para insert/update. Pode ser objeto ou array de objetos para insert em lote.'
      },
      filters: {
        type: 'object',
        description: 'Filtros para select/delete (ex: { "status": "idea" })'
      },
      limit: {
        type: 'number',
        description: 'Limite de resultados (default: 50)'
      }
    },
    required: ['operation', 'table']
  }
}

export async function handleSupabaseTool(input) {
  const { operation, table, data, filters, limit = 50 } = input

  try {
    if (operation === 'select') {
      let query = supabase.from(table).select('*').limit(limit)
      if (filters) {
        for (const [key, value] of Object.entries(filters)) {
          query = query.eq(key, value)
        }
      }
      const { data: rows, error } = await query
      if (error) throw error
      return { success: true, count: rows.length, data: rows }
    }

    if (operation === 'insert') {
      const insertData = typeof data === 'string' ? JSON.parse(data) : data
      const { data: inserted, error } = await supabase
        .from(table)
        .insert(insertData)
        .select()
      if (error) throw error
      return { success: true, count: Array.isArray(inserted) ? inserted.length : 1, data: inserted }
    }

    if (operation === 'update') {
      const updateData = typeof data === 'string' ? JSON.parse(data) : data
      const { id: dataId, ...rest } = updateData
      const updateId = dataId || filters?.id
      if (!updateId) return { success: false, error: 'ID obrigatório para update (em data.id ou filters.id)' }
      const fieldsToUpdate = Object.keys(rest).length > 0 ? rest : updateData
      const { data: updated, error } = await supabase
        .from(table)
        .update(fieldsToUpdate)
        .eq('id', updateId)
        .select()
      if (error) throw error
      return { success: true, data: updated }
    }

    if (operation === 'delete') {
      if (!filters) return { success: false, error: 'Filtros obrigatórios para delete' }
      let query = supabase.from(table).delete()
      for (const [key, value] of Object.entries(filters)) {
        query = query.eq(key, value)
      }
      const { error } = await query
      if (error) throw error
      return { success: true }
    }

    return { success: false, error: `Operação desconhecida: ${operation}` }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
