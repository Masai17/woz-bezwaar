-- ============================================================================
-- Bezwaar.WOZ — initiële Supabase-migratie
-- Tabel: orders  (één rij per WOZ-bezwaaraanvraag)
-- REVIEW-GATE: niets live draaien zonder akkoord. Eerst lezen, dan in de
-- Supabase SQL Editor van het WOZ-PROJECT uitvoeren (niet in PadelBuddy!).
-- ============================================================================

create extension if not exists "pgcrypto";  -- voor gen_random_uuid()

create table if not exists public.orders (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  -- ── Betaling (Stripe) ──────────────────────────────────────────────
  stripe_session_id   text unique not null,
  payment_status      text not null default 'pending'
                        check (payment_status in ('pending','paid','failed','refunded')),
  amount_cents        integer,                 -- 1900 = €19,00
  currency            text default 'eur',
  email               text,                    -- komt van Stripe ná betaling

  -- ── Aanvraaggegevens (PII — wordt na 30 dagen geanonimiseerd) ───────
  naam                text,
  adres               text,
  postcode            text,
  gemeente            text,
  belastingjaar       text,
  woz_waarde_euro     integer,
  gewenste_waarde_euro integer,
  argumenten          text,
  vergelijk_objecten  text,                    -- lost de 490-tekens Stripe-metadata-afkapping op

  -- ── Generatie (Claude) ─────────────────────────────────────────────
  bezwaar_text        text,
  generation_status   text not null default 'pending'
                        check (generation_status in ('pending','done','failed','template_fallback')),
  generation_error    text,
  model               text,
  generated_at        timestamptz,

  -- ── Aflevering ──────────────────────────────────────────────────────
  delivered_at        timestamptz,
  delivery_method     text,                    -- bv. 'web', 'email'

  -- ── Bewaarbeleid ────────────────────────────────────────────────────
  anonymized_at       timestamptz              -- gezet zodra PII gewist is
);

-- Indexen voor de meest voorkomende lookups
create index if not exists orders_created_at_idx on public.orders (created_at);
create index if not exists orders_payment_status_idx on public.orders (payment_status);

-- updated_at automatisch bijwerken
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────
-- RLS AAN, en bewust GEEN policies: anon/authenticated krijgen dan nul
-- toegang. De Next.js API-routes draaien server-side met de SERVICE ROLE
-- key, die RLS omzeilt. Gevoelige PII is zo nooit publiek opvraagbaar.
alter table public.orders enable row level security;

comment on table public.orders is
  'WOZ-bezwaaraanvragen. PII wordt na 30 dagen geanonimiseerd (zie 0002). Alleen toegankelijk via de service-role key vanuit de server.';
