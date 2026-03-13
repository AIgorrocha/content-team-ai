---
name: carousel-generator
description: "Gerar carrosseis Instagram como PNG via HTML + Playwright screenshot"
---
# Carousel Generator - Carrossel Instagram via HTML + Playwright

Gera slides de carrossel Instagram como imagens PNG (1080x1350px).
Metodo UNICO: HTML renderizado no Playwright + screenshot.

## REGRAS ABSOLUTAS

- **UNICO METODO:** HTML + Playwright screenshot (usar Playwright MCP)
- **PROIBIDO:** nano-banana, Pillow, IA generativa, canvas manual
- **SEM TITULOS** nos slides
- **FOTO OFICIAL OBRIGATORIA:** Usar foto do Igor no slide 1 e/ou CTA
- **CONFIRMAR TEXTOS** com o usuario ANTES de gerar imagens
- **MAX 30 PALAVRAS** por slide

## Design System

| Propriedade | Valor |
|-------------|-------|
| Dimensao | 1080 x 1350 px |
| Fundo | #0D0D0D |
| Texto principal | #FFFFFF |
| Texto secundario | #A0A0A0 |
| Destaque | #4A90D9 (azul) / #7C3AED (roxo) |
| Fonte | Inter |
| Handle | @igorrocha.ia |

## Fluxo

1. Receber textos dos slides
2. Confirmar com usuario
3. Gerar HTML para cada slide usando template `templates/base-slide.html`
4. Usar Playwright MCP para navegar ao HTML e tirar screenshot (1080x1350)
5. Ou usar `scripts/generate-slides.js` com Node.js + Playwright
6. Entregar PNGs prontos

## Template

O template base esta em `templates/base-slide.html`. Ele usa:
- Header com foto + nome + handle
- Area de conteudo central (hook, body, ou CTA)
- Footer opcional

## Usando o Script Node.js

```bash
cd skills/carousel-generator
node scripts/generate-slides.js
```

O script le o template, injeta conteudo de cada slide, e gera PNGs via Playwright.

## Usando Playwright MCP

Alternativamente, use o Playwright MCP server:
1. Criar HTML do slide como arquivo temporario
2. Navegar ate o arquivo com browser_navigate
3. Tirar screenshot com browser_take_screenshot
4. Repetir para cada slide
