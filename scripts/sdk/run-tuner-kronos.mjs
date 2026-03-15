/**
 * Roda apenas Tuner + Kronos para otimizar e agendar conteúdos já criados.
 */
import { runAgent } from './agent-runner.mjs'
import { handleTelegramTool } from './tools/telegram.mjs'

const REGRAS = `
REGRAS OBRIGATÓRIAS:
1. TUDO em português do Brasil. ZERO inglês.
2. Stack do Igor: Claude Code, Agent SDK, OpenClaw, Supabase. SÓ ISSO.
3. PROIBIDO mencionar n8n, Zapier, Make, LangChain, CrewAI.
4. SEMPRE salvar no Supabase via supabase_query.
`

async function run() {
  console.log('--- TUNER ---')
  const tunerResult = await runAgent('ct-tuner', `
    ${REGRAS}

    Busque as 7 ideias do Quill no banco:
    supabase_query com operation "select", table "ct_content_items", filters: { "status": "draft", "source_agent": "ct-quill" }

    Para CADA ideia, otimize a legenda (campo caption) conforme a plataforma:
    - Instagram: maximo 2200 caracteres, gancho forte na primeira linha, 5 hashtags
    - LinkedIn: 1300-2000 caracteres, tom profissional, pergunta no final

    Depois ATUALIZE cada item no banco com supabase_query:
    operation "update", table "ct_content_items", data: { "id": "ID_DO_ITEM", "caption": "LEGENDA_OTIMIZADA", "status": "ready" }

    O campo id DEVE estar DENTRO do objeto data.
  `)

  console.log('\n--- KRONOS ---')
  const kronosResult = await runAgent('ct-kronos', `
    ${REGRAS}

    Busque os conteudos prontos no banco:
    supabase_query com operation "select", table "ct_content_items", filters: { "status": "ready" }
    Se nao encontrar com "ready", busque com status "draft".

    Monte o calendario da semana 17-22 Marco 2026:
    - Terca 17: IG carrossel 11h + LinkedIn post 8h
    - Quarta 18: IG reel 18h
    - Quinta 19: IG post 21h + LinkedIn 12h
    - Sexta 20: IG carrossel 11h
    - Sabado 21: IG post 15h

    ATUALIZE cada item no banco com supabase_query:
    operation "update", table "ct_content_items", data: { "id": "ID_DO_ITEM", "status": "scheduled", "scheduled_at": "2026-03-17T11:00:00-03:00" }

    O campo id DEVE estar DENTRO do objeto data.

    Retorne uma tabela com: dia, horario, plataforma, formato, titulo.
  `)

  await handleTelegramTool({
    message: `Tuner + Kronos concluidos!\n\nCalendario da semana 17-22 Marco montado.\nVerifique no banco os itens com status "scheduled".`
  })

  console.log('\n=== TUNER ===')
  console.log(tunerResult.substring(0, 1000))
  console.log('\n=== KRONOS ===')
  console.log(kronosResult.substring(0, 1000))
}

run().catch(e => {
  console.error('Erro:', e.message)
  process.exit(1)
})
