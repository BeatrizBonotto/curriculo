// Borboletas em canvas: voam devagar, batem as asas e desviam do mouse com delicadeza.
// Leve de propósito: 8 a 22 borboletas pela área, pausa fora da tela e durante a rolagem; com movimento reduzido fica estática.
export function particulas(canvas, { semMovimento = false } = {}) {
  const g = canvas.getContext('2d');
  const escuro = canvas.dataset.particulas === 'escuro';
  const css = (v, padrao) => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || padrao;
  let cor = escuro ? '255,255,255' : css('--particula', '158,79,103');
  let acento = css('--acento-rgb', '158,79,103');
  addEventListener('tema', () => { cor = escuro ? '255,255,255' : css('--particula', '158,79,103'); acento = css('--acento-rgb', '158,79,103'); desenhar(0); });
  let w = 0, h = 0, dpr = 1, bs = [], visivel = false, raf = 0, t0 = 0;
  const mouse = { x: -1e4, y: -1e4 };

  function medir() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const n = Math.max(8, Math.min(22, Math.round((w * h) / 70000)));
    bs = Array.from({ length: n }, (_, i) => ({
      x: Math.random() * w, y: Math.random() * h, ang: Math.random() * Math.PI * 2, vel: 0.25 + Math.random() * 0.35,
      tam: 5 + Math.random() * 6, fase: Math.random() * Math.PI * 2, ritmo: 0.12 + Math.random() * 0.08, forte: i % 3 === 0,
    }));
    desenhar(0);
  }

  // asas superiores maiores, inferiores menores; "abre" (0..1) achata as asas no eixo x para simular a batida
  function borboleta(b, t) {
    const abre = 0.25 + 0.75 * Math.abs(Math.sin(b.fase + t * b.ritmo));
    const rgb = b.forte ? acento : cor, alfa = b.forte ? (escuro ? 0.6 : 0.5) : (escuro ? 0.35 : 0.22);
    g.save();
    g.translate(b.x, b.y);
    g.rotate(b.ang + Math.PI / 2);
    g.fillStyle = `rgba(${rgb},${alfa})`;
    for (const lado of [-1, 1]) {
      g.save(); g.scale(lado * abre, 1);
      g.beginPath(); g.ellipse(b.tam * 0.55, -b.tam * 0.35, b.tam * 0.6, b.tam * 0.45, -0.5, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.ellipse(b.tam * 0.45, b.tam * 0.35, b.tam * 0.4, b.tam * 0.32, 0.6, 0, Math.PI * 2); g.fill();
      g.restore();
    }
    g.fillStyle = `rgba(${rgb},${Math.min(1, alfa + 0.25)})`;
    g.beginPath(); g.ellipse(0, 0, b.tam * 0.09, b.tam * 0.55, 0, 0, Math.PI * 2); g.fill();
    g.restore();
  }

  function desenhar(t) {
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    for (const b of bs) borboleta(b, t);
  }

  function passo(agora) {
    const t = (agora - t0) / 16;
    for (const b of bs) {
      // passeio: a direção vira devagar; perto do mouse ela se afasta
      b.ang += (Math.random() - 0.5) * 0.08;
      const dx = b.x - mouse.x, dy = b.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 140) b.ang += 0.08 * Math.sign(Math.sin(Math.atan2(dy, dx) - b.ang));
      b.x += Math.cos(b.ang) * b.vel; b.y += Math.sin(b.ang) * b.vel + Math.sin(t * 0.05 + b.fase) * 0.15;
      const m = 20;
      if (b.x < -m) b.x = w + m; else if (b.x > w + m) b.x = -m;
      if (b.y < -m) b.y = h + m; else if (b.y > h + m) b.y = -m;
    }
    desenhar(t);
    if (visivel) raf = requestAnimationFrame(passo);
  }
  const iniciar = () => { cancelAnimationFrame(raf); if (visivel && !semMovimento) { t0 ||= performance.now(); raf = requestAnimationFrame(passo); } };

  const io = new IntersectionObserver(([en]) => { visivel = en.isIntersecting; iniciar(); });
  // durante a rolagem as borboletas param: redesenhar o canvas de tela cheia a cada quadro disputa com a rolagem
  let retomar = 0;
  const aoRolar = () => { cancelAnimationFrame(raf); clearTimeout(retomar); retomar = setTimeout(iniciar, 200); };
  addEventListener('scroll', aoRolar, { passive: true });
  const mover = e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
  const sair = () => { mouse.x = mouse.y = -1e4; };
  const alvo = canvas.dataset.particulas === 'fundo' ? window : canvas.parentElement;
  alvo.addEventListener('pointermove', mover, { passive: true });
  alvo.addEventListener('pointerleave', sair);
  const ro = new ResizeObserver(medir);
  ro.observe(canvas);
  io.observe(canvas);
  return () => { io.disconnect(); ro.disconnect(); cancelAnimationFrame(raf); clearTimeout(retomar); removeEventListener('scroll', aoRolar); alvo.removeEventListener('pointermove', mover); alvo.removeEventListener('pointerleave', sair); };
}
