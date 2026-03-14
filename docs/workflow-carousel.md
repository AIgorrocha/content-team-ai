# Workflow Completo — Carrossel Instagram + Threads + LinkedIn

## Fase 1: Criacao do conteudo

1. Definir tema e pesquisar referencias
2. Criar slides via HTML + Playwright (ver carousel-standards.md)
3. Gerar PNGs 1080x1350 na pasta `content/carousels/[nome]/`

## Fase 2: Legenda

1. Criar legenda com max 500 caracteres (funciona no Instagram E Threads)
2. Criar versao LinkedIn (tom mais profissional) no mesmo arquivo separado por `--- LINKEDIN ---`
3. SEMPRE 5 hashtags
4. NUNCA "nesse carrossel eu mostro" ou similares
5. Salvar como `legenda-[nome].txt` na pasta do carrossel

## Fase 3: Lead magnet (guia)

1. Pesquisar conteudo aprofundado sobre o tema
2. Criar guia no Notion via API (`scripts/create-notion-guide.mjs`)
3. Compartilhar pagina como link publico
4. Legenda com CTA "Comenta [PALAVRA] que te mando"

## Fase 4: Publicacao

1. **Instagram:** postar manualmente (API limita 10 slides, app permite 20)
2. **Threads:** compartilhar do Instagram (mesma legenda)
3. **LinkedIn:** postar manualmente com legenda LinkedIn
4. **TikTok:** SO se tiver versao reels/video (nao tem carrossel)

## Fase 5: Automacao Manychat

1. Criar automacao "Auto-DM de links dos comentarios" no Manychat
2. Gatilho: comentario com palavra-chave no post especifico
3. DM 1: mensagem de boas-vindas + botao
4. DM 2: link do guia no Notion
5. Ativar como LIVE

## Fase 6: Adaptacao LinkedIn (PENDENTE)

- Usar agente ct-tuner (Tuner) do Content Team pra adaptar conteudo
- Analisar o que performa melhor no LinkedIn vs Instagram
- Automatizar publicacao no LinkedIn via API

## Licoes Aprendidas

- Instagram Graph API limita carrossel a 10 slides (app permite 20)
- Postar manual quando mais de 10 slides
- Token do Instagram (Graph API) nao expira na nova API com login do Instagram
- Manychat plano Free: maximo 1 automacao ativa
- Notion plano Free: nao permite "Publicar na web", usa link compartilhado
- NUNCA commitar tokens no GitHub (GitHub Push Protection bloqueia)
- Legenda unica pra Instagram + Threads (max 500 chars)
- Legenda separada pro LinkedIn
- TikTok nao tem carrossel, so reels
