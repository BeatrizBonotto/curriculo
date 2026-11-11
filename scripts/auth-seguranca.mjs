// Login do admin como no portfólio do Matheus: sem cadastro público e senha forte (10+ com minúscula, maiúscula e número).
// Uso: node scripts/auth-seguranca.mjs
import { PAT, REF } from './supabase-admin.mjs';

const r = await fetch(`https://api.supabase.com/v1/projects/${REF}/config/auth`, {
  method: 'PATCH', headers: { Authorization: `Bearer ${PAT}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ disable_signup: true, password_min_length: 10, password_required_characters: 'abcdefghijklmnopqrstuvwxyz:ABCDEFGHIJKLMNOPQRSTUVWXYZ:0123456789' }),
});
const c = await r.json();
if (!r.ok) throw new Error(`HTTP ${r.status}: ${JSON.stringify(c).slice(0, 300)}`);
console.log('ok', { disable_signup: c.disable_signup, password_min_length: c.password_min_length });
