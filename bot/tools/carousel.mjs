/**
 * carousel.mjs - Gerar carrossel HTML + Playwright screenshot
 */

import { writeFile, readFile, mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATE_PATH = resolve(__dirname, '../../skills/carousel-generator/templates/base-slide.html')
const OUTPUT_DIR = resolve(__dirname, '../../output/carousels')

export const definition = {
  name: 'generate_carousel',
  description: 'Gera slides de carrossel Instagram (1080x1350px). Recebe array de slides com texto e tipo. Retorna paths das imagens geradas.',
  input_schema: {
    type: 'object',
    properties: {
      slides: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['hook', 'body', 'cta'],
              description: 'Tipo do slide: hook (abertura), body (conteudo), cta (chamada final)',
            },
            title: { type: 'string', description: 'Titulo principal do slide' },
            body: { type: 'string', description: 'Texto do corpo (para slides body)' },
            subtitle: { type: 'string', description: 'Subtitulo (para slide hook)' },
          },
          required: ['type', 'title'],
        },
        description: 'Array de slides (max 10)',
      },
      carousel_id: {
        type: 'string',
        description: 'ID unico do carrossel (para nomear arquivos)',
      },
    },
    required: ['slides'],
  },
}

export async function execute(input) {
  const { slides, carousel_id } = input
  const id = carousel_id || `carousel-${Date.now()}`

  if (slides.length > 10) {
    return { error: 'Maximo 10 slides por carrossel' }
  }

  try {
    let template
    try {
      template = await readFile(TEMPLATE_PATH, 'utf-8')
    } catch {
      return { error: 'Template base-slide.html nao encontrado' }
    }

    const outDir = resolve(OUTPUT_DIR, id)
    await mkdir(outDir, { recursive: true })

    const paths = []

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i]
      let contentHtml = ''

      if (slide.type === 'hook') {
        contentHtml = `
          <div class="hook-text">${escHtml(slide.title)}</div>
          ${slide.subtitle ? `<div class="hook-sub">${escHtml(slide.subtitle)}</div>` : ''}
          <div class="hook-thread">Deslize para ver →</div>`
      } else if (slide.type === 'cta') {
        contentHtml = `
          <div class="cta-text">${escHtml(slide.title)}</div>
          ${slide.body ? `<div class="cta-action">${escHtml(slide.body)}</div>` : ''}
          <div class="cta-handle">@igorrocha.ia</div>`
      } else {
        contentHtml = `
          <div class="slide-title">${escHtml(slide.title)}</div>
          <div class="slide-body">${formatBody(slide.body || '')}</div>`
      }

      const html = template.replace('<!-- CONTENT INJECTED HERE -->', contentHtml)
      const htmlPath = resolve(outDir, `slide-${i + 1}.html`)
      await writeFile(htmlPath, html)

      const pngPath = resolve(outDir, `slide-${i + 1}.png`)

      try {
        const { chromium } = await import('playwright')
        const browser = await chromium.launch()
        const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
        await page.setContent(html, { waitUntil: 'networkidle' })
        await page.screenshot({ path: pngPath, type: 'png' })
        await browser.close()
        paths.push(pngPath)
      } catch (err) {
        paths.push(`${htmlPath} (screenshot falhou: ${err.message})`)
      }
    }

    return {
      success: true,
      carousel_id: id,
      slides_count: slides.length,
      output_dir: outDir,
      files: paths,
    }
  } catch (err) {
    return { error: err.message }
  }
}

function escHtml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function formatBody(text) {
  return text
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return `<div class="bullet">${escHtml(line.substring(2))}</div>`
      }
      return `<p>${escHtml(line)}</p>`
    })
    .join('\n')
}
