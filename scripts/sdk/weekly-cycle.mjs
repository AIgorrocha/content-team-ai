/**
 * Weekly Cycle - Orquestra o ciclo semanal de conteúdo
 *
 * Fluxo: Scout (pesquisa) → Quill (ideias) → Tuner (otimiza) → Kronos (agenda)
 * Uso: node scripts/sdk/weekly-cycle.mjs
 */
import { runAgent } from './agent-runner.mjs'
import { handleTelegramTool } from './tools/telegram.mjs'
import { handleMemoryWrite } from './tools/memory.mjs'

const REGRAS_GLOBAIS = `
REGRAS OBRIGATÓRIAS (SIGA À RISCA):
1. TUDO em português do Brasil. ZERO inglês em títulos, descrições, legendas, hashtags — TUDO PT-BR.
2. Stack do Igor: Claude Code, Agent SDK, OpenClaw e Supabase. SÓ ESSAS FERRAMENTAS.
3. PROIBIDO mencionar n8n, Zapier, Make, LangChain, CrewAI ou qualquer ferramenta fora da stack.
4. Linguagem simples e direta. Público: gestores de PME que NÃO são programadores.
5. SEMPRE salvar resultados no Supabase usando a tool supabase_query.
`

async function weeklyResearch() {
  console.log('\n' + '='.repeat(60))
  console.log('📅 CICLO SEMANAL DE CONTEÚDO')
  console.log('='.repeat(60))

  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() + 1)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)

  const dateRange = `${weekStart.toISOString().split('T')[0]} a ${weekEnd.toISOString().split('T')[0]}`
  console.log(`📆 Semana: ${dateRange}`)

  // ETAPA 1: Scout — Pesquisa
  console.log('\n--- ETAPA 1: SCOUT (Pesquisa) ---')
  const scoutResult = await runAgent('ct-scout', `
    ${REGRAS_GLOBAIS}

    Execute a pesquisa semanal para a semana de ${dateRange}. Duas partes:

    PARTE 1 — CONCORRENTES INSTAGRAM
    Pesquise TODOS os 9 perfis. Para cada um:
    - Use web_search com o nome do perfil
    - Use web_fetch para carregar a página do perfil ou resultados relevantes
    - Traga: temas recentes, formatos (carrossel/reel/post), ganchos usados, engajamento

    Os 9 perfis:
    1. @adamstewartmarketing (marketing + IA)
    2. @divyannshisharma (automação IA)
    3. @oalanicolas (IA negócios BR)
    4. @charlieautomates (automação)
    5. @noevarner.ai (ferramentas IA)
    6. @liamjohnston.ai (agência IA)
    7. @odanilogato (IA BR)
    8. @thaismartan (IA negócios BR)
    9. @forgoodcode (dev + IA)

    Se NÃO encontrar dados de um perfil, escreva: "Sem dados recentes de @handle".

    Depois de pesquisar, SALVE cada resultado no Supabase:
    supabase_query → insert → ct_competitor_posts
    Campos: competitor_handle, platform ("instagram"), post_type, content_preview, analysis, source_type ("competitor_tracking")

    PARTE 2 — TENDÊNCIAS
    Pesquise sobre: agentes de IA, Claude Code, Agent SDK, OpenClaw, automação para empresas.
    Fontes: LinkedIn, X/Twitter, Reddit (r/ClaudeAI, r/artificial), GitHub trending.

    Salve as 5 melhores tendências como ideias no Supabase:
    supabase_query → insert → ct_content_items
    Campos: title (PT-BR!), content_type ("post"), status ("idea"), platform ("instagram"), source_agent ("ct-scout"), brand ("igorrocha.ia")

    FORMATO DA RESPOSTA (PT-BR):
    ## Concorrentes
    (1 parágrafo por perfil com o que encontrou)

    ## Tendências da Semana
    (5 tendências numeradas)

    ## Ideias de Conteúdo
    (5 ideias baseadas na pesquisa)
  `)

  // Salvar resultado do Scout na memoria para os proximos agentes
  await handleMemoryWrite({
    content: `## Resultado Scout — Semana ${dateRange}\n${scoutResult}`,
    category: 'resultado',
    agent: 'ct-scout'
  })

  // ETAPA 2: Quill — Ideias de conteúdo
  console.log('\n--- ETAPA 2: QUILL (Ideias) ---')
  const quillResult = await runAgent('ct-quill', `
    ${REGRAS_GLOBAIS}

    Gere 7 ideias de conteúdo para a semana de ${dateRange}.

    IMPORTANTE: Use a tool memory_read com query "scout resultado semana" para ler a pesquisa completa do Scout.
    Tambem busque no Supabase os dados mais recentes: ct_competitor_posts e ct_content_items com status "idea".

    PARA CADA IDEIA, escreva:
    1. Título (PT-BR, chamativo, direto)
    2. Formato: carrossel, reel ou post
    3. Plataforma: instagram, linkedin ou email
    4. Legenda opção A (framework AIDA: Atenção → Interesse → Desejo → Ação)
    5. Legenda opção B (framework PAS: Problema → Agitação → Solução)
    6. Exatamente 5 hashtags

    OBRIGATÓRIO: Salve CADA ideia no Supabase usando supabase_query:
    → insert → ct_content_items
    Campos: title, content_type (carrossel|reel|post), status ("draft"), platform, caption (legenda A), hashtags (as 5 hashtags), source_agent ("ct-quill"), brand ("igorrocha.ia")

    Se não salvar no banco, a tarefa NÃO está completa. Salve uma por uma.
  `)

  // ETAPA 3: Tuner — Otimização por plataforma
  console.log('\n--- ETAPA 3: TUNER (Otimização) ---')
  const tunerResult = await runAgent('ct-tuner', `
    ${REGRAS_GLOBAIS}

    Primeiro, busque as ideias do banco:
    supabase_query → select → ct_content_items → filters: { "status": "draft", "source_agent": "ct-quill" }

    Depois, otimize CADA ideia conforme a plataforma:
    - Instagram: máximo 2200 caracteres, 5 hashtags, gancho forte na primeira linha
    - LinkedIn: 1300-2000 caracteres, sem links no corpo, tom profissional, pergunta no final
    - Email: assunto < 50 caracteres, preview text, CTA claro

    OBRIGATÓRIO: Atualize cada item no banco:
    supabase_query → update → ct_content_items
    Campos: caption (versão otimizada), status ("ready")
    Precisa passar o id do item + os campos a atualizar.

    Retorne a lista otimizada em PT-BR.
  `)

  // ETAPA 4: Kronos — Calendário
  console.log('\n--- ETAPA 4: KRONOS (Calendário) ---')
  const kronosResult = await runAgent('ct-kronos', `
    ${REGRAS_GLOBAIS}

    Primeiro, busque os conteúdos prontos:
    supabase_query → select → ct_content_items → filters: { "status": "ready" }

    Se não encontrar com status "ready", busque com status "draft".

    Monte o calendário da semana de ${dateRange}:
    - Terça ${weekStart.toISOString().split('T')[0]}: Instagram carrossel (11h) + LinkedIn post (8h)
    - Quarta: Instagram reel (18h)
    - Quinta: Instagram post (21h) + LinkedIn (12h) + Email newsletter (9h)
    - Sexta: Instagram carrossel (11h)
    - Sábado: Instagram post (15h)

    OBRIGATÓRIO: Atualize CADA item no banco:
    supabase_query → update → ct_content_items
    Campos: status ("scheduled"), scheduled_at (data e hora no formato ISO)

    Retorne uma tabela com: dia, horário, plataforma, formato, título.
  `)

  // Salvar relatório completo em arquivo
  const report = `# Ciclo Semanal — ${dateRange}\n\n## Scout\n${scoutResult}\n\n## Quill\n${quillResult}\n\n## Tuner\n${tunerResult}\n\n## Kronos\n${kronosResult}`
  const fs = await import('fs')
  const reportPath = `reports/weekly-${weekStart.toISOString().split('T')[0]}.md`
  fs.writeFileSync(new URL(`../../${reportPath}`, import.meta.url), report)
  console.log(`\n📄 Relatório salvo em ${reportPath}`)

  // Notificar Igor
  const summary = `<b>📅 Ciclo Semanal Concluído</b>\n\n` +
    `<b>Semana:</b> ${dateRange}\n\n` +
    `✅ Scout: Pesquisa dos 9 concorrentes + tendências\n` +
    `✅ Quill: 7 ideias de conteúdo com legendas\n` +
    `✅ Tuner: Otimizado por plataforma\n` +
    `✅ Kronos: Calendário agendado\n\n` +
    `Relatório completo salvo no servidor.`

  await handleTelegramTool({ message: summary })
  console.log('\n✅ Ciclo semanal concluído!')

  return { scoutResult, quillResult, tunerResult, kronosResult }
}

weeklyResearch().catch(error => {
  console.error('❌ Erro no ciclo semanal:', error.message)
  handleTelegramTool({
    message: `<b>❌ Erro no ciclo semanal</b>\n\n${error.message}`
  })
  process.exit(1)
})
