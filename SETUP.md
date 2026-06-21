# WOZ Bezwaar Generator — Setup in 6 stappen

## Wat heb je nodig
- Gratis account op: Vercel, Stripe, Anthropic

---

## Stap 1 — Anthropic API key
1. Ga naar https://console.anthropic.com
2. Maak account aan → Settings → API Keys → Create Key
3. Kopieer de key (begint met `sk-ant-...`)

## Stap 2 — Stripe instellen
1. Ga naar https://dashboard.stripe.com → maak account aan
2. Activeer iDEAL: Stripe Dashboard → Settings → Payment methods → iDEAL aanzetten
3. Ga naar Developers → API Keys → kopieer Publishable key en Secret key
4. Webhook aanmaken: Developers → Webhooks → Add endpoint
   - URL: https://jouwdomein.nl/api/webhook
   - Events: `checkout.session.completed`
   - Kopieer de Webhook signing secret

## Stap 3 — Vercel deployen
1. Ga naar https://vercel.com → maak account aan (gratis)
2. Klik "Add New Project" → "Import Git Repository"
3. Of: gebruik Vercel CLI: `npm i -g vercel && vercel`
4. Upload de projectmap

## Stap 4 — Environment variables instellen in Vercel
Ga naar je project → Settings → Environment Variables en voeg toe:

```
ANTHROPIC_API_KEY     = sk-ant-...
STRIPE_SECRET_KEY     = sk_live_...
STRIPE_WEBHOOK_SECRET = whsec_...
NEXT_PUBLIC_BASE_URL  = https://jouwdomein.nl
```

## Stap 5 — Domein koppelen
1. Koop domein bij TransIP: wozcheck.nl of wozbezwaar.nl (~€10/jaar)
2. Vercel → Domains → Add domain → volg instructies

## Stap 6 — Testen
1. Ga naar je site
2. Vul een testformulier in
3. Betaal met Stripe testkaart: `4242 4242 4242 4242`
4. Check of bezwaarschrift gegenereerd wordt

---

## Kosten per maand
- Vercel hosting: €0 (gratis tier)
- Domein: ~€1/maand
- Anthropic API: ~€0,05 per bezwaarschrift
- Stripe: 1,5% + €0,25 per transactie

## Bij 100 betalende klanten per maand
- Omzet: 100 × €29 = €2.900
- Kosten: ~€80 (Stripe fees + API)
- Netto: ~€2.820/maand

---

## Domeinadvies
Top 3 beschikbare domeinen (controleer via transip.nl):
1. **wozcheck.nl** — kort, herkenbaar, goede SEO
2. **wozbezwaar.nl** — meest beschrijvend, directe zoekwoord-match
3. **wozfixer.nl** — modern en onderscheidend

Registreer wozcheck.nl én wozbezwaar.nl tegelijk (paar euro per jaar).
