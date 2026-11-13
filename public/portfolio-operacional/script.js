'use strict';

/* ================= Utilitários ================= */
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = (v) => { const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : 0; };
const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const pct = (n) => (n * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%';
const isoMais = (dias) => { const d = new Date(); d.setDate(d.getDate() + dias); return d.toISOString().slice(0, 10); };
const HOJE = isoMais(0);
const dataBR = (iso) => (iso ? iso.split('-').reverse().join('/') : '__/__/____');
const dataExtenso = (iso) => new Date(iso + 'T12:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
const diasAte = (iso) => Math.round((new Date(iso + 'T12:00') - new Date(HOJE + 'T12:00')) / 864e5);
const linhas = (txt) => String(txt || '').split('\n').map((l) => l.trim()).filter(Boolean);
const ANO = new Date().getFullYear();

/* Cabeçalho e rodapé comuns a todos os documentos */
function cabecalho(emissor, sub, tipo, numero) {
  return `<header class="doc-cab"><div class="emissor">${esc(emissor)}<small>${esc(sub)}</small></div>
    <div class="ref"><b>${esc(tipo)}</b>Nº ${esc(numero)}<br>Emitido em ${dataBR(HOJE)}</div></header>`;
}
const rodapeLGPD = (finalidade) => `<footer class="doc-rodape"><b>Proteção de dados (LGPD, Lei 13.709/2018):</b> os dados pessoais deste documento são usados apenas para ${finalidade}, com base no art. 7º da LGPD, e só pelo tempo necessário. O titular pode solicitar acesso, correção ou exclusão a qualquer momento. Documento simulado para portfólio: nomes e valores fictícios.</footer>`;

/* ================= Documentos =================
   Cada documento tem grupos de campos [nome, rótulo, padrão, opções] e uma função que gera o HTML da folha. */
const DOCS = {
  renovacao: {
    nome: 'Proposta de renovação', resumo: 'Seguros · comparativo e economia',
    grupos: [
      { legenda: 'Cliente e apólice', campos: [
        ['cliente', 'Cliente', 'Mariana Exemplo'],
        ['ramo', 'Ramo', 'Residencial', { t: 'select', ops: ['Residencial', 'Incêndio Locatício', 'Condomínio', 'Empresarial'], meio: 1 }],
        ['apolice', 'Apólice atual', '1180.26.000452', { meio: 1 }],
        ['risco', 'Bem segurado', 'Apartamento residencial em Campinas/SP'],
        ['vencimento', 'Fim da vigência', isoMais(38), { t: 'date', meio: 1 }],
        ['premioAtual', 'Prêmio atual (R$/ano)', 1280, { t: 'number', meio: 1 }],
      ] },
      ...[['Seguradora Alfa', 1340, 'R$ 500', 10, true], ['Seguradora Beta', 1165, 'R$ 800', 6, true], ['Seguradora Gama', 990, 'R$ 1.500', 4, false]].map(([s, p, f, x, ok], i) => ({
        legenda: `Cotação ${i + 1}`, campos: [
          [`seg${i}`, 'Seguradora', s, { meio: 1 }],
          [`pre${i}`, 'Prêmio (R$/ano)', p, { t: 'number', meio: 1 }],
          [`fra${i}`, 'Franquia', f, { meio: 1 }],
          [`par${i}`, 'Parcelas sem juros', x, { t: 'number', meio: 1 }],
          [`ok${i}`, 'Mantém todas as coberturas atuais', ok, { t: 'check' }],
        ] })),
      { legenda: 'Condições', campos: [
        ['coberturas', 'Coberturas comparadas (uma por linha)', 'Incêndio, raio e explosão\nDanos elétricos\nRoubo e furto qualificado\nResponsabilidade civil familiar\nAssistência 24 horas', { t: 'area' }],
        ['validade', 'Cotação válida até', isoMais(15), { t: 'date', meio: 1 }],
        ['analista', 'Analista', 'Beatriz Bonotto', { meio: 1 }],
        ['corretora', 'Corretora', 'Corretora Modelo de Seguros'],
      ] },
    ],
    calcular(v) {
      const cot = [0, 1, 2].map((i) => ({ seg: v[`seg${i}`], premio: num(v[`pre${i}`]), franquia: v[`fra${i}`], parcelas: num(v[`par${i}`]), ok: v[`ok${i}`] })).filter((c) => c.seg && c.premio > 0);
      const validas = cot.filter((c) => c.ok);
      const rec = validas.sort((a, b) => a.premio - b.premio)[0] || null;
      const atual = num(v.premioAtual);
      return { cot, rec, atual, eco: rec ? atual - rec.premio : 0, dias: diasAte(v.vencimento) };
    },
    render(v) {
      const { cot, rec, atual, eco, dias } = this.calcular(v);
      const maisBarata = [...cot].sort((a, b) => a.premio - b.premio)[0];
      const status = !rec ? ['erro', 'Nenhuma cotação mantém as coberturas'] : !v.vencimento ? ['alerta', 'Informe o fim da vigência'] : dias < 0 ? ['erro', 'Apólice já vencida'] : dias <= 15 ? ['alerta', `Urgente: vence em ${dias} dias`] : ['ok', `No prazo: vence em ${dias} dias`];
      const html = `${cabecalho(v.corretora, 'Corretora de seguros · atendimento consultivo', 'Proposta de renovação', `PR-${ANO}-0142`)}
        <h3>Renovação do seguro ${esc(v.ramo)}</h3>
        <p class="subt">Preparada para <b>${esc(v.cliente)}</b> · Apólice ${esc(v.apolice)} · ${esc(v.risco)}</p>
        <div class="metricas">
          <div class="metrica"><span>Prêmio atual</span><b>${brl(atual)}</b></div>
          <div class="metrica"><span>Proposta recomendada</span><b>${rec ? brl(rec.premio) : 'n/d'}</b></div>
          <div class="metrica ${eco >= 0 ? 'destaque' : 'ruim'}"><span>${eco >= 0 ? 'Economia no ano' : 'Reajuste no ano'}</span><b>${rec ? brl(Math.abs(eco)) + (atual ? ` (${pct(Math.abs(eco) / atual)})` : '') : 'n/d'}</b></div>
          <div class="metrica ${dias <= 15 ? 'ruim' : ''}"><span>Dias para vencer</span><b>${Number.isFinite(dias) ? dias : 'n/d'}</b></div>
        </div>
        <h4>Comparativo de cotações</h4>
        <table><thead><tr><th>Seguradora</th><th class="num">Prêmio anual</th><th class="num">Variação</th><th>Franquia</th><th class="num">Parcelas</th><th>Coberturas</th></tr></thead><tbody>
          ${cot.map((c) => `<tr class="${c === rec ? 'rec' : ''}"><td>${esc(c.seg)}${c === rec ? ' ★' : ''}</td><td class="num">${brl(c.premio)}</td><td class="num">${atual ? (c.premio >= atual ? '+' : '−') + pct(Math.abs(c.premio - atual) / atual) : 'n/d'}</td><td class="nw">${esc(c.franquia)}</td><td class="num">${c.parcelas}x</td><td class="nw">${c.ok ? 'Mantém todas' : 'Reduzidas'}</td></tr>`).join('')}
        </tbody></table>
        ${rec ? `<div class="parecer"><b>Recomendação: ${esc(rec.seg)}</b>Menor prêmio entre as propostas que mantêm todas as coberturas de hoje${eco >= 0 ? `, com economia de ${brl(eco)} no ano` : `, com o menor reajuste disponível (${brl(-eco)})`} e pagamento em até ${rec.parcelas}x sem juros.${maisBarata && maisBarata !== rec ? ` A proposta da ${esc(maisBarata.seg)} é mais barata, mas reduz coberturas e por isso não é indicada: o barato pode sair caro no sinistro.` : ''}</div>`
          : '<div class="parecer erro"><b>Sem recomendação</b>Nenhuma cotação mantém as coberturas atuais. Solicitar novas cotações antes do contato com o cliente.</div>'}
        <h4>Coberturas consideradas</h4>
        <ul class="lista-check">${linhas(v.coberturas).map((c) => `<li class="s">${esc(c)}</li>`).join('')}</ul>
        <h4>Condições</h4>
        <ul class="ref-legal">
          <li>Cotação válida até ${dataBR(v.validade)}, sujeita à análise e aceitação da seguradora (prazo regulamentar de até 15 dias).</li>
          <li>Sem renovação, a cobertura termina às 24h de ${dataBR(v.vencimento)}. Renovar sem interrupção mantém o histórico do segurado.</li>
          <li>Valores de prêmio incluem IOF. Franquia é a parte do prejuízo que fica com o segurado em cada sinistro.</li>
        </ul>
        <h4>Próximos passos</h4>
        <ol class="ref-legal"><li>Confirmar a opção escolhida até ${dataBR(v.validade)}.</li><li>Assinar a proposta digital enviada pela corretora.</li><li>Receber apólice e boletos (ou débito) por e-mail.</li></ol>
        ${rodapeLGPD('cotação, emissão e atendimento do seguro (execução de contrato)')}`;
      return { html, status, dados: { rec, eco, cot } };
    },
  },

  fianca: {
    nome: 'Análise de Seguro Fiança', resumo: 'Imobiliária · regra de renda e documentos',
    grupos: [
      { legenda: 'Locatário', campos: [
        ['locatario', 'Nome', 'João Fictício'],
        ['cpf', 'CPF', '123.456.789-09', { meio: 1 }],
        ['pessoa', 'Tipo', 'Pessoa física', { t: 'select', ops: ['Pessoa física', 'Pessoa jurídica'], meio: 1 }],
        ['renda', 'Renda mensal comprovada (R$)', 9800, { t: 'number' }],
      ] },
      { legenda: 'Locação', campos: [
        ['imovel', 'Imóvel', 'Rua Exemplo, 100, ap. 32 · Campinas/SP'],
        ['imobiliaria', 'Imobiliária', 'Imobiliária Horizonte', { meio: 1 }],
        ['finalidade', 'Finalidade', 'Residencial', { t: 'select', ops: ['Residencial', 'Comercial'], meio: 1 }],
        ['aluguel', 'Aluguel (R$)', 2500, { t: 'number', meio: 1 }],
        ['condominio', 'Condomínio (R$)', 520, { t: 'number', meio: 1 }],
        ['iptu', 'IPTU mensal (R$)', 110, { t: 'number', meio: 1 }],
        ['prazo', 'Prazo do contrato (meses)', 30, { t: 'number', meio: 1 }],
      ] },
      { legenda: 'Coberturas solicitadas', campos: [
        ['cAluguel', 'Aluguel e encargos (básica)', true, { t: 'check' }],
        ['cDanos', 'Danos ao imóvel', true, { t: 'check' }],
        ['cMulta', 'Multa por rescisão', true, { t: 'check' }],
        ['cPintura', 'Pintura interna e externa', false, { t: 'check' }],
        ['cIncendio', 'Incêndio Locatício vinculado', true, { t: 'check' }],
      ] },
      { legenda: 'Documentos recebidos', campos: [
        ['dId', 'RG e CPF (e do cônjuge, se houver)', true, { t: 'check' }],
        ['dRenda', 'Comprovantes de renda dos últimos 3 meses', true, { t: 'check' }],
        ['dResid', 'Comprovante de residência atual', true, { t: 'check' }],
        ['dFicha', 'Ficha cadastral assinada e autorização de consulta', false, { t: 'check' }],
        ['analista', 'Analista', 'Beatriz Bonotto'],
      ] },
    ],
    render(v) {
      const encargos = num(v.aluguel) + num(v.condominio) + num(v.iptu);
      const renda = num(v.renda);
      const comp = renda ? encargos / renda : 1;
      const docs = [['dId', 'RG e CPF'], ['dRenda', 'Comprovantes de renda (3 meses)'], ['dResid', 'Comprovante de residência'], ['dFicha', 'Ficha cadastral e autorização de consulta']];
      const pend = docs.filter(([k]) => !v[k]);
      const cobs = [['cAluguel', 'Aluguel e encargos'], ['cDanos', 'Danos ao imóvel'], ['cMulta', 'Multa por rescisão'], ['cPintura', 'Pintura interna e externa'], ['cIncendio', 'Incêndio Locatício']];
      const cpfMasc = String(v.cpf).replace(/^(\d{3})\.(\d{3})\.(\d{3})-(\d{2})$/, '***.$2.$3-**');
      const status = pend.length ? ['alerta', `${pend.length} documento(s) pendente(s)`] : comp > 1 / 3 ? ['erro', 'Fora da regra de renda'] : ['ok', 'Apto para envio à seguradora'];
      const parecer = pend.length
        ? `<div class="parecer alerta"><b>Pendente de documentação</b>Solicitar à imobiliária: ${pend.map(([, n]) => n).join(', ')}. A análise só segue com a pasta completa, para evitar recusa por falta de documento.</div>`
        : comp > 1 / 3
          ? `<div class="parecer erro"><b>Fora da regra de renda (${pct(comp)} comprometido)</b>A renda precisa ser de pelo menos 3 vezes o aluguel com encargos (${brl(encargos * 3)}). Sugerir composição de renda com outro morador ou outra modalidade de garantia. A lei não permite somar duas garantias no mesmo contrato.</div>`
          : `<div class="parecer"><b>Apto para envio à seguradora</b>Documentação completa e comprometimento de ${pct(comp)} da renda, dentro do limite de 33%. Seguir para análise cadastral.</div>`;
      const html = `${cabecalho('Corretora Modelo de Seguros', 'Parceria com ' + v.imobiliaria, 'Análise de Seguro Fiança', `SF-${ANO}-0087`)}
        <h3>Análise prévia de Seguro Fiança Locatícia</h3>
        <p class="subt">${esc(v.finalidade)} · ${esc(v.imovel)}</p>
        <div class="metricas">
          <div class="metrica"><span>Aluguel + encargos</span><b>${brl(encargos)}</b></div>
          <div class="metrica"><span>Renda comprovada</span><b>${brl(renda)}</b></div>
          <div class="metrica ${comp <= 1 / 3 ? 'destaque' : 'ruim'}"><span>Comprometimento</span><b>${pct(comp)}</b></div>
          <div class="metrica"><span>LMI de referência</span><b>${brl(encargos * 30)}</b></div>
        </div>
        ${parecer}
        <h4>Dados da locação</h4>
        <table><tbody>
          <tr><th>Locatário</th><td>${esc(v.locatario)} · ${esc(v.pessoa)} · CPF ${esc(cpfMasc)}</td></tr>
          <tr><th>Imobiliária</th><td>${esc(v.imobiliaria)}</td></tr>
          <tr><th>Composição mensal</th><td>Aluguel ${brl(num(v.aluguel))} + condomínio ${brl(num(v.condominio))} + IPTU ${brl(num(v.iptu))}</td></tr>
          <tr><th>Prazo do contrato</th><td>${num(v.prazo)} meses</td></tr>
        </tbody></table>
        <h4>Coberturas</h4>
        <ul class="lista-check">${cobs.map(([k, n]) => `<li class="${v[k] ? 's' : 'n'}">${n}${v[k] ? '' : ' (não contratada)'}</li>`).join('')}</ul>
        <h4>Documentos</h4>
        <ul class="lista-check">${docs.map(([k, n]) => `<li class="${v[k] ? 's' : 'n'}">${n}${v[k] ? '' : ' (pendente)'}</li>`).join('')}</ul>
        <h4>Regras aplicadas</h4>
        <ul class="ref-legal">
          <li><b>Lei 8.245/91, art. 37:</b> o seguro fiança é uma das modalidades de garantia; é vedada mais de uma garantia no mesmo contrato.</li>
          <li><b>Lei 8.245/91, art. 41:</b> o seguro de fiança locatícia abrange a totalidade das obrigações do locatário.</li>
          <li><b>Lei 8.245/91, art. 22, VIII:</b> o seguro contra incêndio cabe ao locador, salvo disposição contrária no contrato, por isso o Incêndio Locatício costuma ser vinculado.</li>
          <li><b>SUSEP:</b> o produto segue as normas da Superintendência de Seguros Privados para o seguro fiança locatícia; a aprovação final é da seguradora.</li>
          <li><b>Política interna:</b> renda mínima de 3 vezes o aluguel com encargos. LMI de 30 vezes é referência usual; cada seguradora define o seu.</li>
          <li><b>LGPD:</b> CPF exibido mascarado (minimização de dados, art. 6º, III).</li>
        </ul>
        ${rodapeLGPD('análise cadastral e contratação do seguro fiança (procedimentos preliminares de contrato)')}`;
      return { html, status, dados: { comp, encargos, pend: pend.map(([, n]) => n) } };
    },
  },

  oficio: {
    nome: 'Ofício ou memorando', resumo: 'Administração pública · padrão oficial',
    grupos: [
      { legenda: 'Identificação', campos: [
        ['tipo', 'Tipo', 'Ofício', { t: 'select', ops: ['Ofício', 'Memorando'], meio: 1 }],
        ['numero', 'Número', '12', { meio: 1 }],
        ['sigla', 'Sigla do setor', 'SEADM', { meio: 1 }],
        ['local', 'Local', 'Campinas', { meio: 1 }],
      ] },
      { legenda: 'Destinatário', campos: [
        ['tratamento', 'Tratamento', 'Senhor', { t: 'select', ops: ['Senhor', 'Senhora'], meio: 1 }],
        ['hierarquia', 'Hierarquia', 'Superior', { t: 'select', ops: ['Superior', 'Mesma ou inferior'], meio: 1 }],
        ['destNome', 'Nome', 'Carlos Exemplo da Silva'],
        ['destCargo', 'Cargo', 'Chefe do Setor de Protocolo'],
        ['destOrgao', 'Órgão ou unidade', 'Agência Modelo'],
      ] },
      { legenda: 'Conteúdo', campos: [
        ['assunto', 'Assunto', 'Encaminhamento de processos digitalizados'],
        ['corpo', 'Texto (parágrafos separados por linha em branco)', 'Encaminho a Vossa Senhoria os 48 processos recebidos no período de 3 a 7 de novembro, já conferidos, digitalizados e indexados pelo número de protocolo no sistema.\n\nInformo que 2 processos foram devolvidos à origem por falta de assinatura, conforme relação em anexo, e retornarão ao fluxo assim que regularizados.\n\nColoco-me à disposição para os esclarecimentos necessários.', { t: 'area' }],
        ['anexos', 'Anexos', 'Relação de protocolos (2 folhas)'],
        ['remNome', 'Remetente', 'Beatriz Bonotto', { meio: 1 }],
        ['remCargo', 'Cargo', 'Analista Administrativa', { meio: 1 }],
      ] },
    ],
    render(v) {
      const fecho = v.hierarquia === 'Superior' ? 'Respeitosamente' : 'Atenciosamente';
      const pron = v.tratamento === 'Senhora' ? 'a Senhora' : 'o Senhor';
      const pars = String(v.corpo || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
      const html = `<div class="oficio">
        <p class="of-num">${esc(v.tipo.toUpperCase())} Nº ${esc(v.numero)}/${ANO}/${esc(v.sigla)}</p>
        <p class="of-data">${esc(v.local)}, ${dataExtenso(HOJE)}.</p>
        <div class="of-dest">${v.tipo === 'Ofício' ? `A Sua Senhoria ${pron}<br>` : `${v.tratamento === 'Senhora' ? 'À Senhora' : 'Ao Senhor'}<br>`}${esc(v.destNome)}<br>${esc(v.destCargo)}<br>${esc(v.destOrgao)}</div>
        <p class="of-assunto">Assunto: ${esc(v.assunto)}.</p>
        <p class="par">${esc(v.tratamento)} ${esc(v.destCargo.split(' ')[0])},</p>
        ${pars.map((p, i) => `<p class="par">${pars.length > 2 ? i + 1 + '. ' : ''}${esc(p)}</p>`).join('')}
        <p class="of-fecho">${fecho},</p>
        <div class="of-ass">${esc(v.remNome)}<br>${esc(v.remCargo)}</div>
        ${v.anexos ? `<p style="margin-top:28px;font-size:.85rem">Anexo: ${esc(v.anexos)}</p>` : ''}
      </div>
      <ul class="ref-legal" style="margin-top:28px;border-top:1px solid #E2E8F0;padding-top:10px">
        <li>Padrão ofício do Manual de Redação da Presidência da República (3ª ed.): identificação, local e data, endereçamento, assunto, texto, fecho e assinatura.</li>
        <li>Fecho "${fecho}": ${fecho === 'Respeitosamente' ? 'usado para autoridades de hierarquia superior' : 'usado para mesma hierarquia ou inferior'}.</li>
      </ul>`;
      return { html, status: ['ok', `Fecho: ${fecho}`], dados: { fecho } };
    },
  },

  compra: {
    nome: 'Requisição de compra', resumo: 'Suprimentos · ponto de pedido e 3 cotações',
    grupos: [
      { legenda: 'Item e estoque', campos: [
        ['item', 'Item', 'Toner para impressora laser'],
        ['solicitante', 'Solicitante', 'Beatriz Bonotto', { meio: 1 }],
        ['setor', 'Setor', 'Administrativo', { meio: 1 }],
        ['consumo', 'Consumo médio (un./mês)', 6, { t: 'number', meio: 1 }],
        ['estoque', 'Estoque atual (un.)', 3, { t: 'number', meio: 1 }],
        ['seguranca', 'Estoque de segurança (un.)', 2, { t: 'number', meio: 1 }],
        ['prazoEnt', 'Prazo de entrega (dias)', 10, { t: 'number', meio: 1 }],
        ['qtd', 'Quantidade a comprar', 8, { t: 'number', meio: 1 }],
        ['alcada', 'Alçada sem aprovação (R$)', 1500, { t: 'number', meio: 1 }],
      ] },
      ...[['Papelaria Central', 182, 25, 5, '30 dias'], ['Distribuidora Norte', 169, 60, 12, '28 dias'], ['Office Mais', 175, 0, 7, 'À vista']].map(([f, p, fr, pz, cond], i) => ({
        legenda: `Fornecedor ${i + 1}`, campos: [
          [`for${i}`, 'Fornecedor', f, { meio: 1 }],
          [`pu${i}`, 'Preço unitário (R$)', p, { t: 'number', meio: 1 }],
          [`fr${i}`, 'Frete (R$)', fr, { t: 'number', meio: 1 }],
          [`pz${i}`, 'Prazo (dias)', pz, { t: 'number', meio: 1 }],
          [`cd${i}`, 'Pagamento', cond],
        ] })),
    ],
    render(v) {
      const diario = num(v.consumo) / 30;
      const pp = Math.ceil(diario * num(v.prazoEnt) + num(v.seguranca));
      const qtd = num(v.qtd);
      const forn = [0, 1, 2].map((i) => ({ nome: v[`for${i}`], pu: num(v[`pu${i}`]), fr: num(v[`fr${i}`]), pz: num(v[`pz${i}`]), cond: v[`cd${i}`] }))
        .filter((f) => f.nome).map((f) => ({ ...f, total: f.pu * qtd + f.fr, atraso: f.pz > num(v.prazoEnt) }));
      const aptos = forn.filter((f) => !f.atraso);
      const venc = [...(aptos.length ? aptos : forn)].sort((a, b) => a.total - b.total)[0];
      const maior = Math.max(...forn.map((f) => f.total));
      const precisa = num(v.estoque) <= pp;
      const aprov = venc && venc.total > num(v.alcada);
      const status = !precisa ? ['ok', 'Estoque acima do ponto de pedido'] : aprov ? ['alerta', 'Requer aprovação do gestor'] : ['ok', 'Compra dentro da alçada'];
      const html = `${cabecalho('Empresa Modelo Ltda.', 'Setor ' + v.setor, 'Requisição de compra', `RC-${ANO}-0311`)}
        <h3>${esc(v.item)}</h3>
        <p class="subt">Solicitante: ${esc(v.solicitante)} · Quantidade: ${qtd} un.</p>
        <div class="metricas">
          <div class="metrica"><span>Estoque atual</span><b>${num(v.estoque)} un.</b></div>
          <div class="metrica ${precisa ? 'ruim' : 'destaque'}"><span>Ponto de pedido</span><b>${pp} un.</b></div>
          <div class="metrica"><span>Melhor custo total</span><b>${venc ? brl(venc.total) : 'n/d'}</b></div>
          <div class="metrica destaque"><span>Economia x maior</span><b>${venc ? brl(maior - venc.total) : 'n/d'}</b></div>
        </div>
        <div class="parecer ${precisa ? (aprov ? 'alerta' : '') : ''}"><b>${precisa ? 'Repor agora' : 'Ainda não é preciso comprar'}</b>Ponto de pedido = consumo diário (${diario.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}) × prazo de entrega (${num(v.prazoEnt)} dias) + estoque de segurança (${num(v.seguranca)}) = ${pp} un. ${precisa ? `O estoque atual (${num(v.estoque)}) está no ponto ou abaixo dele.` : ''} ${venc ? `Fornecedor indicado: <b style="display:inline">${esc(venc.nome)}</b>, menor custo total${aptos.length < forn.length ? ' entre os que entregam no prazo' : ''}.` : ''} ${aprov ? `Valor acima da alçada de ${brl(num(v.alcada))}: encaminhar para aprovação.` : ''}</div>
        <h4>Mapa de cotação</h4>
        <table><thead><tr><th>Fornecedor</th><th class="num">Unitário</th><th class="num">Frete</th><th class="num">Total</th><th class="num">Prazo</th><th>Pagamento</th></tr></thead><tbody>
          ${forn.map((f) => `<tr class="${f === venc ? 'rec' : ''}"><td>${esc(f.nome)}${f === venc ? ' ★' : ''}</td><td class="num">${brl(f.pu)}</td><td class="num">${brl(f.fr)}</td><td class="num">${brl(f.total)}</td><td class="num">${f.pz} dias${f.atraso ? ' ⚠' : ''}</td><td>${esc(f.cond)}</td></tr>`).join('')}
        </tbody></table>
        <h4>Critérios</h4>
        <ul class="ref-legal"><li>Mínimo de 3 cotações para comparar preço, prazo e condição de pagamento.</li><li>Comparação pelo custo total (preço × quantidade + frete), não só pelo preço unitário.</li><li>Fornecedor com prazo maior que o prazo de reposição (⚠) só é escolhido se nenhum outro atender.</li><li>No recebimento, conferir nota fiscal com pedido (quantidade, preço e item) antes de dar entrada no estoque.</li></ul>
        <footer class="doc-rodape">Documento simulado para portfólio: empresa, fornecedores e valores fictícios.</footer>`;
      return { html, status, dados: { pp, venc, aprov, precisa, qtd, forn: forn.length } };
    },
  },

  w2h: {
    nome: 'Plano de ação 5W2H', resumo: 'Gestão · pendências com dono e prazo',
    grupos: [
      { legenda: 'Problema', campos: [
        ['problema', 'Problema', '12 apólices de imobiliárias parceiras com documentação pendente a menos de 30 dias do vencimento.', { t: 'area' }],
        ['meta', 'Meta', 'Zerar pendências até o fim do mês, sem nenhuma apólice vencida.'],
        ['responsavel', 'Responsável pelo plano', 'Beatriz Bonotto'],
      ] },
      ...[
        ['Levantar pendências por imobiliária', 'Saber o que falta em cada apólice', 'Sistema da corretora', isoMais(2), 'Analista de seguros', 'Relatório filtrado por status e vencimento', 0, 'Concluída'],
        ['Contatar imobiliárias com a lista', 'Receber os documentos a tempo', 'E-mail e WhatsApp corporativo', isoMais(7), 'Analista de seguros', 'Mensagem padrão com checklist anexo', 0, 'Em andamento'],
        ['Reenviar pastas completas à seguradora', 'Emitir antes do vencimento', 'Portal da seguradora', isoMais(15), 'Analista de seguros', 'Conferência pelo checklist antes do envio', 0, 'Não iniciada'],
      ].map((a, i) => ({ legenda: `Ação ${i + 1}`, campos: [
        [`what${i}`, 'O quê', a[0]], [`why${i}`, 'Por quê', a[1]], [`where${i}`, 'Onde', a[2], { meio: 1 }], [`when${i}`, 'Quando', a[3], { t: 'date', meio: 1 }],
        [`who${i}`, 'Quem', a[4], { meio: 1 }], [`much${i}`, 'Quanto custa (R$)', a[6], { t: 'number', meio: 1 }], [`how${i}`, 'Como', a[5]],
        [`st${i}`, 'Status', a[7], { t: 'select', ops: ['Não iniciada', 'Em andamento', 'Concluída'] }],
      ] })),
    ],
    render(v) {
      const acoes = [0, 1, 2].map((i) => ({ what: v[`what${i}`], why: v[`why${i}`], where: v[`where${i}`], when: v[`when${i}`], who: v[`who${i}`], how: v[`how${i}`], much: num(v[`much${i}`]), st: v[`st${i}`] })).filter((a) => a.what);
      const feitas = acoes.filter((a) => a.st === 'Concluída').length;
      const atrasadas = acoes.filter((a) => a.st !== 'Concluída' && a.when && diasAte(a.when) < 0).length;
      const custo = acoes.reduce((s, a) => s + a.much, 0);
      const cor = { 'Concluída': '#065F46', 'Em andamento': '#92400E', 'Não iniciada': '#475569' };
      const html = `${cabecalho('Corretora Modelo de Seguros', 'Gestão de carteira', 'Plano de ação 5W2H', `PA-${ANO}-0019`)}
        <h3>Plano de ação</h3>
        <div class="parecer alerta"><b>Problema</b>${esc(v.problema)}</div>
        <p><b>Meta:</b> ${esc(v.meta)}</p>
        <div class="metricas">
          <div class="metrica"><span>Ações</span><b>${acoes.length}</b></div>
          <div class="metrica destaque"><span>Concluídas</span><b>${feitas} (${pct(acoes.length ? feitas / acoes.length : 0)})</b></div>
          <div class="metrica ${atrasadas ? 'ruim' : ''}"><span>Atrasadas</span><b>${atrasadas}</b></div>
          <div class="metrica"><span>Custo previsto</span><b>${brl(custo)}</b></div>
        </div>
        <h4>Ações</h4>
        <table class="tab-w2h"><thead><tr><th>O quê</th><th>Por quê</th><th>Onde</th><th>Quando</th><th>Quem</th><th>Como</th><th class="num">Quanto</th><th>Status</th></tr></thead><tbody>
          ${acoes.map((a) => `<tr><td>${esc(a.what)}</td><td>${esc(a.why)}</td><td>${esc(a.where)}</td><td class="nw">${dataBR(a.when)}</td><td>${esc(a.who)}</td><td>${esc(a.how)}</td><td class="num">${a.much ? brl(a.much) : 'Sem custo'}</td><td class="nw" style="color:${cor[a.st]};font-weight:600">${esc(a.st)}</td></tr>`).join('')}
        </tbody></table>
        <h4>Como acompanhar</h4>
        <ul class="ref-legal"><li>Revisão semanal do status com o responsável de cada ação.</li><li>Ação atrasada ganha nova data e motivo registrado, nunca é apagada.</li><li>O plano fecha quando a meta é atingida e o resultado é registrado.</li></ul>
        <footer class="doc-rodape">Documento simulado para portfólio: dados fictícios.</footer>`;
      const proxima = acoes.filter((a) => a.st !== 'Concluída' && a.when).sort((a, b) => a.when.localeCompare(b.when))[0];
      return { html, status: atrasadas ? ['erro', `${atrasadas} ação(ões) atrasada(s)`] : ['ok', `${feitas} de ${acoes.length} concluídas`], dados: { feitas, total: acoes.length, atrasadas, proxima } };
    },
  },
};

let docAtual = 'renovacao';
let anexosAtuais = [];
let emailAtual = '';

/* ================= Anexos fictícios (SVG) =================
   Cada anexo é desenhado como a página de um documento, com marca d'água de fictício. */
const ANEXO_COR = { apolice: '#1D4ED8', identidade: '#0F766E', renda: '#7C3AED', residencia: '#B45309', nf: '#334155', tabela: '#0F172A', orcamento: '#9E4F67' };
function anexoSVG(tipo, titulo) {
  const cor = ANEXO_COR[tipo] || '#0F172A';
  const linhas = (y0, n, larg = 150) => Array.from({ length: n }, (_, i) => `<rect x="30" y="${y0 + i * 9}" width="${larg - (i % 3) * 22}" height="3.2" rx="1.6" fill="#CBD5E1"/>`).join('');
  const tabela = (y0, n) => `<rect x="30" y="${y0}" width="150" height="9" fill="${cor}" opacity=".85"/>` + Array.from({ length: n }, (_, i) => `<rect x="30" y="${y0 + 9 + i * 9}" width="150" height="9" fill="${i % 2 ? '#F1F5F9' : '#fff'}" stroke="#E2E8F0" stroke-width=".5"/><rect x="34" y="${y0 + 12 + i * 9}" width="${40 + (i * 17) % 40}" height="3" fill="#94A3B8"/><rect x="150" y="${y0 + 12 + i * 9}" width="24" height="3" fill="#94A3B8"/>`).join('');
  const barras = [20, 35, 28, 45, 38, 30];
  const miolo = {
    apolice: `<circle cx="42" cy="58" r="9" fill="${cor}" opacity=".2"/><rect x="58" y="52" width="80" height="5" fill="${cor}"/><rect x="58" y="61" width="50" height="3" fill="#94A3B8"/>${tabela(80, 7)}${linhas(160, 8)}<rect x="120" y="245" width="60" height="18" rx="2" fill="none" stroke="${cor}"/>`,
    identidade: `<rect x="30" y="50" width="150" height="95" rx="6" fill="#ECFDF5" stroke="${cor}"/><rect x="40" y="62" width="38" height="48" rx="3" fill="#CBD5E1"/><circle cx="59" cy="79" r="9" fill="#94A3B8"/><rect x="47" y="92" width="24" height="14" rx="7" fill="#94A3B8"/><rect x="88" y="64" width="80" height="4" fill="${cor}"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="88" y="${76 + i * 10}" width="${70 - i * 6}" height="3" fill="#94A3B8"/>`).join('')}<rect x="40" y="120" width="128" height="14" fill="#0F172A" opacity=".85"/><text x="104" y="130" font-size="7" fill="#fff" text-anchor="middle" font-family="monospace">***.456.789-**</text>${linhas(165, 6)}`,
    renda: `${tabela(55, 10)}<rect x="110" y="160" width="70" height="14" fill="${cor}" opacity=".15"/><rect x="114" y="165" width="40" height="4" fill="${cor}"/>${linhas(190, 6)}`,
    residencia: `<rect x="30" y="50" width="150" height="40" fill="${cor}" opacity=".12"/><rect x="38" y="60" width="60" height="5" fill="${cor}"/><rect x="38" y="72" width="100" height="3" fill="#94A3B8"/>${linhas(105, 6)}${barras.map((b, i) => `<rect x="${40 + i * 22}" y="${210 - b}" width="14" height="${b}" fill="${cor}" opacity=".6"/>`).join('')}`,
    nf: `<rect x="30" y="50" width="150" height="26" fill="none" stroke="${cor}"/><rect x="36" y="58" width="60" height="5" fill="${cor}"/>${Array.from({ length: 36 }, (_, i) => `<rect x="${104 + i * 2}" y="56" width="${i % 3 ? 1 : 1.6}" height="16" fill="#0F172A"/>`).join('')}${tabela(88, 8)}${linhas(178, 5)}<rect x="30" y="230" width="150" height="20" fill="#F1F5F9"/>`,
    tabela: `${tabela(55, 16)}${linhas(215, 4)}`,
    orcamento: `<rect x="30" y="50" width="70" height="6" fill="${cor}"/><rect x="30" y="61" width="110" height="3" fill="#94A3B8"/>${tabela(78, 5)}<rect x="120" y="140" width="60" height="16" fill="${cor}" opacity=".15"/><rect x="126" y="146" width="42" height="4" fill="${cor}"/>${linhas(170, 7)}`,
  }[tipo] || linhas(55, 20);
  const rotulo = titulo.length > 36 ? titulo.slice(0, 35) + '…' : titulo;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 297" role="img" aria-label="${esc(titulo)} (documento fictício)"><rect width="210" height="297" fill="#fff"/><rect width="210" height="30" fill="${cor}"/><text x="30" y="19" font-size="8.5" font-family="Arial, sans-serif" font-weight="700" fill="#fff">${esc(rotulo)}</text>${miolo}<text x="105" y="170" font-size="20" font-family="Arial, sans-serif" font-weight="700" fill="#B91C1C" opacity=".13" text-anchor="middle" transform="rotate(-35 105 170)">DOCUMENTO FICTÍCIO</text><rect x="30" y="275" width="150" height="2" fill="#E2E8F0"/></svg>`;
}

/* ================= E-mail de envio =================
   Assunto, saudação, resumo do documento, assinatura de e-mail e anexos (o PDF gerado abaixo + documentos de apoio). */
const primeiro = (nome) => String(nome || '').trim().split(' ')[0] || 'cliente';
const arquivo = (s) => String(s || 'documento').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w]+/g, '_').replace(/^_|_$/g, '');
const assinaturaEmail = (nome, cargo, empresa) => `${nome || 'Beatriz Bonotto'}\n${cargo} | ${empresa}\n(19) 3000-0000 · atendimento@empresamodelo.exemplo\n\nEste e-mail pode conter dados pessoais protegidos pela LGPD. Se o recebeu por engano, avise e apague a mensagem.`;

const EXTRAS = {
  renovacao: {
    pdf: (v) => `Proposta_Renovacao_${arquivo(v.cliente)}.pdf`,
    anexos: () => [['apolice', 'Apólice atual (vigência a vencer)'], ['tabela', 'Comparativo de coberturas por seguradora']],
    email: (v, d) => ({
      para: `${v.cliente} <cliente@exemplo.com>`,
      assunto: `Renovação do seu seguro ${v.ramo}: ${d.eco > 0 ? `economia de ${brl(d.eco)} no ano` : 'proposta com as melhores condições'}`,
      corpo: `Olá, ${primeiro(v.cliente)}, tudo bem?\n\nSeu seguro ${v.ramo} (apólice ${v.apolice}) vence em ${dataBR(v.vencimento)}. Cotei a renovação em ${d.cot.length} seguradoras e a melhor opção, mantendo todas as suas coberturas, é a ${d.rec ? `${d.rec.seg}: ${brl(d.rec.premio)} por ano, em até ${d.rec.parcelas}x sem juros` : 'que detalho no PDF'}${d.eco > 0 ? `, uma economia de ${brl(d.eco)} em relação ao seguro atual` : ''}.\n\nNo PDF em anexo estão o comparativo completo, as coberturas e as condições. A cotação vale até ${dataBR(v.validade)}.\n\nPosso seguir com a renovação? Se preferir, explico as diferenças por telefone.\n\nAtenciosamente,`,
      assin: assinaturaEmail(v.analista, 'Analista de Seguros', v.corretora),
    }),
  },
  fianca: {
    pdf: (v) => `Analise_Seguro_Fianca_${arquivo(v.locatario)}.pdf`,
    anexos: (v) => [v.dId && ['identidade', 'Documento de identidade (dados mascarados)'], v.dRenda && ['renda', 'Comprovantes de renda (3 meses)'], v.dResid && ['residencia', 'Comprovante de residência']].filter(Boolean),
    email: (v, d, st) => ({
      para: `${v.imobiliaria} <locacao@imobiliaria.exemplo>`,
      assunto: `Seguro Fiança · ${v.locatario}: ${st[1]}`,
      corpo: `Olá, equipe da ${v.imobiliaria}, tudo bem?\n\nConcluí a análise prévia do Seguro Fiança de ${v.locatario} para o imóvel ${v.imovel}.\n\nResultado: ${st[1]}.\nComprometimento de renda: ${pct(d.comp)} (limite de 33%), com aluguel e encargos de ${brl(d.encargos)}.${d.pend.length ? `\nPendências: ${d.pend.join(', ')}.` : ''}\n\nA análise completa segue em PDF, junto com os documentos conferidos. Os dados pessoais foram usados somente para esta análise, conforme a LGPD.\n\n${d.pend.length ? 'Assim que receber as pendências, envio para a seguradora no mesmo dia.' : 'Sigo com o envio à seguradora e aviso vocês assim que sair a aprovação.'}\n\nAtenciosamente,`,
      assin: assinaturaEmail(v.analista, 'Analista de Seguros', 'Corretora Modelo de Seguros'),
    }),
  },
  oficio: {
    pdf: (v) => `${arquivo(v.tipo)}_${v.numero}_${ANO}_${arquivo(v.sigla)}.pdf`,
    anexos: (v) => [['tabela', v.anexos || 'Relação de protocolos']],
    email: (v, d) => ({
      para: `${v.destNome} <protocolo@orgao.exemplo>`,
      assunto: `${v.tipo} nº ${v.numero}/${ANO}/${v.sigla}: ${v.assunto}`,
      corpo: `${v.tratamento === 'Senhora' ? 'Prezada Senhora' : 'Prezado Senhor'} ${v.destNome},\n\nEncaminho em anexo o ${v.tipo} nº ${v.numero}/${ANO}/${v.sigla}, que trata de: ${String(v.assunto).toLowerCase()}.\n\nO documento segue no padrão oficial, com a relação de protocolos anexada para conferência.\n\nPermaneço à disposição para esclarecimentos.\n\n${d.fecho},`,
      assin: assinaturaEmail(v.remNome, v.remCargo, 'Setor ' + (v.sigla || 'administrativo')),
    }),
  },
  compra: {
    pdf: (v) => `Requisicao_Compra_${arquivo(v.item)}.pdf`,
    anexos: (v) => [0, 1, 2].filter((i) => v[`for${i}`]).map((i) => ['orcamento', `Orçamento · ${v[`for${i}`]}`]),
    email: (v, d) => ({
      para: 'Gestão de Compras <compras@empresamodelo.exemplo>',
      assunto: `Requisição de compra: ${v.item} (${d.aprov ? 'aprovação necessária' : 'dentro da alçada'})`,
      corpo: `Olá, tudo bem?\n\nSegue a requisição de compra de ${d.qtd} un. de ${v.item}.\n\nO estoque atual (${num(v.estoque)} un.) ${d.precisa ? 'atingiu' : 'ainda não atingiu'} o ponto de pedido de ${d.pp} un. Cotei com ${d.forn} fornecedores e o menor custo total é da ${d.venc ? `${d.venc.nome}: ${brl(d.venc.total)}, entrega em ${d.venc.pz} dias` : '(sem cotação)'}.${d.aprov ? `\n\nComo o valor passa da alçada de ${brl(num(v.alcada))}, preciso da sua aprovação para emitir o pedido.` : ''}\n\nRequisição e orçamentos em anexo.\n\nObrigada,`,
      assin: assinaturaEmail(v.solicitante, 'Analista Administrativa', 'Empresa Modelo Ltda.'),
    }),
  },
  w2h: {
    pdf: () => `Plano_de_Acao_5W2H_${ANO}.pdf`,
    anexos: () => [['tabela', 'Relatório de pendências por imobiliária']],
    email: (v, d) => ({
      para: 'Equipe de Seguros <seguros@corretoramodelo.exemplo>',
      assunto: `Plano de ação 5W2H: ${d.feitas} de ${d.total} ações concluídas`,
      corpo: `Olá, equipe!\n\nCompartilho o plano de ação para: ${String(v.problema).replace(/\.$/, '').toLowerCase()}.\n\nMeta: ${v.meta}\nAndamento: ${d.feitas} de ${d.total} ações concluídas${d.atrasadas ? `, ${d.atrasadas} atrasada(s)` : ', nenhuma atrasada'}.${d.proxima ? `\nPróxima entrega: ${d.proxima.what} até ${dataBR(d.proxima.when)}.` : ''}\n\nO plano completo segue em PDF. Revisamos o status toda semana.\n\nAtenciosamente,`,
      assin: assinaturaEmail(v.responsavel, 'Analista de Seguros', 'Corretora Modelo de Seguros'),
    }),
  },
};

/* Monta o formulário do documento escolhido, vazio (o exemplo aparece como dica no campo) */
function montarForm(id) {
  docAtual = id;
  const campo = ([nome, rot, padrao, o = {}]) => {
    const idc = 'f-' + nome;
    if (o.t === 'check') return `<label class="check"><input type="checkbox" id="${idc}" name="${nome}">${rot}</label>`;
    const dica = o.t === 'date' ? '' : ` placeholder="Ex.: ${esc(String(padrao).split('\n')[0])}"`;
    const input = o.t === 'area' ? `<textarea id="${idc}" name="${nome}" rows="4"${dica}></textarea>`
      : o.t === 'select' ? `<select id="${idc}" name="${nome}">${o.ops.map((op) => `<option ${op === padrao ? 'selected' : ''}>${op}</option>`).join('')}</select>`
        : `<input id="${idc}" name="${nome}" type="${o.t || 'text'}"${dica}${o.t === 'number' ? ' min="0" step="any" inputmode="decimal"' : ''}>`;
    return `<div class="campo${o.meio ? ' meio' : ''}"><label for="${idc}">${rot}</label>${input}</div>`;
  };
  $('#form-doc').innerHTML = DOCS[id].grupos.map((g) => `<fieldset><legend>${g.legenda}</legend>${g.campos.map(campo).join('')}</fieldset>`).join('');
  document.querySelectorAll('#seletor-doc button').forEach((b) => b.setAttribute('aria-selected', b.dataset.doc === id));
  $('#aviso').textContent = '';
  atualizar();
}

/* Preenche todos os campos com o exemplo do caso */
function carregarExemplo() {
  for (const g of DOCS[docAtual].grupos) for (const [nome, , padrao, o = {}] of g.campos) {
    const el = $('#f-' + nome);
    if (o.t === 'check') el.checked = !!padrao; else el.value = padrao;
  }
  atualizar();
}

/* Lê o formulário (inclusive caixas desmarcadas) */
function valores() {
  const v = {};
  for (const el of $('#form-doc').elements) if (el.name) v[el.name] = el.type === 'checkbox' ? el.checked : el.value;
  return v;
}
const formVazio = () => [...$('#form-doc').elements].every((el) => !el.name || el.type === 'checkbox' || el.tagName === 'SELECT' || !el.value.trim());

/* Redesenha e-mail e folha a cada alteração */
function atualizar() {
  if (formVazio()) {
    $('#folha').innerHTML = '<div class="vazio"><b>Documento em branco</b><p>Preencha os campos ao lado ou carregue o exemplo deste caso para ver o e-mail e o documento prontos.</p><button class="btn" type="button" data-exemplo>Carregar exemplo</button></div>';
    $('#email').hidden = true;
    $('#doc-status').className = 'selo';
    $('#doc-status').textContent = 'Aguardando preenchimento';
    $('#btn-copiar').disabled = $('#btn-pdf').disabled = true;
    return;
  }
  const v = valores();
  const r = DOCS[docAtual].render(v);
  const ex = EXTRAS[docAtual];
  anexosAtuais = [{ tipo: 'pdf', nome: ex.pdf(v) }, ...ex.anexos(v).map(([tipo, nome]) => ({ tipo, nome }))];
  // lista de anexos também no fim do documento (o ofício já tem a sua linha de anexo)
  const listaAnexos = docAtual === 'oficio' || anexosAtuais.length < 2 ? '' : `<h4>Anexos</h4><ol class="ref-legal">${anexosAtuais.slice(1).map((a) => `<li>${esc(a.nome)}</li>`).join('')}</ol>`;
  $('#folha').innerHTML = r.html.includes('<footer class="doc-rodape"') ? r.html.replace('<footer class="doc-rodape"', `${listaAnexos}<footer class="doc-rodape"`) : r.html + listaAnexos;
  const e = ex.email(v, r.dados || {}, r.status);
  emailAtual = `Para: ${e.para}\nAssunto: ${e.assunto}\n\n${e.corpo}\n\n${e.assin}\n\nAnexos: ${anexosAtuais.map((a) => a.nome).join('; ')}`;
  const br = (t) => esc(t).replace(/\n/g, '<br>');
  $('#email').hidden = false;
  $('#email').innerHTML = `<div class="email-topo"><span class="rotulo">E-mail de envio</span><span class="email-dica">O PDF do documento abaixo vai como anexo</span></div>
    <dl class="email-cab"><dt>Para</dt><dd>${esc(e.para)}</dd><dt>Assunto</dt><dd><b>${esc(e.assunto)}</b></dd></dl>
    <div class="email-corpo">${br(e.corpo)}<div class="email-assin">${br(e.assin)}</div></div>
    <div class="email-anexos"><span class="rotulo">Anexos (${anexosAtuais.length})</span><ul>${anexosAtuais.map((a, i) => `<li><button type="button" data-anexo="${i}" title="Abrir ${esc(a.nome)}">${a.tipo === 'pdf' ? '<span class="mini mini-pdf">PDF</span>' : `<span class="mini">${anexoSVG(a.tipo, a.nome)}</span>`}<span class="anexo-nome">${esc(a.nome)}</span></button></li>`).join('')}</ul></div>`;
  $('#doc-status').className = 'selo ' + r.status[0];
  $('#doc-status').textContent = r.status[1];
  $('#btn-copiar').disabled = $('#btn-pdf').disabled = false;
}

/* Impressão: copia só o trecho escolhido para um contêiner na raiz e esconde o resto com display:none (sem páginas em branco) */
function prepararImpressao(el) {
  limparImpressao();
  const c = document.createElement('div');
  c.id = 'impressao';
  c.className = el.className;
  c.innerHTML = el.innerHTML;
  document.body.appendChild(c);
}
const limparImpressao = () => document.getElementById('impressao')?.remove();
function imprimir(el, nomeArquivo) {
  prepararImpressao(el);
  const titulo = document.title;
  if (nomeArquivo) document.title = nomeArquivo.replace(/\.pdf$/, ''); // vira o nome sugerido do PDF
  window.print();
  document.title = titulo;
  limparImpressao();
}
window.prepararTrecho = (sel) => prepararImpressao($(sel)); // usado pelo gerador de PDFs (Playwright)

async function copiarEmail() {
  try { await navigator.clipboard.writeText(emailAtual); $('#aviso').textContent = 'E-mail copiado. Cole no seu cliente de e-mail e anexe o PDF.'; }
  catch { $('#aviso').textContent = 'Não foi possível copiar automaticamente.'; }
}

function abrirAnexo(i) {
  const a = anexosAtuais[i];
  if (!a) return;
  if (a.tipo === 'pdf') { $('#folha').scrollIntoView({ behavior: 'smooth' }); return; }
  $('#visor-anexo-nome').textContent = a.nome;
  $('#visor-anexo-img').innerHTML = anexoSVG(a.tipo, a.nome);
  $('#visor-anexo').showModal();
}

/* ================= Fluxogramas =================
   Nós: ini, proc, dec (decisão: Sim desce; Não vai para o lado), fim. */
const FLUXOS = {
  fianca: {
    titulo: 'Emissão de Seguro Fiança e Incêndio Locatício',
    nos: [
      { t: 'ini', x: 'Pedido da imobiliária' },
      { t: 'proc', x: 'Receber ficha e documentos do locatário' },
      { t: 'dec', x: 'Documentação completa?', nao: { t: 'proc', x: 'Solicitar pendências à imobiliária', volta: 'volta para conferência' } },
      { t: 'proc', x: 'Calcular comprometimento de renda', s: 'aluguel + condomínio + IPTU' },
      { t: 'dec', x: 'Renda ≥ 3x encargos?', nao: { t: 'fim', x: 'Sugerir composição de renda ou outra garantia' } },
      { t: 'proc', x: 'Enviar para análise cadastral da seguradora' },
      { t: 'dec', x: 'Aprovado pela seguradora?', nao: { t: 'fim', x: 'Informar recusa à imobiliária' } },
      { t: 'proc', x: 'Emitir apólice de fiança e Incêndio Locatício' },
      { t: 'dec', x: 'Primeira parcela paga?', nao: { t: 'proc', x: 'Cobrar e lembrar do vencimento', volta: 'volta para pagamento' } },
      { t: 'proc', x: 'Entregar apólices à imobiliária e ao locatário' },
      { t: 'fim', x: 'Contrato de locação garantido' },
    ],
    regras: ['Lei 8.245/91, art. 37: só uma modalidade de garantia por contrato.', 'Lei 8.245/91, art. 41: o seguro fiança cobre todas as obrigações do locatário.', 'Lei 8.245/91, art. 22, VIII: seguro contra incêndio cabe ao locador, salvo cláusula que transfira ao locatário.', 'Renda mínima de 3x o aluguel com encargos (comprometimento até 33%).', 'Aprovação final é da seguradora, conforme normas da SUSEP.', 'LGPD: consulta cadastral só com autorização e dados mínimos.'],
  },
  renovacao: {
    titulo: 'Régua de renovação de apólices',
    nos: [
      { t: 'ini', x: 'Apólice a 45 dias do vencimento' },
      { t: 'proc', x: 'Revisar histórico, sinistros e coberturas' },
      { t: 'proc', x: 'Cotar em pelo menos 3 seguradoras' },
      { t: 'dec', x: 'Alguma mantém as coberturas?', nao: { t: 'proc', x: 'Ajustar coberturas com o cliente e recotar', volta: 'volta para cotação' } },
      { t: 'proc', x: 'Montar proposta com comparativo e recomendação' },
      { t: 'proc', x: 'Contato consultivo com o cliente' },
      { t: 'dec', x: 'Cliente aceitou?', nao: { t: 'fim', x: 'Registrar motivo da não renovação' } },
      { t: 'proc', x: 'Transmitir proposta de renovação' },
      { t: 'dec', x: 'Emitida antes do vencimento?', nao: { t: 'proc', x: 'Avisar cliente do risco de ficar sem cobertura e acompanhar', volta: 'volta para emissão' } },
      { t: 'fim', x: 'Apólice renovada e enviada' },
    ],
    regras: ['Alerta aos 45 dias dá tempo para cotar, negociar e emitir.', 'Comparar pelo conjunto: prêmio, franquia, coberturas e parcelamento.', 'Sem renovação, a cobertura termina às 24h do último dia de vigência.', 'Seguradora tem prazo regulamentar de até 15 dias para aceitar a proposta.', 'Toda recusa do cliente é registrada para a próxima abordagem.'],
  },
  documental: {
    titulo: 'Tramitação documental e ofícios',
    nos: [
      { t: 'ini', x: 'Documento recebido' },
      { t: 'proc', x: 'Registrar entrada e gerar protocolo' },
      { t: 'dec', x: 'Completo e assinado?', nao: { t: 'fim', x: 'Devolver à origem com ofício de pendência' } },
      { t: 'proc', x: 'Digitalizar' },
      { t: 'dec', x: 'Imagem legível?', nao: { t: 'proc', x: 'Digitalizar de novo', volta: 'volta para conferência da imagem' } },
      { t: 'proc', x: 'Indexar pelo número de protocolo' },
      { t: 'dec', x: 'Precisa de manifestação de outro setor?', nao: { t: 'proc', x: 'Arquivar conforme tabela de temporalidade', volta: 'segue para o fim' } },
      { t: 'proc', x: 'Redigir ofício ou memorando de encaminhamento' },
      { t: 'fim', x: 'Processo tramitado e localizável' },
    ],
    regras: ['Manual de Redação da Presidência da República: padrão ofício.', 'Fecho: Respeitosamente para superior; Atenciosamente para mesma hierarquia ou inferior.', 'Tabela de temporalidade define o prazo de guarda de cada tipo de documento.', 'LGPD: acesso restrito a quem precisa do documento para trabalhar.', 'Todo documento devolvido sai com motivo por escrito.'],
  },
  suprimentos: {
    titulo: 'Reposição de suprimentos e compras',
    nos: [
      { t: 'ini', x: 'Conferência semanal de estoque' },
      { t: 'dec', x: 'Estoque ≤ ponto de pedido?', nao: { t: 'fim', x: 'Manter monitoramento' } },
      { t: 'proc', x: 'Cotar com 3 fornecedores' },
      { t: 'proc', x: 'Comparar custo total, prazo e pagamento' },
      { t: 'dec', x: 'Valor dentro da alçada?', nao: { t: 'proc', x: 'Enviar para aprovação do gestor', volta: 'se aprovado, volta para o pedido' } },
      { t: 'proc', x: 'Emitir pedido de compra' },
      { t: 'proc', x: 'Receber mercadoria e nota fiscal' },
      { t: 'dec', x: 'NF confere com o pedido?', nao: { t: 'proc', x: 'Recusar e abrir divergência com o fornecedor', volta: 'volta para recebimento' } },
      { t: 'proc', x: 'Dar entrada no estoque' },
      { t: 'fim', x: 'Estoque reposto' },
    ],
    regras: ['Ponto de pedido = consumo diário × prazo de entrega + estoque de segurança.', 'Mínimo de 3 cotações por compra.', 'Comparar pelo custo total com frete, não pelo preço unitário.', 'Compras acima da alçada exigem aprovação do gestor.', 'Conferir quantidade, item e preço da nota antes da entrada.'],
  },
};

function mostrarFluxo(id) {
  const f = FLUXOS[id];
  $('#titulo-fluxo').textContent = f.titulo;
  const classe = { ini: 'ini', fim: 'fim', proc: 'proc', dec: 'dec' };
  $('#fluxo').innerHTML = f.nos.map((n, i) => {
    const conector = i ? `<li class="passo" aria-hidden="true"><span class="desce">${f.nos[i - 1].t === 'dec' ? '<i>Sim</i>' : ''}</span></li>` : '';
    const ramo = n.nao ? `<div class="ramo"><span class="seta-lado"><i>Não</i></span><div class="no ${classe[n.nao.t]}${n.nao.t === 'fim' ? ' neg' : ''}">${esc(n.nao.x)}${n.nao.volta ? `<span class="volta">↩ ${esc(n.nao.volta)}</span>` : ''}</div></div>` : '';
    const rotulo = n.t === 'dec' ? `Decisão: ${n.x} Se sim, segue. Se não: ${n.nao.x}${n.nao.volta ? ', ' + n.nao.volta : ''}.` : n.x;
    return `${conector}<li class="passo" aria-label="${esc(rotulo)}"><div class="no ${classe[n.t]}"><span>${esc(n.x)}${n.s ? `<small>${esc(n.s)}</small>` : ''}</span></div>${ramo}</li>`;
  }).join('');
  $('#regras').innerHTML = f.regras.map((r) => `<li>${esc(r)}</li>`).join('');
}

/* ================= Inicialização ================= */
$('#seletor-doc').innerHTML = Object.entries(DOCS).map(([id, d]) => `<button type="button" role="tab" data-doc="${id}"><b>${d.nome}</b><span>${d.resumo}</span></button>`).join('');
$('#seletor-doc').addEventListener('click', (e) => { const b = e.target.closest('[data-doc]'); if (b) montarForm(b.dataset.doc); });
$('#form-doc').addEventListener('input', atualizar);
$('#form-doc').addEventListener('change', atualizar);
$('#btn-exemplo').addEventListener('click', carregarExemplo);
$('#btn-limpar').addEventListener('click', () => montarForm(docAtual));
$('#btn-pdf').addEventListener('click', () => imprimir($('#folha'), EXTRAS[docAtual].pdf(valores())));
$('#btn-copiar').addEventListener('click', copiarEmail);
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-exemplo]')) carregarExemplo();
  const a = e.target.closest('[data-anexo]');
  if (a) abrirAnexo(+a.dataset.anexo);
  if (e.target.closest('[data-fechar-anexo]') || e.target === $('#visor-anexo')) $('#visor-anexo').close();
});

$('#sel-fluxo').innerHTML = Object.entries(FLUXOS).map(([id, f]) => `<option value="${id}">${f.titulo}</option>`).join('');
$('#sel-fluxo').addEventListener('change', (e) => mostrarFluxo(e.target.value));
$('#btn-pdf-fluxo').addEventListener('click', () => imprimir($('#area-fluxo'), 'Fluxograma_' + arquivo(FLUXOS[$('#sel-fluxo').value].titulo)));

/* Links #doc-<id> (abre o documento já com o exemplo) e #fluxo-<id>, usados pelos projetos do site */
function rotear() {
  const [, tipo, id] = location.hash.match(/^#(doc|fluxo)-(\w+)$/) || [];
  if (tipo === 'doc' && DOCS[id]) { montarForm(id); carregarExemplo(); $('#documentos').scrollIntoView(); }
  if (tipo === 'fluxo' && FLUXOS[id]) { $('#sel-fluxo').value = id; mostrarFluxo(id); $('#fluxos').scrollIntoView(); }
}
window.addEventListener('hashchange', rotear);
montarForm('renovacao');
mostrarFluxo('fianca');
rotear();

/* Autoteste das regras de cálculo (aparece no console se algo quebrar) */
(() => {
  const r = DOCS.renovacao.calcular({ premioAtual: 1000, vencimento: isoMais(30), seg0: 'A', pre0: 900, ok0: true, seg1: 'B', pre1: 800, ok1: false, seg2: 'C', pre2: 950, ok2: true });
  console.assert(r.rec.seg === 'A' && r.eco === 100 && r.dias === 30, 'renovação: recomendação errada', r);
  console.assert(DOCS.fianca.render({ aluguel: 1000, condominio: 0, iptu: 0, renda: 2000, dId: 1, dRenda: 1, dResid: 1, dFicha: 1, cpf: '', imobiliaria: '' }).status[0] === 'erro', 'fiança: regra de 3x');
})();
