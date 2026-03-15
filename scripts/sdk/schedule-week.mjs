import pg from 'pg'
const { Client } = pg

const c = new Client({
  host: 'db.gfzmlxzxsvjfkujhiqdz.supabase.co',
  port: 5432, database: 'postgres', user: 'postgres',
  password: 'sistemasia2026', ssl: { rejectUnauthorized: false }
})

await c.connect()

// Calendário da semana 17-22 março
const schedule = [
  { like: '3 agentes%', date: '2026-03-17T11:00:00-03:00', content_body: `SLIDE 1 (CAPA):
"3 agentes de IA que substituem R$15 mil em funcionarios"
Subtitulo: Case real de uma consultoria em BH

SLIDE 2:
ANTES: 3 funcionarios, R$15.000/mes
• 1 pessoa fazendo triagem de emails e orcamentos
• 1 pessoa montando propostas
• 1 pessoa fazendo follow-up de clientes

SLIDE 3:
DEPOIS: 3 agentes de IA, R$450/mes
Agente 1: Le email, identifica oportunidade, classifica prioridade
Agente 2: Puxa dados do CRM e monta proposta personalizada
Agente 3: Envia follow-up no timing certo

SLIDE 4:
RESULTADO EM 60 DIAS
• Propostas enviadas: 15/mes → 45/mes (3x mais)
• Taxa de conversao: subiu 22%
• Dono: saiu da operacao pra estrategia

SLIDE 5:
O segredo nao e a ferramenta.
E saber QUAL tarefa delegar.

Comenta DELEGAR que te mostro como comecar.` },

  { like: 'Por que 90%', date: '2026-03-17T08:00:00-03:00', content_body: `POST LINKEDIN (texto longo, sem imagem)

Semana passada conversei com 5 donos de empresa.
Todos tinham o mesmo problema: falta de tempo.

Quando perguntei o que faziam no dia a dia:
• Respondiam emails repetitivos (2h/dia)
• Montavam propostas comerciais (1h/dia)
• Geravam relatorios pro time (1h/dia)
• Cobravam clientes inadimplentes (30min/dia)

4,5 horas por dia em tarefas que um agente de IA faz em minutos.

Nao estou falando de substituir pessoas.
Estou falando de liberar o GESTOR pra fazer o que so ele sabe fazer.

Um dos 5 implementou agentes. Em 60 dias:
- Saiu de 12h/dia pra 7h/dia
- Faturamento subiu 18%
- Zero custo com contratacao nova

Os outros 4 ainda estao respondendo email.
Qual grupo voce quer estar?

Dica: Comece pelas tarefas que voce faz TODOS os dias e que seguem um padrao. Essas sao as primeiras que um agente de IA consegue assumir.` },

  { like: 'Contadora%', date: '2026-03-18T18:00:00-03:00', script: `ROTEIRO REEL (30 segundos)

[0-3s] HOOK (texto na tela + narração):
"Contadora processava 30 notas por dia. Agora processa 200."

[3-8s] PROBLEMA:
"Maria tem escritorio de contabilidade em Curitiba. Todo dia: abrir email, baixar nota, conferir dados, lancar no sistema. 4 horas de trabalho manual."

[8-18s] SOLUÇÃO:
"Colocou um agente de IA que:
- Le o email com a nota
- Extrai os dados
- Lanca no sistema
- Responde o cliente"

[18-25s] RESULTADO:
"200 notas por dia. Funcionarias focam em consultoria. Receita subiu 40% em 3 meses."

[25-30s] CTA:
"Qual processo repetitivo voce ainda faz na mao? Comenta aqui."

TEXTO NA TELA: Mostrar numeros grandes (30 → 200, +40% receita)
MUSICA: Trending audio calmo/motivacional` },

  { like: 'Empreendedor%', date: '2026-03-19T21:00:00-03:00', content_body: `SLIDE 1 (CAPA):
"Empreendedor que fatura R$50 mil/mes sozinho com 5 agentes de IA"
Subtitulo: A estrategia que esta mudando tudo

SLIDE 2:
Nos EUA, empreendedores individuais estao faturando alto sem equipe.
A estrategia? Delegar pra IA.

SLIDE 3:
AGENTE 1 - VENDAS
Responde leads 24/7
Qualifica automaticamente
Agenda reuniao no calendario

SLIDE 4:
AGENTE 2 - CONTEUDO
Pesquisa tendencias
Cria rascunhos
Adapta por plataforma

SLIDE 5:
AGENTE 3 - FINANCEIRO
Controla fluxo de caixa
Envia cobrancas
Gera relatorios

SLIDE 6:
AGENTE 4 - ATENDIMENTO
FAQ automatico
Pos-venda
Pesquisa de satisfacao

SLIDE 7:
AGENTE 5 - ANALISE
Relatorios semanais
Identifica padroes
Sugere melhorias

SLIDE 8:
CUSTO TOTAL: R$800/mes
EQUIPE EQUIVALENTE: R$25.000/mes
ROI: 31x

SLIDE 9:
A diferenca entre empreendedor inteligente e empresario sobrecarregado?
Saber delegar pra IA.

Salva esse post. Semana que vem mostro o passo a passo.` },

  { like: 'Como um gestor saiu%', date: '2026-03-20T11:00:00-03:00', script: `ROTEIRO REEL (30 segundos)

[0-3s] HOOK (texto na tela + narração):
"Gestor trabalhava 12h por dia. Agora trabalha 6."

[3-8s] PROBLEMA:
"Escritorio de advocacia, 12 clientes fixos. Todo dia: emails, peticoes, prazos, cobrancas. 12 horas sem parar."

[8-18s] SOLUÇÃO:
"3 agentes de IA:
1. Email: le e responde 80% sozinho
2. Prazos: monitora todos e avisa com antecedencia
3. Cobranca: identifica atrasados e cobra automatico"

[18-25s] RESULTADO:
"30 dias depois: 12h virou 6h. Zero prazos perdidos. R$8 mil economizado por mes."

[25-30s] CTA:
"Qual tarefa voce faz todo dia que poderia ser delegada? Comenta."

TEXTO NA TELA: Relogio mostrando 12h → 6h
MUSICA: Trending audio energetico` },

  { like: 'Checklist%', date: '2026-03-21T15:00:00-03:00', content_body: `SLIDE 1 (CAPA):
"10 tarefas que voce pode delegar pra IA hoje"
Subtitulo: Checklist gratuito

SLIDE 2: Responder emails repetitivos
Tempo manual: 1-2h/dia
Com agente: automatico, voce so revisa os importantes

SLIDE 3: Gerar relatorios diarios
Tempo manual: 45min/dia
Com agente: pronto as 6h da manha, voce so le

SLIDE 4: Agendar reunioes
Tempo manual: 30min/dia
Com agente: cliente escolhe horario, agente confirma

SLIDE 5: Cobrar inadimplentes
Tempo manual: 1h/dia
Com agente: lembrete automatico no timing certo

SLIDE 6: Montar propostas comerciais
Tempo manual: 1h por proposta
Com agente: puxa dados do CRM e monta em 2 min

SLIDE 7: Postar em redes sociais
Tempo manual: 1h/dia
Com agente: agenda, posta e responde comentarios basicos

SLIDE 8: Transcrever reunioes
Tempo manual: 30min por reuniao
Com agente: grava, transcreve e gera resumo com acoes

SLIDE 9: Classificar leads por prioridade
Tempo manual: 45min/dia
Com agente: pontua leads automaticamente por perfil

SLIDE 10: Follow-up de clientes
Tempo manual: 1h/dia
Com agente: envia mensagem personalizada no momento certo

SLIDE 11 (CTA):
ECONOMIA TOTAL: 5-8 horas por dia
CUSTO: menos de R$100/mes por agente

Quer o checklist completo com passo a passo?
Comenta CHECKLIST que te mando no DM.` }
]

for (const item of schedule) {
  const updates = [`status = 'scheduled'`, `scheduled_at = '${item.date}'`, `approval_status = 'approved'`]
  const params = []
  let paramIdx = 1

  if (item.content_body) {
    updates.push(`content_body = $${paramIdx}`)
    params.push(item.content_body)
    paramIdx++
  }
  if (item.script) {
    updates.push(`script = $${paramIdx}`)
    params.push(item.script)
    paramIdx++
  }

  params.push(item.like)
  const sql = `UPDATE ct_content_items SET ${updates.join(', ')} WHERE title LIKE $${paramIdx}`
  const r = await c.query(sql, params)
  console.log(`Agendado: ${item.like} → ${item.date} (${r.rowCount} rows)`)
}

// Atualizar os 2 restantes (reserva pra proxima semana) com content_body completo
await c.query(`UPDATE ct_content_items SET content_body = $1 WHERE title LIKE 'Gestor de agentes%'`,
[`SLIDE 1 (CAPA):
"Gestor de agentes de IA"
Subtitulo: A profissao que ninguem ensina mas todo mundo precisa

SLIDE 2:
Seu concorrente contratou 3 funcionarios novos.
Voce contratou 3 agentes de IA.

SLIDE 3:
COMPARACAO:
Ele: R$15.000/mes em salarios
Voce: R$500/mes em API
Agentes: 24h, sem ferias, sem atraso

SLIDE 4:
O gestor de agentes de IA NAO programa.
Ele DELEGA.

SLIDE 5:
CASE REAL:
Distribuidora em SP
2 pessoas respondendo orcamentos por email
1 agente substituiu: le email, puxa preco, responde automatico

SLIDE 6:
RESULTADO:
40 orcamentos/dia em 2 min cada
Antes: 4 horas de trabalho manual
Economia: R$6.000/mes

SLIDE 7 (CTA):
Voce nao precisa saber programar.
Voce precisa saber DELEGAR pra IA.

Comenta AGENTE que te mostro como comecar.`])
console.log('Content body: Gestor de agentes')

await c.query(`UPDATE ct_content_items SET content_body = $1 WHERE title LIKE '5 Tarefas%'`,
[`POST INSTAGRAM (imagem unica com texto)

5 Tarefas que Todo Gestor Pode Automatizar Com IA Hoje:

1. Triagem de emails - prioriza automaticamente
2. Relatorios diarios - gera de madrugada, voce le de manha
3. Atendimento ao cliente - responde FAQs instantaneamente
4. Geracao de propostas - preenche dados, voce revisa
5. Monitoramento de indicadores - alerta quando sai do padrao

Nenhuma precisa de programacao.
Nenhuma custa mais de R$100/mes.

Visual: fundo escuro (#0D0D0D), texto branco, icones minimalistas por tarefa
Fonte: Inter bold para titulos, regular para corpo`])
console.log('Content body: 5 Tarefas')

// Verificar estado final
const r = await c.query(`SELECT title, status, content_type, platform, scheduled_at,
  CASE WHEN caption IS NOT NULL THEN 'sim' ELSE 'nao' END as tem_legenda,
  CASE WHEN content_body IS NOT NULL THEN 'sim' ELSE 'nao' END as tem_body,
  CASE WHEN script IS NOT NULL THEN 'sim' ELSE 'nao' END as tem_script
  FROM ct_content_items ORDER BY scheduled_at NULLS LAST, title`)
console.log('\n=== ESTADO FINAL ===')
r.rows.forEach((row, i) => {
  const dt = row.scheduled_at ? row.scheduled_at.toISOString().substring(0,16).replace('T',' ') : 'reserva'
  console.log(`${i+1}. [${row.status}] ${dt} | ${row.content_type} | ${row.platform} | legenda:${row.tem_legenda} body:${row.tem_body} script:${row.tem_script}`)
  console.log(`   ${row.title}`)
})

await c.end()
