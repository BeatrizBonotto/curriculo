// Gera public/media e os ícones a partir de assets/videos (arquivos "old_" são ignorados):
// vídeos, posters, quadros rolados pelo scroll (abertura e "Como eu trabalho"), foto de perfil, logo e imagem OG.
// Uso: node scripts/preparar-midia.mjs   (rode de novo sempre que trocar um vídeo)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const ORIGEM = 'assets/videos', DESTINO = 'public/media';
const arquivos = fs.readdirSync(ORIGEM).filter(f => f.toLowerCase().endsWith('.mp4') && !f.toLowerCase().startsWith('old_'));
const achar = re => arquivos.find(f => re.test(f.toLowerCase()));
const fontes = { intro: achar(/intro/), entrevista: achar(/entrevista|contato/), escritorio: achar(/trabalh|escrit/) };
if (!fontes.intro || !fontes.entrevista) throw new Error(`faltam vídeos em ${ORIGEM}: preciso de um com "intro" e outro com "entrevista" ou "contato" no nome`);
// shortcut: sem o vídeo "trabalhando", a seção "Como eu trabalho" usa o da entrevista; ao colocar o arquivo, rode de novo
if (!fontes.escritorio) { fontes.escritorio = fontes.entrevista; console.warn('aviso: sem vídeo "trabalhando" em assets/videos; usando o da entrevista'); }

fs.rmSync(`${DESTINO}/escritorio`, { recursive: true, force: true });
fs.rmSync(`${DESTINO}/intro`, { recursive: true, force: true });
fs.mkdirSync(`${DESTINO}/intro`, { recursive: true });
for (const [nome, de] of Object.entries(fontes)) fs.copyFileSync(path.join(ORIGEM, de), `${DESTINO}/${nome}.mp4`);

// Logo: monograma em serifa sobre rosé antigo (mesmo desenho no favicon, ícones do app e currículo)
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="256" fill="#9E4F67"/>
<circle cx="256" cy="256" r="222" fill="none" stroke="#F5CAD6" stroke-width="6" opacity=".55"/>
<text x="256" y="338" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="236" fill="#FFF7F9" letter-spacing="-14">Bb</text></svg>`;
fs.writeFileSync('public/favicon.svg', logoSvg);
const logo = Buffer.from(logoSvg);
for (const t of [64, 128]) await sharp(logo).resize(t).webp({ quality: 92 }).toFile(`${DESTINO}/logo-${t}.webp`);
for (const [arq, t] of [['apple-touch-icon.png', 180], ['favicon-96x96.png', 96], ['web-app-manifest-192x192.png', 192], ['web-app-manifest-512x512.png', 512]]) await sharp(logo).resize(t).png().toFile(`public/${arq}`);
await sharp(logo).resize(48).png().toFile('public/favicon.ico'); // PNG dentro de .ico: todos os navegadores atuais aceitam

// Chrome (canal "chrome") decodifica H.264; o Chromium do Playwright não.
const b = await chromium.launch({ channel: 'chrome', args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
const tmp = path.resolve('node_modules/.cache-video.html');
async function abrir(video) {
  fs.writeFileSync(tmp, `<body style="margin:0;background:#000"><video id=v muted src="${pathToFileURL(path.resolve(DESTINO, video)).href}" style="display:block;width:1280px;height:720px"></video></body>`);
  await p.goto(pathToFileURL(tmp).href);
  return p.evaluate(() => new Promise(r => { const v = document.getElementById('v'); v.readyState >= 1 ? r(v.duration) : v.onloadedmetadata = () => r(v.duration); }));
}
const quadro = t => p.evaluate(t => new Promise(r => { const v = document.getElementById('v'); v.onseeked = () => requestAnimationFrame(() => r()); v.currentTime = t; }), t).then(() => p.locator('#v').screenshot());

const QUADROS = 60;
// recorte só das faixas pretas laterais do vídeo de abertura (medidas com ffmpeg cropdetect: 1210x720 a partir de x=34)
const RECORTE = { left: 36, top: 0, width: 1206, height: 720 };
let dur = await abrir('escritorio.mp4');
await sharp(await quadro(0.5)).webp({ quality: 72 }).toFile(`${DESTINO}/escritorio-poster.webp`);
dur = await abrir('intro.mp4');
for (let i = 0; i < QUADROS; i++) {
  const img = await quadro(Math.min(dur - 0.05, (dur * i) / (QUADROS - 1)));
  await sharp(img).extract(RECORTE).webp({ quality: 66 }).toFile(`${DESTINO}/intro/${String(i).padStart(3, '0')}.webp`);
}
const final = await quadro(dur - 0.05);
await sharp(final).extract(RECORTE).webp({ quality: 76 }).toFile(`${DESTINO}/intro-poster.webp`);
dur = await abrir('entrevista.mp4');
await sharp(await quadro(1)).webp({ quality: 72 }).toFile(`${DESTINO}/entrevista-poster.webp`);
await b.close();
fs.rmSync(tmp);

// Foto de perfil (3:4) recortada do último quadro da abertura, em resolução cheia
const fotoTmp = path.resolve('node_modules/.cache-foto.png');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-sseof', '-0.1', '-i', path.join(ORIGEM, fontes.intro), '-frames:v', '1', fotoTmp]);
const meta = await sharp(fotoTmp).metadata();
const alt = meta.height, larg = Math.round(alt * 3 / 4), esq = Math.round(meta.width * 0.505 - larg / 2);
const retrato = await sharp(fotoTmp).extract({ left: esq, top: 0, width: larg, height: alt }).toBuffer();
fs.rmSync(fotoTmp);
await sharp(retrato).resize(768, 1024).webp({ quality: 80 }).toFile(`${DESTINO}/perfil-padrao.webp`);
await sharp(retrato).resize(600, 800).webp({ quality: 80 }).toFile(`${DESTINO}/perfil-social.webp`);

// Imagem de compartilhamento 1200x630
const foto = await sharp(retrato).resize({ height: 630 }).toBuffer();
const lf = (await sharp(foto).metadata()).width;
const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#FAF5F2"/>
<text x="72" y="130" font-family="Arial, sans-serif" font-size="22" fill="#9E4F67" letter-spacing="5">ANALISTA ADMINISTRATIVA</text>
<text x="66" y="262" font-family="Georgia, serif" font-size="104" fill="#2B2226">Beatriz</text>
<text x="66" y="372" font-family="Georgia, serif" font-style="italic" font-size="104" fill="#9E4F67">Bonotto</text>
<text x="72" y="448" font-family="Arial, sans-serif" font-size="24" fill="#66545C">Administração · Atendimento · Seguros · Tecnologia</text>
<text x="72" y="560" font-family="Arial, sans-serif" font-size="22" fill="#66545C">beatrizgsbonotto.web.app</text></svg>`;
await sharp(Buffer.from(svg)).composite([{ input: foto, left: 1200 - lf, top: 0 }]).jpeg({ quality: 84 }).toFile(`${DESTINO}/og.jpg`);

// quadros da seção "Como eu trabalho" (canvas rolado pelo scroll); sem eles o vídeo fica congelado no poster
execFileSync(process.execPath, ['scripts/quadros-video.mjs', `${DESTINO}/escritorio.mp4`, `${DESTINO}/escritorio`, String(QUADROS), '1280'], { stdio: 'inherit' });
console.log('ok', fontes, fs.readdirSync(`${DESTINO}/intro`).length, 'quadros na abertura');
