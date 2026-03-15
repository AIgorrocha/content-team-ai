import pg from 'pg'
const { Client } = pg

const c = new Client({
  host: 'db.gfzmlxzxsvjfkujhiqdz.supabase.co',
  port: 5432, database: 'postgres', user: 'postgres',
  password: 'sistemasia2026', ssl: { rejectUnauthorized: false }
})

await c.connect()

// FIX 1: "triando" → "triagem de"
await c.query(`UPDATE ct_content_items SET caption = REPLACE(caption, '1 pessoa triando emails e orcamentos', '1 pessoa fazendo triagem de emails e orcamentos') WHERE title LIKE '3 agentes%'`)
console.log('Fix 1: triando → triagem de')

// FIX 3: Trocar case de agência de marketing pra escritório de advocacia
await c.query(`UPDATE ct_content_items SET caption = $1 WHERE title LIKE 'Como um gestor saiu%'`,
[`Ele gerenciava um escritorio de advocacia com 12 clientes fixos.
Todo dia: responder emails de clientes, montar peticoes, acompanhar prazos, cobrar honorarios.
12 horas por dia. Sem folga.

Depois de 3 agentes de IA:

1. Agente de email: le, categoriza e responde 80% dos emails sozinho
2. Agente de prazos: monitora todos os prazos processuais e avisa com antecedencia
3. Agente de cobranca: identifica honorarios atrasados e envia lembrete automatico

Resultado em 30 dias:
• 12h/dia virou 6h/dia
• 0 prazos perdidos (antes perdia 2-3 por mes)
• R$8.000/mes economizado em hora extra

Ele nao aprendeu a programar.
Ele aprendeu a DELEGAR pro lugar certo.

Qual tarefa voce faz todo dia que poderia ser delegada?
Comenta aqui.

#inteligenciaartificial #automacao #gestao #produtividade #empreendedorismo`])
console.log('Fix 3: agência marketing → escritório advocacia')

// FIX 7: solopreneur → empreendedor
await c.query(`UPDATE ct_content_items SET
  title = 'Empreendedor que fatura R$50 mil/mes sozinho com 5 agentes de IA',
  caption = $1
  WHERE title LIKE 'Solopreneur%'`,
[`Nos EUA, empreendedores individuais estao faturando USD 10k/mes sem equipe.
A estrategia? 5 agentes de IA fazendo o trabalho de 10 pessoas.

O stack dele:
• 1 agente de vendas (responde leads 24/7)
• 1 agente de conteudo (pesquisa e cria rascunhos)
• 1 agente financeiro (controla fluxo de caixa)
• 1 agente de atendimento (FAQ e pos-venda)
• 1 agente de analise (relatorios semanais automaticos)

Custo total: R$800/mes em APIs
Equipe equivalente: R$25.000/mes

A diferenca entre empreendedor inteligente e empresario sobrecarregado?
Saber delegar pra IA.

Salva esse post. Semana que vem mostro o passo a passo.

#inteligenciaartificial #automacao #empreendedorismo #produtividade #gestao`])
console.log('Fix 7: solopreneur → empreendedor')

// FIX HASHTAGS: Trocar todas as hashtags de pesquisa por hashtags populares de alcance
const hashtagFixes = [
  { like: '3 agentes%', hashtags: '#inteligenciaartificial #automacao #gestao #empreendedorismo #produtividade' },
  { like: 'Checklist%', hashtags: '#inteligenciaartificial #automacao #produtividade #gestao #empreendedorismo' },
  { like: 'Gestor de agentes%', hashtags: '#inteligenciaartificial #automacao #gestao #inovaçao #empreendedorismo' },
  { like: '5 Tarefas%', hashtags: '#inteligenciaartificial #automacao #produtividade #gestao #tecnologia' },
  { like: 'Contadora%', hashtags: '#inteligenciaartificial #automacao #contabilidade #produtividade #gestao' },
  { like: 'Por que 90%', hashtags: '#inteligenciaartificial #automacao #gestao #lideranca #produtividade' },
]

for (const fix of hashtagFixes) {
  // Replace hashtags in caption (last line)
  const { rows } = await c.query(`SELECT id, caption FROM ct_content_items WHERE title LIKE $1`, [fix.like])
  if (rows.length > 0) {
    const caption = rows[0].caption
    // Replace the last line (hashtags) with new hashtags
    const lines = caption.split('\n')
    const lastLine = lines[lines.length - 1]
    if (lastLine.startsWith('#')) {
      lines[lines.length - 1] = fix.hashtags
      await c.query(`UPDATE ct_content_items SET caption = $1 WHERE id = $2`, [lines.join('\n'), rows[0].id])
      console.log('Hashtags atualizadas:', fix.like)
    }
  }
}

// Verificar estado final
const r = await c.query(`SELECT title, content_type, platform FROM ct_content_items ORDER BY title`)
console.log('\nESTADO FINAL:', r.rows.length, 'conteudos')
r.rows.forEach((row, i) => console.log(`${i+1}. ${row.content_type} | ${row.platform} | ${row.title}`))

await c.end()
