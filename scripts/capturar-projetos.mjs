// Tira prints (desktop e celular) dos projetos publicados para assets/NN-slug, a fonte do prints-projetos.mjs.
// Uso: node scripts/capturar-projetos.mjs && node scripts/prints-projetos.mjs
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const PROJETOS = [['01-starbucks', 'https://beatrizbonotto.github.io/Starbucks/'], ['02-curriculo-multilingue', 'https://beatrizbonotto.github.io/curriculo/']];
const b = await chromium.launch();
for (const [pasta, url] of PROJETOS) {
  fs.mkdirSync(`assets/${pasta}`, { recursive: true });
  for (const [nome, viewport] of [['desktop-01', { width: 1440, height: 900 }], ['mobile-01', { width: 390, height: 844 }]]) {
    const p = await b.newPage({ viewport, deviceScaleFactor: nome.startsWith('mobile') ? 2 : 1 });
    await p.goto(url, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1500);
    await p.screenshot({ path: `assets/${pasta}/${nome}.png` });
    await p.close();
  }
  console.log('ok', pasta);
}
await b.close();
