# Carousel Standards - Regras de Geracao de Carrosseis

## Metodo UNICO Permitido

**HTML + Playwright screenshot.** Nenhum outro metodo e aceito.

### Como funciona:
1. Criar arquivo HTML com o conteudo do slide
2. Usar Playwright para abrir o HTML no navegador
3. Tirar screenshot no tamanho 1080x1350px
4. Resultado: PNG pronto para Instagram

## PROIBIDO

- **nano-banana** — biblioteca Node.js de geracao de imagem
- **Pillow** — biblioteca Python de manipulacao de imagem
- **IA generativa** — DALL-E, Midjourney, Stable Diffusion para gerar slides
- **Canvas manual** — desenhar pixels manualmente via codigo
- **Qualquer outro metodo** que nao seja HTML + Playwright

### Por que?
Metodos alternativos (Pillow, IA generativa) NUNCA seguem o template corretamente.
HTML + Playwright garante que o resultado e pixel-perfect e consistente.

## Regras Visuais

### Sem titulos nos slides
- NENHUM slide deve ter titulo/header/banner no topo
- O conteudo comeca direto no centro do slide
- Isso mantem o visual limpo e minimalista

### Foto oficial obrigatoria
- Usar a foto real do Igor Rocha no slide 1 (gancho) e/ou slide final (CTA)
- NUNCA gerar foto por IA
- Arquivo: `logo-igor-rocha.jpg` no workspace
- Posicao padrao: canto inferior esquerdo (48x48px) ou centralizada no CTA (96x96px)

## Tipos de Template

### 1. Texto Puro
- Slides com texto sobre fundo #0D0D0D
- Fonte Inter, peso 800 para texto principal
- Destaque em azul (#4A90D9) para palavras-chave
- Maximo 30 palavras por slide

### 2. Com Imagens
- Slides que incluem imagens/screenshots alem do texto
- Layout adaptado para acomodar a imagem
- Texto reduzido para complementar a imagem
- Imagem deve ter boa resolucao (min 600px de largura)

## Legenda do Post

### Hashtags
- **SEMPRE 5 hashtags** na legenda do carrossel
- Hashtags relevantes ao tema do post
- Misturar hashtags amplas e de nicho
- Exemplo: #igorrocha #ia #automacao #produtividade #tecnologia

### Estrutura da Legenda
1. Gancho (primeira linha que aparece antes do "mais")
2. Corpo com valor (2-3 paragrafos curtos)
3. CTA (chamada para acao)
4. 5 hashtags
- NUNCA usar frases auto-referenciais ("nesse carrossel eu mostro", "nesse post explico", "nesse reels")

### Legendas por plataforma
- **Instagram + Threads** — MESMA legenda. Publica no IG e compartilha pro Threads
- **LinkedIn** — Legenda DIFERENTE, adaptada ao tom profissional da plataforma
- **TikTok** — NAO tem carrossel, nao criar legenda
- Salvar no mesmo arquivo com separador "--- LINKEDIN ---"

## Especificacoes Tecnicas

| Propriedade | Valor |
|-------------|-------|
| Largura | 1080px |
| Altura | 1350px |
| Formato | PNG |
| Fundo | #0D0D0D |
| Texto principal | #FFFFFF |
| Texto secundario | #A0A0A0 |
| Destaque azul | #4A90D9 |
| Destaque roxo | #7C3AED |
| Fonte primaria | Inter |
| Fonte secundaria | Space Grotesk |
| Max slides | 10 |
| Max palavras/slide | 30 |

## Comando Playwright

```bash
npx playwright screenshot \
  --browser chromium \
  --viewport-size "1080,1350" \
  --full-page \
  "file:///caminho/para/slide.html" \
  "/caminho/para/slide.png"
```

## Referencia

Regras definidas na sessao 2026-03-12. Ver `docs/SESSAO_2026-03-12_EXEC-APPROVALS-CARROSSEL.md` no repo moltbot.
