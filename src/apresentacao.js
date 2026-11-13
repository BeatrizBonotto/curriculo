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
function feedbacks() {
  let recs = [];
  try { recs = JSON.parse(document.getElementById('dados')?.textContent || '{}').recomendacoes || []; } catch {}
  return recs.filter(r => r.mensagem && r.mensagem.length < 260).sort((a, b) => a.mensagem.length - b.mensagem.length).slice(1, 4);
}

// imagens dos casos administrativos (capa e documento de cada um), com a legenda cadastrada
function fotosProjetos(area) {
  let projetos = [];
  try { projetos = JSON.parse(document.getElementById('dados')?.textContent || '{}').projetos || []; } catch {}
  return projetos.filter(p => AREAS[area].projetos.includes(p.slug)).flatMap(p => (p.galeria || []).filter(g => /desktop-01|p03-documento|p05-fluxograma/.test(g.url)).map(g => ({ src: g.url, legenda: (g.legenda || p.titulo).split(':')[0] }))).slice(0, 6);
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

// Áreas da apresentação: o tema escolhido no início define casos, imagens e cargo da capa.
const AREAS = {
  adm: { nome: 'Administração', cargo: 'Analista Administrativa', projetos: ['central-documentos', 'portfolio-rotinas-documentais', 'portfolio-rotinas-suprimentos'] },
  seguros: { nome: 'Seguros', cargo: 'Analista de Seguros', projetos: ['central-documentos', 'portfolio-rotinas-seguros'] },
  ti: { nome: 'TI', cargo: 'Tecnologia · Informática para Internet', projetos: ['central-documentos', 'starbucks'] },
};

const SLIDES = (area) => [
  { video: V.intro, abertura: true, classe: 'ap-capa', html: nomeBloco(AREAS[area].cargo),
    notas: 'Deixe o vídeo rodar. Quando o nome aparecer, cumprimente e agradeça o tempo. Diga que vai mostrar em cerca de 10 minutos como trabalha, com casos reais simulados, e que haverá pausas para perguntas.' },

  { fundo: 'aurora', html: `
      <p class="ap-rotulo">Quem sou</p>
      <h2>Organização, atendimento consultivo e processo bem documentado.</h2>
      <ul class="ap-pilares">
        <li style="--i:1"><b>Organização</b><span>Rotinas com prazo, checklist e registro de cada etapa.</span></li>
        <li style="--i:2"><b>Atendimento consultivo</b><span>Explico opções com clareza para o cliente decidir com segurança.</span></li>
        <li style="--i:3"><b>Conformidade</b><span>LGPD, normas da SUSEP e padrão oficial de redação.</span></li>
      </ul>`,
    notas: 'Resuma em uma frase seu jeito de trabalhar. Dê um exemplo rápido de cada pilar. Não leia os cartões: comente.' },

  { fundo: 'ondas', html: `
      <p class="ap-rotulo">Trajetória</p>
      <h2>Do apoio administrativo à análise de seguros.</h2>
      <ol class="ap-linha">
        <li style="--i:1"><b>Claro Brasil</b><span>Aprendiz administrativa · padronização de planilhas e entrada de dados</span></li>
        <li style="--i:2"><b>Tecnoset</b><span>Aprendiz administrativa · suprimentos e chamados</span></li>
        <li style="--i:3"><b>INSS</b><span>Estagiária administrativa · gestão documental pública</span></li>
        <li style="--i:4"><b>Dínamo Seguros</b><span>Desde 2020: de estagiária a Analista de Seguros Pleno · fiança, incêndio e ramos elementares</span></li>
      </ol>`,
    notas: 'Mostre a evolução: cada experiência somou uma habilidade. Destaque que hoje atende carteira de imobiliárias parceiras na Dínamo.' },

  { areas: ['seguros'], video: V.entrevista, html: `
      <p class="ap-rotulo">Caso 1 · Dínamo Seguros</p>
      <h2>Régua de renovação e Seguro Fiança sem travar a locação.</h2>
      <div class="ap-star">
        <div style="--i:1"><b>Situação</b>Muitas renovações vencendo juntas e pedidos de fiança urgentes das imobiliárias.</div>
        <div style="--i:2"><b>Ação</b>Alerta 45 dias antes, cotação em 3 seguradoras, contato consultivo e checklist de documentos.</div>
        <div style="--i:3"><b>Resultado</b>Renovações tratadas antes do vencimento e menos pendências na análise cadastral.</div>
      </div>
      <p class="ap-regra">Regras que aplico: Lei 8.245/91 (arts. 37 e 41), seguro fiança regulado pela SUSEP, renda de pelo menos 3x o aluguel com encargos.</p>`,
    notas: 'Conte o caso no formato Situação, Ação, Resultado. Explique por que a regra de 3x a renda existe e o que faz quando não fecha (composição de renda ou outra garantia, já que a lei não permite duas garantias no mesmo contrato).' },

  { areas: ['seguros'], pausa: true, fundo: 'constelacao', html: `<p class="ap-rotulo">Pausa</p><h2>Perguntas sobre seguros?</h2><p class="ap-sub">Fico à vontade para detalhar renovação, fiança ou atendimento.</p>`,
    notas: 'Pare e pergunte: "Querem que eu detalhe alguma parte?". Espere. Se não houver perguntas, siga.' },

  { areas: ['adm'], video: V.escritorio, html: `
      <p class="ap-rotulo">Caso 2 · INSS</p>
      <h2>Documento encontrado pelo protocolo em minutos.</h2>
      <div class="ap-star">
        <div style="--i:1"><b>Situação</b>Alto volume de documentos físicos e risco de extravio.</div>
        <div style="--i:2"><b>Ação</b>Triagem, conferência, digitalização, indexação por protocolo e ofícios no padrão oficial.</div>
        <div style="--i:3"><b>Resultado</b>Localização rápida e comunicação interna padronizada.</div>
      </div>
      <p class="ap-regra">Padrão que sigo: Manual de Redação da Presidência da República e tratamento de dados pessoais pela LGPD.</p>`,
    notas: 'Explique o fluxo documental e por que a indexação por protocolo evita retrabalho. Cite o fecho correto: Respeitosamente para autoridade superior, Atenciosamente para mesma hierarquia.' },

  { areas: ['adm'], fundo: 'ondas', html: `
      <p class="ap-rotulo">Caso 3 · Tecnoset e Claro</p>
      <h2>Estoque acima do mínimo e planilhas que qualquer um usa.</h2>
      <div class="ap-star">
        <div style="--i:1"><b>Situação</b>Falta de suprimentos e planilhas em formatos diferentes.</div>
        <div style="--i:2"><b>Ação</b>Ponto de pedido, cotação com 3 fornecedores e padrão único de colunas.</div>
        <div style="--i:3"><b>Resultado</b>Reposição antes de faltar e lançamentos com menos correções.</div>
      </div>`,
    notas: 'Mostre que sabe calcular ponto de pedido (consumo diário x prazo de entrega + estoque de segurança) e por que cotar 3 fornecedores.' },

  { areas: ['seguros', 'adm'], video: V.entrevista, html: () => `
      <p class="ap-rotulo">O que dizem os clientes</p>
      <h2>Avaliações públicas do meu atendimento.</h2>
      <div class="ap-recs">${feedbacks().map((r, i) => `<blockquote style="--i:${i + 1}"><p>“${esc(r.mensagem)}”</p><cite>${esc(r.nome)} · avaliação no Google</cite></blockquote>`).join('')}</div>`,
    notas: 'Leia um trecho curto de um feedback. Relacione com o pilar de atendimento consultivo.' },

  { areas: ['ti'], video: V.escritorio, html: `
      <p class="ap-rotulo">Caso TI · Central de Documentos</p>
      <h2>Uma ferramenta feita para o meu dia a dia.</h2>
      <div class="ap-star">
        <div style="--i:1"><b>Situação</b>Documentos parecidos refeitos à mão, com risco de esquecer regra, anexo ou fecho.</div>
        <div style="--i:2"><b>Ação</b>Página em HTML, CSS e JavaScript que gera o e-mail e o documento em PDF a partir de um formulário.</div>
        <div style="--i:3"><b>Resultado</b>Padrão único, cálculos prontos e nada sai do navegador (LGPD).</div>
      </div>
      <p class="ap-regra">Base técnica: curso técnico em Informática para Internet.</p>`,
    notas: 'Conte por que criou a ferramenta: um problema real da rotina. Mostre que entende HTML, CSS e JavaScript e que pensou em privacidade (nada é enviado a servidor).' },

  { areas: ['adm', 'ti'], pausa: true, fundo: 'constelacao', html: `<p class="ap-rotulo">Pausa</p><h2>Alguma pergunta até aqui?</h2><p class="ap-sub">Posso detalhar qualquer caso antes de seguir.</p>`,
    notas: 'Pare e pergunte se querem detalhar algum caso. Espere. Se não houver perguntas, siga.' },

  { fundo: 'constelacao', html: () => `
      <p class="ap-rotulo">Projetos</p>
      <h2>Casos da minha rotina, documentados.</h2>
      <ul class="ap-galeria">${fotosProjetos(area).map((f, i) => `<li style="--i:${i + 1}"><img src="${esc(f.src)}" alt="" loading="lazy"><span>${esc(f.legenda)}</span></li>`).join('')}</ul>`,
    notas: 'Passe pelas imagens: e-mail ao cliente, documento em PDF e fluxograma de cada caso. Se houver tempo, abra a central de documentos e gere uma proposta ao vivo.' },

  { pausa: true, video: V.introLoop, classe: 'ap-capa ap-fim', html: () => `
      <div class="ap-fim-texto"><p class="ap-rotulo">Obrigada</p>${nomeBloco('Perguntas finais? Fico à disposição.')}
      <ul class="ap-contatos">${contatos().map(([href, txt, ic]) => `<li><a href="${esc(href)}" target="_blank" rel="noopener"><span class="ap-contato-ic">${icone(ic)}</span>${esc(txt)}</a></li>`).join('')}</ul></div>
      <figure class="ap-qr"><div data-ap-qr></div><figcaption>${esc(SITE.url.replace('https://', ''))}</figcaption></figure>`,
    notas: 'Agradeça. Pergunte o que mais pesa para a vaga e conecte com um dos casos. Mostre o QR code para acessarem o site e combine o próximo passo.' },
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
  raiz = document.createElement('div');
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
    $('.ap-cont').textContent = `${i + 1} / ${slides.length}${s.pausa ? ' · pausa para perguntas' : ''}`;
    $('.ap-progresso').style.transform = `scaleX(${(i + 1) / slides.length})`;
  }
  // a velocidade volta ao padrão quando o src muda; reaplica quando o vídeo carrega
  video.addEventListener('loadedmetadata', () => { video.playbackRate = slides[i].video?.vel || 1; });

  const relogio = setInterval(() => {
    const s = Math.floor((Date.now() - inicio) / 1000);
    $('.ap-tempo').textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }, 1000);

  function fechar() {
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
