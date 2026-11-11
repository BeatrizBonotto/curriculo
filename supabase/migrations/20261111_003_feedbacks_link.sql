-- Link para a avaliação original (ex.: Google Maps) em cada feedback.
-- Reverter: alter table public.feedbacks drop column link_url;
alter table public.feedbacks add column if not exists link_url text;
alter table public.feedbacks drop constraint if exists feedback_link;
alter table public.feedbacks add constraint feedback_link check (link_url is null or link_url ~* '^https://');
