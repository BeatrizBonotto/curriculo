# Beatriz Bonotto · site e currículo

Site pessoal de Beatriz G. Souza Bonotto (PT, EN e ES), publicado em https://beatrizgsbonotto.web.app.
Páginas: início, sobre mim, currículo (versões Administrativo e TI, com PDF) e o painel /admin.
O site anterior está no branch `legado`.

## Como funciona
- Vite + pré-render: as páginas saem em HTML estático com o conteúdo do banco já dentro (`scripts/prerender.mjs`).
- Conteúdo no Supabase: edite pelo /admin (botão direito no logo abre o campo do código de acesso).
- Firebase Hosting no projeto `beatrizgsbonotto`.

## Comandos
```bash
npm ci
npm run dev                       # site local
npm run build                     # pré-render + build + PDFs do currículo
npm run test:tudo                 # testes unitários, build e testes de navegador
firebase deploy --only hosting    # publica
```

## Conteúdo e mídia
- `.env` (fora do git): `SUPABASE_PAT`, `SUPABASE_PUBLIC_KEY`, `SUPABASE_PRIVATE_KEY`, `SUPABASE_PROJECT_URL`.
- Banco: `supabase/migrations` (aplicar com `node scripts/sql.mjs arquivo.sql`).
- Conteúdo inicial: `node scripts/seed.mjs && node scripts/prints-projetos.mjs` (o seed recria tudo; depois disso, use o admin).
- Vídeos: coloque em `assets/videos` arquivos com "intro", "trabalhando" e "entrevista" (ou "contato") no nome
  e rode `node scripts/preparar-midia.mjs`. Arquivos começando com `old_` são ignorados.
- Logos das empresas: `node scripts/logos-empresas.mjs` (fonte em `assets/logos`).
