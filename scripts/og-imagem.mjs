// Imagem de compartilhamento (og.jpg, 1200x630) tirada da própria abertura do site, no quadro em que
// ela olha para a câmera e o nome aparece; sem menu, textos de rodapé da abertura nem borboletas.
// Uso: npm run build && node scripts/og-imagem.mjs
import { chromium } from '@playwright/test';
import { preview } from 'vite';
import sharp from 'sharp';

const servidor = await preview({ preview: { port: 4175, strictPort: true } });
const b = await chromium.launch({ channel: 'chrome' });
try {
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2, colorScheme: 'light' });
  await p.addInitScript(() => sessionStorage.setItem('splash', '1'));
  await p.goto('http://localhost:4175/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '[data-nav], .hero-intro, [data-particulas], canvas[data-particulas], .pular { display: none !important; }' });
  // rola até o fim do vídeo de abertura (antes de encolher), onde o nome está visível
  const fim = await p.evaluate(() => { const h = document.querySelector('[data-hero]'); return (h.offsetHeight - innerHeight) * 0.52; });
  for (let y = 0; y <= fim; y += 60) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(40); }
  await p.waitForSelector('.hero-nome.visivel');
  await p.waitForTimeout(2500); // letras do nome terminam de entrar
  const png = await p.screenshot();
  await sharp(png).resize(1200, 630).jpeg({ quality: 86, mozjpeg: true }).toFile('public/media/og.jpg');
  console.log('og ok');
} finally {
  await b.close();
  servidor.httpServer.close();
}
