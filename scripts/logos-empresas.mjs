// Recorta o símbolo de cada empresa (assets/logos) em um selo quadrado 256px com fundo transparente,
// envia ao Storage (media/empresas) e grava em site_content.clientes. Uso: node scripts/logos-empresas.mjs
import sharp from 'sharp';
import { adminClient, SUPABASE_URL } from './supabase-admin.mjs';

// recorte do símbolo em frações da imagem já sem bordas vazias (trim): [esquerda, topo, largura, altura]
const EMPRESAS = [
  { nome: 'Dínamo Seguros', arq: 'dinamo.png', corte: [0, 0, 0.27, 1] },
  { nome: 'INSS', arq: 'inss.png', corte: [0.17, 0, 0.66, 0.78] },
  { nome: 'Tecnoset', arq: 'tecnoset.png', corte: [0, 0, 0.24, 1] },
  { nome: 'Claro', arq: 'claro.webp', corte: [0, 0, 1, 1] },
];
const sb = await adminClient();
const lista = [];
for (const e of EMPRESAS) {
  const limpo = await sharp(`assets/logos/${e.arq}`).trim().toBuffer();
  const { width: w, height: h } = await sharp(limpo).metadata();
  const [l, t, lw, lh] = e.corte;
  const simbolo = await sharp(limpo).extract({ left: Math.round(l * w), top: Math.round(t * h), width: Math.round(lw * w), height: Math.round(lh * h) }).trim().toBuffer();
  const selo = await sharp(simbolo).resize(200, 200, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: 28, bottom: 28, left: 28, right: 28, background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 90 }).toBuffer();
  const nome = `empresas/${e.arq.replace(/\.\w+$/, '')}.webp`;
  const { error } = await sb.storage.from('media').upload(nome, selo, { contentType: 'image/webp', upsert: true, cacheControl: '31536000' });
  if (error) throw error;
  lista.push({ nome: e.nome, logo: `${SUPABASE_URL}/storage/v1/object/public/media/${nome}?v=${Date.now().toString(36)}` });
}
const { error } = await sb.from('site_content').upsert({ key: 'clientes', value: lista });
if (error) throw error;
console.log('ok', lista.map(x => x.nome).join(', '));
