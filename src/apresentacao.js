// Modo apresentação: slides em tela cheia com vídeo ou fundo animado, transições e roteiro de fala (tecla N).
// Estrutura pensada para entrevista: apresentação, casos e pausas para perguntas entre os blocos.
import './styles/apresentacao.css';
import QRCode from 'qrcode';
import { SITE } from './config.js';
import { alinharNome } from './lib/alinhar-nome.js';
import { icone } from './render/comum.js';
import { traduzirApresentacao } from './lib/apresentacao-i18n.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Vídeos em bumerangue (ida e volta, sem emenda). A abertura roda na velocidade normal; os de fundo, mais devagar.
const V = {
  intro: { src: '/media/intro.mp4', vel: 1, unico: true },
  introLoop: { src: '/media/ap-intro.mp4', vel: 0.6 },
  escritorio: { src: '/media/ap-escritorio.mp4', vel: 0.6 },
  entrevista: { src: '/media/entrevista.mp4', vel: 0.6 },
};

// Até 3 feedbacks reais (avaliações do Google já publicadas no site), curtos.
// ---------- Dados lidos da própria página (fonte única: o que já está publicado no site) ----------
const dadosPagina = () => { try { return JSON.parse(document.getElementById('dados')?.textContent || '{}'); } catch { return {}; } };
const sobreTexto = () => document.querySelector('.sobre-lead')?.textContent.trim() || '';
const fotoPerfil = () => document.querySelector('.sobre-foto img')?.getAttribute('src') || '';
const iniciais = nome => String(nome || '').split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');

// até 3 feedbacks na ordem em que a landing carrega, garantindo pelo menos um de gestão
const GESTAO = /gestor|gerente|lead|coorden|diretor|head|ceo|cto|fundador|s[óo]cio|supervisor|manager|product owner/i;
const recorte = (s, n) => { const t = String(s || '').trim(); if (t.length <= n) return t; const c = t.slice(0, n); return c.slice(0, c.lastIndexOf(' ')) + '…'; };
function feedbacks() {
  const recs = (dadosPagina().recomendacoes || []).filter(r => r.mensagem);
  const escolhidos = recs.slice(0, 3);
  const gestao = recs.find(r => GESTAO.test(`${r.cargo || ''} ${r.empresa || ''}`));
  if (gestao && !escolhidos.includes(gestao)) escolhidos[escolhidos.length - 1] = gestao;
  return escolhidos.filter(Boolean).sort((a, b) => recs.indexOf(a) - recs.indexOf(b));
}
const avatar = r => r.imagem_url ? `<img class="ap-avatar" src="${esc(r.imagem_url)}" alt="" loading="lazy">` : `<span class="ap-avatar ap-avatar-ini" aria-hidden="true">${esc(iniciais(r.nome))}</span>`;

// Lista em sequência (uma informação embaixo da outra, numerada): mais fácil de ler e de seguir o raciocínio
const seq = (itens, classe = '') => `<ol class="ap-seq ${classe}">${itens.map(([titulo, texto], i) => `<li style="--i:${i + 1}"><span class="ap-seq-n">${i + 1}</span><div><b>${titulo}</b><span>${texto}</span></div></li>`).join('')}</ol>`;
// caso de sucesso: onde foi, qual era o problema, a solução e o impacto
const caso = (onde, problema, solucao, impacto) => seq([['Onde', onde], ['Problema', problema], ['Solução', solucao], ['Impacto', impacto]], 'ap-seq-caso');

// missão, visão e valores publicados na seção Sobre do site
function mvv() {
  return [...document.querySelectorAll('.mvv article')].map(a => {
    const itens = [...a.querySelectorAll('li')].map(li => li.textContent.trim());
    return [a.querySelector('h2')?.textContent.trim() || '', itens.length ? itens.join(' · ') : a.querySelector('p')?.textContent.trim() || ''];
  }).filter(([t, d]) => t && d);
}

// Slides padrão da estrutura de entrevista: sobre, carreira, casos, feedbacks, projetos, por que eu, encerramento
const slideSobre = (titulo, pilares, notas) => ({ fundo: 'aurora', html: () => `
      <div class="ap-sobre">${fotoPerfil() ? `<div class="ap-foto-caixa" style="--i:1"><img class="ap-foto" src="${esc(fotoPerfil())}" alt=""></div>` : ''}
      <div><p class="ap-rotulo">Sobre</p><h2>${titulo}</h2>${sobreTexto() ? `<p class="ap-sub ap-resumo">${esc(sobreTexto())}</p>` : ''}${seq(pilares)}</div></div>`, notas });
const slideMvv = notas => ({ fundo: 'aurora', html: () => `<p class="ap-rotulo">Quem sou</p><h2>Missão, visão e valores.</h2>${seq(mvv())}`, notas });

// carreira: linha do tempo em barras (gráfico) com os números na mesma tela; itens = [início, fim ou null, empresa, papel]
// ---- logos e detalhes (tudo vem do que já tá publicado no site) ----
const semAc = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
// logo da empresa: primeiro nas experiências, depois na faixa de empresas da home
function logoEmpresa(nome) {
  if (!nome) return '';
  const n = semAc(nome).split(/[\s(]/)[0];
  const e = (dadosPagina().experiencias || []).find(x => x.logo && semAc(x.instituicao).includes(n));
  if (e) return e.logo;
  // na faixa de empresas o nome fica no texto do item, não no alt da imagem
  const li = [...document.querySelectorAll('main li')].find(l => l.querySelector('img') && semAc(l.textContent).includes(n));
  const img = li?.querySelector('img');
  return img ? img.currentSrc || img.src : '';
}
const marca = (src, nome) => src ? `<img class="ap-logo" src="${esc(src)}" alt="" loading="lazy">` : `<span class="ap-logo ap-logo-ini" aria-hidden="true">${esc(iniciais(nome))}</span>`;
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const mesAno = d => { if (!d) return 'hoje'; const [a, m] = String(d).split('-'); return `${MESES[+m - 1]} ${a}`; };
const nomeCurto = org => (String(org).match(/\(([^)]+)\)/) || [])[1] || String(org).replace(/ Advogados Associados$/, '');
// duração tipo "2 anos e 3 meses"
function duracao(ini, fim) {
  const [a1, m1] = String(ini).split('-').map(Number);
  const f = fim ? String(fim).split('-').map(Number) : [new Date().getFullYear(), new Date().getMonth() + 1];
  const tot = (f[0] - a1) * 12 + (f[1] - m1) + 1;
  const a = Math.floor(tot / 12), m = tot % 12;
  return [a ? `${a} ${a > 1 ? 'anos' : 'ano'}` : '', m ? `${m} ${m > 1 ? 'meses' : 'mês'}` : ''].filter(Boolean).join(' e ');
}

const slideCarreira = (titulo, notas) => ({ fundo: 'ondas', html: () => {
  const exps = (dadosPagina().experiencias || []).filter(e => e.inicio).sort((x, y) => String(x.inicio).localeCompare(String(y.inicio)));
  const agora = new Date(); const hoje = agora.getFullYear() + agora.getMonth() / 12;
  const num = d => d ? +String(d).slice(0, 4) + (+String(d).slice(5, 7) - 1) / 12 : hoje;
  const ini = Math.floor(Math.min(...exps.map(e => num(e.inicio)))), fim = Math.ceil(hoje + 0.05);
  const x = v => ((v - ini) / (fim - ini)) * 100;
  const marcas = []; for (let a = ini; a <= agora.getFullYear(); a += 2) marcas.push(a);
  // anos de experiência = soma dos períodos trabalhados (sem contar os buracos e sem contar 2x o que se sobrepõe)
  const per = exps.map(e => [num(e.inicio), num(e.fim)]).sort((p, q) => p[0] - q[0]);
  let anos = 0, ate = -Infinity;
  for (const [a, b] of per) { const c = Math.max(a, ate); if (b > c) anos += b - c; ate = Math.max(ate, b); }
  const empresas = new Set(exps.map(e => semAc(nomeCurto(e.instituicao)).split(' ')[0])).size;
  // barra fica pra cima do balão quando tá na metade da direita (senão sai da tela)
  return `<p class="ap-rotulo">Carreira</p><h2>${titulo}</h2>
    <div class="ap-numeros"><span><b>${Math.floor(anos)}</b> anos de experiência</span><span><b>${empresas}</b> empresas</span><span class="ap-dica">Toque numa barra para ver os detalhes</span></div>
    <div class="ap-gantt">
      ${exps.slice().reverse().map((e, k) => { const l = x(num(e.inicio)), w = Math.max(x(num(e.fim)) - l, 2.5); return `<div class="ap-gantt-linha" style="--i:${k + 1}">
        <span class="ap-gantt-rot">${marca(e.logo, nomeCurto(e.instituicao))}<span><b>${esc(nomeCurto(e.instituicao))}</b>${esc(e.titulo || '')}</span></span>
        <span class="ap-gantt-trilho"><button type="button" class="ap-gantt-barra" style="left:${l}%;width:${w}%" aria-expanded="false" data-balao><em>${w < 9 ? String(e.inicio).slice(0, 4) : e.fim ? `${String(e.inicio).slice(0, 4)} a ${String(e.fim).slice(0, 4)}` : `desde ${String(e.inicio).slice(0, 4)}`}</em></button>
          <span class="ap-balao ${l > 50 ? 'ap-balao-esq' : ''}" style="--x:${l > 50 ? l + w : l}%" hidden><b>${esc(e.titulo || '')}</b><span>${esc(e.instituicao)}</span><span>${mesAno(e.inicio)} a ${mesAno(e.fim)} · ${duracao(e.inicio, e.fim)}</span><span>${[e.local, e.modalidade, e.regime].filter(Boolean).map(esc).join(' · ')}</span></span></span>
      </div>`; }).join('')}
      <div class="ap-gantt-linha ap-gantt-eixo"><span></span><span class="ap-gantt-trilho">${marcas.map(a => `<small style="left:${x(a)}%">${a}</small>`).join('')}</span></div>
    </div>`;
}, notas });
// prova do caso: a tela da ferramenta quando existe; senão, um feedback da mesma empresa
function provaHTML(prova) {
  if (!prova) return '';
  const d = dadosPagina(); const projetos = d.apresentacao || d.projetos || [];
  const p = prova.projeto ? projetos.find(x => x.slug === prova.projeto) : null;
  const gal = p?.galeria || [];
  const k = Math.max(0, gal.findIndex(g => prova.foto && g.url.includes(prova.foto)));
  const img = gal[k];
  if (img) return `<figure class="ap-prova"><button type="button" class="ap-prova-ver" data-galeria="${esc(p.slug)}" data-inicio="${k}" aria-label="Ver imagens de ${esc(p.titulo)}"><img src="${esc(img.url)}" alt="${esc(prova.rotulo || p.titulo)}" loading="lazy"><span class="ap-prova-mais">${gal.length > 1 ? `Ver ${gal.length} imagens` : 'Ampliar'}</span></button><figcaption>${esc(prova.rotulo || p.titulo)}</figcaption></figure>`;
  if (prova.referencia) return `<figure class="ap-prova ap-prova-ref"><blockquote>${esc(prova.referencia.texto)}</blockquote><figcaption>${esc(prova.referencia.titulo)}</figcaption></figure>`;
  const recs = (d.recomendacoes || []).filter(r => prova.empresa && r.empresa && r.empresa.toLowerCase().includes(prova.empresa.toLowerCase()));
  const rec = recs[prova.indice || 0];
  if (rec) return `<figure class="ap-prova ap-prova-rec"><blockquote>"${esc(recorte(rec.mensagem, 220))}"</blockquote><figcaption>${esc(rec.nome)}${rec.cargo ? ` · ${esc(rec.cargo)}` : ''}</figcaption></figure>`;
  return '';
}
function ondeHTML(rotulo) {
  const nome = rotulo.split('·').pop().trim();
  const lugar = ONDE[nome] || [nome];
  const logo = lugar.map(logoEmpresa).find(Boolean);
  return `<span class="ap-onde">${marca(logo, lugar[0])}${esc(lugar.join(' · '))}</span>`;
}
const slideCaso = (areas, video, rotulo, titulo, problema, solucao, impacto, regra, notas, prova) => ({ areas, video,
  html: `<p class="ap-rotulo">Case de sucesso</p><h2>${titulo}</h2>
    <div class="ap-caso"><div>${caso(ondeHTML(rotulo), problema, solucao, impacto)}${regra && !prova?.referencia ? `<p class="ap-regra">${regra}</p>` : ''}</div>${provaHTML(prova)}</div>`, notas });
// formação: técnico, graduação, pós e certificações na mesma grade de cartões
const ano = s => (s ? String(s).slice(0, 4) : '');
const slideFormacao = notas => ({ fundo: 'aurora', html: () => {
  const d = dadosPagina();
  const form = (d.formacoes || []).slice().sort((a, b) => String(b.inicio).localeCompare(String(a.inicio)));
  const item = (t, sub, i, logo, nome) => `<li style="--i:${i + 1}">${nome ? marca(logo, nome) : ''}<div><b>${esc(t)}</b><span>${esc(sub)}</span></div></li>`;
  const semAcento = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const tipoLabel = v => { const s = semAcento(v); return /lato|pos|especializ|mba/.test(s) ? 'Pós-graduação' : /bacharel|gradua|licenciatura|tecnologo/.test(s) ? 'Graduação' : /tecnic/.test(s) ? 'Curso técnico' : /livre/.test(s) ? 'Curso livre' : String(v || ''); };
  const periodo = f => { const a = ano(f.inicio), b = f.atual ? 'atual' : ano(f.fim); return !b || b === a ? a : `${a} → ${b}`; };
  const cursos = form.map(f => semAcento(f.curso));
  const certs = (d.certificacoes || []).filter(c => !cursos.some(cur => cur && semAcento(c.nome).includes(cur))).sort((a, b) => String(b.data).localeCompare(String(a.data)));
  const grupos = [
    form.length ? `<div class="ap-grupo"><h3>Formação acadêmica</h3><ul>${form.map((f, i) => item(f.curso, [tipoLabel(f.tipo), f.instituicao, periodo(f), f.modalidade].filter(Boolean).join(' · '), i, f.logo, f.instituicao)).join('')}</ul></div>` : '',
    certs.length ? `<div class="ap-grupo"><h3>Cursos e certificações</h3><ul>${certs.map((c, i) => item(c.nome, [c.instituicao, ano(c.data)].filter(Boolean).join(' · '), i)).join('')}</ul></div>` : '',
  ].filter(Boolean).join('');
  return `<p class="ap-rotulo">Formação</p><h2>Técnico, graduação e cursos.</h2>
    <div class="ap-formacao">${grupos || '<p class="ap-sub">Formação e certificações estão na página Trajetória do site.</p>'}</div>`;
}, notas });
const slideFeedbacks = (titulo, notas) => ({ video: V.entrevista, html: () => `
      <p class="ap-rotulo">Feedbacks</p><h2>${titulo}</h2>
      <div class="ap-recs">${feedbacks().map((r, i) => `<blockquote style="--i:${i + 1}" role="button" tabindex="0" data-rec="${i}" aria-label="Ler o feedback completo de ${esc(r.nome)}"><p>“${esc(recorte(r.mensagem, 200))}”</p><footer>${avatar(r)}<cite><b>${esc(r.nome)}</b>${[r.cargo, r.empresa].filter(Boolean).map(esc).join(' · ')}</cite>${logoEmpresa(r.empresa) ? `<img class="ap-logo ap-logo-rec" src="${esc(logoEmpresa(r.empresa))}" alt="${esc(r.empresa)}">` : ''}</footer></blockquote>`).join('')}</div>`, notas });

// imagens dos casos da área escolhida (capa, documento e fluxograma de cada um), com a legenda cadastrada
// uma imagem por projeto, na ordem dos destaques da área
function fotosProjetos(area) {
  const projetos = dadosPagina().projetos || [];
  return AREAS[area].destaques.map(slug => projetos.find(p => p.slug === slug)).filter(Boolean)
    .map(p => { const g = (p.galeria || [])[0]; return g ? { src: g.url, legenda: p.titulo, tela: g.legenda ? '' : rotuloFoto(g.url) } : null; })
    .filter(Boolean);
}
// contatos publicados na página (e-mail, WhatsApp, LinkedIn), mais o site
// +55 (19) 99591-0737
const fone = n => { const d = String(n).replace(/\D/g, ''); return d.length >= 12 ? `+${d.slice(0, 2)} (${d.slice(2, 4)}) ${d.slice(4, -4)}-${d.slice(-4)}` : d; };
const semHttp = u => String(u).replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
function contatos() {
  const vistos = new Set();
  const lista = [...document.querySelectorAll('a[href^="mailto:"], a[href*="wa.me/"], a[href*="linkedin.com"], a[href*="github.com"]')]
    .map(a => a.href.startsWith('mailto:') ? [a.href, a.href.slice(7), 'email'] : a.href.includes('wa.me') ? [a.href, fone(a.href.split('wa.me/')[1]), 'whatsapp'] : a.href.includes('github') ? [a.href, semHttp(a.href), 'github'] : [a.href, semHttp(a.href), 'linkedin'])
    .filter(([h]) => !vistos.has(h) && vistos.add(h));
  return [...lista, [SITE.url, semHttp(SITE.url), 'globo']];
}

const sobrenome = () => document.querySelector('.hero-nome-2')?.textContent.trim() || 'G. Souza Bonotto';
const nomeBloco = cargo => `<p class="ap-nome" data-ap-nome><span class="ap-nome-1">Beatriz</span><span class="ap-nome-2">${esc(sobrenome())}</span><span class="ap-nome-cargo">${esc(cargo)}</span></p>`;

// Áreas: o tema escolhido no início define os casos, as imagens e o cargo da capa
const AREAS = {
  adm: { nome: 'Administração', cargo: 'Analista Administrativa', projetos: ['central-documentos', 'portfolio-rotinas-documentais', 'portfolio-rotinas-suprimentos'], destaques: ['central-documentos', 'portfolio-rotinas-documentais', 'portfolio-rotinas-suprimentos'] },
  seguros: { nome: 'Seguros', cargo: 'Analista de Seguros', projetos: ['central-documentos', 'portfolio-rotinas-seguros'], destaques: ['central-documentos', 'portfolio-rotinas-seguros'] },
  ti: { nome: 'TI', cargo: 'Tecnologia · Informática para Internet', projetos: ['central-documentos', 'starbucks'], destaques: ['central-documentos', 'starbucks'] },
};

// onde cada solução rodou (o logo sai da empresa listada primeiro)
const ONDE = {
  'Dínamo Seguros': ['Dínamo Seguros', 'carteira de imobiliárias parceiras'],
  'Seguro Fiança': ['Dínamo Seguros', 'imobiliárias parceiras'],
  'INSS': ['INSS', 'Campinas'],
  'Tecnoset e Claro': ['Tecnoset', 'Claro Brasil'],
  'Central de Documentos': ['Dínamo Seguros', 'ferramenta própria'],
};

const SLIDES = (area) => [
  // 1. Introdução
  { video: V.intro, abertura: true, classe: 'ap-capa', html: nomeBloco(AREAS[area].cargo),
    notas: 'Deixe o vídeo rodar. Quando o nome aparecer, cumprimente e agradeça o tempo. Diga o que vai mostrar: quem você é, sua carreira e casos reais. Avise que vai pausar para perguntas.' },

  // 2. Sobre
  slideSobre('Organização, atendimento consultivo e processo bem documentado.', [
    ['Organização', 'Rotinas com prazo, checklist e registro de cada etapa.'],
    ['Atendimento consultivo', 'Explico as opções com clareza para o cliente decidir com segurança.'],
    ['Conformidade', 'LGPD, normas da SUSEP e padrão oficial de redação.'],
  ], 'Apresente-se em até 1 minuto: formação, anos de experiência e o que procura agora. Ligue com a vaga: diga por que ela faz sentido para você.'),

  // 3. Carreira
  slideMvv('Fale da missão com suas palavras e dê um exemplo real de cada valor no trabalho. Isso responde "como você trabalha?" antes da pergunta.'),

  // 3. Carreira: linha do tempo e números na mesma tela
  slideCarreira('Do apoio administrativo à análise de seguros.', 'Conte como uma evolução: cada experiência somou uma habilidade. Destaque o crescimento dentro da Dínamo, de estagiária a analista.'),

  // 3b. Formação
  slideFormacao('Diga o que cada formação somou: o técnico em informática deu base prática de web, a graduação em administração deu visão de gestão e processo. Cite um curso que mudou sua forma de trabalhar.'),

  // 4. Casos reais por área
  slideCaso(['seguros'], V.entrevista, 'Caso real · Dínamo Seguros', 'Renovação sem deixar apólice vencer.',
    'Muitas renovações de Ramos Elementares vencendo ao mesmo tempo.',
    'Régua com alerta 45 dias antes, cotação em 3 seguradoras e proposta com comparativo de prêmio e coberturas.',
    'Renovações tratadas antes do vencimento e cliente decidindo com clareza.',
    'Sem renovação, a cobertura termina às 24h do último dia de vigência.', 'Explique como compara propostas: prêmio, franquia, coberturas e parcelamento. Diga como conduz o contato consultivo.',
    { projeto: 'portfolio-rotinas-seguros', foto: 'p03-documento', rotulo: 'Proposta de renovação com comparativo' }),
  slideCaso(['seguros'], V.escritorio, 'Caso real · Seguro Fiança', 'Análise que não trava a locação.',
    'Pedidos urgentes das imobiliárias, com documentação incompleta.',
    'Checklist de documentos e regra de renda (pelo menos 3x o aluguel com encargos) antes de enviar à seguradora.',
    'Menos idas e vindas com a seguradora e locação liberada mais rápido.',
    'Lei 8.245/91: arts. 37 e 41 (garantias) e art. 22, VIII (seguro contra incêndio).', 'Se a renda não fecha, cite as saídas: composição de renda ou outra garantia, já que a lei não permite duas no mesmo contrato.',
    { projeto: 'portfolio-rotinas-seguros', foto: 'p04-analise-fianca', rotulo: 'Análise de Seguro Fiança' }),
  slideCaso(['adm'], V.escritorio, 'Caso real · INSS', 'Documento encontrado pelo protocolo em minutos.',
    'Alto volume de documentos físicos e risco de extravio.',
    'Triagem, conferência, digitalização, indexação por protocolo e ofícios no padrão oficial.',
    'Localização rápida e comunicação interna padronizada.',
    'Fecho: Respeitosamente para autoridade superior; Atenciosamente para a mesma hierarquia.', 'Explique o fluxo documental e por que indexar por protocolo evita retrabalho.',
    { projeto: 'portfolio-rotinas-documentais', foto: 'p03-documento', rotulo: 'Ofício no padrão oficial' }),
  slideCaso(['adm'], V.entrevista, 'Caso real · Tecnoset e Claro', 'Estoque acima do mínimo e planilhas no mesmo padrão.',
    'Falta de suprimentos e planilhas em formatos diferentes entre áreas.',
    'Ponto de pedido, cotação com 3 fornecedores e padrão único de colunas com validação.',
    'Reposição antes de faltar e lançamentos com menos correções.',
    'Ponto de pedido = consumo diário × prazo de entrega + estoque de segurança.', 'Mostre que sabe calcular o ponto de pedido e por que comparar pelo custo total com frete.',
    { projeto: 'portfolio-rotinas-suprimentos', foto: 'p03-documento', rotulo: 'Requisição com ponto de pedido' }),
  slideCaso(['ti', 'adm', 'seguros'], V.escritorio, 'Caso real · Central de Documentos', 'Uma ferramenta feita para o meu dia a dia.',
    'Documentos parecidos refeitos à mão, com risco de esquecer regra, anexo ou fecho.',
    'Página em HTML, CSS e JavaScript que gera o e-mail de envio e o documento em PDF a partir de um formulário.',
    'Padrão único, cálculos prontos e nenhum dado sai do navegador (LGPD).',
    '', 'Mostre a ferramenta ao vivo se der: gere uma proposta de renovação com o exemplo.',
    { projeto: 'central-documentos', rotulo: 'Central de Documentos' }),

  // 5. Pausa
  { pausa: true, fundo: 'constelacao', html: `<p class="ap-rotulo">Pausa</p><h2>Alguma pergunta até aqui?</h2><p class="ap-sub">Posso detalhar qualquer caso antes de seguir.</p>`,
    notas: 'Pare de verdade e espere. Se não houver perguntas, pergunte qual dos casos mais se parece com o dia a dia da vaga.' },

  // 6. Feedbacks
  slideFeedbacks('O que dizem os clientes.', 'Leia um trecho curto de uma avaliação. Relacione com o atendimento consultivo.'),

  // 7. Projetos
  { fundo: 'constelacao', html: () => `
      <p class="ap-rotulo">Projetos</p><h2>Casos documentados.</h2>
      <ul class="ap-galeria">${fotosProjetos(area).map((f, i) => `<li style="--i:${i + 1}"><img src="${esc(f.src)}" alt="" loading="lazy"><span><b>${esc(f.legenda)}</b>${f.tela ? `<em>${esc(f.tela)}</em>` : ''}</span></li>`).join('')}</ul>`,
    notas: 'Passe pelas imagens: e-mail ao cliente, documento em PDF e fluxograma de cada caso.' },

  // 8. Por que eu
  { fundo: 'aurora', html: `<p class="ap-rotulo">O que eu entrego</p><h2>Por que posso somar à equipe.</h2>${seq([
      ['Processo sob controle', 'Prazos, checklist e registro: nada se perde no caminho.'],
      ['Atendimento que gera confiança', 'Explico com clareza e acompanho até resolver.'],
      ['Melhoria contínua', 'Quando algo se repete, padronizo e automatizo.'],
    ])}`,
    notas: 'Resuma o valor em três frases. Depois faça suas perguntas: como a equipe trabalha hoje, qual o maior desafio da vaga e quais os próximos passos.' },

  // 9. Encerramento
  { pausa: true, video: V.introLoop, classe: 'ap-capa ap-fim', html: () => `
      <div class="ap-fim-texto"><p class="ap-rotulo">Obrigada</p>${nomeBloco('Perguntas finais? Fico à disposição.')}
      <ul class="ap-contatos">${contatos().map(([href, txt, ic]) => `<li><a href="${esc(href)}" target="_blank" rel="noopener"><span class="ap-contato-ic">${icone(ic)}</span>${esc(txt)}</a></li>`).join('')}</ul></div>
      <figure class="ap-qr"><div data-ap-qr></div><figcaption>${esc(SITE.url.replace('https://', ''))}</figcaption></figure>`,
    notas: 'Agradeça. Combine o próximo passo e o prazo de retorno. Mostre o QR code para acessarem o site.' },
];

/* Fundos animados em canvas, discretos: aurora (manchas de luz), ondas (linhas finas) e constelação (pontos que seguem o mouse). */
function fundoAnimado(canvas) {
  const g = canvas.getContext('2d');
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let modo = '', w = 0, h = 0, dpr = 1, raf = 0, pontos = [];
  const mouse = { x: -1e4, y: -1e4 };
  const medir = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    pontos = Array.from({ length: Math.round(Math.min(90, (w * h) / 18000)) }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25 }));
  };
  const quadro = t => {
    g.clearRect(0, 0, w, h);
    if (modo === 'aurora') {
      [[.25, .35, '232,165,185'], [.75, .6, '158,79,103'], [.5, .85, '245,202,214']].forEach(([fx, fy, cor], i) => {
        const x = w * (fx + Math.sin(t / 7000 + i * 2) * .12), y = h * (fy + Math.cos(t / 9000 + i) * .1), r = Math.max(w, h) * .45;
        const grad = g.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, `rgba(${cor},.22)`); grad.addColorStop(1, `rgba(${cor},0)`);
        g.fillStyle = grad; g.fillRect(0, 0, w, h);
      });
    } else if (modo === 'ondas') {
      g.lineWidth = 1;
      for (let k = 0; k < 14; k++) {
        g.strokeStyle = `rgba(232,165,185,${0.09 + k * 0.016})`;
        g.beginPath();
        for (let x = 0; x <= w; x += 12) {
          const y = h * (.35 + k * .035) + Math.sin(x / 220 + t / 2600 + k * .5) * 38 + Math.sin(x / 90 - t / 3800) * 8 + (mouse.y > 0 ? (mouse.y - h / 2) * .03 * Math.exp(-((x - mouse.x) ** 2) / 60000) : 0);
          x ? g.lineTo(x, y) : g.moveTo(x, y);
        }
        g.stroke();
      }
    } else if (modo === 'constelacao') {
      for (const p of pontos) {
        p.x = (p.x + p.vx + w) % w; p.y = (p.y + p.vy + h) % h;
        const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
        if (d < 160) { p.x -= dx * .004; p.y -= dy * .004; }
      }
      for (let i = 0; i < pontos.length; i++) {
        const a = pontos[i];
        g.fillStyle = 'rgba(245,202,214,.55)'; g.beginPath(); g.arc(a.x, a.y, 1.4, 0, 6.29); g.fill();
        for (let j = i + 1; j < pontos.length; j++) {
          const b = pontos[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) { g.strokeStyle = `rgba(232,165,185,${(1 - d / 130) * .22})`; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); }
        }
      }
    }
    if (!reduzido && modo) raf = requestAnimationFrame(quadro);
  };
  const mover = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
  addEventListener('resize', medir);
  addEventListener('pointermove', mover);
  medir();
  return {
    usar(novo) { modo = novo || ''; cancelAnimationFrame(raf); canvas.classList.toggle('ativo', !!modo); if (modo) quadro(performance.now()); else g.clearRect(0, 0, w, h); },
    parar() { cancelAnimationFrame(raf); removeEventListener('resize', medir); removeEventListener('pointermove', mover); },
  };
}

let raiz = null;

export function abrir(aoFechar = () => {}) {
  if (raiz) return;
  let slides = [];
  let i = 0, soltarNome = () => {}, revelar = null;
  const inicio = Date.now();
  raiz = document.createElement('dialog'); // camada superior do navegador: fica acima de qualquer modal do site
  raiz.className = 'ap';
  raiz.setAttribute('role', 'dialog');
  raiz.setAttribute('aria-modal', 'true');
  raiz.setAttribute('aria-label', 'Modo apresentação');
  raiz.innerHTML = `
    <video class="ap-video" muted loop playsinline aria-hidden="true"></video>
    <canvas class="ap-fundo" aria-hidden="true"></canvas>
    <div class="ap-veu" aria-hidden="true"></div>
    <section class="ap-slide" aria-live="polite"></section>
    <aside class="ap-notas" hidden><b>Roteiro</b><p></p></aside>
    <footer class="ap-barra">
      <span class="ap-cont"></span>
      <span class="ap-tempo">00:00</span>
      <span class="ap-acoes">
        <span class="ap-fonte" role="group" aria-label="Tamanho do texto"><button type="button" data-fonte="-1" aria-label="Diminuir texto">A−</button><button type="button" data-fonte="1" aria-label="Aumentar texto">A+</button></span>
        <button type="button" data-ap="notas" title="Roteiro (N)">Roteiro</button>
        <button type="button" data-ap="ant" aria-label="Anterior">←</button>
        <button type="button" data-ap="prox" aria-label="Próximo">→</button>
        <button type="button" data-ap="sair" title="Sair (Esc)">Sair</button>
      </span>
      <i class="ap-progresso"></i>
    </footer>`;
  document.body.appendChild(raiz);
  const pararTraducao = traduzirApresentacao(raiz); // EN/ES: troca os textos fixos conforme o idioma da página
  raiz.showModal();
  raiz.addEventListener('cancel', e => { e.preventDefault(); fechar(); });
  document.documentElement.classList.add('ap-aberta');
  const $ = s => raiz.querySelector(s);
  const video = $('.ap-video');
  const fundo = fundoAnimado($('.ap-fundo'));

  // abertura: só o vídeo; na metade da ida (antes da volta do bumerangue) o nome aparece e a tela escurece
  function abertura() {
    raiz.classList.add('ap-so-video');
    let feito = false;
    const mostrar = () => { if (feito) return; feito = true; raiz.classList.remove('ap-so-video'); video.removeEventListener('timeupdate', checar); };
    const checar = () => { if (video.duration && video.currentTime >= video.duration / 2) mostrar(); };
    video.addEventListener('timeupdate', checar);
    const reserva = setTimeout(mostrar, 6000); // se o vídeo não carregar, revela mesmo assim
    return () => { clearTimeout(reserva); mostrar(); };
  }

  function mostrar(n) {
    if (!slides.length) return;
    i = Math.max(0, Math.min(slides.length - 1, n));
    const s = slides[i];
    revelar?.(); revelar = null;
    soltarNome();
    const slide = $('.ap-slide');
    slide.classList.remove('ap-entra');
    void slide.offsetWidth; // reinicia a animação de entrada
    slide.className = `ap-slide ${s.classe || ''} ${s.pausa ? 'ap-pausa' : ''}`;
    slide.innerHTML = typeof s.html === 'function' ? s.html() : s.html;
    slide.classList.add('ap-entra');
    soltarNome = alinharNome(slide.querySelector('[data-ap-nome]'));
    const qr = slide.querySelector('[data-ap-qr]');
    if (qr) QRCode.toString(SITE.url, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#2B2226', light: '#ffffff' } }).then(svg => { qr.innerHTML = svg; });
    const v = s.video;
    if (v) {
      if (video.getAttribute('src') !== v.src) { video.src = v.src; }
      video.loop = !v.unico;
      if (s.abertura) video.currentTime = 0;
      video.playbackRate = v.vel;
      video.play().catch(() => {});
    } else video.pause();
    raiz.classList.toggle('ap-sem-video', !v);
    fundo.usar(v ? '' : s.fundo);
    if (s.abertura) revelar = abertura();
    $('.ap-notas p').textContent = s.notas;
    $('.ap-cont').textContent = `${i + 1} / ${slides.length}${s.pausa && !s.classe?.includes('ap-fim') ? ' · pausa para perguntas' : ''}`;
    $('.ap-progresso').style.transform = `scaleX(${(i + 1) / slides.length})`;
  }
  // a velocidade volta ao padrão quando o src muda; reaplica quando o vídeo carrega
  video.addEventListener('loadedmetadata', () => { video.playbackRate = slides[i].video?.vel || 1; });

  const relogio = setInterval(() => {
    const s = Math.floor((Date.now() - inicio) / 1000);
    $('.ap-tempo').textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }, 1000);

  function fechar() {
    if (!raiz) return;
    pararTraducao();
    clearInterval(relogio);
    revelar?.();
    soltarNome();
    fundo.parar();
    document.removeEventListener('keydown', teclas);
    document.removeEventListener('fullscreenchange', saiuTelaCheia);
    raiz.remove();
    raiz = null;
    document.documentElement.classList.remove('ap-aberta');
    screen.orientation?.unlock?.();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    aoFechar();
  }
  const saiuTelaCheia = () => { if (!document.fullscreenElement) fechar(); };
  const alternarNotas = () => { $('.ap-notas').hidden = !$('.ap-notas').hidden; };

  // tela de escolha do tema (Administração, Seguros ou TI), também pelas teclas 1, 2 e 3
  function escolher() {
    raiz.classList.add('ap-sem-video');
    fundo.usar('aurora');
    const slide = $('.ap-slide');
    slide.className = 'ap-slide ap-escolha ap-entra';
    slide.innerHTML = `<p class="ap-rotulo">Modo apresentação</p><h2>Qual é o foco desta conversa?</h2>
      <div class="ap-areas">${Object.entries(AREAS).map(([id, a], n) => `<button type="button" data-area="${id}" style="--i:${n + 1}"><span>${n + 1}</span>${a.nome}</button>`).join('')}</div>`;
    $('.ap-notas p').textContent = 'Escolha a área da vaga. A apresentação mostra só os casos e projetos dessa área.';
    $('.ap-cont').textContent = 'Escolha o tema';
    slide.querySelector('[data-area]').focus();
  }
  function iniciar(area) {
    slides = SLIDES(area).filter(s => !s.areas || s.areas.includes(area));
    mostrar(0);
    $('[data-ap="prox"]').focus();
  }

  // ---- camadas (galeria e feedback completo) ----
  const fecharCamada = () => { const c = raiz.querySelector('.ap-camada'); if (!c) return false; c.remove(); return true; };
  function abrirCamada(html) {
    fecharCamada();
    const c = document.createElement('div');
    c.className = 'ap-camada';
    c.innerHTML = `<div class="ap-camada-caixa" role="dialog" aria-modal="true">${html}<button type="button" class="ap-camada-fechar" data-camada-fechar aria-label="Fechar">${icone('fechar')}</button></div>`;
    raiz.appendChild(c);
    c.querySelector('[data-camada-fechar]').focus();
    return c;
  }
  function verGaleria(slug, k) {
    const d = dadosPagina(); const p = (d.apresentacao || d.projetos || []).find(x => x.slug === slug);
    const fotos = p?.galeria || []; if (!fotos.length) return;
    const c = abrirCamada(`<figure class="ap-lb"><img alt=""><figcaption></figcaption></figure>${fotos.length > 1 ? '<button type="button" class="ap-lb-seta" data-lb="-1" aria-label="Imagem anterior">←</button><button type="button" class="ap-lb-seta ap-lb-dir" data-lb="1" aria-label="Próxima imagem">→</button>' : ''}`);
    c.classList.add('ap-camada-galeria');
    const pinta = () => { const f = fotos[k]; c.querySelector('img').src = f.url; c.querySelector('figcaption').textContent = `${f.legenda || p.titulo} · ${k + 1} de ${fotos.length}`; };
    c.mover = passo => { k = (k + passo + fotos.length) % fotos.length; pinta(); };
    pinta();
  }
  function verFeedback(r) {
    const logo = logoEmpresa(r.empresa);
    abrirCamada(`<div class="ap-rec-completo"><header>${avatar(r)}<div><b>${esc(r.nome)}</b><span>${[r.cargo, r.empresa].filter(Boolean).map(esc).join(' · ')}</span></div>${logo ? `<img class="ap-logo" src="${esc(logo)}" alt="${esc(r.empresa)}">` : ''}</header><blockquote>${esc(r.mensagem).replace(/\n+/g, '<br><br>')}</blockquote></div>`);
  }
  raiz.addEventListener('cancel', e => { if (fecharCamada()) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);

  function teclas(e) {
    const camada = raiz.querySelector('.ap-camada');
    if (camada) {
      if (camada.mover && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { e.preventDefault(); camada.mover(e.key === 'ArrowRight' ? 1 : -1); }
      return; // Esc fica com o evento cancel do dialog
    }
    if (e.key === 'Enter' && e.target.closest?.('[data-rec]')) { e.preventDefault(); verFeedback(feedbacks()[+e.target.closest('[data-rec]').dataset.rec]); return; }
    if (!slides.length) {
      const area = { 1: 'adm', 2: 'seguros', 3: 'ti' }[e.key];
      if (area) iniciar(area); else if (e.key === 'Escape') fechar();
      return;
    }
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) {
      e.preventDefault();
      // na abertura, o primeiro "próximo" só antecipa o nome
      if (revelar && raiz.classList.contains('ap-so-video')) { revelar(); revelar = null; return; }
      mostrar(i + 1);
    }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); mostrar(i - 1); }
    else if (e.key === 'Escape') fechar();
    else if (e.key.toLowerCase() === 'n') alternarNotas();
    else if (e.key === 'Home') mostrar(0);
    else if (e.key === 'End') mostrar(slides.length - 1);
  }

  raiz.addEventListener('click', e => {
    const area = e.target.closest('[data-area]')?.dataset.area;
    if (area) { iniciar(area); return; }
    const camada = e.target.closest('.ap-camada');
    if (camada) {
      if (e.target.closest('[data-camada-fechar]') || e.target === camada) fecharCamada();
      else if (e.target.closest('[data-lb]')) camada.mover(+e.target.closest('[data-lb]').dataset.lb);
      return;
    }
    const barra = e.target.closest('[data-balao]');
    if (barra) {
      const balao = barra.nextElementSibling, abre = balao.hidden;
      raiz.querySelectorAll('.ap-balao').forEach(b => { b.hidden = true; b.previousElementSibling.setAttribute('aria-expanded', 'false'); });
      balao.hidden = !abre; barra.setAttribute('aria-expanded', String(abre));
      return;
    }
    if (!e.target.closest('.ap-balao')) raiz.querySelectorAll('.ap-balao').forEach(b => { b.hidden = true; });
    const gal = e.target.closest('[data-galeria]');
    if (gal) { verGaleria(gal.dataset.galeria, +gal.dataset.inicio || 0); return; }
    const rec = e.target.closest('[data-rec]');
    if (rec) { verFeedback(feedbacks()[+rec.dataset.rec]); return; }
    const acao = e.target.closest('[data-ap]')?.dataset.ap;
    if (acao === 'prox') { if (revelar && raiz.classList.contains('ap-so-video')) { revelar(); revelar = null; } else mostrar(i + 1); }
    else if (acao === 'ant') mostrar(i - 1);
    else if (acao === 'sair') fechar();
    else if (acao === 'notas') alternarNotas();
  });
  document.addEventListener('keydown', teclas);

  // celular: toque no terço esquerdo volta, no direito avança; deslizar também troca de slide.
  // Com a tela girada (celular em pé), o "esquerdo" da apresentação fica no topo da tela física.
  let toque = null;
  raiz.addEventListener('touchstart', e => {
    if (e.touches.length > 1) { toque = null; return; } // dois dedos: é zoom, não navegação
    toque = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
  }, { passive: true });
  raiz.addEventListener('touchend', e => {
    if (!toque || !slides.length || e.target.closest('button, a, [data-area], .ap-notas, .ap-camada, [data-rec], .ap-balao')) { toque = null; return; }
    const f = e.changedTouches[0];
    const girada = matchMedia('(orientation: portrait) and (max-width: 700px)').matches;
    const [d, cruz, pos, tam] = girada ? [f.clientY - toque.y, f.clientX - toque.x, f.clientY, innerHeight] : [f.clientX - toque.x, f.clientY - toque.y, f.clientX, innerWidth];
    const rapido = Date.now() - toque.t < 600;
    toque = null;
    if (Math.abs(d) > 50 && Math.abs(d) > Math.abs(cruz) && rapido) { avancar(d < 0 ? 1 : -1); return; }
    if (Math.abs(d) < 12 && Math.abs(cruz) < 12) { if (pos < tam / 3) avancar(-1); else if (pos > tam * 2 / 3) avancar(1); }
  }, { passive: true });
  function avancar(passo) {
    if (passo > 0 && revelar && raiz.classList.contains('ap-so-video')) { revelar(); revelar = null; return; }
    mostrar(i + passo);
  }
  // só fecha ao sair da tela cheia se ela chegou a abrir (alguns navegadores bloqueiam)
  setTimeout(() => document.addEventListener('fullscreenchange', saiuTelaCheia), 300);
  screen.orientation?.lock?.('landscape').catch(() => {});
  escolher();
}
