// Gera os PDFs dos casos (materiais-portfolio/pdf) e os prints dos projetos (assets/NN-slug) a partir da Central de Documentos.
// Uso: sirva public/ na porta 8799 (python -m http.server 8799) e rode node scripts/gerar-casos.mjs && node scripts/prints-projetos.mjs <slugs>
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const BASE = 'http://localhost:8799/portfolio-operacional/';
const PDF = 'materiais-portfolio/pdf';
fs.mkdirSync(PDF, { recursive: true });
const b = await chromium.launch();
const erros = [];
const paginasPdf = buf => (buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;

async function abrir(vp, hash, escala = 1) {
  const p = await b.newPage({ viewport: vp, deviceScaleFactor: escala });
  p.on('pageerror', e => erros.push(e.message));
  p.on('console', m => ['error', 'assert'].includes(m.type()) && erros.push(m.text()));
  await p.goto(BASE + hash, { waitUntil: 'networkidle' });
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  // nos recortes de elemento o cabeçalho fixo ficaria por cima; nas vistas gerais ele aparece normalmente
  if (vp.width === 1280) await p.addStyleTag({ content: '.topo { position: static !important; }' });
  return p;
}
async function pdf(p, sel, nome) {
  await p.evaluate(s => window.prepararTrecho(s), sel);
  const buf = await p.pdf({ path: `${PDF}/${nome}`, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await p.evaluate(() => document.getElementById('impressao')?.remove());
  console.log('pdf', nome, paginasPdf(buf), 'página(s)');
}

const CASOS = {
  '03-portfolio-rotinas-seguros': { doc: 'renovacao', extra: [['fianca', 'p04-analise-fianca']], fluxo: 'fianca', anexo: 'p06-anexo-apolice' },
  '04-portfolio-rotinas-documentais': { doc: 'oficio', extra: [], fluxo: 'documental', anexo: 'p05-anexo-protocolos' },
  '05-portfolio-rotinas-suprimentos': { doc: 'compra', extra: [['w2h', 'p04-plano-5w2h']], fluxo: 'suprimentos', anexo: 'p06-anexo-orcamento' },
};

for (const [pasta, c] of Object.entries(CASOS)) {
  const dir = `assets/${pasta}`;
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  // visão geral (desktop e celular): e-mail + documento
  for (const [nome, vp, esc] of [['desktop-01', { width: 1440, height: 900 }, 1], ['mobile-01', { width: 390, height: 844 }, 2]]) {
    const p = await abrir(vp, `#doc-${c.doc}`, esc);
    await p.evaluate(m => { document.querySelector(m ? '#email' : '#documentos').scrollIntoView(); scrollBy(0, m ? -70 : 0); }, nome === 'mobile-01');
    await p.waitForTimeout(300);
    await p.screenshot({ path: `${dir}/${nome}.png` });
    await p.close();
  }
  const p = await abrir({ width: 1280, height: 900 }, `#doc-${c.doc}`, 1.5);
  await p.locator('#email').screenshot({ path: `${dir}/p02-email.png` });
  await p.locator('#folha').screenshot({ path: `${dir}/p03-documento.png` });
  const nomePdf = await p.evaluate(() => document.querySelector('[data-anexo="0"] .anexo-nome').textContent);
  await pdf(p, '#folha', nomePdf);
  // anexo fictício (último da lista do e-mail)
  await p.locator('[data-anexo]').last().click();
  await p.locator('#visor-anexo-img svg').screenshot({ path: `${dir}/${c.anexo}.png` });
  await p.keyboard.press('Escape');
  for (const [doc, arq] of c.extra) {
    await p.goto(BASE + `#doc-${doc}`); await p.waitForTimeout(300);
    await p.locator('#folha').screenshot({ path: `${dir}/${arq}.png` });
    await pdf(p, '#folha', await p.evaluate(() => document.querySelector('[data-anexo="0"] .anexo-nome').textContent));
  }
  await p.goto(BASE + `#fluxo-${c.fluxo}`); await p.waitForTimeout(300);
  await p.locator('#area-fluxo').screenshot({ path: `${dir}/p05-fluxograma.png` });
  await pdf(p, '#area-fluxo', `Fluxograma_${c.fluxo}.pdf`);
  await p.close();
  console.log('ok', pasta, fs.readdirSync(dir).join(', '));
}

// formulário começa vazio e o botão carrega o exemplo
const p = await abrir({ width: 1280, height: 900 }, '');
console.log('vazio:', await p.textContent('#doc-status'), '| e-mail oculto:', await p.isHidden('#email'));
await p.click('#btn-exemplo');
console.log('exemplo:', await p.textContent('#doc-status'));
await p.close();
await b.close();
console.log('erros:', erros.length ? erros : 'nenhum');
