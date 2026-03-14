---
name: carousel-generator
description: "Generate Instagram carousel slides as PNG images using HTML templates + Playwright screenshots"
homepage: https://playwright.dev
metadata: { "openclaw": { "emoji": "🎨", "requires": { "bins": ["node", "npx"], "env": ["SUPABASE_URL", "SUPABASE_SERVICE_KEY"] } } }
---
# Carousel Generator - Gerar Carrossel Instagram via HTML + Playwright

Gera slides de carrossel Instagram como imagens PNG (1080x1350px).
Metodo UNICO: HTML renderizado no Playwright + screenshot. NENHUM outro metodo e permitido.

## REGRAS ABSOLUTAS

- **UNICO METODO:** HTML + Playwright screenshot
- **PROIBIDO:** nano-banana, Pillow, IA generativa, canvas manual
- **SEM TITULOS** nos slides (nunca colocar titulo/header)
- **FOTO OFICIAL OBRIGATORIA:** Usar a foto do Igor no slide 1 e/ou CTA
- **CONFIRMAR TEXTOS** com o usuario ANTES de gerar imagens
- **MAX 30 PALAVRAS** por slide

## Design System

| Propriedade | Valor |
|-------------|-------|
| Dimensao | 1080 x 1350 px |
| Fundo | #0D0D0D (preto) |
| Texto principal | #FFFFFF (branco) |
| Texto secundario | #A0A0A0 (cinza) |
| Destaque 1 | #4A90D9 (azul) |
| Destaque 2 | #7C3AED (roxo) |
| Fonte primaria | Inter |
| Fonte secundaria | Space Grotesk |
| Estilo | Minimalista |
| Foto perfil | Canto inferior esquerdo |
| Handle | @igorrocha.ia |

## Step 1: Preparar os textos

Antes de gerar qualquer imagem:
1. Listar TODOS os textos dos slides
2. Mostrar ao usuario para aprovacao
3. SO gerar imagens apos confirmacao

## Step 2: Gerar HTML de cada slide

Para CADA slide, criar um arquivo HTML seguindo o template abaixo.
Salvar os HTMLs em `/root/.openclaw/workspace/carousel-temp/`.

### Template Slide CORPO (slides 2 a N-1):

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1080px;
    height: 1350px;
    background: #0D0D0D;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 80px;
    font-family: 'Inter', sans-serif;
    color: #FFFFFF;
    overflow: hidden;
  }

  .content {
    text-align: center;
    max-width: 920px;
  }

  .main-text {
    font-size: 52px;
    font-weight: 800;
    line-height: 1.3;
    margin-bottom: 40px;
    letter-spacing: -0.5px;
  }

  .sub-text {
    font-size: 36px;
    font-weight: 400;
    line-height: 1.5;
    color: #A0A0A0;
  }

  .highlight {
    color: #4A90D9;
    font-weight: 900;
  }

  .list-item {
    font-size: 38px;
    font-weight: 600;
    line-height: 1.8;
    text-align: left;
    color: #FFFFFF;
  }

  .list-item::before {
    content: "- ";
    color: #4A90D9;
  }

  .footer {
    position: absolute;
    bottom: 40px;
    left: 80px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .footer img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }

  .footer span {
    font-size: 24px;
    color: #A0A0A0;
    font-weight: 500;
  }
</style>
</head>
<body>
  <div class="content">
    <!-- TEXTO PRINCIPAL AQUI -->
    <div class="main-text">TEXTO PRINCIPAL</div>
    <!-- TEXTO SECUNDARIO (OPCIONAL) -->
    <div class="sub-text">Texto secundario aqui</div>
  </div>

  <div class="footer">
    <img src="/root/.openclaw/workspace/logo-igor-rocha.jpg" alt="Igor">
    <span>@igorrocha.ia</span>
  </div>
</body>
</html>
```

### Template Slide GANCHO (slide 1):

Mesmo template do corpo, mas com fonte maior:
- `.main-text` font-size: **64px**
- `.main-text` font-weight: **900**
- Sem `.sub-text` (ou usar para complemento curto)

### Template Slide CTA (ultimo slide):

Mesmo template do corpo, mas:
- `.main-text` font-size: **48px** (pergunta)
- Adicionar `.cta-action` com font-size **56px**, font-weight **900**, color **#4A90D9**
- Foto do Igor maior (96x96px) centralizada

### Template com LISTA (slides com bullet points):

Substituir `.main-text` + `.sub-text` por:
```html
<div class="content">
  <div class="main-text" style="font-size: 44px; margin-bottom: 48px;">Titulo da lista</div>
  <div class="list-item">Item 1</div>
  <div class="list-item">Item 2</div>
  <div class="list-item">Item 3</div>
  <div class="list-item">Item 4</div>
</div>
```

## Step 3: Screenshot com Playwright

Para CADA arquivo HTML, tirar screenshot PNG:

```bash
npx playwright screenshot \
  --browser chromium \
  --viewport-size "1080,1350" \
  --full-page \
  "file:///root/.openclaw/workspace/carousel-temp/slide-01.html" \
  "/root/.openclaw/workspace/carousel-temp/slide-01.png"
```

Repetir para cada slide (slide-01.html -> slide-01.png, slide-02.html -> slide-02.png, etc).

## Step 4: Upload para Supabase Storage

Fazer upload de cada PNG para Supabase Storage (bucket publico) para que o instagram-poster possa usar:

```bash
for f in /root/.openclaw/workspace/carousel-temp/slide-*.png; do
  FILENAME=$(basename "$f")
  curl -s -X POST "$SUPABASE_URL/storage/v1/object/carousel-images/$FILENAME" \
    -H "apikey: $SUPABASE_SERVICE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
    -H "Content-Type: image/png" \
    --data-binary "@$f"
done
```

As URLs publicas ficam em: `$SUPABASE_URL/storage/v1/object/public/carousel-images/slide-XX.png`

## Step 5: Mostrar resultado ao usuario

Depois de gerar todos os PNGs:
1. Listar os arquivos gerados com tamanho
2. Mostrar as URLs publicas
3. Perguntar se quer publicar agora (delegar para instagram-poster)

## Limpeza

Apos confirmacao do usuario, limpar os temporarios:
```bash
rm -rf /root/.openclaw/workspace/carousel-temp/
```

## Fluxo Completo Resumido

1. Receber textos dos slides
2. Confirmar com usuario
3. Gerar HTML para cada slide
4. Screenshot Playwright -> PNG
5. Upload Supabase Storage
6. Mostrar resultado
7. (Opcional) Publicar via instagram-poster
8. Limpar temporarios

## Customizacoes por Slide

Se um slide precisa de destaque especial, usar a classe `.highlight`:
```html
<span class="highlight">PALAVRA DESTAQUE</span>
```

Se precisa de emoji ou icone, usar emoji Unicode direto no HTML.

## Troubleshooting

- **Fonte Inter nao carrega:** Verificar internet no servidor. Fallback: `font-family: 'Inter', Arial, sans-serif`
- **Playwright nao instalado:** Rodar `npx playwright install chromium`
- **Imagem cortada:** Verificar viewport-size esta 1080,1350
- **Texto muito longo:** Reduzir font-size ou quebrar em 2 slides
