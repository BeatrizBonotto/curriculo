// Modo apresentação: slides em tela cheia com vídeo ou fundo animado, transições e roteiro de fala (tecla N).
// Estrutura pensada para entrevista: apresentação, casos e pausas para perguntas entre os blocos.
import './styles/apresentacao.css';
import QRCode from 'qrcode';
import { SITE } from './config.js';
import { alinharNome } from './lib/alinhar-nome.js';
import { icone } from './render/comum.js';

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

// Até 3 recomendações curtas, com foto de perfil (ou iniciais quando não houver)
function feedbacks() {
  const recs = dadosPagina().recomendacoes || [];
  return recs.filter(r => r.mensagem && r.mensagem.length < 320).sort((a, b) => a.mensagem.length - b.mensagem.length).slice(0, 3);
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
      <div class="ap-sobre">${fotoPerfil() ? `<img class="ap-foto" src="${esc(fotoPerfil())}" alt="" style="--i:1">` : ''}
      <div><p class="ap-rotulo">Sobre</p><h2>${titulo}</h2>${sobreTexto() ? `<p class="ap-sub ap-resumo">${esc(sobreTexto())}</p>` : ''}${seq(pilares)}</div></div>`, notas });
const slideMvv = notas => ({ fundo: 'aurora', html: () => `<p class="ap-rotulo">Quem sou</p><h2>Missão, visão e valores.</h2>${seq(mvv())}`, notas });

// carreira: linha do tempo em barras (gráfico) com os números na mesma tela; itens = [início, fim ou null, empresa, papel]
const slideCarreira = (titulo, itens, notas) => ({ fundo: 'ondas', html: () => {
  const hoje = new Date().getFullYear();
  const ini = Math.min(...itens.map(i => i[0])), fim = hoje + 1;
  const x = a => ((a - ini) / (fim - ini)) * 100;
  const marcas = Array.from({ length: fim - ini + 1 }, (_, k) => ini + k).filter(a => (a - ini) % 3 === 0);
  if (hoje - marcas[marcas.length - 1] >= 2) marcas.push(hoje); // o ano atual só entra se não encostar na marca anterior
  const empresas = new Set(itens.filter(i => !/técnico em|curso|formação/i.test(i[2] + ' ' + i[3])).map(i => i[2].split(' (')[0])).size;
  return `<p class="ap-rotulo">Carreira</p><h2>${titulo}</h2>
    <div class="ap-numeros"><span><b>${hoje - ini}</b> anos de experiência</span><span><b>${empresas}</b> empresas</span></div>
    <div class="ap-gantt" role="img" aria-label="Linha do tempo da carreira">
      ${itens.map(([a, b, org, papel], i) => `<div class="ap-gantt-linha" style="--i:${i + 1}"><span class="ap-gantt-rot"><b>${org}</b>${papel}</span><span class="ap-gantt-trilho"><i style="left:${x(a)}%;width:${x((b ?? hoje) + 1) - x(a)}%"><em>${b ? `${a} a ${b}` : `desde ${a}`}</em></i></span></div>`).join('')}
      <div class="ap-gantt-linha ap-gantt-eixo"><span></span><span class="ap-gantt-trilho">${marcas.map(a => `<small style="left:${x(a)}%">${a}</small>`).join('')}</span></div>
    </div>`;
}, notas });
const slideCaso = (areas, video, rotulo, titulo, problema, solucao, impacto, regra, notas) => ({ areas, video,
  html: `<p class="ap-rotulo">Case de sucesso</p><h2>${titulo}</h2>${caso(rotulo.split('·').pop().trim(), problema, solucao, impacto)}${regra ? `<p class="ap-regra">${regra}</p>` : ''}`, notas });
const slideFeedbacks = (titulo, notas) => ({ video: V.entrevista, html: () => `
      <p class="ap-rotulo">Feedbacks</p><h2>${titulo}</h2>
      <div class="ap-recs">${feedbacks().map((r, i) => `<blockquote style="--i:${i + 1}"><p>“${esc(r.mensagem)}”</p><footer>${avatar(r)}<cite><b>${esc(r.nome)}</b>${[r.cargo, r.empresa].filter(Boolean).map(esc).join(' · ')}</cite></footer></blockquote>`).join('')}</div>`, notas });

// imagens dos casos da área escolhida (capa, documento e fluxograma de cada um), com a legenda cadastrada
function fotosProjetos(area) {
  const projetos = dadosPagina().projetos || [];
  return projetos.filter(p => AREAS[area].projetos.includes(p.slug))
    .flatMap(p => (p.galeria || []).filter(g => /desktop-01|p03-documento|p05-fluxograma/.test(g.url)).map(g => ({ src: g.url, legenda: (g.legenda || p.titulo).split(':')[0] })))
    .slice(0, 6);
}
// contatos publicados na página (e-mail, WhatsApp, LinkedIn), mais o site
function contatos() {
  const vistos = new Set();
  const lista = [...document.querySelectorAll('a[href^="mailto:"], a[href*="wa.me/"], a[href*="linkedin.com"]')]
    .map(a => a.href.startsWith('mailto:') ? [a.href, a.href.slice(7), 'email'] : a.href.includes('wa.me') ? [a.href, 'WhatsApp', 'whatsapp'] : [a.href, 'LinkedIn', 'linkedin'])
    .filter(([h]) => !vistos.has(h) && vistos.add(h));
  return [...lista, [SITE.url, SITE.url.replace('https://', ''), 'globo']];
}

const sobrenome = () => document.querySelector('.hero-nome-2')?.textContent.trim() || 'G. Souza Bonotto';
const nomeBloco = cargo => `<p class="ap-nome" data-ap-nome><span class="ap-nome-1">Beatriz</span><span class="ap-nome-2">${esc(sobrenome())}</span><span class="ap-nome-cargo">${esc(cargo)}</span></p>`;

// Áreas: o tema escolhido no início define os casos, as imagens e o cargo da capa
const AREAS = {
  adm: { nome: 'Administração', cargo: 'Analista Administrativa', projetos: ['central-documentos', 'portfolio-rotinas-documentais', 'portfolio-rotinas-suprimentos'] },
  seguros: { nome: 'Seguros', cargo: 'Analista de Seguros', projetos: ['central-documentos', 'portfolio-rotinas-seguros'] },
  ti: { nome: 'TI', cargo: 'Tecnologia · Informática para Internet', projetos: ['central-documentos', 'starbucks'] },
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
  slideCarreira('Do apoio administrativo à análise de seguros.', [
    [2013, 2014, 'Claro Brasil', 'Aprendiz Administrativa'],
    [2015, 2016, 'Tecnoset', 'Aprendiz Administrativa'],
    [2019, 2020, 'INSS', 'Estagiária Administrativa'],
    [2020, 2025, 'Dínamo Seguros', 'Estagiária e Auxiliar Administrativa'],
    [2025, null, 'Dínamo Seguros', 'Analista de Seguros Pleno'],
    [2023, 2025, 'Politécnica Brasileira', 'Técnico em Informática para Internet'],
  ], 'Conte como uma evolução: cada experiência somou uma habilidade. Destaque o crescimento dentro da Dínamo, de estagiária a analista.'),

  // 4. Casos reais por área
  slideCaso(['seguros'], V.entrevista, 'Caso real · Dínamo Seguros', 'Renovação sem deixar apólice vencer.',
    'Muitas renovações de Ramos Elementares vencendo ao mesmo tempo.',
    'Régua com alerta 45 dias antes, cotação em 3 seguradoras e proposta com comparativo de prêmio e coberturas.',
    'Renovações tratadas antes do vencimento e cliente decidindo com clareza.',
    'Sem renovação, a cobertura termina às 24h do último dia de vigência.', 'Explique como compara propostas: prêmio, franquia, coberturas e parcelamento. Diga como conduz o contato consultivo.'),
  slideCaso(['seguros'], V.escritorio, 'Caso real · Seguro Fiança', 'Análise que não trava a locação.',
    'Pedidos urgentes das imobiliárias, com documentação incompleta.',
    'Checklist de documentos e regra de renda (pelo menos 3x o aluguel com encargos) antes de enviar à seguradora.',
    'Menos idas e vindas com a seguradora e locação liberada mais rápido.',
    'Lei 8.245/91: arts. 37 e 41 (garantias) e art. 22, VIII (seguro contra incêndio).', 'Se a renda não fecha, cite as saídas: composição de renda ou outra garantia, já que a lei não permite duas no mesmo contrato.'),
  slideCaso(['adm'], V.escritorio, 'Caso real · INSS', 'Documento encontrado pelo protocolo em minutos.',
    'Alto volume de documentos físicos e risco de extravio.',
    'Triagem, conferência, digitalização, indexação por protocolo e ofícios no padrão oficial.',
    'Localização rápida e comunicação interna padronizada.',
    'Fecho: Respeitosamente para autoridade superior; Atenciosamente para a mesma hierarquia.', 'Explique o fluxo documental e por que indexar por protocolo evita retrabalho.'),
  slideCaso(['adm'], V.entrevista, 'Caso real · Tecnoset e Claro', 'Estoque acima do mínimo e planilhas no mesmo padrão.',
    'Falta de suprimentos e planilhas em formatos diferentes entre áreas.',
    'Ponto de pedido, cotação com 3 fornecedores e padrão único de colunas com validação.',
    'Reposição antes de faltar e lançamentos com menos correções.',
    'Ponto de pedido = consumo diário × prazo de entrega + estoque de segurança.', 'Mostre que sabe calcular o ponto de pedido e por que comparar pelo custo total com frete.'),
  slideCaso(['ti', 'adm', 'seguros'], V.escritorio, 'Caso real · Central de Documentos', 'Uma ferramenta feita para o meu dia a dia.',
    'Documentos parecidos refeitos à mão, com risco de esquecer regra, anexo ou fecho.',
    'Página em HTML, CSS e JavaScript que gera o e-mail de envio e o documento em PDF a partir de um formulário.',
    'Padrão único, cálculos prontos e nenhum dado sai do navegador (LGPD).',
    '', 'Mostre a ferramenta ao vivo se der: gere uma proposta de renovação com o exemplo.'),

  // 5. Pausa
  { pausa: true, fundo: 'constelacao', html: `<p class="ap-rotulo">Pausa</p><h2>Alguma pergunta até aqui?</h2><p class="ap-sub">Posso detalhar qualquer caso antes de seguir.</p>`,
    notas: 'Pare de verdade e espere. Se não houver perguntas, pergunte qual dos casos mais se parece com o dia a dia da vaga.' },

  // 6. Feedbacks
  slideFeedbacks('O que dizem os clientes.', 'Leia um trecho curto de uma avaliação. Relacione com o atendimento consultivo.'),

  // 7. Projetos
  { fundo: 'constelacao', html: () => `
      <p class="ap-rotulo">Projetos</p><h2>Casos documentados.</h2>
      <ul class="ap-galeria">${fotosProjetos(area).map((f, i) => `<li style="--i:${i + 1}"><img src="${esc(f.src)}" alt="" loading="lazy"><span>${esc(f.legenda)}</span></li>`).join('')}</ul>`,
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

  function teclas(e) {
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
    if (!toque || !slides.length || e.target.closest('button, a, [data-area], .ap-notas')) { toque = null; return; }
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
