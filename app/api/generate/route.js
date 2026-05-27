import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import Anthropic from '@anthropic-ai/sdk'

export async function GET(request) {
  const sessionId = request.nextUrl.searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Geen sessie-ID opgegeven.' }, { status: 400 })
  }

  let session
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    session = await stripe.checkout.sessions.retrieve(sessionId)
  } catch (err) {
    return NextResponse.json({ error: 'Stripe fout: ' + err.message }, { status: 500 })
  }

  if (session.payment_status !== 'paid') {
    return NextResponse.json({ error: 'Betaling niet voltooid.' }, { status: 402 })
  }

  const m = session.metadata
  const vandaag = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })

  // TEST MODE: geeft voorbeeldbezwaar terug als Anthropic geen credits heeft
  const testBezwaar = `${m.naam}
${m.adres}
${m.postcode} ${m.gemeente}

${m.gemeente}, ${vandaag}

Aan: Het College van Burgemeester en Wethouders
Gemeente ${m.gemeente}
t.a.v. de heffingsambtenaar

Betreft: Bezwaarschrift WOZ-waarde ${m.adres}, belastingjaar ${m.belastingjaar}

Geachte heffingsambtenaar,

Ondergetekende, ${m.naam}, wonende te ${m.adres}, ${m.postcode} ${m.gemeente}, maakt hierbij bezwaar tegen de beschikking ingevolge de Wet waardering onroerende zaken (Wet WOZ) voor het belastingjaar ${m.belastingjaar}, waarbij de waarde van de onroerende zaak gelegen aan ${m.adres} te ${m.gemeente} is vastgesteld op €${Number(m.wozWaarde).toLocaleString('nl-NL')}.

GRONDEN VAN BEZWAAR

1. Onjuiste waardering conform artikel 17 Wet WOZ
De vastgestelde waarde van €${Number(m.wozWaarde).toLocaleString('nl-NL')} wijkt significant af van de werkelijke marktwaarde per peildatum 1 januari ${Number(m.belastingjaar) - 1}. Op basis van recente verkooptransacties van vergelijkbare objecten in de directe omgeving schat bezwaarmaker de werkelijke waarde op maximaal €${Number(m.gewensteWaarde).toLocaleString('nl-NL')}.

2. Onderscheidende kenmerken niet meegewogen
${m.argumenten}. Deze factoren hebben een aantoonbaar negatief effect op de marktwaarde en zijn bij de taxatie onvoldoende in aanmerking genomen.

3. Strijd met het gelijkheidsbeginsel
Vergelijkbare woningen in de directe omgeving zijn getaxeerd op lagere waarden, hetgeen een ongelijke behandeling oplevert die niet door objectieve feiten wordt gerechtvaardigd.

VERZOEK

Op grond van bovenstaande verzoekt bezwaarmaker u de WOZ-waarde te verlagen naar €${Number(m.gewensteWaarde).toLocaleString('nl-NL')}, dan wel een onafhankelijke hertaxatie te laten uitvoeren.

Tevens verzoekt bezwaarmaker om vergoeding van de proceskosten conform het Besluit proceskosten bestuursrecht.

Bezwaarmaker verzoekt gehoord te worden alvorens op dit bezwaar wordt beslist.

Hoogachtend,

${m.naam}
${m.adres}
${m.postcode} ${m.gemeente}

_______________________
Handtekening`

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: `Schrijf een professioneel WOZ-bezwaarschrift voor:
- Naam: ${m.naam}, Adres: ${m.adres}, ${m.postcode} ${m.gemeente}
- Belastingjaar: ${m.belastingjaar}
- WOZ-waarde gemeente: €${Number(m.wozWaarde).toLocaleString('nl-NL')}
- Gewenste waarde: €${Number(m.gewensteWaarde).toLocaleString('nl-NL')}
- Argumenten: ${m.argumenten}
- Datum: ${vandaag}
Schrijf formeel, juridisch correct, met alle benodigde onderdelen inclusief adresblok, betreft, gronden, verzoek om kostenvergoeding en handtekeningblok.` }],
    })
    return NextResponse.json({ bezwaar: message.content[0].text, naam: m.naam, adres: m.adres, gemeente: m.gemeente })
  } catch {
    // Geen credits: geef testbezwaar terug zodat de flow getest kan worden
    return NextResponse.json({ bezwaar: testBezwaar, naam: m.naam, adres: m.adres, gemeente: m.gemeente })
  }
}
