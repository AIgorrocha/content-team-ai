/**
 * supabase-query.mjs - CRUD nas tabelas ct_*
 */

import { createClient } from '@supabase/supabase-js'
import { config } from '../config.mjs'

const supabase = createClient(config.supabaseUrl, config.supabaseKey)

const ALLOWED_TABLES = [
  'ct_content_items', 'ct_tasks', 'ct_agents', 'ct_audit_log',
  'ct_content_series', 'ct_content_series_items',
  'ct_competitors', 'ct_competitor_posts',
  'ct_contacts', 'ct_deals', 'ct_deal_activities',
  'ct_pipeline_stages', 'ct_subscribers', 'ct_email_campaigns',
  'ct_email_sequences', 'ct_email_sequence_steps', 'ct_lead_magnets',
  'ct_design_system', 'ct_influencers', 'ct_collaborations',
  'ct_brand_profile', 'ct_credentials',
]

export const definition = {
  name: 'supabase_query',
  description: 'Consulta ou modifica dados nas tabelas ct_* do Supabase. Suporta select, insert, update. DELETE nao permitido.',
  input_schema: {
    type: 'object',
    properties: {
      operation: {
        type: 'string',
        enum: ['select', 'insert', 'update'],
        description: 'Tipo de operacao',
      },
      table: {
        type: 'string',
        description: 'Nome da tabela (ex: ct_content_items)',
      },
      columns: {
        type: 'string',
        description: 'Colunas para select (ex: "id,title,status"). Default: *',
      },
      filters: {
        type: 'object',
        description: 'Filtros como {coluna: valor} para where/eq. Suporta: {coluna: valor} para eq, {coluna: {gte: valor}} para gte/lte/like/in',
      },
      data: {
        type: 'object',
        description: 'Dados para insert ou update',
      },
      order_by: {
        type: 'string',
        description: 'Coluna para ordenar (prefixo - para desc, ex: "-scheduled_at")',
      },
      limit: {
        type: 'number',
        description: 'Limite de resultados (max 50, default 20)',
      },
    },
    required: ['operation', 'table'],
  },
}

export async function execute(input) {
  const { operation, table, columns, filters, data, order_by, limit } = input

  if (!ALLOWED_TABLES.includes(table)) {
    return { error: `Tabela "${table}" nao permitida. Tabelas validas: ${ALLOWED_TABLES.join(', ')}` }
  }

  try {
    if (operation === 'select') {
      let query = supabase.from(table).select(columns || '*')

      if (filters) {
        for (const [col, val] of Object.entries(filters)) {
          if (val && typeof val === 'object' && !Array.isArray(val)) {
            if (val.gte) query = query.gte(col, val.gte)
            if (val.lte) query = query.lte(col, val.lte)
            if (val.like) query = query.like(col, val.like)
            if (val.in) query = query.in(col, val.in)
            if (val.neq) query = query.neq(col, val.neq)
          } else {
            query = query.eq(col, val)
          }
        }
      }

      if (order_by) {
        const desc = order_by.startsWith('-')
        const col = desc ? order_by.slice(1) : order_by
        query = query.order(col, { ascending: !desc })
      }

      query = query.limit(Math.min(limit || 20, 50))
      const { data: rows, error } = await query

      if (error) return { error: error.message }
      return { count: rows.length, data: rows }
    }

    if (operation === 'insert') {
      if (!data) return { error: 'Campo "data" obrigatorio para insert' }
      const { data: result, error } = await supabase.from(table).insert(data).select()
      if (error) return { error: error.message }
      return { inserted: result }
    }

    if (operation === 'update') {
      if (!data) return { error: 'Campo "data" obrigatorio para update' }
      if (!filters) return { error: 'Campo "filters" obrigatorio para update (seguranca)' }

      let query = supabase.from(table).update(data)
      for (const [col, val] of Object.entries(filters)) {
        if (typeof val !== 'object' || Array.isArray(val)) {
          query = query.eq(col, val)
        }
      }
      const { data: result, error } = await query.select()
      if (error) return { error: error.message }
      return { updated: result }
    }

    return { error: `Operacao "${operation}" nao suportada` }
  } catch (err) {
    return { error: err.message }
  }
}
