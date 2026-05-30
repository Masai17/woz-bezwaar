# 📧 E-mailaflevering activeren — wat is er nog nodig?

**Status:** 🟡 Code is klaar en staat live, maar **inert** — de app verstuurt nog niets.
Zodra de onderstaande stappen zijn gedaan, mailt de app het bezwaarschrift automatisch.
**Er hoeft geen code meer geschreven te worden.**

---

## Hoe het nu werkt
- Na een geslaagde generatie probeert `lib/mail.js` het bezwaar te mailen naar het
  e-mailadres dat de klant bij Stripe opgeeft.
- Zolang `RESEND_API_KEY` + `MAIL_FROM` niet zijn gezet, slaat hij dit stilletjes over
  (de klant ziet het bezwaar gewoon op de website). De aanvraag faalt nooit door de mail.
- Provider: **Resend** (https://resend.com) — gratis tier ruim voldoende voor de start.

---

## Wat moet er nog gebeuren (3 stappen)

### 1. Resend-account + API-key
- Maak een account op https://resend.com.
- Ga naar **API Keys → Create API Key**, kopieer de sleutel (begint met `re_...`).

### 2. Domein verifiëren (verplicht voor een eigen no-reply-adres)
- Vereist eerst dat het domein **wozbezwaar.nl** geregistreerd is (zie GO-LIVE 4.2).
- In Resend: **Domains → Add Domain → `wozbezwaar.nl`**.
- Voeg de getoonde **DNS-records** (SPF, DKIM, DMARC) toe bij je domeinregistrar/DNS.
- Wacht tot Resend de status **Verified** toont.
- > Zonder geverifieerd domein kun je niet vanaf `noreply@wozbezwaar.nl` sturen.
  > Voor een snelle test kun je tijdelijk Resend's testafzender `onboarding@resend.dev` gebruiken.

### 3. Env-vars invullen (Vercel + lokaal `.env.local`)
```
RESEND_API_KEY=re_...                          # uit stap 1
MAIL_FROM=Bezwaar.WOZ <noreply@wozbezwaar.nl>  # jouw no-reply-afzender (geverifieerd domein)
MAIL_REPLY_TO=support@wozbezwaar.nl            # optioneel; antwoorden gaan hierheen
```
- In Vercel: **Project → Settings → Environment Variables** (omgeving **Production**).
- Daarna **één keer opnieuw deployen** (env-wijzigingen gelden pas voor de volgende deploy).

---

## Testen of het werkt
1. Doorloop een (test-mode) bestelling met een e-mailadres dat je zelf kunt openen.
2. Controleer of de mail binnenkomt.
3. In Supabase: de `orders`-rij heeft dan `delivery_method = 'email'` (i.p.v. `'web'`).
4. Mislukt het versturen? De fout staat in de Vercel-logs; de klant houdt altijd de
   webweergave op de success-pagina.

---

## Waar zit de code
- `lib/mail.js` — opbouw + verzending van de e-mail (HTML + platte tekst).
- `app/api/generate/route.js` — roept `sendBezwaarEmail(...)` aan na de generatie en
  logt `delivery_method`.
- `.env.example` — documenteert de drie env-vars.

## Andere afzender/provider later?
De verzending gebruikt de Resend REST API via een simpele `fetch`. Wil je ooit een andere
provider (Postmark, SES, SMTP), dan hoeft alleen `lib/mail.js` aangepast te worden.
