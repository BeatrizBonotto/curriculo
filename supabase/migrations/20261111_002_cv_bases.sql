-- Versões de currículo da Beatriz: administrativo (adm) e transição para TI (ti).
-- Reverter: alter table public.cv_versions drop constraint cv_versions_base_check;
--           alter table public.cv_versions add constraint cv_versions_base_check check (base = any (array['qa','dev','freela','basico']));
alter table public.cv_versions drop constraint if exists cv_versions_base_check;
alter table public.cv_versions add constraint cv_versions_base_check check (base = any (array['adm', 'ti']));
