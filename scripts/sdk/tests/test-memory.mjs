/**
 * Teste do sistema de memoria — Camada 1
 * Valida: write, read, loadContext, flush, busca por keywords, logs diarios
 *
 * Uso: node scripts/sdk/tests/test-memory.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  handleMemoryRead, handleMemoryWrite, handleMemoryHandoff,
  loadMemoryContext, flushAgentMemory, getSessionId
} from '../tools/memory.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const memoryDir = path.resolve(__dirname, '../../../memory')

let passed = 0
let failed = 0

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ ${testName}`)
    passed++
  } else {
    console.log(`  ❌ ${testName}`)
    failed++
  }
}

// Limpar log de teste anterior (se existir hoje)
const todayFile = path.join(memoryDir, `${new Date().toISOString().split('T')[0]}.md`)
const hadExistingLog = fs.existsSync(todayFile)
const existingContent = hadExistingLog ? fs.readFileSync(todayFile, 'utf-8') : null

async function runTests() {
  console.log('\n🧪 TESTES DO SISTEMA DE MEMORIA — CAMADA 1\n')

  // ========== TEST 1: MEMORY.md existe e tem conteudo ==========
  console.log('--- Teste 1: MEMORY.md ---')
  const memoryPath = path.join(memoryDir, 'MEMORY.md')
  assert(fs.existsSync(memoryPath), 'MEMORY.md existe')
  const memoryContent = fs.readFileSync(memoryPath, 'utf-8')
  assert(memoryContent.length > 100, 'MEMORY.md tem conteudo (>100 chars)')
  assert(memoryContent.includes('PT-BR'), 'MEMORY.md menciona PT-BR')
  assert(memoryContent.includes('Supabase'), 'MEMORY.md menciona Supabase')

  // ========== TEST 2: memory_write ==========
  console.log('\n--- Teste 2: memory_write ---')
  const writeResult1 = await handleMemoryWrite({
    content: 'Teste de escrita: agente scout encontrou 5 tendencias sobre agentes de IA.',
    category: 'resultado',
    agent: 'ct-scout-test'
  })
  assert(writeResult1.success === true, 'memory_write retorna success=true')
  assert(writeResult1.data.includes(new Date().toISOString().split('T')[0]), 'Salvou no arquivo do dia correto')

  const writeResult2 = await handleMemoryWrite({
    content: 'Decisao: usar formato carrossel para conteudo tecnico, reel para cases.',
    category: 'decisao',
    agent: 'ct-maestro-test'
  })
  assert(writeResult2.success === true, 'Segunda escrita tambem funciona (append)')

  // Verificar que o arquivo do dia foi criado e tem ambas entradas
  assert(fs.existsSync(todayFile), 'Arquivo do dia criado')
  const todayContent = fs.readFileSync(todayFile, 'utf-8')
  assert(todayContent.includes('ct-scout-test'), 'Contem entrada do scout')
  assert(todayContent.includes('ct-maestro-test'), 'Contem entrada do maestro')
  assert(todayContent.includes('resultado'), 'Contem categoria resultado')
  assert(todayContent.includes('decisao'), 'Contem categoria decisao')

  // ========== TEST 3: memory_read ==========
  console.log('\n--- Teste 3: memory_read ---')
  const readResult1 = await handleMemoryRead({ query: 'tendencias agentes' })
  assert(readResult1.success === true, 'memory_read retorna success=true')
  assert(Array.isArray(readResult1.data), 'Retorna array de resultados')
  assert(readResult1.data.length > 0, 'Encontrou pelo menos 1 fonte')

  // Buscar algo que existe no MEMORY.md
  const readResult2 = await handleMemoryRead({ query: 'concorrentes monitorados' })
  assert(readResult2.success === true, 'Busca por concorrentes funciona')
  const hasMemoSource = readResult2.data.some(r => r.source.includes('MEMORY.md'))
  assert(hasMemoSource, 'Encontrou resultado no MEMORY.md')

  // Buscar algo que NAO existe
  const readResult3 = await handleMemoryRead({ query: 'xyzzyplugh12345' })
  assert(readResult3.success === true, 'Busca vazia retorna success=true')
  assert(typeof readResult3.data === 'string', 'Busca vazia retorna string (mensagem)')

  // ========== TEST 4: loadMemoryContext ==========
  console.log('\n--- Teste 4: loadMemoryContext ---')
  const context = await loadMemoryContext()
  assert(typeof context === 'string', 'Retorna string')
  assert(context.length > 200, 'Contexto tem tamanho razoavel (>200 chars)')
  assert(context.includes('Memoria de Longo Prazo'), 'Inclui secao de longo prazo')
  assert(context.includes('Memorias Recentes'), 'Inclui secao de memorias recentes')

  // ========== TEST 5: flushAgentMemory ==========
  console.log('\n--- Teste 5: flushAgentMemory ---')
  await flushAgentMemory('ct-test-flush', 'Este e um resultado de teste com mais de cinquenta caracteres para garantir que o flush funciona corretamente e salva no log diario.')
  const afterFlush = fs.readFileSync(todayFile, 'utf-8')
  assert(afterFlush.includes('ct-test-flush'), 'Flush salvou com nome do agente')

  // Flush com resultado curto (deve ignorar)
  const beforeShortFlush = fs.readFileSync(todayFile, 'utf-8')
  await flushAgentMemory('ct-test-short', 'curto')
  const afterShortFlush = fs.readFileSync(todayFile, 'utf-8')
  assert(!afterShortFlush.includes('ct-test-short'), 'Flush ignora resultados curtos (<50 chars)')

  // Flush com resultado longo (deve truncar em 500)
  const longResult = 'A'.repeat(800)
  await flushAgentMemory('ct-test-long', longResult)
  const afterLongFlush = fs.readFileSync(todayFile, 'utf-8')
  assert(afterLongFlush.includes('ct-test-long'), 'Flush salvou resultado longo')
  assert(afterLongFlush.includes('...'), 'Resultado longo foi truncado')

  // ========== TEST 6: searchInText scoring ==========
  console.log('\n--- Teste 6: Busca com scoring ---')
  const multiKeyword = await handleMemoryRead({ query: 'scout tendencias semana resultado' })
  assert(multiKeyword.success === true, 'Busca multi-keyword funciona')
  if (Array.isArray(multiKeyword.data) && multiKeyword.data.length > 0) {
    const firstSource = multiKeyword.data[0]
    assert(firstSource.matches.length > 0, 'Multi-keyword retorna matches rankeados')
  }

  // ========== TEST 7: memory_handoff ==========
  console.log('\n--- Teste 7: memory_handoff ---')
  const handoffResult = await handleMemoryHandoff({
    from_agent: 'ct-scout-test',
    to_agent: 'ct-quill-test',
    summary: 'Pesquisa concluida: 5 tendencias sobre agentes de IA, 9 perfis analisados.',
    key_data: { trends_count: 5, profiles_count: 9, items_created: ['id-1', 'id-2'] }
  })
  assert(handoffResult.success === true, 'memory_handoff retorna success=true')
  assert(handoffResult.data.includes('ct-scout-test'), 'Handoff registra from_agent')
  assert(handoffResult.data.includes('Session'), 'Handoff retorna session ID')

  // Verificar que handoff aparece no log do dia
  const afterHandoff = fs.readFileSync(todayFile, 'utf-8')
  assert(afterHandoff.includes('HANDOFF'), 'Handoff salvo no arquivo local')
  assert(afterHandoff.includes('ct-quill-test'), 'Handoff menciona to_agent')

  // ========== TEST 7b: getSessionId ==========
  console.log('\n--- Teste 7b: getSessionId ---')
  const sid = getSessionId()
  assert(typeof sid === 'string', 'getSessionId retorna string')
  assert(sid.startsWith('session-'), 'Session ID tem prefixo correto')
  assert(sid.length > 20, 'Session ID tem tamanho razoavel')

  // ========== TEST 7c: loadMemoryContext (async) ==========
  console.log('\n--- Teste 7c: loadMemoryContext async ---')
  const asyncContext = await loadMemoryContext()
  assert(typeof asyncContext === 'string', 'loadMemoryContext async retorna string')
  assert(asyncContext.includes('Memoria de Longo Prazo'), 'Contexto async inclui longo prazo')

  // ========== TEST 8: Integridade do agent-runner ==========
  console.log('\n--- Teste 8: Integridade do agent-runner ---')
  const runnerPath = path.resolve(__dirname, '../agent-runner.mjs')
  const runnerContent = fs.readFileSync(runnerPath, 'utf-8')
  assert(runnerContent.includes('memoryReadToolDefinition'), 'agent-runner importa memoryReadToolDefinition')
  assert(runnerContent.includes('memoryWriteToolDefinition'), 'agent-runner importa memoryWriteToolDefinition')
  assert(runnerContent.includes('memoryHandoffToolDefinition'), 'agent-runner importa memoryHandoffToolDefinition')
  assert(runnerContent.includes('loadMemoryContext'), 'agent-runner importa loadMemoryContext')
  assert(runnerContent.includes('flushAgentMemory'), 'agent-runner importa flushAgentMemory')
  assert(runnerContent.includes('getSessionId'), 'agent-runner importa getSessionId')
  assert(runnerContent.includes('memory_read: handleMemoryRead'), 'agent-runner registra handler memory_read')
  assert(runnerContent.includes('memory_write: handleMemoryWrite'), 'agent-runner registra handler memory_write')
  assert(runnerContent.includes('memory_handoff: handleMemoryHandoff'), 'agent-runner registra handler memory_handoff')
  assert(runnerContent.includes('Memoria do Sistema'), 'agent-runner injeta memoria no system prompt')
  assert(runnerContent.includes('await flushAgentMemory'), 'agent-runner faz flush ao encerrar')
  assert(runnerContent.includes('await loadMemoryContext'), 'agent-runner faz await no loadMemoryContext')

  // ========== TEST 9: Integridade do weekly-cycle ==========
  console.log('\n--- Teste 8: Integridade do weekly-cycle ---')
  const cyclePath = path.resolve(__dirname, '../weekly-cycle.mjs')
  const cycleContent = fs.readFileSync(cyclePath, 'utf-8')
  assert(cycleContent.includes('handleMemoryWrite'), 'weekly-cycle importa handleMemoryWrite')
  assert(cycleContent.includes('memory_read'), 'weekly-cycle instrui Quill a usar memory_read')
  assert(!cycleContent.includes('scoutResult.substring(0, 3000)'), 'weekly-cycle NAO usa mais substring truncado')

  // ========== TEST 10: Tool definitions validas para API Anthropic ==========
  console.log('\n--- Teste 10: Tool definitions ---')
  const { memoryReadToolDefinition, memoryWriteToolDefinition, memoryHandoffToolDefinition } = await import('../tools/memory.mjs')

  assert(memoryReadToolDefinition.name === 'memory_read', 'memory_read tem name correto')
  assert(memoryReadToolDefinition.input_schema.type === 'object', 'memory_read schema e object')
  assert(memoryReadToolDefinition.input_schema.required.includes('query'), 'memory_read requer query')

  assert(memoryWriteToolDefinition.name === 'memory_write', 'memory_write tem name correto')
  assert(memoryWriteToolDefinition.input_schema.type === 'object', 'memory_write schema e object')
  assert(memoryWriteToolDefinition.input_schema.required.includes('content'), 'memory_write requer content')
  assert(memoryWriteToolDefinition.input_schema.required.includes('category'), 'memory_write requer category')
  assert(memoryWriteToolDefinition.input_schema.properties.category.enum.length === 4, 'memory_write tem 4 categorias')

  assert(memoryHandoffToolDefinition.name === 'memory_handoff', 'memory_handoff tem name correto')
  assert(memoryHandoffToolDefinition.input_schema.required.includes('from_agent'), 'memory_handoff requer from_agent')
  assert(memoryHandoffToolDefinition.input_schema.required.includes('to_agent'), 'memory_handoff requer to_agent')
  assert(memoryHandoffToolDefinition.input_schema.required.includes('summary'), 'memory_handoff requer summary')

  // ========== CLEANUP ==========
  // Restaurar estado anterior do log do dia (remover entradas de teste)
  if (!hadExistingLog) {
    // Se nao tinha log antes, remover o arquivo criado pelo teste
    fs.unlinkSync(todayFile)
    console.log('\n🧹 Arquivo de teste removido')
  } else {
    // Restaurar conteudo original
    fs.writeFileSync(todayFile, existingContent, 'utf-8')
    console.log('\n🧹 Log do dia restaurado ao estado original')
  }

  // ========== RESULTADO ==========
  console.log('\n' + '='.repeat(40))
  console.log(`📊 RESULTADO: ${passed} passou, ${failed} falhou (de ${passed + failed})`)
  console.log('='.repeat(40))

  if (failed > 0) {
    process.exit(1)
  }
}

runTests().catch(err => {
  console.error('❌ Erro fatal nos testes:', err)
  process.exit(1)
})
