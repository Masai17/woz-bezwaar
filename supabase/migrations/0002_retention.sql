-- ============================================================================
-- Bezwaar.WOZ — bewaarbeleid (AVG + fiscaal in balans)
-- REVIEW-GATE: optioneel, pas uitvoeren na akkoord. Vereist pg_cron.
--
-- Spanning: AVG zegt PII minimaliseren/verwijderen (de site belooft "max 30
-- dagen bewaard"), MAAR de Belastingdienst eist dat je transactie-/factuur-
-- gegevens 7 jaar bewaart. Oplossing: na 30 dagen de PII + het gegenereerde
-- document ANONIMISEREN, maar de financiële kern (bedrag, datum, Stripe-id,
-- status) bewaren voor de boekhouding. Stripe bewaart zelf de factuurgegevens.
-- ============================================================================

create extension if not exists pg_cron;

-- Anonimiseer aanvragen ouder dan 30 dagen: wis alle direct herleidbare PII
-- en het document, behoud de financiële/analytische kern.
create or replace function public.anonymize_old_orders()
returns void language sql as $$
  update public.orders
  set naam = null,
      adres = null,
      postcode = null,
      argumenten = null,
      vergelijk_objecten = null,
      bezwaar_text = null,
      email = null,
      anonymized_at = now()
  where created_at < now() - interval '30 days'
    and anonymized_at is null;
$$;

-- Dagelijks om 03:00 uitvoeren.
select cron.schedule(
  'anonymize-old-woz-orders',
  '0 3 * * *',
  $$ select public.anonymize_old_orders(); $$
);

-- Handig: laatste cron-runs bekijken
--   select * from cron.job_run_details order by start_time desc limit 20;
-- Job verwijderen:
--   select cron.unschedule('anonymize-old-woz-orders');
