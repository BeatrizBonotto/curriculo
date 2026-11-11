-- Estrutura completa do banco, copiada do portfólio matheusbonotto (11/11/2026) para um projeto Supabase vazio.
-- Reverter: drop schema public cascade; create schema public; (projeto novo, sem dados a perder)
create extension if not exists pgcrypto;

-- SEQUENCES

-- TABLES

create table public.academic_history (
  id uuid default uuid_generate_v4() not null,
  instituicao character varying(200) not null,
  curso character varying(200) not null,
  tipo character varying(50),
  data_inicio date,
  data_fim date,
  atual boolean default false,
  descricao text,
  ordem integer default 0,
  created_at timestamp without time zone default now(),
  updated_at timestamp without time zone default now(),
  logo_url character varying(500),
  imagens_urls text[],
  profile_id uuid,
  tipo_academico text,
  tipo_local text,
  i18n jsonb default '{}'::jsonb not null,
  visivel boolean default true not null,
  bloqueado boolean default false not null
);

create table public.achievements (
  id uuid default uuid_generate_v4() not null,
  titulo character varying(200) not null,
  descricao text,
  categoria character varying(50) not null,
  imagem_url character varying(500),
  evidencias_urls text[],
  desbloqueado boolean default false,
  data_conquista date,
  ordem integer default 0,
  created_at timestamp without time zone default now(),
  updated_at timestamp without time zone default now(),
  evidence character varying(500),
  evidence_file character varying(500),
  i18n jsonb default '{}'::jsonb not null,
  visivel boolean default true not null,
  bloqueado boolean default false not null
);

create table public.admins (
  user_id uuid not null,
  created_at timestamp with time zone default now() not null
);

create table public.app_config (
  key character varying(100) not null,
  value text not null,
  description text,
  created_at timestamp without time zone default now(),
  updated_at timestamp without time zone default now()
);

create table public.audit_log (
  id uuid default uuid_generate_v4() not null,
  table_name character varying(100) not null,
  record_id uuid not null,
  action character varying(20) not null,
  old_data jsonb,
  new_data jsonb,
  user_email text,
  created_at timestamp without time zone default now()
);

create table public.certifications (
  id uuid default uuid_generate_v4() not null,
  profile_id uuid,
  nome character varying(200) not null,
  instituicao character varying(200) not null,
  data_certificacao date,
  validade character varying(100),
  certificado_url character varying(500),
  ordem integer default 0,
  created_at timestamp without time zone default now(),
  updated_at timestamp without time zone default now(),
  i18n jsonb default '{}'::jsonb not null,
  visivel boolean default true not null,
  bloqueado boolean default false not null
);

create table public.contact_messages (
  id uuid default uuid_generate_v4() not null,
  nome character varying(200) not null,
  email character varying(200) not null,
  assunto character varying(200),
  mensagem text not null,
  lida boolean default false,
  created_at timestamp without time zone default now(),
  idioma text
);

create table public.cv_projects (
  id uuid default gen_random_uuid() not null,
  profile_id uuid not null,
  nome text not null,
  descricao text,
  tecnologias text[],
  data date,
  ordem integer default 0,
  created_at timestamp with time zone default now(),
  link text,
  url text,
  github_url text,
  link_projeto text,
  link_github text,
  imagem_url text,
  imagem text,
  i18n jsonb default '{}'::jsonb not null
);

create table public.cv_versions (
  id uuid default gen_random_uuid() not null,
  slug text not null,
  nome text not null,
  base text default 'qa'::text not null,
  titulo text,
  resumo text,
  visivel boolean default true not null,
  ordem integer default 0 not null,
  i18n jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  secoes text[] default ARRAY['resumo'::text, 'servicos'::text, 'experiencia'::text, 'projetos'::text, 'competencias'::text, 'formacao'::text, 'idiomas'::text, 'palavras'::text] not null,
  detalhe text default 'auto'::text not null,
  projetos text[] default '{}'::text[] not null,
  palavras_chave text[] default '{}'::text[] not null,
  mostrar_idade boolean default true not null
);

create table public.feedbacks (
  id uuid default uuid_generate_v4() not null,
  professional_history_id uuid,
  nome character varying(200) not null,
  cargo character varying(200),
  empresa character varying(200),
  mensagem text not null,
  imagem_url character varying(500),
  fonte character varying(50) default 'LinkedIn'::character varying not null,
  aprovado boolean default false,
  data_feedback date,
  ordem integer default 0,
  created_at timestamp without time zone default now(),
  updated_at timestamp without time zone default now(),
  i18n jsonb default '{}'::jsonb not null
);

create table public.hard_skills (
  id uuid default uuid_generate_v4() not null,
  profile_id uuid,
  nome character varying(200) not null,
  categoria character varying(50),
  nivel integer default 0,
  ordem integer default 0,
  created_at timestamp without time zone default now(),
  updated_at timestamp without time zone default now(),
  i18n jsonb default '{}'::jsonb not null,
  visivel boolean default true not null
);

create table public.languages (
  id uuid default uuid_generate_v4() not null,
  profile_id uuid,
  idioma character varying(100) not null,
  nivel character varying(50) not null,
  cursando boolean default false,
  instituicao character varying(200),
  ordem integer default 0,
  created_at timestamp without time zone default now(),
  updated_at timestamp without time zone default now(),
  i18n jsonb default '{}'::jsonb not null,
  visivel boolean default true not null
);

create table public.login_bloqueios (
  email text not null,
  falhas integer default 0 not null,
  bloqueado boolean default false not null,
  atualizado timestamp with time zone default now() not null
);

create table public.professional_history (
  id uuid default uuid_generate_v4() not null,
  instituicao character varying(200) not null,
  titulo character varying(200) not null,
  regime character varying(50),
  local character varying(200),
  tipo_local character varying(50),
  descricao text,
  data_inicio date not null,
  data_fim date,
  atual boolean default false,
  categoria_profissional character varying(50) not null,
  ordem integer default 0,
  created_at timestamp without time zone default now(),
  updated_at timestamp without time zone default now(),
  logo_url character varying(500),
  imagens_urls text[],
  profile_id uuid,
  i18n jsonb default '{}'::jsonb not null,
  visivel boolean default true not null,
  bloqueado boolean default false not null
);

create table public.profiles (
  id uuid default uuid_generate_v4() not null,
  user_id uuid,
  primeiro_nome character varying(100) not null,
  sobrenome character varying(100) not null,
  nome_completo character varying(200) not null,
  data_nascimento date,
  local character varying(200),
  pais character varying(100) default 'Brasil'::character varying,
  ocupacao character varying(200),
  descricao text,
  keywords text,
  github_url character varying(500),
  linkedin_url character varying(500),
  email character varying(200),
  telefone character varying(50),
  apresentacao_url character varying(500),
  avatar_url character varying(500),
  created_at timestamp without time zone default now(),
  updated_at timestamp without time zone default now(),
  apresentacao text
);

create table public.project_institution_relations (
  id uuid default gen_random_uuid() not null,
  project_id uuid,
  institution_type text not null,
  institution_id uuid not null,
  created_at timestamp with time zone default now()
);

create table public.projects (
  id uuid default uuid_generate_v4() not null,
  titulo character varying(200) not null,
  descricao_curta text,
  descricao_completa text,
  categoria character varying(50) not null,
  imagem_url character varying(500),
  tags text[],
  tecnologias text[],
  funcionalidades text[],
  conquistas text[],
  link_projeto character varying(500),
  link_github character varying(500),
  data_projeto date,
  data_inicio date,
  data_fim date,
  ativo boolean default true,
  ordem integer default 0,
  created_at timestamp without time zone default now(),
  updated_at timestamp without time zone default now(),
  professional_history_id uuid,
  academic_history_id uuid,
  i18n jsonb default '{}'::jsonb not null,
  slug text,
  destaque boolean default false not null,
  papel text,
  galeria jsonb default '[]'::jsonb not null,
  categorias text[] default '{}'::text[] not null,
  bloqueado boolean default false not null
);

create table public.site_content (
  key text not null,
  value jsonb not null,
  updated_at timestamp with time zone default now() not null
);

create table public.skills_tree (
  id uuid default uuid_generate_v4() not null,
  nome character varying(200) not null,
  categoria character varying(50) not null,
  nivel integer default 0,
  parent_id uuid,
  descricao text,
  ordem integer default 0,
  desbloqueado boolean default false,
  created_at timestamp without time zone default now(),
  updated_at timestamp without time zone default now(),
  icon character varying(100),
  i18n jsonb default '{}'::jsonb not null,
  visivel boolean default true not null,
  bloqueado boolean default false not null
);

create table public.soft_skills (
  id uuid default uuid_generate_v4() not null,
  profile_id uuid,
  nome character varying(200) not null,
  ordem integer default 0,
  created_at timestamp without time zone default now(),
  updated_at timestamp without time zone default now(),
  i18n jsonb default '{}'::jsonb not null,
  visivel boolean default true not null
);

-- CONSTRAINTS

alter table public.academic_history add constraint academic_history_pkey PRIMARY KEY (id);
alter table public.achievements add constraint achievements_pkey PRIMARY KEY (id);
alter table public.admins add constraint admins_pkey PRIMARY KEY (user_id);
alter table public.app_config add constraint app_config_pkey PRIMARY KEY (key);
alter table public.audit_log add constraint audit_log_pkey PRIMARY KEY (id);
alter table public.certifications add constraint certifications_pkey PRIMARY KEY (id);
alter table public.contact_messages add constraint contact_messages_pkey PRIMARY KEY (id);
alter table public.cv_projects add constraint cv_projects_pkey PRIMARY KEY (id);
alter table public.cv_versions add constraint cv_versions_pkey PRIMARY KEY (id);
alter table public.feedbacks add constraint feedbacks_pkey PRIMARY KEY (id);
alter table public.hard_skills add constraint hard_skills_pkey PRIMARY KEY (id);
alter table public.languages add constraint languages_pkey PRIMARY KEY (id);
alter table public.login_bloqueios add constraint login_bloqueios_pkey PRIMARY KEY (email);
alter table public.professional_history add constraint professional_history_pkey PRIMARY KEY (id);
alter table public.profiles add constraint profiles_pkey PRIMARY KEY (id);
alter table public.project_institution_relations add constraint project_institution_relations_pkey PRIMARY KEY (id);
alter table public.projects add constraint projects_pkey PRIMARY KEY (id);
alter table public.site_content add constraint site_content_pkey PRIMARY KEY (key);
alter table public.skills_tree add constraint skills_tree_pkey PRIMARY KEY (id);
alter table public.soft_skills add constraint soft_skills_pkey PRIMARY KEY (id);
alter table public.academic_history add constraint check_academic_dates CHECK (((data_fim IS NULL) OR (data_inicio IS NULL) OR (data_fim >= data_inicio)));
alter table public.contact_messages add constraint contato_tamanhos CHECK (((char_length(COALESCE(mensagem, ''::text)) <= 5000) AND (char_length(COALESCE(idioma, ''::text)) <= 5))) NOT VALID;
alter table public.contact_messages add constraint contato_email CHECK (((email IS NULL) OR ((email)::text ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'::text))) NOT VALID;
alter table public.contact_messages add constraint contact_messages_tamanhos CHECK ((((char_length((nome)::text) >= 1) AND (char_length((nome)::text) <= 120)) AND ((char_length((email)::text) >= 3) AND (char_length((email)::text) <= 200)) AND (char_length((COALESCE(assunto, ''::character varying))::text) <= 200) AND ((char_length(mensagem) >= 1) AND (char_length(mensagem) <= 5000)))) NOT VALID;
alter table public.cv_versions add constraint cv_versions_base_check CHECK ((base = ANY (ARRAY['qa'::text, 'dev'::text, 'freela'::text, 'basico'::text])));
alter table public.cv_versions add constraint cv_versions_slug_key UNIQUE (slug);
alter table public.cv_versions add constraint cv_versions_detalhe_check CHECK ((detalhe = ANY (ARRAY['auto'::text, 'completo'::text, 'resumido'::text, 'minimo'::text])));
alter table public.feedbacks add constraint feedbacks_fonte_check CHECK (((fonte)::text = ANY ((ARRAY['Site'::character varying, 'LinkedIn'::character varying, 'Feedz'::character varying, 'E-mail'::character varying])::text[])));
alter table public.feedbacks add constraint feedback_tamanho CHECK ((char_length(COALESCE(mensagem, ''::text)) <= 4000)) NOT VALID;
alter table public.hard_skills add constraint hard_skills_nivel_check CHECK (((nivel >= 0) AND (nivel <= 100)));
alter table public.professional_history add constraint check_professional_dates CHECK (((data_fim IS NULL) OR (data_inicio IS NULL) OR (data_fim >= data_inicio)));
alter table public.profiles add constraint profiles_user_id_key UNIQUE (user_id);
alter table public.project_institution_relations add constraint project_institution_relations_project_id_institution_type_i_key UNIQUE (project_id, institution_type, institution_id);
alter table public.project_institution_relations add constraint project_institution_relations_institution_type_check CHECK ((institution_type = ANY (ARRAY['academico'::text, 'profissional'::text])));
alter table public.projects add constraint check_project_dates CHECK (((data_fim IS NULL) OR (data_inicio IS NULL) OR (data_fim >= data_inicio)));
alter table public.projects add constraint check_single_institution CHECK ((((professional_history_id IS NULL) AND (academic_history_id IS NOT NULL)) OR ((professional_history_id IS NOT NULL) AND (academic_history_id IS NULL)) OR ((professional_history_id IS NULL) AND (academic_history_id IS NULL))));
alter table public.skills_tree add constraint skills_tree_nivel_check CHECK (((nivel >= 0) AND (nivel <= 100)));
alter table public.academic_history add constraint academic_history_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.admins add constraint admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public.certifications add constraint certifications_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.cv_projects add constraint cv_projects_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.feedbacks add constraint feedbacks_professional_history_id_fkey FOREIGN KEY (professional_history_id) REFERENCES professional_history(id) ON DELETE SET NULL;
alter table public.hard_skills add constraint hard_skills_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.languages add constraint languages_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.professional_history add constraint professional_history_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.profiles add constraint profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);
alter table public.project_institution_relations add constraint project_institution_relations_project_id_fkey FOREIGN KEY (project_id) REFERENCES cv_projects(id) ON DELETE CASCADE;
alter table public.projects add constraint projects_academic_history_id_fkey FOREIGN KEY (academic_history_id) REFERENCES academic_history(id) ON DELETE SET NULL;
alter table public.projects add constraint projects_professional_history_id_fkey FOREIGN KEY (professional_history_id) REFERENCES professional_history(id) ON DELETE SET NULL;
alter table public.skills_tree add constraint skills_tree_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES skills_tree(id) ON DELETE CASCADE;
alter table public.soft_skills add constraint soft_skills_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- INDEXES

CREATE INDEX idx_professional_history_profile_id ON public.professional_history USING btree (profile_id);
CREATE INDEX idx_skills_tree_categoria ON public.skills_tree USING btree (categoria);
CREATE INDEX idx_projects_categoria ON public.projects USING btree (categoria);
CREATE INDEX idx_project_institution_institution ON public.project_institution_relations USING btree (institution_type, institution_id);
CREATE INDEX idx_cv_projects_data ON public.cv_projects USING btree (data);
CREATE INDEX idx_skills_tree_parent ON public.skills_tree USING btree (parent_id);
CREATE INDEX idx_projects_professional_history ON public.projects USING btree (professional_history_id);
CREATE INDEX idx_contact_messages_lida ON public.contact_messages USING btree (lida, created_at DESC);
CREATE INDEX idx_cv_projects_profile_id ON public.cv_projects USING btree (profile_id);
CREATE INDEX idx_feedbacks_aprovado ON public.feedbacks USING btree (aprovado);
CREATE INDEX idx_cv_projects_nome ON public.cv_projects USING btree (nome);
CREATE INDEX idx_feedbacks_professional_history ON public.feedbacks USING btree (professional_history_id);
CREATE INDEX idx_projects_ativo ON public.projects USING btree (ativo);
CREATE INDEX idx_projects_academic_history ON public.projects USING btree (academic_history_id);
CREATE INDEX idx_academic_history_tipo_academico ON public.academic_history USING btree (tipo_academico);
CREATE INDEX idx_professional_history_data_inicio ON public.professional_history USING btree (data_inicio);
CREATE INDEX idx_academic_history_profile_id ON public.academic_history USING btree (profile_id);
CREATE INDEX idx_professional_history_dates ON public.professional_history USING btree (data_inicio DESC, data_fim DESC);
CREATE INDEX idx_academic_history_instituicao ON public.academic_history USING btree (instituicao);
CREATE INDEX idx_projects_professional_history_id ON public.projects USING btree (professional_history_id);
CREATE INDEX idx_academic_history_dates ON public.academic_history USING btree (data_inicio DESC, data_fim DESC);
CREATE UNIQUE INDEX projects_slug_key ON public.projects USING btree (slug);
CREATE INDEX idx_feedbacks_fonte ON public.feedbacks USING btree (fonte);
CREATE INDEX idx_feedbacks_ordem ON public.feedbacks USING btree (ordem);
CREATE INDEX idx_project_institution_project ON public.project_institution_relations USING btree (project_id);
CREATE INDEX idx_projects_search ON public.projects USING gin (to_tsvector('portuguese'::regconfig, (((COALESCE(titulo, ''::character varying))::text || ' '::text) || COALESCE(descricao_curta, ''::text))));
CREATE INDEX idx_project_institution_relations_institution ON public.project_institution_relations USING btree (institution_type, institution_id);
CREATE INDEX idx_academic_history_data_inicio ON public.academic_history USING btree (data_inicio);
CREATE INDEX idx_professional_history_categoria ON public.professional_history USING btree (categoria_profissional);
CREATE INDEX idx_professional_history_instituicao ON public.professional_history USING btree (instituicao);
CREATE INDEX idx_projects_data_projeto ON public.projects USING btree (data_projeto);
CREATE INDEX idx_projects_academic_history_id ON public.projects USING btree (academic_history_id);
CREATE INDEX idx_project_institution_relations_project_id ON public.project_institution_relations USING btree (project_id);

-- FUNCTIONS

CREATE OR REPLACE FUNCTION public.audit_trigger_function()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (table_name, record_id, action, old_data, user_email)
    VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD)::jsonb, auth.email());
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (table_name, record_id, action, old_data, new_data, user_email)
    VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb, auth.email());
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (table_name, record_id, action, new_data, user_email)
    VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW)::jsonb, auth.email());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.cleanup_old_messages(days_old integer DEFAULT 365)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM contact_messages
  WHERE lida = true 
    AND created_at < NOW() - (days_old || ' days')::INTERVAL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.desbloquear_login()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not exists (select 1 from jsonb_array_elements(coalesce(auth.jwt() -> 'amr', '[]'::jsonb)) m where m ->> 'method' in ('recovery', 'otp', 'magiclink')) then
    return false;
  end if;
  update public.login_bloqueios set falhas = 0, bloqueado = false, atualizado = now() where email = lower(auth.email());
  return true;
end $function$
;

CREATE OR REPLACE FUNCTION public.get_config(config_key character varying)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN (SELECT value FROM app_config WHERE key = config_key);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'total_projetos', (SELECT COUNT(*) FROM projects WHERE ativo = true),
    'total_skills', (SELECT COUNT(*) FROM skills_tree),
    'total_conquistas', (SELECT COUNT(*) FROM achievements),
    'mensagens_nao_lidas', (SELECT COUNT(*) FROM contact_messages WHERE lida = false),
    'total_projetos_por_categoria', (
      SELECT json_object_agg(categoria, count)
      FROM (
        SELECT categoria, COUNT(*) as count
        FROM projects
        WHERE ativo = true
        GROUP BY categoria
      ) sub
    )
  ) INTO stats;
  
  RETURN stats;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_institution_projects(history_id uuid, history_type text DEFAULT 'professional'::text)
 RETURNS TABLE(id uuid, titulo character varying, descricao_curta text, categoria character varying, imagem_url character varying, data_projeto date, ativo boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  IF history_type = 'professional' THEN
    RETURN QUERY
    SELECT 
      p.id,
      p.titulo,
      p.descricao_curta,
      p.categoria,
      p.imagem_url,
      p.data_projeto,
      p.ativo
    FROM projects p
    WHERE p.professional_history_id = history_id
      AND p.ativo = true
    ORDER BY p.ordem, p.data_projeto DESC;
  ELSIF history_type = 'academic' THEN
    RETURN QUERY
    SELECT 
      p.id,
      p.titulo,
      p.descricao_curta,
      p.categoria,
      p.imagem_url,
      p.data_projeto,
      p.ativo
    FROM projects p
    WHERE p.academic_history_id = history_id
      AND p.ativo = true
    ORDER BY p.ordem, p.data_projeto DESC;
  END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_institutions_by_project(p_project_id uuid)
 RETURNS TABLE(institution_type text, institution_id uuid, institution_name text, institution_logo text)
 LANGUAGE plpgsql
AS $function$
begin
  return query
  select 
    r.institution_type,
    r.institution_id,
    case 
      when r.institution_type = 'academico' then a.instituicao
      when r.institution_type = 'profissional' then p.instituicao
    end as institution_name,
    case 
      when r.institution_type = 'academico' then a.logo_url
      when r.institution_type = 'profissional' then p.logo_url
    end as institution_logo
  from public.project_institution_relations r
  left join public.academic_history a 
    on r.institution_type = 'academico' and r.institution_id = a.id
  left join public.professional_history p 
    on r.institution_type = 'profissional' and r.institution_id = p.id
  where r.project_id = p_project_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_projects_by_institution(p_institution_type text, p_institution_id uuid)
 RETURNS TABLE(project_id uuid, project_nome text, project_descricao text, project_data text, project_tecnologias text[], project_link text, project_url text, project_github text, project_imagem_url text, project_imagem text, link_projeto text, link_github text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as project_id,
    p.titulo as project_nome,
    COALESCE(p.descricao_curta, p.descricao_completa, '') as project_descricao,
    COALESCE(p.data_projeto::text, p.data_inicio::text, '') as project_data,
    COALESCE(p.tecnologias, ARRAY[]::text[]) as project_tecnologias,
    -- Tentar diferentes campos de link
    COALESCE(
      p.link_projeto,
      p.link_github,
      NULL
    ) as project_link,
    p.link_projeto as project_url,
    p.link_github as project_github,
    p.imagem_url as project_imagem_url,
    p.imagem_url as project_imagem,
    p.link_projeto,
    p.link_github
  FROM public.projects p
  WHERE (
    ((p_institution_type = 'profissional' OR p_institution_type = 'professional') AND p.professional_history_id = p_institution_id) OR
    ((p_institution_type = 'academico' OR p_institution_type = 'academic') AND p.academic_history_id = p_institution_id)
  )
    AND p.ativo = true
  ORDER BY p.ordem, p.data_projeto DESC NULLS LAST;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (select 1 from public.admins where user_id = auth.uid())
    and not exists (select 1 from public.login_bloqueios b where b.email = lower(auth.email()) and b.bloqueado);
$function$
;

CREATE OR REPLACE FUNCTION public.is_admin_email()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select public.is_admin();
$function$
;

CREATE OR REPLACE FUNCTION public.login_bloqueado(p_email text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce((select bloqueado from public.login_bloqueios where email = lower(trim(p_email))), false);
$function$
;

CREATE OR REPLACE FUNCTION public.login_sucesso()
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  update public.login_bloqueios set falhas = 0, atualizado = now() where email = lower(auth.email()) and not bloqueado;
$function$
;

CREATE OR REPLACE FUNCTION public.registrar_falha_login(p_email text)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
declare v_email text := lower(trim(p_email)); v_falhas integer;
begin
  if not exists (select 1 from auth.users u join public.admins a on a.user_id = u.id where lower(u.email) = v_email) then
    return 3;
  end if;
  insert into public.login_bloqueios as b (email, falhas, bloqueado, atualizado) values (v_email, 1, false, now())
  on conflict (email) do update set falhas = b.falhas + 1, bloqueado = b.bloqueado or b.falhas + 1 >= 3, atualizado = now()
  returning falhas into v_falhas;
  return greatest(0, 3 - v_falhas);
end $function$
;

CREATE OR REPLACE FUNCTION public.search_projects(search_text text DEFAULT NULL::text, category_filter text DEFAULT NULL::text, active_only boolean DEFAULT true)
 RETURNS TABLE(id uuid, titulo character varying, descricao_curta text, categoria character varying, imagem_url character varying, data_projeto date, ativo boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.titulo,
    p.descricao_curta,
    p.categoria,
    p.imagem_url,
    p.data_projeto,
    p.ativo
  FROM projects p
  WHERE 
    (active_only = false OR p.ativo = true)
    AND (category_filter IS NULL OR p.categoria = category_filter)
    AND (
      search_text IS NULL OR
      p.titulo ILIKE '%' || search_text || '%' OR
      p.descricao_curta ILIKE '%' || search_text || '%' OR
      p.descricao_completa ILIKE '%' || search_text || '%'
    )
  ORDER BY p.ordem, p.data_projeto DESC;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.vincular_projeto_instituicao(p_project_name text, p_institution_name text, p_institution_type text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_project_id uuid;
  v_institution_id uuid;
  v_found_type text;
BEGIN
  -- Buscar projeto
  SELECT id INTO v_project_id
  FROM public.cv_projects
  WHERE lower(nome) LIKE '%' || lower(p_project_name) || '%'
  LIMIT 1;

  IF v_project_id IS NULL THEN
    RETURN '❌ Projeto não encontrado: ' || p_project_name;
  END IF;

  -- Se não especificou o tipo, tenta encontrar automaticamente
  IF p_institution_type IS NULL THEN
    -- Tenta profissional primeiro
    SELECT id INTO v_institution_id
    FROM public.professional_history
    WHERE lower(instituicao) LIKE '%' || lower(p_institution_name) || '%'
    LIMIT 1;

    IF v_institution_id IS NOT NULL THEN
      v_found_type := 'profissional';
    ELSE
      -- Tenta acadêmico
      SELECT id INTO v_institution_id
      FROM public.academic_history
      WHERE lower(instituicao) LIKE '%' || lower(p_institution_name) || '%'
      LIMIT 1;

      IF v_institution_id IS NOT NULL THEN
        v_found_type := 'academico';
      END IF;
    END IF;
  ELSE
    -- Usa o tipo especificado
    v_found_type := p_institution_type;
    
    IF p_institution_type = 'profissional' THEN
      SELECT id INTO v_institution_id
      FROM public.professional_history
      WHERE lower(instituicao) LIKE '%' || lower(p_institution_name) || '%'
      LIMIT 1;
    ELSIF p_institution_type = 'academico' THEN
      SELECT id INTO v_institution_id
      FROM public.academic_history
      WHERE lower(instituicao) LIKE '%' || lower(p_institution_name) || '%'
      LIMIT 1;
    END IF;
  END IF;

  IF v_institution_id IS NULL THEN
    RETURN '❌ Instituição não encontrada: ' || p_institution_name;
  END IF;

  -- Vincular
  INSERT INTO public.project_institution_relations (
    project_id,
    institution_type,
    institution_id
  ) VALUES (
    v_project_id,
    v_found_type,
    v_institution_id
  )
  ON CONFLICT (project_id, institution_type, institution_id) DO NOTHING;

  RETURN '✅ Projeto "' || p_project_name || '" vinculado à "' || p_institution_name || '" (' || v_found_type || ')';
END;
$function$
;

-- VIEWS

create or replace view public.v_projects_complete as
 SELECT p.id,
    p.titulo,
    p.descricao_curta,
    p.descricao_completa,
    p.categoria,
    p.imagem_url,
    p.tecnologias,
    p.tags,
    p.link_projeto,
    p.link_github,
    p.data_projeto,
    p.data_inicio,
    p.data_fim,
    p.ativo,
    p.ordem,
    p.created_at,
    p.updated_at,
    ph.instituicao AS instituicao_profissional,
    ph.titulo AS titulo_profissional,
    ph.logo_url AS logo_profissional,
    ah.instituicao AS instituicao_academica,
    ah.curso AS curso_academico,
    ah.logo_url AS logo_academica,
        CASE
            WHEN (p.professional_history_id IS NOT NULL) THEN 'profissional'::text
            WHEN (p.academic_history_id IS NOT NULL) THEN 'academico'::text
            ELSE NULL::text
        END AS tipo_instituicao
   FROM ((projects p
     LEFT JOIN professional_history ph ON ((p.professional_history_id = ph.id)))
     LEFT JOIN academic_history ah ON ((p.academic_history_id = ah.id)));

create or replace view public.v_history_timeline as
 SELECT 'profissional'::text AS tipo,
    ph.id,
    ph.instituicao,
    ph.titulo AS titulo_curso,
    ph.categoria_profissional AS categoria,
    ph.regime AS vinculo,
    ph.data_inicio,
    ph.data_fim,
    ph.atual,
    ph.local,
    ph.tipo_local,
    ph.logo_url,
    ph.imagens_urls,
    ph.descricao,
    ph.created_at
   FROM professional_history ph
UNION ALL
 SELECT 'academico'::text AS tipo,
    ah.id,
    ah.instituicao,
    ah.curso AS titulo_curso,
    NULL::character varying AS categoria,
    ah.tipo_academico AS vinculo,
    ah.data_inicio,
    ah.data_fim,
    ah.atual,
    NULL::character varying AS local,
    ah.tipo_local,
    ah.logo_url,
    ah.imagens_urls,
    ah.descricao,
    ah.created_at
   FROM academic_history ah
  ORDER BY 7 DESC;

-- TRIGGERS

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hard_skills_updated_at BEFORE UPDATE ON public.hard_skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_soft_skills_updated_at BEFORE UPDATE ON public.soft_skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_languages_updated_at BEFORE UPDATE ON public.languages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON public.certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feedbacks_updated_at BEFORE UPDATE ON public.feedbacks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professional_history_updated_at BEFORE UPDATE ON public.professional_history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_academic_history_updated_at BEFORE UPDATE ON public.academic_history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_tree_updated_at BEFORE UPDATE ON public.skills_tree FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON public.achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS

alter table public.admins enable row level security;
alter table public.profiles enable row level security;
alter table public.hard_skills enable row level security;
alter table public.soft_skills enable row level security;
alter table public.languages enable row level security;
alter table public.app_config enable row level security;
alter table public.certifications enable row level security;
alter table public.site_content enable row level security;
alter table public.feedbacks enable row level security;
alter table public.audit_log enable row level security;
alter table public.projects enable row level security;
alter table public.contact_messages enable row level security;
alter table public.cv_projects enable row level security;
alter table public.professional_history enable row level security;
alter table public.academic_history enable row level security;
alter table public.skills_tree enable row level security;
alter table public.achievements enable row level security;
alter table public.project_institution_relations enable row level security;
alter table public.cv_versions enable row level security;
alter table public.login_bloqueios enable row level security;

-- POLICIES

create policy admin_tudo on public.audit_log as PERMISSIVE for ALL to public using (is_admin()) with check (is_admin());
create policy admin_tudo on public.contact_messages as PERMISSIVE for ALL to public using (is_admin()) with check (is_admin());
create policy admin_tudo on public.feedbacks as PERMISSIVE for ALL to public using (is_admin()) with check (is_admin());
create policy admin_tudo on public.projects as PERMISSIVE for ALL to public using (is_admin()) with check (is_admin());
create policy leitura_publica on public.profiles as PERMISSIVE for SELECT to public using (true);
create policy leitura_publica on public.cv_projects as PERMISSIVE for SELECT to public using (true);
create policy leitura_publica on public.project_institution_relations as PERMISSIVE for SELECT to public using (true);
create policy leitura_publica on public.site_content as PERMISSIVE for SELECT to public using (true);
create policy leitura_publica on public.professional_history as PERMISSIVE for SELECT to public using (visivel);
create policy leitura_publica on public.academic_history as PERMISSIVE for SELECT to public using (visivel);
create policy leitura_publica on public.achievements as PERMISSIVE for SELECT to public using (visivel);
create policy leitura_publica on public.skills_tree as PERMISSIVE for SELECT to public using (visivel);
create policy leitura_publica on public.hard_skills as PERMISSIVE for SELECT to public using (visivel);
create policy leitura_publica on public.soft_skills as PERMISSIVE for SELECT to public using (visivel);
create policy leitura_publica on public.languages as PERMISSIVE for SELECT to public using (visivel);
create policy leitura_publica on public.certifications as PERMISSIVE for SELECT to public using (visivel);
create policy leitura_publica on public.projects as PERMISSIVE for SELECT to public using (ativo);
create policy leitura_publica on public.feedbacks as PERMISSIVE for SELECT to public using (aprovado);
create policy envio_publico on public.feedbacks as PERMISSIVE for INSERT to public with check ((aprovado = false));
create policy admins_self on public.admins as PERMISSIVE for SELECT to public using ((user_id = auth.uid()));
create policy admin_tudo on public.profiles as PERMISSIVE for ALL to public using (is_admin()) with check (is_admin());
create policy admin_tudo on public.professional_history as PERMISSIVE for ALL to public using (is_admin()) with check (is_admin());
create policy admin_tudo on public.academic_history as PERMISSIVE for ALL to public using (is_admin()) with check (is_admin());
create policy admin_tudo on public.achievements as PERMISSIVE for ALL to public using (is_admin()) with check (is_admin());
create policy admin_tudo on public.skills_tree as PERMISSIVE for ALL to public using (is_admin()) with check (is_admin());
create policy admin_tudo on public.hard_skills as PERMISSIVE for ALL to public using (is_admin()) with check (is_admin());
create policy admin_tudo on public.soft_skills as PERMISSIVE for ALL to public using (is_admin()) with check (is_admin());
create policy admin_tudo on public.languages as PERMISSIVE for ALL to public using (is_admin()) with check (is_admin());
create policy admin_tudo on public.certifications as PERMISSIVE for ALL to public using (is_admin()) with check (is_admin());
create policy admin_tudo on public.cv_projects as PERMISSIVE for ALL to public using (is_admin()) with check (is_admin());
create policy admin_tudo on public.project_institution_relations as PERMISSIVE for ALL to public using (is_admin()) with check (is_admin());
create policy admin_tudo on public.site_content as PERMISSIVE for ALL to public using (is_admin()) with check (is_admin());
create policy admin_tudo on public.app_config as PERMISSIVE for ALL to public using (is_admin()) with check (is_admin());
create policy envio_publico on public.contact_messages as PERMISSIVE for INSERT to public with check (((lida = false) OR (lida IS NULL)));
create policy media_leitura on storage.objects as PERMISSIVE for SELECT to public using ((bucket_id = 'media'::text));
create policy media_admin_insert on storage.objects as PERMISSIVE for INSERT to public with check (((bucket_id = 'media'::text) AND is_admin()));
create policy media_admin_update on storage.objects as PERMISSIVE for UPDATE to public using (((bucket_id = 'media'::text) AND is_admin()));
create policy media_admin_delete on storage.objects as PERMISSIVE for DELETE to public using (((bucket_id = 'media'::text) AND is_admin()));
create policy admin_tudo on public.cv_versions as PERMISSIVE for ALL to public using (is_admin()) with check (is_admin());
create policy leitura_publica on public.cv_versions as PERMISSIVE for SELECT to public using (visivel);

-- BUCKETS
insert into storage.buckets (id, name, public, allowed_mime_types) values ('media', 'media', true, array['image/png','image/jpeg','image/webp','image/gif','video/mp4','application/pdf']) on conflict do nothing;

-- SEGURANÇA (de 20261027_009_seguranca.sql)
revoke all on public.login_bloqueios from anon, authenticated;
revoke all on function public.login_bloqueado(text), public.registrar_falha_login(text), public.login_sucesso(), public.desbloquear_login() from public;
grant execute on function public.login_bloqueado(text), public.registrar_falha_login(text) to anon, authenticated;
grant execute on function public.login_sucesso(), public.desbloquear_login() to authenticated;
do $$
declare f record;
begin
  for f in select p.oid::regprocedure as sig from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname in ('cleanup_old_messages', 'get_config', 'get_dashboard_stats', 'search_projects',
      'get_projects_by_institution', 'get_institution_projects', 'vincular_projeto_instituicao', 'audit_trigger_function', 'update_updated_at_column')
  loop
    execute format('revoke execute on function %s from public, anon', f.sig);
  end loop;
end $$;
-- o Supabase concede EXECUTE direto ao anon e ao authenticated: tira também deles
revoke execute on function public.login_sucesso(), public.desbloquear_login() from anon;
do $$
declare f record;
begin
  for f in select p.oid::regprocedure as sig from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname in ('cleanup_old_messages', 'get_config', 'get_dashboard_stats', 'search_projects',
      'get_projects_by_institution', 'get_institution_projects', 'vincular_projeto_instituicao', 'audit_trigger_function', 'get_institutions_by_project')
  loop
    execute format('revoke execute on function %s from public, anon, authenticated', f.sig);
  end loop;
end $$;
