const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, '..', 'templates', 'base-slide.html'),
  'utf-8'
);

// Profile photo - real photo as base64
const photoPath = path.join(__dirname, '..', 'assets', 'igor-photo.jpg');
const photoB64 = fs.existsSync(photoPath)
  ? fs.readFileSync(photoPath).toString('base64')
  : '';
const PROFILE_PHOTO = photoB64
  ? 'data:image/jpeg;base64,' + photoB64
  : 'https://via.placeholder.com/64';

// Define your slides here
const slides = [
  {
    type: 'hook',
    html: `
      <div class="hook-text">Seu texto de gancho aqui.</div>
      <div class="hook-sub">Subtitulo explicativo.</div>
      <div class="hook-thread">Deslize para ver:</div>
    `
  },
  {
    type: 'body',
    html: `
      <div class="slide-title">1. Topico do slide</div>
      <div class="slide-body">
        <p>Conteudo principal aqui.</p>
        <div class="bullet">Ponto 1</div>
        <div class="bullet">Ponto 2</div>
        <div class="bullet">Ponto 3</div>
      </div>
    `
  },
  {
    type: 'cta',
    html: `
      <div class="cta-text">Gostou do conteudo?</div>
      <div class="cta-action">Comenta <span style="color:#FFFFFF;font-weight:800">SIM</span> que te mando mais.</div>
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

  const outputDir = path.join(__dirname, '..', '..', '..', 'carousel-output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const page = await context.newPage();

    const html = TEMPLATE
      .replace('PROFILE_PHOTO_URL', PROFILE_PHOTO)
      .replace('<!-- CONTENT INJECTED HERE -->', slide.html);

    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const num = String(i + 1).padStart(2, '0');
    const outputPath = path.join(outputDir, `slide-${num}.png`);

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
