const NOTION_TOKEN = process.env.NOTION_TOKEN
const NOTION_API = 'https://api.notion.com/v1'
const PARENT_PAGE = '323b6a95-c9be-8055-a59b-edd13acddd0d'
const OLD_PAGE = '323b6a95-c9be-8131-8d6a-cea4909d17a9'

async function notionFetch(endpoint, method = 'GET', body = null) {
  const res = await fetch(`${NOTION_API}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : null
  })
  return res.json()
}

function t(content, bold = false, italic = false, code = false, color = 'default') {
  return { type: 'text', text: { content }, annotations: { bold, italic, code, color } }
}
function tLink(content, url) {
  return { type: 'text', text: { content, link: { url } }, annotations: { bold: false } }
}

const h1 = (s) => ({ object:'block', type:'heading_1', heading_1:{ rich_text:[t(s)] } })
const h2 = (s) => ({ object:'block', type:'heading_2', heading_2:{ rich_text:[t(s)] } })
const h3 = (s) => ({ object:'block', type:'heading_3', heading_3:{ rich_text:[t(s)] } })
const p = (...tx) => ({ object:'block', type:'paragraph', paragraph:{ rich_text: tx } })
const bullet = (s) => ({ object:'block', type:'bulleted_list_item', bulleted_list_item:{ rich_text:[t(s)] } })
const num = (s) => ({ object:'block', type:'numbered_list_item', numbered_list_item:{ rich_text:[t(s)] } })
const div = () => ({ object:'block', type:'divider', divider:{} })
const callout = (s, emoji='💡') => ({ object:'block', type:'callout', callout:{ rich_text:[t(s)], icon:{type:'emoji',emoji} } })
const quote = (s) => ({ object:'block', type:'quote', quote:{ rich_text:[t(s)] } })
const codeBlock = (s, lang='plain text') => ({ object:'block', type:'code', code:{ rich_text:[t(s)], language:lang } })
const toggle = (title, children) => ({ object:'block', type:'toggle', toggle:{ rich_text:[t(title)], children } })

async function main() {
  // Delete old page
  await notionFetch(`/blocks/${OLD_PAGE}`, 'DELETE')
  console.log('🗑️ Pagina antiga deletada')

  // Create new page - Part 1 (API limit: 100 blocks per request)
  const page = await notionFetch('/pages', 'POST', {
    parent: { type: 'page_id', page_id: PARENT_PAGE },
    icon: { type: 'emoji', emoji: '🤖' },
    cover: { type: 'external', external: { url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200' } },
    properties: {
      title: { title: [t('Guia Completo: Claude Cowork — Como Configurar do Jeito Certo')] }
    },
    children: [
      callout('Esse guia foi criado por @igorrocha.ia — Engenheiro Civil e Consultor de IA. Você recebeu esse link porque comentou COWORK em um dos meus posts. Use, aplique e me conta o resultado.', '👋'),
      p(),

      // SECAO 1
      h1('O que é o Claude Cowork'),
      p(t('A maioria das pessoas usa IA como uma caixa de texto: digita, recebe resposta, copia e cola. '), t('O Claude Cowork funciona diferente.', true)),
      p(t('Ele é um programa que roda no seu computador, dentro do Claude Desktop. Não é uma aba do navegador — é uma ferramenta que vive na sua máquina, acessa suas pastas, lê seus arquivos e executa tarefas por você.')),

      h3('O que ele faz na prática'),
      bullet('Lê e escreve direto nas suas pastas reais'),
      bullet('Cria documentos Word, planilhas Excel e apresentações PowerPoint'),
      bullet('Instala extensões (MCP Servers) que conectam em outras ferramentas'),
      bullet('Faz perguntas antes de agir — não chuta'),
      bullet('Roda isolado numa sandbox segura'),

      h3('Cowork vs Code vs Desktop — qual a diferença?'),
      p(t('Claude Desktop', true), t(' é o app que você instala no computador. Dentro dele existem dois modos:')),
      bullet('Cowork — para não-programadores. Interface visual, sandbox segura, trabalha com arquivos.'),
      bullet('Code — para desenvolvedores. Roda no terminal, acesso total ao sistema, mais rápido e controlável.'),
      p(t('Este guia foca no ', false), t('Cowork', true), t(' — o modo para quem quer resultados sem escrever código.')),

      div(),

      // SECAO 2
      h1('Como instalar'),

      h3('Passo 1: Baixar o Claude Desktop'),
      p(t('Acesse '), tLink('claude.ai/download', 'https://claude.ai/download'), t(' e instale o app para seu sistema (Windows, Mac ou Linux).')),

      h3('Passo 2: Criar conta ou fazer login'),
      p(t('Se já tem conta no claude.ai, use a mesma. Se não, crie uma.')),

      h3('Passo 3: Escolher o plano'),
      p(t('O Cowork funciona apenas com planos pagos:')),
      bullet('Pro ($20/mês) — inclui Cowork com limite de ~45 mensagens a cada 5 horas'),
      bullet('Max 5x ($100/mês) — 5x mais uso, ideal pra quem trabalha o dia todo com IA'),
      bullet('Max 20x ($200/mês) — uso intenso, sem preocupação com limites'),
      callout('O plano gratuito NÃO inclui Cowork. Minha recomendação: comece com o Pro ($20/mês) e atualize se precisar.', '💰'),

      h3('Passo 4: Ativar o Cowork'),
      p(t('Dentro do Claude Desktop, clique no ícone de pasta no canto inferior esquerdo. Selecione a pasta que quer dar acesso ao Claude. Pronto — ele já consegue ler e escrever nela.')),

      div(),

      // SECAO 3
      h1('O ciclo de trabalho'),
      p(t('Na minha operação funciona assim, todos os dias:')),
      num('Eu descrevo o que preciso em linguagem normal'),
      num('O Cowork me faz 2-3 perguntas pra entender melhor'),
      num('Eu respondo'),
      num('Volto 20 minutos depois e o documento está pronto na minha pasta'),
      callout('Esse ciclo já cobre 60% do meu trabalho de escritório. Relatórios, propostas, análises, documentação — tudo delegado.', '📊'),
      p(t('A chave é que o Claude não chuta. Ele pergunta o que precisa saber antes de começar. Por isso o resultado é tão diferente de um ChatGPT genérico.')),

      div(),

      // SECAO 4
      h1('A estratégia dos arquivos de contexto'),
      callout('Esse é o segredo que 99% das pessoas não conhece. A diferença entre "IA genérica" e "parece que fui eu que escrevi" está aqui.', '🧠'),
      p(t('Pare de pensar em "prompts melhores". '), t('Comece a pensar em arquivos melhores.', true)),
      p(t('Crie uma pasta chamada "Contexto Claude" no seu computador com 3 arquivos:')),

      h3('1. sobre-mim.md'),
      p(t('Quem você é, o que faz, pra quem trabalha, o que é sucesso pra você.')),
      codeBlock('# Sobre Mim\n\n- Nome: Igor Rocha\n- Cargo: Engenheiro Civil / Consultor de IA\n- Empresa: Visão Projetos BIM\n- O que faço: Crio sistemas de IA pra gestores que não são programadores\n- Sucesso pra mim: Entregar automações que funcionam sem depender de mim\n- Experiência: 326 projetos entregues, 13 especialistas na equipe\n- Público: Gestores de PME, profissionais liberais, empreendedores'),

      h3('2. tom-de-voz.md'),
      p(t('Como você se comunica. Suas expressões, o que evitar, referências.')),
      codeBlock('# Tom de Voz\n\n- Estilo: Direto e prático, sem rodeios\n- Sempre uso: analogias do dia a dia, exemplos concretos, números reais\n- Nunca uso: jargão técnico sem explicar, linguagem corporativa vazia\n- Formato preferido: bullet points > parágrafos longos\n- Quando explico algo técnico: uso analogia primeiro, detalhe depois\n- Referência de tom: como se estivesse explicando pra um amigo inteligente que não é da área'),

      h3('3. estilo-trabalho.md'),
      p(t('Como você quer que o Claude se comporte.')),
      codeBlock('# Estilo de Trabalho\n\n- Sempre pergunte antes de tomar decisões grandes\n- Nunca invente dados — se não sabe, avise\n- Formato padrão: títulos claros + bullet points + exemplos\n- Quando eu pedir um documento, salve direto na pasta (não me mostre o texto pra copiar)\n- Se algo não ficou claro no meu pedido, pergunte em vez de chutar\n- Priorize simplicidade — se pode resolver em 3 linhas, não faça em 30'),

      p(t('Esses arquivos ', false, true), t('melhoram com o tempo', true, true), t('. Cada semana que você refina, o Claude fica mais preciso. É como treinar um assistente — quanto mais contexto, melhor o resultado.', false, true)),

      div(),

      // SECAO 5
      h1('O primeiro prompt'),
      p(t('Depois de criar os 3 arquivos e selecionar a pasta no Cowork, use esse prompt:')),
      codeBlock('"Leia todos os arquivos desta pasta completamente.\nDepois me dê um resumo do que você sabe sobre mim,\ncomo eu trabalho e qual contexto você tem acesso.\nMe diga também o que está faltando pra você me ajudar melhor."'),
      p(t('Esse prompt faz três coisas:')),
      num('Força o Claude a ler tudo antes de começar'),
      num('Você confirma se ele entendeu certo'),
      num('Ele te diz o que falta — você pode completar os arquivos'),
      quote('A qualidade da resposta vai de "IA genérica" para "parece que fui eu que escrevi".'),
    ]
  })

  if (!page.id) {
    console.log('❌ Erro:', JSON.stringify(page, null, 2))
    return
  }

  console.log('✅ Parte 1 criada')

  // Part 2 - Append more blocks
  await notionFetch(`/blocks/${page.id}/children`, 'PATCH', {
    children: [
      div(),

      h1('Extensões (MCP Servers)'),
      p(t('MCP Servers são extensões que dão "superpoderes" ao Claude. Conectam ele a ferramentas externas. Você instala com um comando.')),

      h3('As mais úteis pra quem não programa'),
      bullet('Playwright — automação de navegador (preencher formulários, tirar screenshots, testar sites)'),
      bullet('Google Sheets — ler e escrever planilhas direto do Google'),
      bullet('Notion — ler e criar páginas no Notion'),
      bullet('Obsidian — acessar suas notas e knowledge base'),
      bullet('Supabase — banco de dados sem código'),
      bullet('GitHub — gerenciar repositórios e código'),

      p(t('Cada extensão que você adiciona, o Cowork fica mais capaz. É como dar novas ferramentas pro seu assistente.', false, true)),

      callout('No Claude Code (terminal), existem centenas de extensões. No Cowork (visual), as opções são mais limitadas mas crescem a cada atualização.', '🔌'),

      div(),

      h1('Exemplos práticos de uso'),
      p(t('Casos reais de como eu e outros profissionais usam o Cowork no dia a dia:')),

      h3('Documentos e relatórios'),
      bullet('"Leia a planilha de vendas de março e monte o relatório mensal no formato que sempre uso"'),
      bullet('"Crie uma proposta comercial pra esse cliente usando o modelo da pasta Propostas"'),
      bullet('"Compare esses dois contratos e me diga as diferenças importantes"'),

      h3('Organização de arquivos'),
      bullet('"Organize todos os PDFs desta pasta por data, crie subpastas por mês/ano"'),
      bullet('"Renomeie todos os arquivos dessa pasta seguindo o padrão YYYY-MM-DD_nome"'),

      h3('Análise de dados'),
      bullet('"Leia essa planilha Excel e me diga quais clientes gastaram mais de R$10.000 no último trimestre"'),
      bullet('"Cruze os dados dessa tabela com essa outra e gere um resumo"'),

      h3('Conteúdo'),
      bullet('"Crie 5 variações de legenda pra esse post sobre IA, no meu tom de voz"'),
      bullet('"Transforme esse artigo longo num carrossel de 10 slides"'),
      bullet('"Resuma essa reunião gravada em ata com pontos de ação"'),

      h3('Um caso real: professor criou jogo educativo'),
      p(t('Um professor desenhou a interface de um jogo educativo no papel, escaneou, deu ao Claude com a descrição das mecânicas. Em 20 minutos tinha um jogo HTML funcional rodando no navegador. Sem escrever uma linha de código.')),

      div(),

      h1('Dicas avançadas'),

      h3('1. Salve prompts que funcionam'),
      p(t('Quando um prompt dá resultado bom, salve como arquivo .md na sua pasta de contexto. O Claude vai usar como referência nas próximas vezes. Com o tempo, você constrói uma biblioteca de "receitas" que aceleram tudo.')),

      h3('2. Use o /compact quando o contexto estourar'),
      p(t('Conversas longas consomem contexto (memória). Quando o Claude começar a "esquecer" coisas do início da conversa, digite '), t('/compact', false, false, true), t('. Ele comprime tudo e libera espaço.')),

      h3('3. Comece cada tarefa com /clear'),
      p(t('Quando mudar de assunto, use '), t('/clear', false, false, true), t(' pra limpar a conversa. Isso evita que contexto de uma tarefa anterior confunda a próxima.')),

      h3('4. Automatize tarefas repetitivas'),
      p(t('Todo gestor tem tarefas que se repetem toda semana:')),
      bullet('Atualizar planilha de indicadores'),
      bullet('Montar relatório mensal'),
      bullet('Responder emails padrão'),
      bullet('Organizar pasta de projetos'),
      p(t('O Cowork faz tudo isso. Peça uma vez, salve o prompt, e da próxima vez é só rodar de novo.')),

      h3('5. Cuidado com o consumo de quota'),
      p(t('O Cowork consome mais tokens que o chat normal porque faz muito trabalho "escondido" (screenshots, processamento visual). Se seu plano Pro estiver acabando rápido, considere:')),
      bullet('Usar /compact com frequência'),
      bullet('Ser mais específico nos pedidos (menos idas e vindas)'),
      bullet('Considerar o Max ($100/mês) se usa o dia todo'),

      div(),

      h1('Problemas comuns e soluções'),
      bullet('Claude "esquece" o contexto → Use /compact ou /clear'),
      bullet('Resultado genérico → Melhore seus arquivos de contexto (sobre-mim, tom-de-voz)'),
      bullet('Muito lento → Feche outros apps pesados, mínimo 4GB RAM'),
      bullet('Não consegue acessar pasta → Verifique permissões do sistema operacional'),
      bullet('Quota acabou rápido → Normal no Cowork, considere plano Max'),

      div(),

      h1('Próximo nível: Claude Code'),
      p(t('Se você quer ir além do Cowork, o Claude Code (versão terminal) permite:')),
      bullet('Automações mais avançadas com scripts'),
      bullet('Integrações com APIs externas (Instagram, WhatsApp, email)'),
      bullet('Deploy de projetos inteiros'),
      bullet('Agentes que rodam em paralelo'),
      bullet('Hooks que formatam código automaticamente'),
      p(t('Não precisa saber programar pra começar — o próprio Claude te ensina. Mas é o caminho natural pra quem quer extrair 100% da ferramenta.')),

      div(),

      h1('Resumo'),
      callout('O segredo não é o prompt. É o contexto que você dá pro Claude. Três arquivos simples transformam uma IA genérica numa ferramenta que trabalha do seu jeito.', '🎯'),
      p(),
      p(t('Criado por '), t('@igorrocha.ia', true), t(' — Sistemas com IA para gestores que querem resultados, não complexidade.')),
      p(t('Me siga no Instagram: '), tLink('@igorrocha.ia', 'https://instagram.com/igorrocha.ia')),
      p(t('LinkedIn: '), tLink('Igor Rocha', 'https://linkedin.com/in/igorrochaia')),
    ]
  })

  console.log('✅ Parte 2 criada')
  console.log(`\n📎 Link: https://www.notion.so/${page.id.replace(/-/g, '')}`)
  console.log(`\n⚠️ Publique na web: Compartilhar → Publicar na web`)
}

main()
