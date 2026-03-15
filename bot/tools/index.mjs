/**
 * tools/index.mjs - Registry de todas as tools
 */

import * as supabaseQuery from './supabase-query.mjs'
import * as telegramSend from './telegram-send.mjs'
import * as runScript from './run-script.mjs'
import * as webSearch from './web-search.mjs'
import * as carousel from './carousel.mjs'

const tools = [supabaseQuery, telegramSend, runScript, webSearch, carousel]

export const toolDefinitions = tools.map((t) => t.definition)

const executors = Object.fromEntries(tools.map((t) => [t.definition.name, t.execute]))

export async function executeTool(name, input) {
  const executor = executors[name]
  if (!executor) {
    return { error: `Tool "${name}" nao encontrada` }
  }
  try {
    return await executor(input)
  } catch (err) {
    return { error: `Erro executando ${name}: ${err.message}` }
  }
}
