/**
 * Agent Runner - Executa qualquer agente ct-*.md com tool use loop
 *
 * Uso: node scripts/sdk/agent-runner.mjs <agent-name> [prompt]
 */
import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'

import { supabaseToolDefinition, handleSupabaseTool } from './tools/supabase.mjs'
import { webSearchToolDefinition, webFetchToolDefinition, handleWebSearchTool, handleWebFetchTool } from './tools/web-search.mjs'
import { telegramToolDefinition, handleTelegramTool } from './tools/telegram.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../..')

const client = new Anthropic()

const TOOLS = [supabaseToolDefinition, webSearchToolDefinition, webFetchToolDefinition, telegramToolDefinition]

const toolHandlers = {
  supabase_query: handleSupabaseTool,
  web_search: handleWebSearchTool,
  web_fetch: handleWebFetchTool,
  telegram_notify: handleTelegramTool
}

function loadAgentPrompt(agentName) {
  const agentPath = path.join(projectRoot, 'agents', `${agentName}.md`)
  if (!fs.existsSync(agentPath)) {
    throw new Error(`Agente não encontrado: ${agentPath}`)
  }
  const content = fs.readFileSync(agentPath, 'utf-8')
  const bodyMatch = content.match(/---[\s\S]*?---\n([\s\S]*)/)
  return bodyMatch ? bodyMatch[1].trim() : content
}

function loadReference(filename) {
  const refPath = path.join(projectRoot, 'references', filename)
  if (!fs.existsSync(refPath)) return ''
  return fs.readFileSync(refPath, 'utf-8')
}

export async function runAgent(agentName, userPrompt, options = {}) {
  const { maxTurns = 25, model = process.env.CLAUDE_MODEL || 'claude-haiku-4-5-20251001' } = options

  const systemPrompt = [
    loadAgentPrompt(agentName),
    '\n\n## Referências\n',
    `### Brand Profile\n${loadReference('brand-profile.md')}`,
    `### Concorrentes\n${loadReference('competitors.md')}`,
    `\n\nData atual: ${new Date().toISOString().split('T')[0]}`,
    '\n\nREGRA CRÍTICA: Responda SEMPRE em português do Brasil. Zero inglês.'
  ].join('\n')

  const messages = [{ role: 'user', content: userPrompt }]

  console.log(`\n🤖 Executando ${agentName}...`)
  console.log(`📝 Prompt: ${userPrompt.substring(0, 100)}...`)

  let finalResult = ''

  for (let turn = 0; turn < maxTurns; turn++) {
    const response = await client.messages.create({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      tools: TOOLS,
      messages
    })

    if (response.stop_reason === 'end_turn') {
      const textBlock = response.content.find(b => b.type === 'text')
      finalResult = textBlock ? textBlock.text : ''
      console.log(`✅ ${agentName} concluído (${turn + 1} turnos)`)

      // Log primeiras linhas do resultado
      const preview = finalResult.split('\n').slice(0, 5).join('\n')
      console.log(`📄 Preview: ${preview}`)

      return finalResult
    }

    if (response.stop_reason === 'tool_use') {
      messages.push({ role: 'assistant', content: response.content })

      const toolResults = []
      for (const block of response.content) {
        if (block.type === 'tool_use') {
          const inputPreview = JSON.stringify(block.input).substring(0, 120)
          console.log(`  🔧 ${block.name}: ${inputPreview}`)

          const handler = toolHandlers[block.name]
          let result
          try {
            if (handler) {
              result = await handler(block.input)
            } else {
              result = { success: false, error: `Tool desconhecida: ${block.name}` }
            }
          } catch (toolError) {
            result = { success: false, error: `Erro na tool ${block.name}: ${toolError.message}` }
          }

          // Log resultado da tool
          const resultPreview = JSON.stringify(result).substring(0, 100)
          console.log(`     → ${result.success ? '✅' : '❌'} ${resultPreview}`)

          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: JSON.stringify(result)
          })
        }
      }
      messages.push({ role: 'user', content: toolResults })
    }
  }

  console.log(`⚠️ ${agentName} atingiu limite de ${maxTurns} turnos`)
  return finalResult || 'Limite de turnos atingido'
}

// CLI
const args = process.argv.slice(2)
if (args.length >= 1) {
  const agentName = args[0]
  const prompt = args.slice(1).join(' ') || 'Execute sua tarefa principal conforme suas instruções.'

  runAgent(agentName, prompt)
    .then(result => {
      console.log('\n📋 Resultado completo:')
      console.log(result)
    })
    .catch(error => {
      console.error('❌ Erro:', error.message)
      process.exit(1)
    })
}
