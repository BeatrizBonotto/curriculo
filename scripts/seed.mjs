// Popula o Supabase da Beatriz com o conteúdo inicial (fatos de seed/administrativo.json e seed/ti.json).
// Idempotente: apaga e recria o conteúdo das tabelas abaixo. Depois disso, edite pelo /admin.
// Uso: node scripts/seed.mjs && node scripts/prints-projetos.mjs   (o seed recria os projetos sem capa)
import { adminClient } from './supabase-admin.mjs';

const sb = await adminClient();
const tr = (en, es) => ({ en, es });

const perfil = {
  primeiro_nome: 'Beatriz', sobrenome: 'G. Souza Bonotto', nome_completo: 'Beatriz G. Souza Bonotto',
  data_nascimento: '1998-03-14', local: 'Campinas-SP', pais: 'Brasil', ocupacao: 'Analista Administrativa',
  email: 'beatrizsouzag@outlook.com', telefone: '+55 (19) 99103-5924',
  linkedin_url: 'https://linkedin.com/in/beatrizsouza-adm', github_url: 'https://github.com/BeatrizBonotto',
};

// linhas "- item" viram um parágrafo "Atividades: a; b; c." (no currículo, "- " marca subtítulo em negrito)
function atividades(txt, rotulo) {
  const [corpo, ...itens] = txt.split('\n- ');
  return itens.length ? `${corpo}\n${rotulo}: ${itens.map((x, i) => (i ? x.charAt(0).toLowerCase() + x.slice(1) : x)).join('; ')}.` : txt;
}
const DINAMO = 'Dínamo Seguros';
const descDinamo = 'Cotações de seguros novos e renovações de todo ramo elementar. Administro seguros da carteira de clientes de imobiliárias parceiras. Atendimento ao cliente, fechamento de seguros, acompanhamento de emissões e resoluções com seguradoras.';
const descDinamoEn = 'Quotes for new policies and renewals across all property and casualty lines. I manage the insurance portfolio of partner real estate agencies. Customer service, closing policies, following up on issuance and resolving cases with insurers.';
const descDinamoEs = 'Cotizaciones de seguros nuevos y renovaciones de todos los ramos generales. Administro los seguros de la cartera de inmobiliarias asociadas. Atención al cliente, cierre de seguros, seguimiento de emisiones y gestiones con aseguradoras.';
const experiencias = [
  { instituicao: DINAMO, titulo: 'Analista de Seguros PL', regime: 'CLT', data_inicio: '2025-08-01', atual: true, ordem: 1,
    descricao: `${descDinamo}\n- Controle de prazos, pendências e acompanhamento de demandas\n- Planilhas de acompanhamento e cadastros sempre atualizados\n- Contato com parceiros e seguradoras até a resolução`,
    i18n: tr({ titulo: 'Insurance Analyst (mid-level)', descricao: `${descDinamoEn}\n- Tracking deadlines, pending items and requests\n- Follow-up spreadsheets and records kept up to date\n- Contact with partners and insurers until each case is solved`, tipo_local: 'On-site' },
      { titulo: 'Analista de Seguros (semi senior)', descricao: `${descDinamoEs}\n- Control de plazos, pendientes y seguimiento de solicitudes\n- Planillas de seguimiento y registros siempre actualizados\n- Contacto con socios y aseguradoras hasta la resolución`, tipo_local: 'Presencial' }) },
  { instituicao: DINAMO, titulo: 'Auxiliar Administrativa', regime: 'CLT', data_inicio: '2020-11-01', data_fim: '2025-08-01', ordem: 2,
    descricao: `${descDinamo}\n- Recebimento, separação, digitalização e arquivo de documentos\n- Emissão de boletos e envio de documentos\n- Planilhas e controles internos`,
    i18n: tr({ titulo: 'Administrative Assistant', descricao: `${descDinamoEn}\n- Receiving, sorting, scanning and filing documents\n- Issuing payment slips and sending documents\n- Spreadsheets and internal controls`, tipo_local: 'On-site' },
      { titulo: 'Auxiliar Administrativa', descricao: `${descDinamoEs}\n- Recepción, clasificación, digitalización y archivo de documentos\n- Emisión de boletos y envío de documentos\n- Planillas y controles internos`, tipo_local: 'Presencial' }) },
  { instituicao: DINAMO, titulo: 'Estagiária Administrativa', regime: 'Estágio', data_inicio: '2020-08-01', data_fim: '2020-11-01', ordem: 3,
    descricao: 'Emissão de boletos, controle de arquivos, envio de documentos e cotações de seguros. Apoio às demandas administrativas da empresa.',
    i18n: tr({ titulo: 'Administrative Intern', regime: 'Internship', descricao: 'Issuing payment slips, managing files, sending documents and insurance quotes. Support for the company’s administrative tasks.', tipo_local: 'On-site' },
      { titulo: 'Pasante Administrativa', regime: 'Pasantía', descricao: 'Emisión de boletos, control de archivos, envío de documentos y cotizaciones de seguros. Apoyo en las tareas administrativas de la empresa.', tipo_local: 'Presencial' }) },
  { instituicao: 'Instituto Nacional do Seguro Social (INSS)', titulo: 'Estagiária Administrativa', regime: 'Estágio', data_inicio: '2019-04-01', data_fim: '2020-04-01', ordem: 4,
    descricao: 'Elaboração de memorandos e ofícios, emissão e digitalização de documentos, organização de arquivos de processos.',
    i18n: tr({ titulo: 'Administrative Intern', regime: 'Internship', instituicao: 'INSS, Brazil’s National Social Security Institute', descricao: 'Drafting memos and official letters, issuing and scanning documents, organizing case files.', tipo_local: 'On-site' },
      { titulo: 'Pasante Administrativa', regime: 'Pasantía', instituicao: 'INSS, Instituto Nacional del Seguro Social de Brasil', descricao: 'Redacción de memorandos y oficios, emisión y digitalización de documentos, organización de archivos de expedientes.', tipo_local: 'Presencial' }) },
  { instituicao: 'Tecnoset', titulo: 'Aprendiz Administrativa', regime: 'Aprendiz', data_inicio: '2015-10-01', data_fim: '2016-10-01', ordem: 5,
    descricao: 'Anexava documentos, atendia clientes, elaborava planilhas e apresentações, monitorava suprimentos e o encerramento de atendimentos.',
    i18n: tr({ titulo: 'Administrative Apprentice', regime: 'Apprentice', descricao: 'Attached documents, served customers, built spreadsheets and presentations, monitored supplies and the closing of service tickets.', tipo_local: 'On-site' },
      { titulo: 'Aprendiz Administrativa', regime: 'Aprendiz', descricao: 'Adjuntaba documentos, atendía clientes, elaboraba planillas y presentaciones, controlaba suministros y el cierre de atenciones.', tipo_local: 'Presencial' }) },
  { instituicao: 'Claro Brasil', titulo: 'Aprendiz Administrativa', regime: 'Aprendiz', data_inicio: '2013-10-01', data_fim: '2014-10-01', ordem: 6,
    descricao: 'Criação de planilhas, suporte ao setor administrativo, organização de arquivos e inserção de dados em sistema.',
    i18n: tr({ titulo: 'Administrative Apprentice', regime: 'Apprentice', descricao: 'Built spreadsheets, supported the administrative team, organized files and entered data into the system.', tipo_local: 'On-site' },
      { titulo: 'Aprendiz Administrativa', regime: 'Aprendiz', descricao: 'Creación de planillas, apoyo al sector administrativo, organización de archivos e ingreso de datos en el sistema.', tipo_local: 'Presencial' }) },
].map(e => ({ local: 'Campinas-SP', tipo_local: 'Presencial', categoria_profissional: 'ADM', atual: false, data_fim: null, visivel: true, ...e }))
  .map(e => ({ ...e, descricao: atividades(e.descricao, 'Atividades'), i18n: { en: { ...e.i18n.en, descricao: atividades(e.i18n.en.descricao, 'Main tasks') }, es: { ...e.i18n.es, descricao: atividades(e.i18n.es.descricao, 'Actividades') } } }));

const formacoes = [
  { instituicao: 'Politécnica Brasileira', curso: 'Técnico em Informática para Internet', tipo_academico: 'tecnico', data_inicio: '2023-11-01', data_fim: '2025-05-01', ordem: 1,
    descricao: 'Formação prática e teórica em desenvolvimento web: HTML, CSS, JavaScript, lógica de programação, design responsivo, banco de dados, metodologias ágeis e testes de software.',
    i18n: tr({ curso: 'Technical Diploma in Web Development', descricao: 'Hands-on and theoretical training in web development: HTML, CSS, JavaScript, programming logic, responsive design, databases, agile methods and software testing.' },
      { curso: 'Técnico en Informática para Internet', descricao: 'Formación práctica y teórica en desarrollo web: HTML, CSS, JavaScript, lógica de programación, diseño responsivo, bases de datos, metodologías ágiles y pruebas de software.' }) },
  { instituicao: 'Anhanguera Educacional', curso: 'Administração de Empresas', tipo_academico: 'bacharel', data_inicio: '2019-06-01', data_fim: '2023-06-01', ordem: 2,
    descricao: 'Gestão estratégica, finanças, recursos humanos, marketing, logística e planejamento empresarial.',
    i18n: tr({ curso: 'Business Administration', descricao: 'Strategic management, finance, human resources, marketing, logistics and business planning.' },
      { curso: 'Administración de Empresas', descricao: 'Gestión estratégica, finanzas, recursos humanos, marketing, logística y planificación empresarial.' }) },
  { instituicao: 'Senac Brasil', curso: 'Serviços Administrativos', tipo_academico: 'tecnico', data_inicio: '2015-10-01', data_fim: '2016-10-01', ordem: 3,
    descricao: 'Rotinas administrativas, atendimento ao cliente, organização de documentos e ferramentas de escritório.',
    i18n: tr({ curso: 'Administrative Services', descricao: 'Administrative routines, customer service, document management and office tools.' },
      { curso: 'Servicios Administrativos', descricao: 'Rutinas administrativas, atención al cliente, organización de documentos y herramientas de oficina.' }) },
  { instituicao: 'Senac Brasil', curso: 'Gestão de Negócios', tipo_academico: 'cursolivre', data_inicio: '2013-10-01', data_fim: '2014-10-01', ordem: 4,
    descricao: 'Introdução à gestão empresarial, planejamento estratégico, empreendedorismo, marketing e operações.',
    i18n: tr({ curso: 'Business Management', descricao: 'Introduction to business management, strategic planning, entrepreneurship, marketing and operations.' },
      { curso: 'Gestión de Negocios', descricao: 'Introducción a la gestión empresarial, planificación estratégica, emprendimiento, marketing y operaciones.' }) },
].map(f => ({ tipo_local: 'Presencial', atual: false, visivel: true, ...f }));

const certificacoes = [
  ['Jornada da Inteligência Profissional', 'Professional Intelligence Journey', 'Jornada de la Inteligencia Profesional'],
  ['Produtividade Inteligente', 'Smart Productivity', 'Productividad Inteligente'],
  ['Semana do Excel', 'Excel Week', 'Semana de Excel'],
  ['Argumentação persuasiva', 'Persuasive Argumentation', 'Argumentación persuasiva'],
  ['Comunicação e pensamento assertivo', 'Assertive Communication and Thinking', 'Comunicación y pensamiento asertivo'],
].map(([nome, en, es], i) => ({ nome, instituicao: 'Plataforma online', data_certificacao: '2024-01-01', validade: 'Vitalícia', ordem: i + 1, visivel: true,
  i18n: tr({ nome: en, instituicao: 'Online platform', validade: 'Lifetime' }, { nome: es, instituicao: 'Plataforma en línea', validade: 'Vitalicia' }) }));

const hard = [
  ['Administrativo', 'Administrative', 'Administrativo', [
    ['Rotinas administrativas', 'Administrative routines', 'Rutinas administrativas'],
    ['Atendimento ao cliente', 'Customer service', 'Atención al cliente'],
    ['Controle e organização de documentos', 'Document control and organization', 'Control y organización de documentos'],
    ['Arquivamento físico e digital', 'Physical and digital filing', 'Archivo físico y digital'],
    ['Emissão de documentos e boletos', 'Issuing documents and payment slips', 'Emisión de documentos y boletos'],
    ['Controle de agenda e prazos', 'Calendar and deadline control', 'Control de agenda y plazos'],
    ['Acompanhamento de processos', 'Process follow-up', 'Seguimiento de procesos'],
    ['Cadastro e atualização de dados', 'Data entry and updates', 'Registro y actualización de datos'],
    ['Cotação e renovação de seguros', 'Insurance quotes and renewals', 'Cotización y renovación de seguros']]],
  ['Ferramentas', 'Tools', 'Herramientas', [
    ['Microsoft Excel', 'Microsoft Excel', 'Microsoft Excel'], ['Pacote Office', 'Microsoft Office', 'Paquete Office'], ['Elaboração de planilhas', 'Spreadsheet building', 'Elaboración de planillas']]],
  ['Tecnologia', 'Technology', 'Tecnología', [
    ['HTML', 'HTML', 'HTML'], ['CSS', 'CSS', 'CSS'], ['JavaScript', 'JavaScript', 'JavaScript'],
    ['Lógica de programação', 'Programming logic', 'Lógica de programación'], ['Análise de dados', 'Data analysis', 'Análisis de datos'],
    ['Testes de software', 'Software testing', 'Pruebas de software'], ['Scrum', 'Scrum', 'Scrum']]],
];
let ordem = 0;
const competencias = hard.flatMap(([cat, catEn, catEs, itens]) => itens.map(([nome, en, es]) => ({ nome, categoria: cat, ordem: ++ordem, visivel: true, i18n: tr({ nome: en, categoria: catEn }, { nome: es, categoria: catEs }) })));

const comportamentais = [
  ['Organização', 'Organization', 'Organización'], ['Gestão de tempo', 'Time management', 'Gestión del tiempo'],
  ['Comunicação assertiva', 'Assertive communication', 'Comunicación asertiva'], ['Proatividade', 'Proactivity', 'Proactividad'],
  ['Atenção aos detalhes', 'Attention to detail', 'Atención al detalle'], ['Habilidades analíticas', 'Analytical skills', 'Habilidades analíticas'],
  ['Resolução de problemas', 'Problem solving', 'Resolución de problemas'], ['Trabalho em equipe', 'Teamwork', 'Trabajo en equipo'],
  ['Pensamento estratégico', 'Strategic thinking', 'Pensamiento estratégico'],
].map(([nome, en, es], i) => ({ nome, ordem: i + 1, visivel: true, i18n: tr({ nome: en }, { nome: es }) }));

const idiomas = [{ idioma: 'Português', nivel: 'Nativo', ordem: 1, visivel: true, i18n: tr({ idioma: 'Portuguese', nivel: 'Native' }, { idioma: 'Portugués', nivel: 'Nativo' }) }];

const projetos = [
  { slug: 'starbucks', titulo: 'Landing page Starbucks', categoria: 'dev', categorias: ['dev'], destaque: true, ordem: 1, data_projeto: '2025-02-01',
    descricao_curta: 'Landing page de estudo inspirada na Starbucks, feita do zero com HTML, CSS e JavaScript.',
    descricao_completa: 'Projeto do curso técnico: página responsiva com seções de produtos, troca de imagens e layout pensado para celular e computador, publicada no GitHub Pages.',
    tecnologias: ['HTML', 'CSS', 'JavaScript'], link_projeto: 'https://beatrizbonotto.github.io/Starbucks/', link_github: 'https://github.com/BeatrizBonotto/Starbucks', papel: 'Desenvolvimento completo',
    i18n: tr({ titulo: 'Starbucks landing page', descricao_curta: 'Study landing page inspired by Starbucks, built from scratch with HTML, CSS and JavaScript.', descricao_completa: 'Technical course project: a responsive page with product sections, image switching and a layout designed for phones and desktops, published on GitHub Pages.', papel: 'Full development' },
      { titulo: 'Landing page Starbucks', descricao_curta: 'Landing page de estudio inspirada en Starbucks, hecha desde cero con HTML, CSS y JavaScript.', descricao_completa: 'Proyecto del curso técnico: página responsiva con secciones de productos, cambio de imágenes y diseño pensado para móvil y computadora, publicada en GitHub Pages.', papel: 'Desarrollo completo' }) },
  { slug: 'curriculo-multilingue', titulo: 'Currículo multilíngue', categoria: 'dev', categorias: ['dev'], destaque: true, ordem: 2, data_projeto: null,
    descricao_curta: 'Currículo gerado a partir de um arquivo JSON, em português, inglês e espanhol, pronto para imprimir em A4.',
    descricao_completa: 'Primeira versão do meu currículo on-line: os dados ficam em JSON e o JavaScript monta a página, com seletor de idioma, layout A4 com quebra de páginas e versão para PDF.',
    tecnologias: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'], link_github: 'https://github.com/BeatrizBonotto/curriculo', papel: 'Desenvolvimento completo',
    i18n: tr({ titulo: 'Multilingual résumé', descricao_curta: 'Résumé generated from a JSON file, in Portuguese, English and Spanish, ready to print on A4.', descricao_completa: 'The first version of my online résumé: the data lives in JSON and JavaScript builds the page, with a language picker, an A4 layout with page breaks and a PDF version.', papel: 'Full development' },
      { titulo: 'Currículum multilingüe', descricao_curta: 'Currículum generado a partir de un archivo JSON, en portugués, inglés y español, listo para imprimir en A4.', descricao_completa: 'La primera versión de mi currículum en línea: los datos están en JSON y JavaScript arma la página, con selector de idioma, diseño A4 con saltos de página y versión en PDF.', papel: 'Desarrollo completo' }) },
].map(p => ({ ativo: true, ...p }));

const resumoAdm = 'Analista administrativa com {anos} anos de experiência e formação em Administração de Empresas. Atuo com rotinas administrativas, atendimento ao cliente, organização de documentos, controle de prazos e processos, planilhas e suporte operacional, hoje como Analista de Seguros na Dínamo Seguros. Perfil organizado, proativo e analítico, com foco em eficiência e melhoria contínua.';
const resumoTi = 'Formada em Administração, com {anos} anos de experiência administrativa e técnica em Informática para Internet. Na transição para tecnologia, uno a vivência com processos, atendimento e organização ao que aprendi no curso: HTML, CSS, JavaScript, lógica de programação, análise de dados, testes de software e Scrum. Busco uma oportunidade em TI para criar ferramentas digitais que agreguem valor ao dia a dia das empresas.';
const cvs = [
  { slug: 'administrativo', nome: 'Administrativo', base: 'adm', titulo: 'Analista Administrativa', resumo: resumoAdm, ordem: 1, detalhe: 'auto',
    secoes: ['resumo', 'experiencia', 'competencias', 'formacao', 'idiomas'],
    palavras_chave: ['Administração', 'Rotinas Administrativas', 'Atendimento ao Cliente', 'Organização de Documentos', 'Controle de Processos', 'Excel', 'Seguros'],
    i18n: tr({ nome: 'Administrative', titulo: 'Administrative Analyst', resumo: 'Administrative analyst with {anos} years of experience and a degree in Business Administration. I handle administrative routines, customer service, document management, deadline and process control, spreadsheets and operational support, currently as an Insurance Analyst at Dínamo Seguros. Organized, proactive and analytical, focused on efficiency and continuous improvement.' },
      { nome: 'Administrativo', titulo: 'Analista Administrativa', resumo: 'Analista administrativa con {anos} años de experiencia y título en Administración de Empresas. Trabajo con rutinas administrativas, atención al cliente, organización de documentos, control de plazos y procesos, planillas y soporte operativo, hoy como Analista de Seguros en Dínamo Seguros. Perfil organizado, proactivo y analítico, enfocado en la eficiencia y la mejora continua.' }) },
  { slug: 'ti', nome: 'TI', base: 'ti', titulo: 'Desenvolvedora Web Júnior · Transição de carreira', resumo: resumoTi, ordem: 2, detalhe: 'auto',
    secoes: ['resumo', 'formacao', 'projetos', 'competencias', 'experiencia', 'idiomas'],
    palavras_chave: ['HTML', 'CSS', 'JavaScript', 'Lógica de Programação', 'Testes de Software', 'Scrum', 'Análise de Dados', 'Transição de Carreira'],
    i18n: tr({ nome: 'Tech', titulo: 'Junior Web Developer · Career change', resumo: 'Business Administration graduate with {anos} years of administrative experience and a technical diploma in web development. Moving into tech, I bring hands-on experience with processes, customer service and organization together with what I learned in the course: HTML, CSS, JavaScript, programming logic, data analysis, software testing and Scrum. Looking for an IT opportunity to build digital tools that add value to companies every day.' },
      { nome: 'TI', titulo: 'Desarrolladora Web Junior · Transición de carrera', resumo: 'Licenciada en Administración, con {anos} años de experiencia administrativa y técnica en Informática para Internet. En la transición a la tecnología, uno la experiencia con procesos, atención y organización con lo que aprendí en el curso: HTML, CSS, JavaScript, lógica de programación, análisis de datos, pruebas de software y Scrum. Busco una oportunidad en TI para crear herramientas digitales que aporten valor al día a día de las empresas.' }) },
].map(c => ({ visivel: true, mostrar_idade: true, projetos: [], ...c }));

const site = {
  contato: { email: 'beatrizsouzag@outlook.com', linkedin: 'https://linkedin.com/in/beatrizsouza-adm', github: 'https://github.com/BeatrizBonotto', whatsapp: '5519991035924' },
  clientes: [{ nome: 'Dínamo Seguros' }, { nome: 'INSS' }, { nome: 'Tecnoset' }, { nome: 'Claro Brasil' }],
  disponibilidade: { ativo: true, pt: { texto: 'Aberta a vagas administrativas e de entrada em TI · Campinas e remoto' }, en: { texto: 'Open to administrative and entry-level IT roles · Campinas or remote' }, es: { texto: 'Abierta a vacantes administrativas y de inicio en TI · Campinas o remoto' } },
  hero: {
    pt: { eyebrow: 'Analista Administrativa · Campinas, Brasil', titulo: 'Organização que faz a rotina fluir.', subtitulo: 'Processos em ordem, clientes bem atendidos e documentos no lugar certo. Agora levando esse cuidado também para a tecnologia.', cta_primario: 'Ver trajetória', cta_secundario: 'Falar comigo' },
    en: { eyebrow: 'Administrative Analyst · Campinas, Brazil', titulo: 'Organization that keeps the routine flowing.', subtitulo: 'Processes in order, customers well looked after and documents in the right place. Now bringing that same care to technology.', cta_primario: 'See experience', cta_secundario: 'Get in touch' },
    es: { eyebrow: 'Analista Administrativa · Campinas, Brasil', titulo: 'Organización que hace fluir la rutina.', subtitulo: 'Procesos en orden, clientes bien atendidos y documentos en su lugar. Ahora llevando ese cuidado también a la tecnología.', cta_primario: 'Ver trayectoria', cta_secundario: 'Hablar conmigo' },
  },
  manifesto: {
    pt: { frases: ['Cada demanda tem dono, prazo e retorno.', 'Planilha boa é a que todo mundo entende.', 'Atender bem é resolver de verdade.', 'Aprender sempre, agora também com código.'] },
    en: { frases: ['Every request has an owner, a deadline and a reply.', 'A good spreadsheet is one everyone understands.', 'Good service means actually solving it.', 'Always learning, now with code too.'] },
    es: { frases: ['Cada solicitud tiene dueño, plazo y respuesta.', 'Una buena planilla es la que todos entienden.', 'Atender bien es resolver de verdad.', 'Aprender siempre, ahora también con código.'] },
  },
  seo: {
    pt: { titulo: 'Beatriz Bonotto | Analista Administrativa e de Seguros em Campinas | Currículo', descricao: 'Analista administrativa com {anos} anos de experiência em rotinas administrativas, atendimento, documentos e seguros. Formada em Administração e técnica em Informática para Internet.' },
    en: { titulo: 'Beatriz Bonotto | Administrative and Insurance Analyst in Campinas, Brazil | Résumé', descricao: 'Administrative analyst with {anos} years of experience in administrative routines, customer service, documents and insurance. Business Administration graduate with a web development diploma.' },
    es: { titulo: 'Beatriz Bonotto | Analista Administrativa y de Seguros en Campinas, Brasil | Currículum', descricao: 'Analista administrativa con {anos} años de experiencia en rutinas administrativas, atención, documentos y seguros. Licenciada en Administración y técnica en Informática para Internet.' },
  },
  servicos: {
    pt: [{ titulo: 'Rotinas administrativas', texto: 'Cadastros, arquivos, emissão de documentos e boletos, sempre conferidos e no prazo.' }, { titulo: 'Atendimento ao cliente', texto: 'Por telefone, e-mail ou presencial, com retorno claro até a solicitação estar resolvida.' }, { titulo: 'Controle de prazos e processos', texto: 'Pendências acompanhadas de perto, com planilhas que mostram o status de cada demanda.' }, { titulo: 'Seguros', texto: 'Cotações, renovações e acompanhamento de emissões junto às seguradoras.' }, { titulo: 'Planilhas e dados', texto: 'Controles em Excel que organizam informação solta e ajudam a decidir.' }, { titulo: 'Primeiros passos em TI', texto: 'HTML, CSS, JavaScript, testes de software e Scrum para apoiar times de tecnologia.' }],
    en: [{ titulo: 'Administrative routines', texto: 'Records, files, documents and payment slips, always double-checked and on time.' }, { titulo: 'Customer service', texto: 'By phone, email or in person, with clear follow-up until each request is solved.' }, { titulo: 'Deadline and process control', texto: 'Pending items tracked closely, with spreadsheets that show the status of every request.' }, { titulo: 'Insurance', texto: 'Quotes, renewals and follow-up on policy issuance with insurers.' }, { titulo: 'Spreadsheets and data', texto: 'Excel controls that organize scattered information and support decisions.' }, { titulo: 'First steps in tech', texto: 'HTML, CSS, JavaScript, software testing and Scrum to support tech teams.' }],
    es: [{ titulo: 'Rutinas administrativas', texto: 'Registros, archivos, documentos y boletos, siempre revisados y a tiempo.' }, { titulo: 'Atención al cliente', texto: 'Por teléfono, correo o en persona, con respuesta clara hasta resolver cada solicitud.' }, { titulo: 'Control de plazos y procesos', texto: 'Pendientes seguidos de cerca, con planillas que muestran el estado de cada solicitud.' }, { titulo: 'Seguros', texto: 'Cotizaciones, renovaciones y seguimiento de emisiones con las aseguradoras.' }, { titulo: 'Planillas y datos', texto: 'Controles en Excel que ordenan la información y ayudan a decidir.' }, { titulo: 'Primeros pasos en TI', texto: 'HTML, CSS, JavaScript, pruebas de software y Scrum para apoyar equipos de tecnología.' }],
  },
  sobre: {
    pt: { texto: 'Sou de Campinas-SP, formada em Administração e com {anos} anos de experiência na área administrativa. Gosto de rotina bem organizada, de atender bem e de ver cada processo um pouco melhor do que encontrei. Hoje sou Analista de Seguros na Dínamo Seguros e, em paralelo, concluí o técnico em Informática para Internet para levar esse jeito de trabalhar também para a tecnologia.' },
    en: { texto: 'I’m from Campinas, Brazil, a Business Administration graduate with {anos} years of administrative experience. I like a well-organized routine, good service and leaving every process a little better than I found it. Today I’m an Insurance Analyst at Dínamo Seguros and, alongside work, I completed a technical diploma in web development to bring this way of working to technology too.' },
    es: { texto: 'Soy de Campinas, Brasil, licenciada en Administración y con {anos} años de experiencia en el área administrativa. Me gusta la rutina bien organizada, atender bien y dejar cada proceso un poco mejor de lo que lo encontré. Hoy soy Analista de Seguros en Dínamo Seguros y, en paralelo, terminé el técnico en Informática para Internet para llevar esta forma de trabajar también a la tecnología.' },
  },
  sobre_mim: {
    pt: { carreira: 'Comecei cedo, como aprendiz na Claro e na Tecnoset, onde aprendi a criar planilhas, organizar arquivos e atender clientes. Fiz estágio no INSS, com ofícios, memorandos e processos, e entrei na Dínamo Seguros como estagiária. Lá cresci para auxiliar administrativa e hoje sou Analista de Seguros. No caminho me formei em Administração de Empresas e concluí o técnico em Informática para Internet.', pessoal: 'Sou organizada, atenta aos detalhes e gosto de resolver as coisas até o fim. Comunico com clareza, trabalho bem em equipe e tenho curiosidade para aprender, tanto que fui atrás da tecnologia para crescer junto com ela.', missao: 'Manter processos organizados e pessoas bem atendidas, deixando a rotina mais simples para todos.', visao: 'Unir a experiência administrativa à tecnologia e ajudar empresas com ferramentas digitais que façam diferença no dia a dia.', valores: ['Organização', 'Responsabilidade com prazos', 'Atendimento com empatia', 'Aprendizado contínuo', 'Trabalho em equipe'] },
    en: { carreira: 'I started early, as an apprentice at Claro and Tecnoset, where I learned to build spreadsheets, organize files and serve customers. I interned at INSS, handling official letters, memos and case files, and joined Dínamo Seguros as an intern. There I grew into an administrative assistant role and today I’m an Insurance Analyst. Along the way I graduated in Business Administration and completed a technical diploma in web development.', pessoal: 'I’m organized, detail-oriented and like to see things through to the end. I communicate clearly, work well in teams and I’m curious to learn, so much that I went after technology to grow with it.', missao: 'Keep processes organized and people well looked after, making the routine simpler for everyone.', visao: 'Combine administrative experience with technology and help companies with digital tools that make a difference every day.', valores: ['Organization', 'Accountability for deadlines', 'Empathetic service', 'Continuous learning', 'Teamwork'] },
    es: { carreira: 'Empecé temprano, como aprendiz en Claro y Tecnoset, donde aprendí a crear planillas, organizar archivos y atender clientes. Hice una pasantía en el INSS, con oficios, memorandos y expedientes, y entré en Dínamo Seguros como pasante. Allí crecí a auxiliar administrativa y hoy soy Analista de Seguros. En el camino me licencié en Administración de Empresas y terminé el técnico en Informática para Internet.', pessoal: 'Soy organizada, atenta a los detalles y me gusta resolver las cosas hasta el final. Me comunico con claridad, trabajo bien en equipo y tengo curiosidad por aprender, tanto que fui tras la tecnología para crecer con ella.', missao: 'Mantener los procesos organizados y a las personas bien atendidas, haciendo la rutina más simple para todos.', visao: 'Unir la experiencia administrativa con la tecnología y ayudar a las empresas con herramientas digitales que marquen la diferencia en el día a día.', valores: ['Organización', 'Responsabilidad con los plazos', 'Atención con empatía', 'Aprendizaje continuo', 'Trabajo en equipo'] },
  },
  valor_hora: { visivel: false },
  palavras_chave: ['Analista Administrativa', 'Assistente Administrativa', 'Auxiliar Administrativa', 'Rotinas Administrativas', 'Atendimento ao Cliente', 'Organização de Documentos', 'Controle de Processos', 'Excel', 'Seguros', 'Administração de Empresas', 'HTML', 'CSS', 'JavaScript', 'Testes de Software', 'Scrum', 'Campinas'],
};

// árvore de competências: uma raiz por área, sem nível (o currículo não informa)
const arvore = hard.map(([cat, catEn, catEs, itens], i) => ({ raiz: { nome: cat, categoria: cat === 'Tecnologia' ? 'dev' : 'social', ordem: i + 1, i18n: tr({ nome: catEn }, { nome: catEs }) }, filhos: itens }));

const limpar = async t => { const { error } = await sb.from(t).delete().not('id', 'is', null); if (error) throw new Error(`${t}: ${error.message}`); };
const inserir = async (t, linhas) => { const { data, error } = await sb.from(t).insert(linhas).select(); if (error) throw new Error(`${t}: ${error.message}`); return data; };

for (const t of ['skills_tree', 'projects', 'cv_versions', 'professional_history', 'academic_history', 'certifications', 'hard_skills', 'soft_skills', 'languages', 'profiles']) await limpar(t);
await inserir('profiles', [perfil]);
await inserir('professional_history', experiencias);
await inserir('academic_history', formacoes);
await inserir('certifications', certificacoes);
await inserir('hard_skills', competencias);
await inserir('soft_skills', comportamentais);
await inserir('languages', idiomas);
await inserir('projects', projetos);
await inserir('cv_versions', cvs);
for (const { raiz, filhos } of arvore) {
  const [r] = await inserir('skills_tree', [{ ...raiz, visivel: true }]);
  await inserir('skills_tree', filhos.map(([nome, en, es], i) => ({ nome, categoria: r.categoria, parent_id: r.id, ordem: i + 1, visivel: true, i18n: tr({ nome: en }, { nome: es }) })));
}
const { error } = await sb.from('site_content').upsert(Object.entries(site).map(([key, value]) => ({ key, value })));
if (error) throw error;
console.log('seed ok:', experiencias.length, 'experiências,', formacoes.length, 'formações,', competencias.length, 'competências,', projetos.length, 'projetos,', cvs.length, 'currículos');
