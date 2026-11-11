// Avisa a Beatriz por e-mail (Brevo) a cada mensagem do formulário de contato.
// Guarda a chave do Brevo no Vault do Supabase e cria o gatilho em contact_messages (pg_net chama a API do Brevo).
// A chave nunca vai para o navegador nem para o git. Uso: node scripts/email-contato.mjs [--teste]
import { lerEnv, PAT, REF } from './supabase-admin.mjs';

const env = lerEnv();
const chave = env.BREVO_API_KEY;
if (!chave) throw new Error('falta BREVO_API_KEY no .env');
const brevo = (p, o = {}) => fetch(`https://api.brevo.com/v3${p}`, { ...o, headers: { 'api-key': chave, Accept: 'application/json', 'Content-Type': 'application/json', ...o.headers } });

const { senders = [] } = await (await brevo('/senders')).json();
const remetente = senders.find(s => s.active);
if (!remetente) throw new Error(`nenhum remetente ativo na conta Brevo (encontrados: ${senders.map(s => s.email).join(', ') || 'nenhum'})`);
const destino = env.EMAIL_CONTATO || 'beatrizsouzag@outlook.com';
console.log('remetente:', remetente.email, '| destino:', destino);

const sql = async q => {
  const r = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, { method: 'POST', headers: { Authorization: `Bearer ${PAT}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ query: q }) });
  const t = await r.text();
  if (!r.ok) throw new Error(t.slice(0, 400));
  return JSON.parse(t);
};
const lit = s => `'${String(s).replace(/'/g, "''")}'`;

await sql('create extension if not exists pg_net;');
// segredos no Vault: recria para refletir o .env atual
await sql(`delete from vault.secrets where name in ('brevo_api_key', 'email_contato_cfg');
select vault.create_secret(${lit(chave)}, 'brevo_api_key');
select vault.create_secret(${lit(JSON.stringify({ de: { name: 'Site Beatriz Bonotto', email: remetente.email }, para: destino }))}, 'email_contato_cfg');`);

await sql(`
create or replace function public.avisar_contato_por_email() returns trigger
language plpgsql security definer set search_path = public, extensions as $$
declare k text; cfg jsonb; corpo text;
begin
  select decrypted_secret into k from vault.decrypted_secrets where name = 'brevo_api_key';
  select decrypted_secret::jsonb into cfg from vault.decrypted_secrets where name = 'email_contato_cfg';
  if k is null or cfg is null then return new; end if;
  -- texto do visitante escapado: vira HTML inofensivo
  corpo := format('<p><strong>Nome:</strong> %s<br><strong>E-mail:</strong> %s<br><strong>Assunto:</strong> %s</p><p>%s</p><p style="color:#888">Enviado pelo formulário de beatrizgsbonotto.web.app</p>',
    replace(replace(coalesce(new.nome, ''), '<', '&lt;'), '>', '&gt;'),
    replace(replace(coalesce(new.email, ''), '<', '&lt;'), '>', '&gt;'),
    replace(replace(coalesce(new.assunto, ''), '<', '&lt;'), '>', '&gt;'),
    replace(replace(replace(coalesce(new.mensagem, ''), '<', '&lt;'), '>', '&gt;'), E'\\n', '<br>'));
  perform net.http_post(
    url := 'https://api.brevo.com/v3/smtp/email',
    headers := jsonb_build_object('api-key', k, 'Content-Type', 'application/json', 'Accept', 'application/json'),
    body := jsonb_build_object('sender', cfg->'de', 'to', jsonb_build_array(jsonb_build_object('email', cfg->>'para')),
      'replyTo', case when new.email ~* '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$' then jsonb_build_object('email', new.email, 'name', left(coalesce(new.nome, ''), 120)) end,
      'subject', 'Nova mensagem no site: ' || left(coalesce(new.nome, 'visitante'), 80), 'htmlContent', corpo));
  return new;
exception when others then
  return new; -- e-mail é aviso; a mensagem continua salva mesmo se o envio falhar
end $$;
revoke execute on function public.avisar_contato_por_email() from public, anon, authenticated;
drop trigger if exists contato_email on public.contact_messages;
create trigger contato_email after insert on public.contact_messages for each row execute function public.avisar_contato_por_email();`);
console.log('gatilho ok');

if (process.argv.includes('--teste')) {
  await sql(`insert into public.contact_messages (nome, email, assunto, mensagem, idioma) values ('Teste do site', 'teste@exemplo.com', 'outro', 'Mensagem de teste: se chegou, o aviso por e-mail do formulário está funcionando.', 'pt');`);
  await new Promise(r => setTimeout(r, 6000));
  const [res] = await sql(`select status_code, left(content::text, 200) c from net._http_response order by created desc limit 1;`);
  console.log('Brevo respondeu:', res);
  await sql(`delete from public.contact_messages where email = 'teste@exemplo.com';`);
}
