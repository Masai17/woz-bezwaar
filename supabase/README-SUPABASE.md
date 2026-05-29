# 🗄️ Supabase — Bezwaar.WOZ

**Laatst bijgewerkt:** 2026-05-29 · **Status:** 🟡 Ontwerp klaar, nog niet uitgevoerd (review-gate)

> Conform afspraak stap-voor-stap met review-gates — **geen big bang**.
> De migraties zijn klaargezet maar nog **niet** live gedraaid.

---

## 1. Architectuurkeuze: apart Supabase-project per bedrijf
**Aanbevolen: een eigen Supabase-project voor WOZ**, los van PadelBuddy.
Redenen: quota-/egress-isolatie (jouw egress-les), kleinere blast radius bij een foute
migratie, schonere AVG-afbakening voor gevoelige PII, en het past binnen de gratis
**2-actieve-projecten-limiet** (PadelBuddy + WOZ = 2). Derde site later → pauzeer een
inactief project of start een tweede gratis organisatie.

---

## 2. Welke informatie wordt opgeslagen?
Eén tabel: **`orders`** (één rij per aanvraag). Categorieën:

| Categorie | Velden | Waarom |
|-----------|--------|--------|
| Identificatie | `id`, `created_at`, `updated_at` | sleutel + tijdlijn |
| Betaling | `stripe_session_id`, `payment_status`, `amount_cents`, `currency`, `email` | koppeling Stripe, alleen leveren bij `paid` |
| Aanvraag (PII) | `naam`, `adres`, `postcode`, `gemeente`, `belastingjaar`, `woz_waarde_euro`, `gewenste_waarde_euro`, `argumenten`, `vergelijk_objecten` | input voor het bezwaar; **lost de 490-tekens Stripe-metadata-afkapping op** |
| Generatie | `bezwaar_text`, `generation_status`, `generation_error`, `model`, `generated_at` | document bewaren → herstelbaar als klant venster sluit; fouten traceerbaar |
| Aflevering | `delivered_at`, `delivery_method` | bewijs dat klant het kreeg |
| Bewaarbeleid | `anonymized_at` | markeert wanneer PII gewist is |

**Dit lost meteen 3 GO-LIVE-blokkers op:** betrouwbare aflevering (3.3), metadata-afkapping (2.4), en de "30 dagen bewaard"-belofte waarmaken (1.5).

---

## 3. Beveiliging
- **RLS staat aan, zonder policies** → anon/authenticated krijgen nul toegang.
- De Next.js API-routes draaien server-side met de **service-role key** (omzeilt RLS).
- Gevoelige PII is dus nooit publiek opvraagbaar via de client.

## 4. Bewaarbeleid (AVG ⇄ fiscaal)
- Na **30 dagen**: PII + document **anonimiseren** (niet de hele rij wissen), financiële kern (bedrag, datum, Stripe-id, status) blijft staan voor de boekhouding — Belastingdienst eist 7 jaar.
- Geregeld via `pg_cron` (dagelijks 03:00) in `0002_retention.sql`.

---

## 5. Setup (zodra je akkoord bent — nog niet doen)
1. Maak een **nieuw** Supabase-project aan (regio EU, bv. Frankfurt — AVG).
2. SQL Editor → draai `migrations/0001_init.sql`.
3. (Optioneel, na review) draai `migrations/0002_retention.sql` voor auto-anonimisering.
4. Project Settings → API → noteer:
   - `Project URL`
   - `anon` key (niet strikt nodig voor server-only)
   - **`service_role` key** (geheim! alleen server-side)
5. Zet in Vercel (en lokaal in `.env.local`):
   ```
   SUPABASE_URL=...
   SUPABASE_SERVICE_ROLE_KEY=...   # GEHEIM — nooit in client/Git
   ```
6. Voeg `verwerkersovereenkomst` toe aan de GO-LIVE-compliancelijst (Supabase als verwerker; teken hun DPA, EU-regio).

---

## 6. Volgende stap (apart review-gate — nog niet uitgevoerd)
De app-code aanpassen om Supabase te gebruiken:
- `@supabase/supabase-js` toevoegen + een server-side client (service-role).
- **`/api/checkout`**: maak een `orders`-rij (status `pending`) met de formuliergegevens, zet alléén `order_id` in Stripe-metadata (i.p.v. alle velden afgekapt).
- **`/api/generate`**: lees order via `session_id`, genereer, sla `bezwaar_text` op, zet status. Bij herhaald bezoek: teruglezen i.p.v. opnieuw genereren.
- Stille sjabloon-fallback vervangen door nette foutafhandeling (GO-LIVE 3.1).
- Eventueel e-mail-aflevering (GO-LIVE 3.3/3.4).

Ik bouw dit pas na jouw akkoord, in kleine stappen.
