// Cliente service_role para scripts locais. Chaves e PAT vêm do .env (nunca versionado).
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

export function lerEnv() {
  const txt = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8');
  return Object.fromEntries(txt.split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^"|"$/g, '')]));
}

export const SUPABASE_URL = lerEnv().SUPABASE_PROJECT_URL.replace(/\/$/, '');
export const REF = new URL(SUPABASE_URL).host.split('.')[0];
export const PAT = lerEnv().SUPABASE_PAT;

export async function adminClient() {
  return createClient(SUPABASE_URL, lerEnv().SUPABASE_PRIVATE_KEY, { auth: { persistSession: false } });
}
