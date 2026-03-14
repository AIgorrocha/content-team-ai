const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, '..', 'skills', 'carousel-generator', 'templates', 'base-slide.html'),
  'utf-8'
);

// Profile photo - real photo as base64
const photoPath = path.join(__dirname, 'igor-photo.jpg');
const photoB64 = fs.readFileSync(photoPath).toString('base64');
const PROFILE_PHOTO = 'data:image/jpeg;base64,' + photoB64;

const slides = [
  // SLIDE 1 - HOOK
  {
    type: 'hook',
    html: `
      <div class="hook-text">Claude Cowork não é chatbot.</div>
      <div class="hook-sub">Ele controla seu computador e executa tarefas por você.</div>
      <div class="hook-thread">Como configurar do jeito certo. Um guia completo:</div>
    `
  },
  // SLIDE 2
  {
    type: 'body',
    html: `
      <div class="slide-title">1. O que o Cowork realmente faz</div>
      <div class="slide-body">
        <p>A maioria pensa que é igual ao ChatGPT. Uma caixa de texto.</p>
        <p>O Claude Cowork é diferente.</p>
        <div class="bullet">Mora no seu computador</div>
        <div class="bullet">Lê e escreve nas suas pastas reais</div>
        <div class="bullet">Cria Word, Excel e PowerPoint prontos</div>
        <div class="bullet">Instala extensões específicas pro seu trabalho</div>
        <div class="bullet">Faz perguntas antes de agir</div>
      </div>
    `
  },
  // SLIDE 3
  {
    type: 'body',
    html: `
      <div class="slide-title">2. O ciclo de trabalho</div>
      <div class="slide-body">
        <p>Eu descrevo o que preciso.</p>
        <p>O Cowork me faz 3 perguntas.</p>
        <p>Eu respondo.</p>
        <p>Volto 20 minutos depois e o documento está pronto.</p>
        <p class="closing">Esse ciclo já cobre 60% do meu trabalho de escritório.</p>
      </div>
    `
  },
  // SLIDE 4
  {
    type: 'body',
    html: `
      <div class="slide-title">3. Acesso aos seus arquivos</div>
      <div class="slide-body">
        <p>O Claude lê e escreve direto nas pastas do seu computador.</p>
        <p>Sem upload. Sem download. Sem arrastar arquivo pra janela de chat.</p>
        <div class="bullet">Selecione uma pasta. Ele lê tudo que tem dentro</div>
        <div class="bullet">Usa seus relatórios antigos como referência</div>
        <div class="bullet">Puxa dados do mês passado pra montar o atual</div>
        <div class="bullet">Salva o resultado direto na sua pasta</div>
        <p class="closing">IA no seu ambiente. Não uma ferramenta que você precisa ir até ela.</p>
      </div>
    `
  },
  // SLIDE 5
  {
    type: 'body',
    html: `
      <div class="slide-title">4. A estratégia dos arquivos de contexto</div>
      <div class="slide-body">
        <p>Pare de pensar em "prompts melhores". Comece a pensar em <span class="emphasis">arquivos melhores</span>.</p>
        <p>Crie uma pasta "Contexto Claude" com 3 arquivos:</p>
        <div class="bullet"><span class="emphasis">sobre-mim.md</span> &mdash; quem você é, seu cargo, o que faz</div>
        <div class="bullet"><span class="emphasis">tom-de-voz.md</span> &mdash; como você se comunica, suas expressões</div>
        <div class="bullet"><span class="emphasis">estilo-trabalho.md</span> &mdash; como você quer que o Claude se comporte</div>
        <p class="closing">Esses arquivos melhoram com o tempo. Cada semana que você refina, o Claude fica mais preciso.</p>
      </div>
    `
  },
  // SLIDE 6
  {
    type: 'body',
    html: `
      <div class="slide-title">5. Primeiro comando</div>
      <div class="slide-body">
        <p>Depois de selecionar sua pasta, digite:</p>
        <div class="quote">"Leia todos os arquivos desta pasta. Me diga o que você sabe sobre mim, como eu trabalho e que contexto você tem."</div>
        <p>A qualidade muda de "IA genérica" para "isso parece algo que eu escreveria".</p>
      </div>
    `
  },
  // SLIDE 7
  {
    type: 'body',
    html: `
      <div class="slide-title">6. Ele pergunta antes de fazer</div>
      <div class="slide-body">
        <p>Antes de executar qualquer ação, o Cowork pede permissão:</p>
        <div class="quote">"Posso criar este arquivo?"<br>"Posso modificar esta planilha?"<br>"Posso rodar este comando?"</div>
        <p>Você aprova cada passo. Nada acontece sem seu OK.</p>
        <p class="closing">É como ter um assistente que mostra o trabalho antes de entregar.</p>
      </div>
    `
  },
  // SLIDE 8
  {
    type: 'body',
    html: `
      <div class="slide-title">7. Sua primeira tarefa</div>
      <div class="slide-body">
        <p>Comece simples:</p>
        <div class="quote">"Organize os arquivos desta pasta por tipo e data. Crie subpastas se necessário."</div>
        <p>Depois evolua:</p>
        <div class="bullet">"Crie um relatório com base nesses dados"</div>
        <div class="bullet">"Atualize esta planilha com os números de março"</div>
        <div class="bullet">"Escreva um email profissional resumindo este documento"</div>
      </div>
    `
  },
  // SLIDE 9
  {
    type: 'body',
    html: `
      <div class="slide-title">8. Extensões (MCP)</div>
      <div class="slide-body">
        <p>Extensões conectam o Cowork a ferramentas externas. Pense nelas como "superpoderes".</p>
        <div class="bullet"><span class="emphasis">Gmail</span> &mdash; lê e envia emails por você</div>
        <div class="bullet"><span class="emphasis">Google Drive</span> &mdash; cria e edita documentos na nuvem</div>
        <div class="bullet"><span class="emphasis">Slack</span> &mdash; envia mensagens no canal certo</div>
        <div class="bullet"><span class="emphasis">Banco de dados</span> &mdash; consulta e atualiza informações</div>
      </div>
    `
  },
  // SLIDE 10
  {
    type: 'body',
    html: `
      <div class="slide-title">9. Biblioteca de extensões</div>
      <div class="slide-body">
        <p>Existem centenas de extensões prontas.</p>
        <p>Você instala com um comando. Sem programação.</p>
        <div class="bullet">Planilhas Google</div>
        <div class="bullet">Notion e Obsidian</div>
        <div class="bullet">WhatsApp e Telegram</div>
        <div class="bullet">Supabase, PostgreSQL, Firebase</div>
        <div class="bullet">GitHub, Jira, Linear</div>
        <p class="closing">Cada extensão que você adiciona, o Cowork fica mais capaz.</p>
      </div>
    `
  },
  // SLIDE 11
  {
    type: 'body',
    html: `
      <div class="slide-title">10. Instruções permanentes</div>
      <div class="slide-body">
        <p>Você pode criar regras que o Claude segue sempre:</p>
        <div class="bullet">"Sempre responda em português"</div>
        <div class="bullet">"Use tom profissional e direto"</div>
        <div class="bullet">"Salve arquivos na pasta Documentos"</div>
        <div class="bullet">"Nunca delete arquivos sem perguntar"</div>
        <p class="closing">Uma vez configurado, ele segue suas regras em toda conversa nova.</p>
      </div>
    `
  },
  // SLIDE 12
  {
    type: 'body',
    html: `
      <div class="slide-title">11. O arquivo CLAUDE.md</div>
      <div class="slide-body">
        <p>Crie um arquivo chamado <span class="emphasis">CLAUDE.md</span> na raiz da sua pasta de trabalho.</p>
        <p>Coloque nele:</p>
        <div class="bullet">Quem você é e o que faz</div>
        <div class="bullet">Regras do seu negócio</div>
        <div class="bullet">Como você quer as entregas</div>
        <div class="bullet">O que ele nunca deve fazer</div>
        <p>O Claude lê esse arquivo automaticamente toda vez que inicia.</p>
        <p class="closing">É como dar um manual de operações pro seu assistente.</p>
      </div>
    `
  },
  // SLIDE 13
  {
    type: 'body',
    html: `
      <div class="slide-title">12. Criando documentos profissionais</div>
      <div class="slide-body">
        <p>O Cowork cria documentos completos:</p>
        <div class="bullet"><span class="emphasis">Word</span> &mdash; propostas, contratos, relatórios</div>
        <div class="bullet"><span class="emphasis">Excel</span> &mdash; planilhas com fórmulas funcionando</div>
        <div class="bullet"><span class="emphasis">PowerPoint</span> &mdash; apresentações formatadas</div>
        <div class="bullet"><span class="emphasis">PDF</span> &mdash; documentos finalizados</div>
        <p>Não é rascunho. Sai pronto pra enviar ao cliente.</p>
      </div>
    `
  },
  // SLIDE 14
  {
    type: 'body',
    html: `
      <div class="slide-title">13. Automatizando tarefas repetitivas</div>
      <div class="slide-body">
        <p>Todo gestor tem aquelas tarefas que se repetem toda semana:</p>
        <div class="bullet">Atualizar planilha de indicadores</div>
        <div class="bullet">Montar relatório mensal</div>
        <div class="bullet">Responder emails padrão</div>
        <div class="bullet">Organizar pasta de projetos</div>
        <p>O Cowork faz tudo isso. Você só precisa pedir uma vez e salvar o prompt.</p>
      </div>
    `
  },
  // SLIDE 15
  {
    type: 'body',
    html: `
      <div class="slide-title">14. Segurança</div>
      <div class="slide-body">
        <p>A dúvida mais comum: "é seguro?"</p>
        <div class="bullet">Ele pede permissão antes de cada ação</div>
        <div class="bullet">Você pode limitar quais pastas ele acessa</div>
        <div class="bullet">Nada é enviado sem sua aprovação</div>
        <div class="bullet">Seus dados ficam no seu computador</div>
        <p class="closing">Você está no controle o tempo todo. Ele é o assistente, você é o chefe.</p>
      </div>
    `
  },
  // SLIDE 16
  {
    type: 'body',
    html: `
      <div class="slide-title">15. O que muda na sua rotina</div>
      <div class="slide-body">
        <p><span class="emphasis">Antes:</span> 2 horas montando relatório.</p>
        <p><span class="emphasis">Depois:</span> 5 minutos descrevendo o que precisa.</p>
        <p><span class="emphasis">Antes:</span> arrastar arquivo pro ChatGPT e copiar resposta.</p>
        <p><span class="emphasis">Depois:</span> o Claude já está na sua pasta, sabe seu contexto e entrega pronto.</p>
        <p class="closing">Não é sobre IA fazer seu trabalho. É sobre IA fazer a parte chata pra você focar no que importa.</p>
      </div>
    `
  },
  // SLIDE 17
  {
    type: 'body',
    html: `
      <div class="slide-title">16. Como começar hoje</div>
      <div class="slide-body">
        <div class="bullet">Acesse claude.ai/download e instale o Claude Desktop</div>
        <div class="bullet">Abra e selecione uma pasta de trabalho</div>
        <div class="bullet">Crie o arquivo CLAUDE.md com suas regras</div>
        <div class="bullet">Dê o primeiro comando: "Leia tudo e me diga o que encontrou"</div>
        <div class="bullet">Comece com tarefas simples e vá evoluindo</div>
        <p class="closing">Em 15 minutos você já está usando. Em uma semana, não vive sem.</p>
      </div>
    `
  },
  // SLIDE 18 - CTA
  {
    type: 'cta',
    html: `
      <div class="cta-text">Quer o passo a passo completo de como extrair 100% do Claude Cowork?</div>
      <div class="cta-action">Comenta <span style="color:#FFFFFF;font-weight:800">COWORK</span> que te mando o guia completo.</div>
      <div class="cta-handle">@igorrocha.ia</div>
    `
  }
];

async function generate() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 2
  });

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const page = await context.newPage();

    const html = TEMPLATE
      .replace('PROFILE_PHOTO_URL', PROFILE_PHOTO)
      .replace('<!-- CONTENT INJECTED HERE -->', slide.html);

    await page.setContent(html, { waitUntil: 'networkidle' });

    // Wait for font to load
    await page.waitForTimeout(2000);

    const num = String(i + 1).padStart(2, '0');
    const outputPath = path.join(__dirname, `slide-${num}.png`);

    await page.screenshot({
      path: outputPath,
      type: 'png',
      clip: { x: 0, y: 0, width: 1080, height: 1350 }
    });

    console.log(`Slide ${num} gerado: ${outputPath}`);
    await page.close();
  }

  await browser.close();
  console.log(`\nTotal: ${slides.length} slides gerados em carousel-output/`);
}

generate().catch(console.error);
