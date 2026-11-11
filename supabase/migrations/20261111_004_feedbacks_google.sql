-- Feedbacks podem vir das avaliações do Google.
-- Reverter: alter table public.feedbacks drop constraint feedbacks_fonte_check;
--           alter table public.feedbacks add constraint feedbacks_fonte_check check (fonte in ('Site','LinkedIn','Feedz','E-mail'));
alter table public.feedbacks drop constraint if exists feedbacks_fonte_check;
alter table public.feedbacks add constraint feedbacks_fonte_check check (fonte in ('Site', 'LinkedIn', 'Feedz', 'E-mail', 'Google'));
