-- ============================================================================
-- Bezwaar.WOZ — migratie 0003: optimalisatie & hardening
-- REVIEW-GATE: tabel was leeg bij toepassing, dus risicoloos. Uitvoeren ná 0001 + 0002.
-- Bron: Supabase/Postgres-review (2026-05-29).
-- ============================================================================

-- ── BLOK 1 — Security hardening (HOOG) ─────────────────────────────────────
-- anon/authenticated hadden volledige table-grants; alleen RLS blokkeerde ze.
-- Tweede verdedigingslaag: rechten expliciet intrekken. De app gebruikt
-- uitsluitend de service-role (omzeilt RLS én heeft eigen grants).
revoke all on public.orders from anon, authenticated;
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter table public.orders force row level security;

-- ── BLOK 2 — Constraints op financiële kern (HOOG) + waarden (MIDDEN) ──────
alter table public.orders
  alter column amount_cents set not null,
  alter column currency    set not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'orders_amount_cents_positive') then
    alter table public.orders add constraint orders_amount_cents_positive check (amount_cents > 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'orders_currency_len') then
    alter table public.orders add constraint orders_currency_len check (char_length(currency) = 3);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'orders_woz_nonneg') then
    alter table public.orders add constraint orders_woz_nonneg check (woz_waarde_euro is null or woz_waarde_euro >= 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'orders_gewenste_nonneg') then
    alter table public.orders add constraint orders_gewenste_nonneg check (gewenste_waarde_euro is null or gewenste_waarde_euro >= 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'orders_email_format') then
    alter table public.orders add constraint orders_email_format check (email is null or email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$');
  end if;
end $$;

-- ── BLOK 3 — Doelgerichte partial indexen (MIDDEN) ─────────────────────────
-- Retention-query: where created_at < now()-30d and anonymized_at is null.
create index if not exists orders_retention_idx
  on public.orders (created_at) where anonymized_at is null;
-- Mislukte generaties snel vinden voor handmatig herstel.
create index if not exists orders_failed_generation_idx
  on public.orders (created_at) where generation_status = 'failed';

-- ── BLOK 4 — Retention-functie: gemist PII dichten (HOOG) ──────────────────
-- 0002 liet 'gemeente' (quasi-identificerend) en 'generation_error' (kan een
-- ge-echo'de prompt met naam/adres bevatten) staan. Nu meegenomen.
create or replace function public.anonymize_old_orders()
returns void language sql as $$
  update public.orders
  set naam = null,
      adres = null,
      postcode = null,
      gemeente = null,
      argumenten = null,
      vergelijk_objecten = null,
      bezwaar_text = null,
      email = null,
      generation_error = null,
      anonymized_at = now()
  where created_at < now() - interval '30 days'
    and anonymized_at is null;
$$;

-- ── BLOK 5 — Documentatie ──────────────────────────────────────────────────
comment on constraint orders_amount_cents_positive on public.orders is
  'Financiele kern: bedrag altijd > 0 (7 jr bewaard voor fiscus).';
