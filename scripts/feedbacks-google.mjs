// Avaliações do Google Maps (Dínamo Seguros) que citam a Beatriz, com link para o original.
// Datas aproximadas a partir de "há N meses" (lidas em 11/11/2026). Idempotente: apaga e recria as de fonte Google.
// Uso: node scripts/feedbacks-google.mjs
import { adminClient } from './supabase-admin.mjs';

const L = id => `https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1s${id}!2m1!1s0x94c8c5ffc979def3:0x21fdea58df96c6d6!3m1!1s2@1:${id}`;
const tr = (en, es) => ({ en: { mensagem: en, cargo: 'Client' }, es: { mensagem: es, cargo: 'Cliente' } });
const F = [
  ['Rafael Ramos', '2026-10-01', 'Ci9DQUlRQUNvZENodHljRjlvT2pBeFVITXRVVTU0YzJwVlNYWlFSR1J6TmtRMVUwRRAB',
    'Não tive dificuldade alguma em fechar meu seguro, graças a explicação e transparência da consultora Beatriz Souza! Muito educada, objetiva e disposta a me ajudar, sem falar que o valor das coberturas é bem justo.',
    'I had no trouble at all closing my insurance, thanks to the explanation and transparency of consultant Beatriz Souza! Very polite, objective and willing to help, not to mention the coverage price is very fair.',
    '¡No tuve ninguna dificultad para cerrar mi seguro, gracias a la explicación y transparencia de la consultora Beatriz Souza! Muy educada, objetiva y dispuesta a ayudarme, además el valor de las coberturas es muy justo.'],
  ['Fabio Rogerio Arruda Ferreira', '2025-11-01', 'Ci9DQUlRQUNvZENodHljRjlvT2tFNVFqSnpOVEJJYzJoSFJVUktiRXQwVW01MWVXYxAB',
    '100% satisfeito com a Dínamo Corretora de Seguros. A se destacar uma moça de nome Beatriz, que é muito atenciosa explicando com muita paciência como é o funcionamento do Seguro Fiança para aluguel de casa. Percebi que ela tem muito conhecimento técnico sobre o assunto e isso me ajudou demais na escolha das melhores opções. Certamente farei outros tipos de seguros com a Dínamo.',
    '100% satisfied with Dínamo insurance brokerage. Special mention to Beatriz, who was very attentive and patiently explained how rent guarantee insurance works. I could tell she has deep technical knowledge of the subject, and it helped me a lot to choose the best options. I will certainly take out other kinds of insurance with Dínamo.',
    '100% satisfecho con Dínamo Corredora de Seguros. Destaco a Beatriz, muy atenta, que me explicó con mucha paciencia cómo funciona el seguro de fianza para alquiler. Noté que tiene mucho conocimiento técnico del tema y eso me ayudó mucho a elegir las mejores opciones. Sin duda contrataré otros seguros con Dínamo.'],
  ['João Paulo Oriente', '2026-10-01', 'Ci9DQUlRQUNvZENodHljRjlvT2pWT00ybFhhMkprYVVaYVoyWlFhR05pZUU1TldHYxAB',
    'Já sou cliente da Dínamo há 4+ anos e sempre fui muito bem atendido. Hoje foi mais uma comprovação disso: a Beatriz Souza fez uma cotação super rápida e o atendimento foi nota 10! Muito obrigado, Bia!',
    "I've been a Dínamo client for 4+ years and have always been very well served. Today proved it once again: Beatriz Souza made a super fast quote and the service was a perfect 10! Thank you so much, Bia!",
    'Soy cliente de Dínamo hace más de 4 años y siempre me atendieron muy bien. Hoy fue otra prueba: Beatriz Souza hizo una cotización súper rápida y la atención fue de 10. ¡Muchas gracias, Bia!'],
  ['taina roberta fontes justino', '2026-07-01', 'Ci9DQUlRQUNvZENodHljRjlvT2s5NVIzTXpOak5FYW0xNFpFZFVSVWQwZWtOSmFtYxAB',
    'Seguro fiança feito com a Beatriz, super recomendo! Extremamente atenciosa, ágil e profissional.',
    'Rent guarantee insurance done with Beatriz, highly recommend! Extremely attentive, quick and professional.',
    'Seguro de fianza hecho con Beatriz, ¡lo recomiendo mucho! Extremadamente atenta, ágil y profesional.'],
  ['Marlo Martins Filho', '2023-11-01', 'ChdDSUhNMG9nS0VJQ0FnSURCdnZhT2hRRRAB',
    'Estou muito satisfeito com os serviços prestados pela Beatriz, sempre de bom humor, clareza e atenção! Parabéns Dínamo, equipe top demais!',
    "I'm very happy with Beatriz's service, always good-humored, clear and attentive! Congratulations Dínamo, an amazing team!",
    '¡Estoy muy satisfecho con los servicios de Beatriz, siempre de buen humor, con claridad y atención! ¡Felicitaciones Dínamo, un equipo excelente!'],
  ['Ana Carolina Soares', '2026-07-01', 'ChZDSUhNMG9nS0VJQ0FnSUR1cjhEMlp3EAE',
    'Atendimento excelente, muito solícitos com o cliente. Ótimo serviço. O Edson é extremamente simpático e prestativo! A Beatriz também sempre nos atende super bem! Resolve nossos problemas! Nota 1000!',
    'Excellent service, very helpful to clients. Great service. Edson is extremely friendly and helpful! Beatriz also always serves us really well! She solves our problems! A perfect score!',
    'Atención excelente, muy serviciales con el cliente. Gran servicio. ¡Edson es muy simpático y atento! ¡Beatriz también siempre nos atiende súper bien! ¡Resuelve nuestros problemas! ¡Nota 1000!'],
  ['maria angélica godoi', '2024-11-01', 'ChdDSUhNMG9nS0VJQ0FnSUROLTYtWW93RRAB',
    'Excelente atendimento, a Beatriz é rápida e resolve tudo, recomendo muito.',
    'Excellent service, Beatriz is quick and solves everything, highly recommend.',
    'Excelente atención, Beatriz es rápida y resuelve todo, la recomiendo mucho.'],
  ['Leister Cerri', '2026-07-01', 'Ci9DQUlRQUNvZENodHljRjlvT2sxQ2RqbGhTRm94TVV4bk1HTkZOMjV2YTBoQ2FYYxAB',
    'Atendimento de qualidade com equipe muito bem preparada e atenciosa. Destaque especial para o atendimento da Beatriz.',
    'Quality service with a very well-prepared and attentive team. Special mention to the service from Beatriz.',
    'Atención de calidad con un equipo muy bien preparado y atento. Destaque especial para la atención de Beatriz.'],
  ['Sandra Mondin', '2026-10-01', 'Ci9DQUlRQUNvZENodHljRjlvT25sTVJFeEROazA1UW01TGRtdHdRV1l6T0dkaVpHYxAB',
    'Corretora Beatriz. Excelente agilidade no atendimento. Ótima profissional.',
    'Broker Beatriz. Excellent, fast service. A great professional.',
    'Corredora Beatriz. Excelente agilidad en la atención. Gran profesional.'],
  ['Mônica da Matta', '2026-08-01', 'Ci9DQUlRQUNvZENodHljRjlvT25GUWJETlNibGRCTW5oUmNXRkdOMUowU25WSlFtYxAB',
    'Fui atendida pela Beatriz, uma excelente profissional. Só tenho a agradecer pela sua atenção.',
    'I was served by Beatriz, an excellent professional. I can only thank her for her attention.',
    'Me atendió Beatriz, una excelente profesional. Solo tengo que agradecer su atención.'],
  ['Amós Gomes', '2026-08-01', 'Ci9DQUlRQUNvZENodHljRjlvT2psc1JVbFlja2RyUmtsbmFGbDBiSFJ3TlVoS1kxRRAB',
    'Com atendente Beatriz, 5 estrelas.', 'With Beatriz as my attendant, 5 stars.', 'Con la atención de Beatriz, 5 estrellas.'],
];

const sb = await adminClient();
const { data: exp } = await sb.from('professional_history').select('id').eq('instituicao', 'Dínamo Seguros').eq('atual', true).limit(1);
let { error } = await sb.from('feedbacks').delete().eq('fonte', 'Google');
if (error) throw error;
({ error } = await sb.from('feedbacks').insert(F.map(([nome, data, id, pt, en, es], i) => ({
  nome, cargo: 'Cliente', empresa: 'Dínamo Seguros', mensagem: pt, fonte: 'Google', link_url: L(id), data_feedback: data,
  aprovado: true, ordem: i + 1, professional_history_id: exp?.[0]?.id ?? null, i18n: tr(en, es),
}))));
if (error) throw error;
console.log('ok', F.length, 'feedbacks');
