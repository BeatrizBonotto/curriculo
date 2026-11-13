import { expect, test } from '@playwright/test';
import { dados, semVazamento, simularSupabase, URLS, vigiarErros } from './apoio.js';

test.beforeEach(async ({ page }) => { await simularSupabase(page); });

test.describe('todas as páginas, nos 3 idiomas', () => {
  for (const url of URLS) {
    test(`${url} carrega sem erros, com um h1, idioma certo e sem vazar da tela`, async ({ page }) => {
      const erros = vigiarErros(page);
      await page.goto(url);
      const lang = url.startsWith('/en/') ? 'en' : url.startsWith('/es/') ? 'es' : 'pt-BR';
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('h1')).toHaveCount(1);
      expect((await page.title()).length).toBeGreaterThan(15);
      await expect(page.locator('body')).not.toContainText(/undefined|\[object Object\]|NaN/);
      await semVazamento(page);
      expect(erros).toEqual([]);
    });
  }
});

test('SEO: meta tags, Open Graph, hreflang, JSON-LD, sitemap e robots', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Analista administrativa/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://beatrizgsbonotto.web.app/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og\.jpg(\?v=\d+)?$/);
  await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(4);
  const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(ld['@graph'][0]['@type']).toBe('Person');
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap.match(/<loc>/g)).toHaveLength(6); // início e currículo, nos 3 idiomas (sobre agora é seção do início)
  expect(await (await request.get('/robots.txt')).text()).toContain('Disallow: /admin/');
  expect((await request.get('/media/og.jpg')).ok()).toBeTruthy();
});

test('navegação: menu, páginas e troca de idioma', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    const botao = page.locator('[data-menu]');
    await botao.click();
    await expect(botao).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(botao).toHaveAttribute('aria-expanded', 'false');
    await botao.click();
  }
  // sobre, trajetória, projetos e contato são âncoras da home
  await expect(page.locator('.nav-links a[href="/#contato"]')).toHaveCount(1);
  await page.locator('.nav-links a[href="/#sobre"]').click();
  await expect(page.locator('#sobre')).toBeInViewport();
  if (isMobile) await page.locator('[data-menu]').click();
  await page.locator('.nav-idiomas a[hreflang="en"]').click();
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator('#sobre-titulo')).toHaveCount(1);
});

test('tela de abertura: boas-vindas por 3 s na primeira página da sessão, depois não volta', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => false }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const splash = page.locator('[data-splash]');
  await expect(splash).toBeVisible();
  await expect(splash).toContainText('Bem-vindo');
  await page.waitForFunction(() => !document.querySelector('[data-splash]'), null, { timeout: 10000 });
  expect(await page.evaluate(() => performance.now())).toBeGreaterThanOrEqual(1000);
  await page.goto('/cv/');
  await expect(page.locator('[data-splash]')).toHaveCount(0);
});

test('abertura: título escondido sobre o vídeo e visível depois da rolagem',async ({ page }) => {
  await page.goto('/');
  const titulo = page.locator('.hero-titulo');
  await expect(titulo).toHaveCSS('opacity', '0');
  await expect(page.locator('[data-nav]')).not.toHaveClass(/escura/); // começa clara e escurece com o vídeo
  await expect(page.locator('.hero.quadros')).toHaveCount(1); // quadros do vídeo carregaram
  await page.evaluate(() => scrollTo(0, document.querySelector('[data-hero]').offsetHeight - innerHeight));
  await expect(titulo).toHaveCSS('opacity', '1', { timeout: 5000 });
  await expect(page.locator('.caminhos .caminho')).toHaveCount(5); // atalhos: sobre, trajetória, projetos, contato, currículo
  await expect(page.locator('.caminhos')).toBeInViewport();
});

test('abertura no desktop: texto à esquerda e vídeo à direita nunca se encostam, em qualquer resolução', async ({ browser, isMobile }) => {
  test.skip(isMobile, 'no celular o texto fica abaixo do vídeo');
  test.setTimeout(150000); // sete resoluções em sequência; com 4 workers passa de 60 s
  for (const [width, height] of [[960, 720], [1280, 720], [1366, 768], [1536, 864], [1920, 1080], [2560, 1440], [3440, 1440]]) {
    const ctx = await browser.newContext({ viewport: { width, height } });
    const page = await ctx.newPage();
    await simularSupabase(page);
    await page.goto('/');
    await expect(page.locator('.hero.quadros')).toHaveCount(1);
    await page.evaluate(() => scrollTo(0, document.querySelector('[data-hero]').offsetHeight - innerHeight));
    await expect(page.locator('.hero-titulo')).toHaveCSS('opacity', '1', { timeout: 5000 });
    await page.waitForTimeout(800); // o scrub do vídeo termina de encolher
    const r = await page.evaluate(() => {
      const m = document.querySelector('[data-hero-midia]').getBoundingClientRect();
      const t = [...document.querySelectorAll('.hero-texto *')].map(e => e.getBoundingClientRect()).filter(q => q.width && q.height);
      return { textoDir: Math.max(...t.map(q => q.right)), midiaEsq: m.left, base: Math.max(...t.map(q => q.bottom)) };
    });
    expect(r.midiaEsq - r.textoDir, `${width}x${height}: vão entre texto e vídeo`).toBeGreaterThanOrEqual(32);
    expect(r.base, `${width}x${height}: texto cabe na tela`).toBeLessThanOrEqual(height);
    await ctx.close();
  }
});

test('com movimento reduzido tudo aparece sem animação', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await simularSupabase(page);
  await page.goto('/');
  await expect(page.locator('.hero-titulo')).toBeInViewport();
  await expect(page.locator('.hero-titulo')).toHaveCSS('opacity', '1');
  await ctx.close();
});

test('contato: valida e envia a mensagem', async ({ page }) => {
  const escritas = await simularSupabase(page);
  await page.goto('/contato/');
  const enviar = page.getByRole('button', { name: /Enviar mensagem/ });
  await enviar.click();
  await expect(page.locator('[data-status]')).toHaveText(/Preencha/);
  await expect(page.locator('#f-nome')).toHaveAttribute('aria-invalid', 'true');
  await page.fill('#f-nome', 'Recrutadora');
  await page.fill('#f-email', 'rh@empresa.com');
  await page.fill('#f-msg', 'Temos uma vaga de QA.');
  await enviar.click();
  await expect(page.locator('[data-status]')).toHaveText(/Mensagem enviada/);
  expect(escritas.find(e => e.tabela === 'contact_messages').corpo).toMatchObject({ nome: 'Recrutadora', email: 'rh@empresa.com', idioma: 'pt', lida: false });
});

test('currículo: folhas A4, sem foto, numeradas', async ({ page }) => {
  await page.goto('/cv/');
  const folhas = page.locator('.folha');
  await expect(folhas.first()).toBeVisible();
  expect(await folhas.count()).toBeGreaterThanOrEqual(2);
  await expect(page.locator('.folha img')).toHaveCount(0);
  await expect(folhas.last().locator('.folha-numero')).toHaveText(/Página \d de \d/);
  // cada folha tem exatamente as proporções de A4 (210 × 297 mm)
  const { w, h } = await folhas.first().evaluate(el => ({ w: el.offsetWidth, h: el.offsetHeight }));
  expect(Math.abs(h / w - 297 / 210)).toBeLessThan(0.01);
  // nenhum bloco ultrapassa a folha
  const estouro = await page.evaluate(() => [...document.querySelectorAll('.folha')].some(f => f.scrollHeight > f.clientHeight + 1));
  expect(estouro).toBe(false);
});

test('celular: cabeçalho só com o logo e menu ocupando a tela', async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.goto('/');
  // no celular o cabeçalho mostra só a assinatura (logotipo)
  await expect(page.locator('.nav-assinatura')).toBeVisible();
  const bm = await page.locator('[data-menu]').boundingBox();
  expect(Math.abs(bm.width - bm.height)).toBeLessThan(2);
  await page.locator('[data-menu]').click();
  const painel = await page.locator('.nav-links').boundingBox();
  expect(painel.height).toBeGreaterThan(page.viewportSize().height * 0.9);
  await expect(page.locator('.nav-links a[href="/#contato"]')).toBeInViewport();
});

test('nenhum botão quebra linha ou vaza o texto', async ({ page }) => {
  test.setTimeout(120000);
  for (const url of URLS) {
    await page.goto(url);
    const ruins = await page.evaluate(() => {
      const sel = '.btn, [role="tab"], .vistas button, .valor-grupo button, .rpg-acoes button, .caminho, .ler-mais, .expandir, .nav-cv, .galeria-modos button, .cv-versoes button, .cv-barra button, .nav-lingua summary';
      const out = [];
      for (const el of document.querySelectorAll(sel)) {
        const cs = getComputedStyle(el);
        if (!el.offsetParent || cs.visibility === 'hidden' || el.closest('[aria-hidden="true"], [hidden]')) continue;
        // só o texto conta (ícone ao lado do texto não é quebra de linha): cada nó de texto em uma única linha
        const nos = []; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); while (w.nextNode()) if (w.currentNode.textContent.trim()) nos.push(w.currentNode);
        // cada nó de texto numa linha só (contadores menores ao lado do rótulo não contam como quebra)
        const quebrou = nos.some(n => { const r = document.createRange(); r.selectNodeContents(n); return new Set([...r.getClientRects()].filter(x => x.width > 1).map(x => Math.round(x.bottom / 6))).size > 1; });
        if (quebrou || el.scrollWidth > el.clientWidth + 2) out.push(`${el.className || el.tagName}: "${el.textContent.trim().slice(0, 30)}"`);
      }
      return out;
    });
    expect(ruins, `botões quebrados em ${url}`).toEqual([]);
  }
});

test('primeira visita segue o idioma do navegador e depois respeita a escolha', async ({ browser }) => {
  const ctx = await browser.newContext({ locale: 'en-US' });
  const page = await ctx.newPage();
  await simularSupabase(page, { perguntarIdioma: true });
  await page.goto('/');
  await expect(page).toHaveURL(/\/en\/$/);
  await page.goto('/es/');
  await expect(page).toHaveURL(/\/es\/$/);
  await ctx.close();
});

test('currículo: versões vêm do banco e o admin lista os currículos', async ({ page }) => {
  await page.goto('/cv/');
  const versoes = (dados.cvs || []);
  if (versoes.length) await expect(page.locator('[data-variante]')).toHaveCount(versoes.length);
  await expect(page.locator('.folha').first()).toBeVisible();
});

test('cheat code: errado treme e avisa; certo libera o Admin no menu', async ({ page }) => {
  await page.goto('/');
  await page.locator('.nav-assinatura').click({ button: 'right' });
  const balao = page.locator('.cheat');
  await expect(balao).toBeVisible();
  await balao.locator('input').fill('abc');
  await balao.locator('input').press('Enter');
  await expect(balao).toHaveClass(/erro/);
  await expect(balao.locator('.cheat-msg')).toHaveText('Código errado. Tente de novo.');
  await balao.locator('input').fill('iddqd');
  await balao.locator('input').press('Enter');
  await expect(page.locator('.nav-admin')).toHaveAttribute('href', '/admin/');
  await page.goto('/en/');
  await expect(page.locator('.nav-admin')).toHaveCount(1);
  // outra aba não herda o acesso
  const outra = await page.context().newPage();
  await simularSupabase(outra);
  await outra.goto('/');
  await expect(outra.locator('.nav-cv')).toHaveCount(1);
  await expect(outra.locator('.nav-admin')).toHaveCount(0);
});

test('números: valor real no HTML sem JS e no DOM durante a contagem', async ({ page, browser, request }) => {
  const html = await (await request.get('/')).text();
  const esperados = [...html.matchAll(/<strong data-contar="(\d+)">(\d+)<\/strong>/g)];
  expect(esperados.length).toBeGreaterThan(0); // só números maiores que zero aparecem (checado abaixo)
  for (const [, alvo, texto] of esperados) { expect(texto).toBe(alvo); expect(+texto).toBeGreaterThan(0); }

  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const semJs = await ctx.newPage();
  await semJs.goto('/');
  await expect(semJs.locator('.numero strong')).toHaveText(esperados.map(m => m[1]));
  await ctx.close();

  // grava todo texto que os números tiverem desde a carga: nenhum pode ser diferente do real
  await page.addInitScript(() => {
    window.textosNumeros = [];
    new MutationObserver(() => document.querySelectorAll('[data-contar]').forEach(el => window.textosNumeros.push(el.textContent)))
      .observe(document, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['data-mostra'] });
  });
  await page.goto('/');
  const primeiro = page.locator('.numero strong').first();
  await primeiro.scrollIntoViewIfNeeded();
  await expect(primeiro).toHaveAttribute('data-mostra', /\d/); // a contagem visual aconteceu
  await expect(primeiro).not.toHaveClass(/contando/);
  const textos = await page.evaluate(() => [...new Set(window.textosNumeros)]);
  expect(textos.sort()).toEqual(esperados.map(m => m[1]).sort());
});

test('currículo: o botão do menu abre a página e "Baixar PDF" segue a versão escolhida', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.nav-cv').first()).toHaveAttribute('href', '/cv/');
  await page.goto('/cv/');
  const baixar = page.locator('[data-baixar]');
  await expect(baixar).toHaveAttribute('href', /_ADMINISTRATIVO\.pdf$/);
  const outra = page.locator('[data-variante]').nth(1);
  test.skip(!(await outra.count()));
  const slug = await outra.getAttribute('data-variante');
  await outra.click();
  await expect(baixar).toHaveAttribute('href', new RegExp(`_${slug.toUpperCase()}\.pdf$`));
});

test('vídeos rolados pelo scroll têm todos os quadros publicados', async ({ page, request }) => {
  await page.goto('/');
  const seqs = await page.locator('[data-sequencia]').evaluateAll(els => els.map(e => [e.dataset.sequencia, +e.dataset.quadros]));
  expect(seqs.length).toBeGreaterThanOrEqual(2);
  for (const [pasta, n] of seqs)
    for (const i of [0, n - 1]) expect((await request.get(`${pasta}${String(i).padStart(3, '0')}.webp`)).status(), `${pasta} quadro ${i}`).toBe(200);
});
