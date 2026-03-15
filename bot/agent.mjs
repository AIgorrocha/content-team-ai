/**
 * agent.mjs - Claude API + tool execution loop
 */

import Anthropic from '@anthropic-ai/sdk'
import { config } from './config.mjs'
import { buildSystemPrompt } from './system-prompt.mjs'
import { toolDefinitions, executeTool } from './tools/index.mjs'

const anthropic = new Anthropic({ apiKey: config.anthropicApiKey })

// Historico in-memory por chat_id
const histories = new Map()

function getHistory(chatId) {
  const entry = histories.get(chatId)
  if (entry && Date.now() - entry.lastAccess < config.historyTtlMs) {
    entry.lastAccess = Date.now()
    return entry.messages
  }
  const messages = []
  histories.set(chatId, { messages, lastAccess: Date.now() })
  return messages
}

function trimHistory(messages) {
  while (messages.length > config.maxHistoryMessages) {
    messages.shift()
  }
}

export async function processMessage(userText, chatId) {
  const messages = getHistory(chatId)
  messages.push({ role: 'user', content: userText })
  trimHistory(messages)

  const systemPrompt = buildSystemPrompt()
  let response

  try {
    response = await anthropic.messages.create({
      model: config.model,
      max_tokens: 4096,
      system: systemPrompt,
      tools: toolDefinitions,
      messages: [...messages],
    })
  } catch (err) {
    console.error('Claude API erro:', err.message)
    return `Erro ao processar: ${err.message}`
  }

  // Tool use loop (max 10 iterations)
  let iterations = 0
  while (response.stop_reason === 'tool_use' && iterations < 10) {
    iterations++

    const assistantContent = response.content
    messages.push({ role: 'assistant', content: assistantContent })

    const toolResults = []
    for (const block of assistantContent) {
      if (block.type === 'tool_use') {
        console.log(`  Tool: ${block.name}(${JSON.stringify(block.input).substring(0, 100)})`)
        const result = await executeTool(block.name, block.input)
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: JSON.stringify(result),
        })
      }
    }

    messages.push({ role: 'user', content: toolResults })
    trimHistory(messages)

    try {
      response = await anthropic.messages.create({
        model: config.model,
        max_tokens: 4096,
        system: systemPrompt,
        tools: toolDefinitions,
        messages: [...messages],
      })
    } catch (err) {
      console.error('Claude API erro (loop):', err.message)
      return `Erro ao processar: ${err.message}`
    }
  }

  // Extract final text
  const finalContent = response.content
  messages.push({ role: 'assistant', content: finalContent })
  trimHistory(messages)

  const textBlocks = finalContent
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')

  return textBlocks || '(sem resposta)'
}
