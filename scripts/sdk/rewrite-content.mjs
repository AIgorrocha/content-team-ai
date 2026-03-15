import pg from 'pg'
const { Client } = pg

const c = new Client({
  host: 'db.gfzmlxzxsvjfkujhiqdz.supabase.co',
  port: 5432, database: 'postgres', user: 'postgres',
  password: 'sistemasia2026', ssl: { rejectUnauthorized: false }
})

await c.connect()

// REESCREVER #2 - Profissão mais procurada
await c.query(`UPDATE ct_content_items SET
  title='Gestor de agentes de IA: a profissao que ninguem ensina mas todo mundo precisa',
  caption=$1, content_type='carousel', platform='instagram', source_agent='ct-quill', status='draft'
  WHERE title LIKE 'A profissão mais procurada%'`,
  [`Seu concorrente contratou 3 funcionarios novos. Voce contratou 3 agentes de IA.

Diferenca?

• Ele gasta R$15.000/mes em salarios
• Voce gasta R$500/mes em API
• Os agentes trabalham 24h, sem ferias, sem atraso

O gestor de agentes de IA nao programa. Ele DELEGA.

Exemplo real:
Um dono de distribuidora em SP tinha 2 pessoas so pra responder orcamentos por email. Colocou 1 agente que le o email, puxa preco do sistema e responde automatico.

Resultado: 40 orcamentos/dia respondidos em 2 minutos cada. Antes levava 4 horas.

Economia: R$6.000/mes + clientes atendidos 3x mais rapido.

Voce nao precisa saber programar.
Voce precisa saber DELEGAR pra IA.

Comenta AGENTE que te mostro como comecar.

#solopreneur #iaagents #agentsia #ia #gestaocomia`])
console.log('Reescrito: Gestor de agentes')

// REESCREVER #3 - Delegam tarefas
await c.query(`UPDATE ct_content_items SET
  title='Como um gestor saiu de 12h/dia pra 6h delegando pra agentes de IA',
  caption=$1, content_type='reel', platform='instagram', source_agent='ct-quill', status='draft'
  WHERE title LIKE 'Agentes de IA Delegam%'`,
  [`Ele gerenciava uma agencia de marketing com 8 clientes.
Todo dia: responder emails, montar relatorios, agendar posts, cobrar clientes.
12 horas por dia. Sem folga.

Depois de 3 agentes de IA:

1. Agente de email: le, categoriza e responde 80% dos emails sozinho
2. Agente de relatorio: puxa dados do sistema e monta relatorio toda manha as 6h
3. Agente de cobranca: identifica inadimplentes e envia lembrete automatico

Resultado em 30 dias:
• 12h/dia virou 6h/dia
• 0 clientes perdidos por demora
• R$8.000/mes economizado em hora extra

Ele nao aprendeu a programar.
Ele aprendeu a DELEGAR pro lugar certo.

Qual tarefa voce faz todo dia que poderia ser delegada?
Comenta aqui.

#solopreneur #iaagents #agentsia #ia #produtividade`])
console.log('Reescrito: Gestor 12h pra 6h')

// REESCREVER #8 - Multiagentes
await c.query(`UPDATE ct_content_items SET
  title='3 agentes de IA que substituem R$15 mil em funcionarios',
  caption=$1, content_type='carousel', platform='instagram', source_agent='ct-quill', status='draft'
  WHERE title LIKE 'Sistemas multiagentes%'`,
  [`Nao e demitir ninguem. E parar de contratar pra tarefas que IA faz melhor.

Case real de uma consultoria em BH:

ANTES (3 funcionarios, R$15.000/mes):
• 1 pessoa triando emails e orcamentos
• 1 pessoa montando propostas
• 1 pessoa fazendo follow-up de clientes

DEPOIS (3 agentes, R$450/mes):
• Agente 1: le email, identifica oportunidade, classifica prioridade
• Agente 2: puxa dados do CRM e monta proposta personalizada
• Agente 3: envia follow-up no timing certo baseado no historico

Resultado em 60 dias:
• Propostas enviadas: de 15/mes pra 45/mes
• Taxa de conversao: subiu 22%
• Tempo do dono: saiu de operacao pra estrategia

O segredo? Nao e a ferramenta. E saber QUAL tarefa delegar.

Quer saber quais tarefas da sua empresa podem ser delegadas?
Comenta DELEGAR.

#solopreneur #iaagents #agentsia #ia #automacao`])
console.log('Reescrito: 3 agentes 15k')

// CRIAR 4 NOVOS

// 1: Solopreneur
await c.query(`INSERT INTO ct_content_items (title, content_type, status, platform, caption, source_agent, approval_status) VALUES ($1, 'carousel', 'draft', 'instagram', $2, 'ct-quill', 'pending')`,
  ['Solopreneur que fatura R$50 mil/mes sozinho com 5 agentes de IA',
  `Nos EUA, solopreneurs estao faturando USD 10k/mes sem equipe.
A estrategia? 5 agentes de IA fazendo o trabalho de 10 pessoas.

O stack dele:
• 1 agente de vendas (responde leads 24/7)
• 1 agente de conteudo (pesquisa e cria rascunhos)
• 1 agente financeiro (controla fluxo de caixa)
• 1 agente de atendimento (FAQ e pos-venda)
• 1 agente de analise (relatorios semanais automaticos)

Custo total: R$800/mes em APIs
Equipe equivalente: R$25.000/mes

A diferenca entre solopreneur e empresario sobrecarregado?
Saber delegar pra IA.

Salva esse post. Semana que vem mostro o passo a passo.

#solopreneur #iaagents #agentsia #ia #empreendedorismo`])
console.log('Criado: Solopreneur 50k')

// 2: Contadora
await c.query(`INSERT INTO ct_content_items (title, content_type, status, platform, caption, source_agent, approval_status) VALUES ($1, 'reel', 'draft', 'instagram', $2, 'ct-quill', 'pending')`,
  ['Contadora que processava 30 notas por dia na mao. Agora processa 200.',
  `Maria tem um escritorio de contabilidade em Curitiba.
30 clientes. 2 funcionarias.

Todo dia: abrir email, baixar nota, conferir dados, lancar no sistema, responder cliente.

30 notas/dia. 4 horas de trabalho manual.

Depois do agente de IA:
• Le o email com a nota fiscal
• Extrai os dados automaticamente
• Lanca no sistema contabil
• Responde o cliente confirmando recebimento

Agora processa 200 notas/dia.
As funcionarias focam em consultoria (que cobra mais).

Receita do escritorio subiu 40% em 3 meses.
Nao porque trabalhou mais. Porque trabalhou no que importa.

Qual processo repetitivo voce ainda faz na mao?

#solopreneur #iaagents #agentsia #ia #contabilidade`])
console.log('Criado: Contadora')

// 3: LinkedIn
await c.query(`INSERT INTO ct_content_items (title, content_type, status, platform, caption, source_agent, approval_status) VALUES ($1, 'post', 'draft', 'linkedin', $2, 'ct-quill', 'pending')`,
  ['Por que 90% dos gestores ainda fazem na mao o que IA faz em 2 minutos',
  `Semana passada conversei com 5 donos de empresa.

Todos tinham o mesmo problema: falta de tempo.

Quando perguntei o que faziam no dia a dia:

• Respondiam emails repetitivos (2h/dia)
• Montavam propostas comerciais (1h/dia)
• Geravam relatorios pro time (1h/dia)
• Cobravam clientes inadimplentes (30min/dia)

4,5 horas por dia em tarefas que um agente de IA faz em minutos.

Nao estou falando de substituir pessoas.
Estou falando de liberar o GESTOR pra fazer o que so ele sabe fazer: tomar decisoes, fechar negocios, pensar estrategia.

Um dos 5 implementou agentes. Em 60 dias:
- Saiu de 12h/dia pra 7h/dia
- Faturamento subiu 18% (mais tempo pra vender)
- Zero custo com contratacao nova

Os outros 4 ainda estao respondendo email.

Qual grupo voce quer estar?

#solopreneur #iaagents #agentsia #ia #gestao`])
console.log('Criado: LinkedIn 90%')

// 4: Isca virtual
await c.query(`INSERT INTO ct_content_items (title, content_type, status, platform, caption, source_agent, approval_status) VALUES ($1, 'carousel', 'draft', 'instagram', $2, 'ct-quill', 'pending')`,
  ['Checklist gratuito: 10 tarefas que voce pode delegar pra IA hoje',
  `Peguei as 10 tarefas mais comuns que gestores fazem todo dia e mostro como cada uma pode ser delegada pra um agente de IA.

Slide 1: Responder emails repetitivos
Slide 2: Gerar relatorios diarios
Slide 3: Agendar reunioes
Slide 4: Cobrar inadimplentes
Slide 5: Montar propostas comerciais
Slide 6: Postar em redes sociais
Slide 7: Transcrever reunioes
Slide 8: Classificar leads por prioridade
Slide 9: Fazer follow-up de clientes
Slide 10: Monitorar concorrentes

Cada uma dessas tarefas leva de 15 a 60 minutos por dia.
Todas podem ser feitas por agentes de IA por menos de R$100/mes.

Quer o checklist completo com o passo a passo?
Comenta CHECKLIST que te mando no DM.

#solopreneur #iaagents #agentsia #ia #produtividade`])
console.log('Criado: Checklist isca')

// Estado final
const r = await c.query(`SELECT title, status, content_type, platform FROM ct_content_items ORDER BY status, title`)
console.log('\nESTADO FINAL:', r.rows.length, 'conteudos')
r.rows.forEach((row, i) => console.log(`${i+1}. ${row.status} | ${row.content_type} | ${row.platform} | ${row.title}`))

await c.end()
