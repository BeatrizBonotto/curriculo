// Tradução da apresentação (EN/ES). Os textos que vêm do site já chegam no idioma da página;
// aqui ficam só os textos escritos na própria apresentação. Um observador troca cada texto em
// português pela versão do idioma assim que ele aparece (slides, roteiro, balões, galeria, botões).
const DIC = [
[
"Modo apresentação",
"Presentation mode",
"Modo presentación"
],
[
"Qual é o foco desta conversa?",
"What is the focus of this conversation?",
"¿Cuál es el foco de esta conversación?"
],
[
"Escolha o tema",
"Choose the topic",
"Elige el tema"
],
[
"Escolha o foco da conversa. A apresentação mostra só os casos e projetos dessa área.",
"Pick the focus of the conversation. The presentation shows only the cases and projects of that area.",
"Elige el foco de la conversación. La presentación muestra solo los casos y proyectos de esa área."
],
[
"Escolha a área da vaga. A apresentação mostra só os casos e projetos dessa área.",
"Pick the area of the role. The presentation shows only the cases and projects of that area.",
"Elige el área de la vacante. La presentación muestra solo los casos y proyectos de esa área."
],
[
"Roteiro",
"Script",
"Guion"
],
[
"Sair",
"Exit",
"Salir"
],
[
"Roteiro (N)",
"Script (N)",
"Guion (N)"
],
[
"Sair (Esc)",
"Exit (Esc)",
"Salir (Esc)"
],
[
"Anterior",
"Previous",
"Anterior"
],
[
"Próximo",
"Next",
"Siguiente"
],
[
"Fechar",
"Close",
"Cerrar"
],
[
"Tamanho do texto",
"Text size",
"Tamaño del texto"
],
[
"Diminuir texto",
"Smaller text",
"Reducir texto"
],
[
"Aumentar texto",
"Larger text",
"Aumentar texto"
],
[
"Imagem anterior",
"Previous image",
"Imagen anterior"
],
[
"Próxima imagem",
"Next image",
"Imagen siguiente"
],
[
"pausa para perguntas",
"pause for questions",
"pausa para preguntas"
],
[
"Sobre",
"About",
"Sobre mí"
],
[
"Quem sou",
"Who I am",
"Quién soy"
],
[
"Missão, visão e valores.",
"Mission, vision and values.",
"Misión, visión y valores."
],
[
"Carreira",
"Career",
"Carrera"
],
[
"anos de experiência",
"years of experience",
"años de experiencia"
],
[
"empresas",
"companies",
"empresas"
],
[
"Toque numa barra para ver os detalhes",
"Tap a bar to see the details",
"Toca una barra para ver los detalles"
],
[
"Linha do tempo da carreira",
"Career timeline",
"Línea de tiempo de la carrera"
],
[
"Formação",
"Education",
"Formación"
],
[
"Técnico, graduação e cursos.",
"Technical school, degree and courses.",
"Técnico, grado y cursos."
],
[
"Formação acadêmica",
"Academic background",
"Formación académica"
],
[
"Cursos e certificações",
"Courses and certifications",
"Cursos y certificaciones"
],
[
"Formação e certificações estão na página Trajetória do site.",
"Education and certifications are on the Journey section of the site.",
"La formación y las certificaciones están en la sección Trayectoria del sitio."
],
[
"Case de sucesso",
"Success case",
"Caso de éxito"
],
[
"Onde",
"Where",
"Dónde"
],
[
"Problema",
"Problem",
"Problema"
],
[
"Solução",
"Solution",
"Solución"
],
[
"Impacto",
"Impact",
"Impacto"
],
[
"Ampliar",
"Enlarge",
"Ampliar"
],
[
"Pausa",
"Pause",
"Pausa"
],
[
"Alguma pergunta até aqui?",
"Any questions so far?",
"¿Alguna pregunta hasta aquí?"
],
[
"Posso detalhar qualquer caso antes de seguir.",
"I can go deeper into any case before moving on.",
"Puedo detallar cualquier caso antes de seguir."
],
[
"Pare de verdade e espere. Se não houver perguntas, pergunte qual dos casos mais se parece com o dia a dia da vaga.",
"Really stop and wait. If there are no questions, ask which case is closest to the day to day of the role.",
"Detente de verdad y espera. Si no hay preguntas, pregunta cuál de los casos se parece más al día a día de la vacante."
],
[
"Feedbacks",
"Feedback",
"Opiniones"
],
[
"Projetos",
"Projects",
"Proyectos"
],
[
"O que eu entrego",
"What I deliver",
"Lo que entrego"
],
[
"Perguntas finais? Fico à disposição.",
"Any final questions? I am at your disposal.",
"¿Preguntas finales? Quedo a disposición."
],
[
"Pós-graduação",
"Postgraduate",
"Posgrado"
],
[
"Graduação",
"Bachelor's degree",
"Grado"
],
[
"Curso técnico",
"Technical course",
"Curso técnico"
],
[
"Curso livre",
"Short course",
"Curso libre"
],
[
"Desenvolvimento",
"Development",
"Desarrollo"
],
[
"Administração",
"Administration",
"Administración"
],
[
"Seguros",
"Insurance",
"Seguros"
],
[
"Analista Administrativa",
"Administrative Analyst",
"Analista Administrativa"
],
[
"Analista de Seguros",
"Insurance Analyst",
"Analista de Seguros"
],
[
"Tecnologia · Informática para Internet",
"Technology · Web Development",
"Tecnología · Informática para Internet"
],
[
"Deixe o vídeo rodar. Quando o nome aparecer, cumprimente e agradeça o tempo. Diga o que vai mostrar: quem você é, sua carreira e casos reais. Avise que vai pausar para perguntas.",
"Let the video play. When your name appears, greet them and thank them for their time. Say what you will show: who you are, your career and real cases. Tell them you will pause for questions.",
"Deja correr el video. Cuando aparezca tu nombre, saluda y agradece el tiempo. Di lo que vas a mostrar: quién eres, tu carrera y casos reales. Avisa que harás pausas para preguntas."
],
[
"Organização, atendimento consultivo e processo bem documentado.",
"Organization, consultative service and well-documented processes.",
"Organización, atención consultiva y procesos bien documentados."
],
[
"Organização",
"Organization",
"Organización"
],
[
"Rotinas com prazo, checklist e registro de cada etapa.",
"Routines with deadlines, checklists and a record of every step.",
"Rutinas con plazo, checklist y registro de cada etapa."
],
[
"Atendimento consultivo",
"Consultative service",
"Atención consultiva"
],
[
"Explico as opções com clareza para o cliente decidir com segurança.",
"I explain the options clearly so the client can decide with confidence.",
"Explico las opciones con claridad para que el cliente decida con seguridad."
],
[
"Conformidade",
"Compliance",
"Cumplimiento"
],
[
"LGPD, normas da SUSEP e padrão oficial de redação.",
"LGPD (data protection), SUSEP rules and the official writing standard.",
"LGPD (protección de datos), normas de la SUSEP y estándar oficial de redacción."
],
[
"Apresente-se em até 1 minuto: formação, anos de experiência e o que procura agora. Ligue com a vaga: diga por que ela faz sentido para você.",
"Introduce yourself in up to 1 minute: education, years of experience and what you are looking for now. Connect it to the role: say why it makes sense for you.",
"Preséntate en hasta 1 minuto: formación, años de experiencia y lo que buscas ahora. Conéctalo con la vacante: di por qué tiene sentido para ti."
],
[
"Fale da missão com suas palavras e dê um exemplo real de cada valor no trabalho. Isso responde \"como você trabalha?\" antes da pergunta.",
"Talk about the mission in your own words and give a real work example for each value. It answers \"how do you work?\" before they ask.",
"Habla de la misión con tus palabras y da un ejemplo real de cada valor en el trabajo. Responde \"¿cómo trabajas?\" antes de la pregunta."
],
[
"Do apoio administrativo à análise de seguros.",
"From administrative support to insurance analysis.",
"Del apoyo administrativo al análisis de seguros."
],
[
"Conte como uma evolução: cada experiência somou uma habilidade. Destaque o crescimento dentro da Dínamo, de estagiária a analista.",
"Tell it as an evolution: each job added a skill. Highlight your growth at Dínamo, from intern to analyst.",
"Cuéntalo como una evolución: cada experiencia sumó una habilidad. Destaca el crecimiento dentro de Dínamo, de pasante a analista."
],
[
"Diga o que cada formação somou: o técnico em informática deu base prática de web, a graduação em administração deu visão de gestão e processo. Cite um curso que mudou sua forma de trabalhar.",
"Say what each step added: the IT technical course gave hands-on web skills, the business degree gave a management and process view. Mention a course that changed the way you work.",
"Di lo que sumó cada formación: el técnico en informática dio base práctica de web y el grado en administración dio visión de gestión y procesos. Cita un curso que cambió tu forma de trabajar."
],
[
"Renovação sem deixar apólice vencer.",
"Renewals without letting any policy expire.",
"Renovación sin dejar vencer ninguna póliza."
],
[
"Muitas renovações de Ramos Elementares vencendo ao mesmo tempo.",
"Many property and casualty renewals expiring at the same time.",
"Muchas renovaciones de ramos generales venciendo al mismo tiempo."
],
[
"Régua com alerta 45 dias antes, cotação em 3 seguradoras e proposta com comparativo de prêmio e coberturas.",
"A schedule with an alert 45 days before, quotes from 3 insurers and a proposal comparing premium and coverage.",
"Calendario con alerta 45 días antes, cotización en 3 aseguradoras y propuesta con comparativo de prima y coberturas."
],
[
"Renovações tratadas antes do vencimento e cliente decidindo com clareza.",
"Renewals handled before expiry and clients deciding with clarity.",
"Renovaciones tratadas antes del vencimiento y clientes decidiendo con claridad."
],
[
"Sem renovação, a cobertura termina às 24h do último dia de vigência.",
"Without renewal, coverage ends at midnight on the last day of the term.",
"Sin renovación, la cobertura termina a las 24 h del último día de vigencia."
],
[
"Explique como compara propostas: prêmio, franquia, coberturas e parcelamento. Diga como conduz o contato consultivo.",
"Explain how you compare proposals: premium, deductible, coverage and installments. Say how you lead the consultative contact.",
"Explica cómo comparas propuestas: prima, deducible, coberturas y cuotas. Di cómo conduces el contacto consultivo."
],
[
"Proposta de renovação com comparativo",
"Renewal proposal with comparison",
"Propuesta de renovación con comparativo"
],
[
"Análise que não trava a locação.",
"An analysis that does not hold up the rental.",
"Un análisis que no frena el alquiler."
],
[
"Pedidos urgentes das imobiliárias, com documentação incompleta.",
"Urgent requests from real estate agencies, with incomplete documents.",
"Pedidos urgentes de las inmobiliarias, con documentación incompleta."
],
[
"Checklist de documentos e regra de renda (pelo menos 3x o aluguel com encargos) antes de enviar à seguradora.",
"Document checklist and income rule (at least 3x the rent plus charges) before sending to the insurer.",
"Checklist de documentos y regla de ingresos (al menos 3 veces el alquiler con gastos) antes de enviar a la aseguradora."
],
[
"Menos idas e vindas com a seguradora e locação liberada mais rápido.",
"Less back and forth with the insurer and rentals approved faster.",
"Menos idas y vueltas con la aseguradora y alquiler liberado más rápido."
],
[
"Lei 8.245/91: arts. 37 e 41 (garantias) e art. 22, VIII (seguro contra incêndio).",
"Brazilian Tenancy Law 8.245/91: arts. 37 and 41 (guarantees) and art. 22, VIII (fire insurance).",
"Ley brasileña 8.245/91: arts. 37 y 41 (garantías) y art. 22, VIII (seguro contra incendio)."
],
[
"Se a renda não fecha, cite as saídas: composição de renda ou outra garantia, já que a lei não permite duas no mesmo contrato.",
"If the income does not match, mention the options: combining incomes or another guarantee, since the law does not allow two in the same contract.",
"Si los ingresos no alcanzan, cita las salidas: composición de ingresos u otra garantía, ya que la ley no permite dos en el mismo contrato."
],
[
"Análise de Seguro Fiança",
"Rent guarantee insurance analysis",
"Análisis de seguro de caución"
],
[
"Documento encontrado pelo protocolo em minutos.",
"Documents found by protocol number in minutes.",
"Documento encontrado por el protocolo en minutos."
],
[
"Alto volume de documentos físicos e risco de extravio.",
"A high volume of paper documents and a risk of losing them.",
"Alto volumen de documentos físicos y riesgo de extravío."
],
[
"Triagem, conferência, digitalização, indexação por protocolo e ofícios no padrão oficial.",
"Sorting, checking, scanning, indexing by protocol number and letters in the official format.",
"Clasificación, revisión, digitalización, indexación por protocolo y oficios en el formato oficial."
],
[
"Localização rápida e comunicação interna padronizada.",
"Fast retrieval and standardized internal communication.",
"Localización rápida y comunicación interna estandarizada."
],
[
"Fecho: Respeitosamente para autoridade superior; Atenciosamente para a mesma hierarquia.",
"Closing: \"Respectfully\" for a higher authority; \"Kind regards\" for the same level.",
"Cierre: \"Respetuosamente\" para autoridad superior; \"Atentamente\" para la misma jerarquía."
],
[
"Explique o fluxo documental e por que indexar por protocolo evita retrabalho.",
"Explain the document flow and why indexing by protocol number avoids rework.",
"Explica el flujo documental y por qué indexar por protocolo evita retrabajo."
],
[
"Ofício no padrão oficial",
"Official letter in the official format",
"Oficio en el formato oficial"
],
[
"Estoque acima do mínimo e planilhas no mesmo padrão.",
"Stock above the minimum and spreadsheets in the same format.",
"Stock por encima del mínimo y hojas de cálculo con el mismo patrón."
],
[
"Falta de suprimentos e planilhas em formatos diferentes entre áreas.",
"Supply shortages and spreadsheets in different formats across areas.",
"Falta de suministros y hojas de cálculo con formatos distintos entre áreas."
],
[
"Ponto de pedido, cotação com 3 fornecedores e padrão único de colunas com validação.",
"Reorder point, quotes from 3 suppliers and a single column standard with validation.",
"Punto de pedido, cotización con 3 proveedores y un patrón único de columnas con validación."
],
[
"Reposição antes de faltar e lançamentos com menos correções.",
"Restocking before running out and entries with fewer corrections.",
"Reposición antes de que falte y registros con menos correcciones."
],
[
"Ponto de pedido = consumo diário × prazo de entrega + estoque de segurança.",
"Reorder point = daily usage × delivery time + safety stock.",
"Punto de pedido = consumo diario × plazo de entrega + stock de seguridad."
],
[
"Mostre que sabe calcular o ponto de pedido e por que comparar pelo custo total com frete.",
"Show that you can calculate the reorder point and why to compare by total cost including freight.",
"Muestra que sabes calcular el punto de pedido y por qué comparar por el costo total con flete."
],
[
"Requisição com ponto de pedido",
"Purchase request with reorder point",
"Solicitud con punto de pedido"
],
[
"Uma ferramenta feita para o meu dia a dia.",
"A tool built for my daily work.",
"Una herramienta hecha para mi día a día."
],
[
"Documentos parecidos refeitos à mão, com risco de esquecer regra, anexo ou fecho.",
"Similar documents redone by hand, with the risk of forgetting a rule, attachment or closing.",
"Documentos parecidos rehechos a mano, con riesgo de olvidar una regla, un anexo o el cierre."
],
[
"Página em HTML, CSS e JavaScript que gera o e-mail de envio e o documento em PDF a partir de um formulário.",
"An HTML, CSS and JavaScript page that turns a form into the cover email and the PDF document.",
"Página en HTML, CSS y JavaScript que genera el correo de envío y el documento en PDF a partir de un formulario."
],
[
"Padrão único, cálculos prontos e nenhum dado sai do navegador (LGPD).",
"A single standard, ready-made calculations and no data leaves the browser (LGPD).",
"Un patrón único, cálculos listos y ningún dato sale del navegador (LGPD)."
],
[
"Mostre a ferramenta ao vivo se der: gere uma proposta de renovação com o exemplo.",
"Show the tool live if you can: generate a renewal proposal with the example.",
"Muestra la herramienta en vivo si puedes: genera una propuesta de renovación con el ejemplo."
],
[
"O que dizem os clientes.",
"What clients say.",
"Lo que dicen los clientes."
],
[
"Leia um trecho curto de uma avaliação. Relacione com o atendimento consultivo.",
"Read a short part of a review. Link it to consultative service.",
"Lee un fragmento corto de una reseña. Relaciónalo con la atención consultiva."
],
[
"Casos documentados.",
"Documented cases.",
"Casos documentados."
],
[
"Passe pelas imagens: e-mail ao cliente, documento em PDF e fluxograma de cada caso.",
"Go through the images: email to the client, PDF document and flowchart of each case.",
"Pasa por las imágenes: correo al cliente, documento en PDF y diagrama de flujo de cada caso."
],
[
"Por que posso somar à equipe.",
"Why I can add to the team.",
"Por qué puedo sumar al equipo."
],
[
"Processo sob controle",
"Process under control",
"Proceso bajo control"
],
[
"Prazos, checklist e registro: nada se perde no caminho.",
"Deadlines, checklists and records: nothing gets lost along the way.",
"Plazos, checklist y registro: nada se pierde en el camino."
],
[
"Atendimento que gera confiança",
"Service that builds trust",
"Atención que genera confianza"
],
[
"Explico com clareza e acompanho até resolver.",
"I explain clearly and follow up until it is solved.",
"Explico con claridad y acompaño hasta resolver."
],
[
"Melhoria contínua",
"Continuous improvement",
"Mejora continua"
],
[
"Quando algo se repete, padronizo e automatizo.",
"When something repeats, I standardize and automate it.",
"Cuando algo se repite, lo estandarizo y automatizo."
],
[
"Resuma o valor em três frases. Depois faça suas perguntas: como a equipe trabalha hoje, qual o maior desafio da vaga e quais os próximos passos.",
"Sum up your value in three sentences. Then ask your questions: how the team works today, the biggest challenge of the role and the next steps.",
"Resume tu valor en tres frases. Luego haz tus preguntas: cómo trabaja el equipo hoy, cuál es el mayor desafío de la vacante y cuáles son los próximos pasos."
],
[
"Obrigada",
"Thank you",
"Gracias"
],
[
"Agradeça. Combine o próximo passo e o prazo de retorno. Mostre o QR code para acessarem o site.",
"Thank them. Agree on the next step and when you will hear back. Show the QR code so they can open the site.",
"Agradece. Acuerda el próximo paso y el plazo de respuesta. Muestra el código QR para que accedan al sitio."
],
[
"carteira de imobiliárias parceiras",
"portfolio of partner real estate agencies",
"cartera de inmobiliarias asociadas"
],
[
"imobiliárias parceiras",
"partner real estate agencies",
"inmobiliarias asociadas"
],
[
"ferramenta própria",
"own tool",
"herramienta propia"
],
[
"TI",
"IT",
"TI"
]
];
const PALAVRAS = [["Presencial", "On-site", "Presencial"], ["Remoto", "Remote", "Remoto"], ["Híbrido", "Hybrid", "Híbrido"], ["Estágio", "Internship", "Prácticas"], ["Aprendiz", "Apprentice", "Aprendiz"], ["atual", "present", "actual"]];
const MESES = { pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'], en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'] };

const lang = () => document.documentElement.dataset.lang || 'pt';
const k = () => (lang() === 'en' ? 1 : 2);
const mapa = new Map(DIC.map(l => [l[0], l]));
const longos = DIC.filter(l => l[0].length >= 12 && l[0].includes(' ')).sort((a, b) => b[0].length - a[0].length);

// textos que mudam com números (contadores, períodos, durações)
function regras(t) {
  const en = lang() === 'en';
  const mes = new RegExp(`\\b(${MESES.pt.join('|')}) (\\d{4})\\b`, 'g');
  return t
    .replace(/^Ver (\d+) imagens$/, en ? 'View $1 images' : 'Ver $1 imágenes')
    .replace(/ · (\d+) de (\d+)$/, en ? ' · $1 of $2' : ' · $1 de $2')
    .replace(/^desde (\d{4})$/, en ? 'since $1' : 'desde $1')
    .replace(/^(\d{4}) a (\d{4})$/, en ? '$1 to $2' : '$1 a $2')
    .replace(mes, (_, m, a) => `${MESES[lang()][MESES.pt.indexOf(m)]} ${a}`)
    .replace(/ a hoje\b/, en ? ' to present' : ' a hoy')
    .replace(/(\w{3} \d{4}) a (\w{3} \d{4})/, en ? '$1 to $2' : '$1 a $2')
    .replace(/\b(\d+) anos\b/g, en ? '$1 years' : '$1 años').replace(/\b1 ano\b/g, en ? '1 year' : '1 año')
    .replace(/\b(\d+) meses\b/g, en ? '$1 months' : '$1 meses').replace(/\b1 mês\b/g, en ? '1 month' : '1 mes')
    .replace(/(years?|años?) e (\d)/, en ? '$1 and $2' : '$1 y $2')
    .replace(/ → atual\b/, en ? ' → present' : ' → actual');
}

export function tr(t) {
  if (lang() === 'pt' || !t) return t;
  const limpo = t.trim();
  const exato = mapa.get(limpo);
  if (exato) return t.replace(limpo, exato[k()]);
  let s = t;
  for (const l of longos) if (s.includes(l[0])) s = s.split(l[0]).join(l[k()]);
  for (const [pt, ...outros] of PALAVRAS) s = s.replace(new RegExp(`(^|[^\\p{L}])${pt}(?=$|[^\\p{L}])`, 'gu'), `$1${outros[k() - 1]}`);
  return regras(s);
}

const ATRIBUTOS = ['aria-label', 'title', 'alt', 'placeholder'];
function traduzirNo(no) {
  if (no.nodeType === 3) { const n = tr(no.nodeValue); if (n !== no.nodeValue) no.nodeValue = n; return; }
  if (no.nodeType !== 1) return;
  for (const a of ATRIBUTOS) if (no.hasAttribute(a)) { const v = no.getAttribute(a), n = tr(v); if (n !== v) no.setAttribute(a, n); }
  no.childNodes.forEach(traduzirNo);
}

// liga a tradução num elemento (a raiz da apresentação) e devolve a função que desliga
export function traduzirApresentacao(raiz) {
  if (lang() === 'pt') return () => {};
  traduzirNo(raiz);
  const obs = new MutationObserver(ms => ms.forEach(m => {
    if (m.type === 'characterData') traduzirNo(m.target);
    else if (m.type === 'attributes') traduzirNo(m.target);
    else m.addedNodes.forEach(traduzirNo);
  }));
  obs.observe(raiz, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATRIBUTOS });
  return () => obs.disconnect();
}
