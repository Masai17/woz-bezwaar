import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import Anthropic from '@anthropic-ai/sdk'
import { getSupabaseAdmin } from '../../../lib/supabaseAdmin'

const MODEL = 'claude-sonnet-4-6'

export async function GET(request) {
  const sessionId = request.nextUrl.searchParams.get('session_id')
  if (!sessionId) {
    return NextResponse.json({ error: 'Geen sessie-ID opgegeven.' }, { status: 400 })
  }

  // 1) Betaling verifiëren bij Stripe.
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

  // 2) Order ophalen (via order_id in metadata, fallback op stripe_session_id).
  const supabaseAdmin = getSupabaseAdmin()
  const orderId = session.metadata?.order_id
  let query = supabaseAdmin.from('orders').select('*')
  query = orderId ? query.eq('id', orderId) : query.eq('stripe_session_id', sessionId)
  const { data: order, error: fetchError } = await query.single()

  if (fetchError || !order) {
    console.error('Order niet gevonden:', fetchError)
    return NextResponse.json({ error: 'Aanvraag niet gevonden.' }, { status: 404 })
  }

  // Markeer als betaald (idempotent) + bewaar e-mailadres.
  const email = session.customer_details?.email || session.customer_email || order.email || null
  if (order.payment_status !== 'paid' || (email && email !== order.email)) {
    await supabaseAdmin.from('orders')
      .update({ payment_status: 'paid', email })
      .eq('id', order.id)
  }

  const respond = (bezwaar) => NextResponse.json({
    bezwaar, naam: order.naam, adres: order.adres, gemeente: order.gemeente,
  })

  // 3) Al gegenereerd? Direct teruggeven (idempotent — geen dubbele kosten,
  //    werkt als klant de pagina herlaadt of opnieuw opent).
  if (order.bezwaar_text && order.generation_status === 'done') {
    return respond(order.bezwaar_text)
  }

  // 4) Genereren met Claude.
  const vandaag = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
  const woz = order.woz_waarde_euro != null ? `€${order.woz_waarde_euro.toLocaleString('nl-NL')}` : 'onbekend'
  const gewenst = order.gewenste_waarde_euro != null ? `€${order.gewenste_waarde_euro.toLocaleString('nl-NL')}` : 'onbekend'

  const prompt = `Schrijf een professioneel WOZ-bezwaarschrift voor:
- Naam: ${order.naam}, Adres: ${order.adres}, ${order.postcode} ${order.gemeente}
- Belastingjaar: ${order.belastingjaar}
- WOZ-waarde gemeente: ${woz}
- Gewenste waarde: ${gewenst}
- Argumenten: ${order.argumenten}
${order.vergelijk_objecten ? `- Vergelijkbare woningen / referentieobjecten: ${order.vergelijk_objecten}` : ''}
- Datum: ${vandaag}
Schrijf formeel, juridisch correct, met alle benodigde onderdelen inclusief adresblok, betreft, gronden, verzoek om kostenvergoeding en handtekeningblok.${order.vergelijk_objecten ? ' Verwerk de genoemde vergelijkbare woningen expliciet als onderbouwing in de gronden.' : ''}`

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })
    const bezwaar = message.content[0].text

    await supabaseAdmin.from('orders').update({
      bezwaar_text: bezwaar,
      generation_status: 'done',
      generation_error: null,
      model: MODEL,
      generated_at: new Date().toISOString(),
      delivered_at: new Date().toISOString(),
      delivery_method: 'web',
    }).eq('id', order.id)

    return respond(bezwaar)
  } catch (err) {
    // GEEN stille sjabloon-fallback: fout vastleggen zodat we kunnen herstellen.
    console.error('Generatie mislukt:', err)
    await supabaseAdmin.from('orders').update({
      generation_status: 'failed',
      generation_error: String(err?.message || err).slice(0, 1000),
    }).eq('id', order.id)

    return NextResponse.json({
      error: 'Het opstellen is tijdelijk mislukt. Uw betaling is veilig en uw aanvraag is opgeslagen — wij leveren uw bezwaarschrift alsnog.',
    }, { status: 500 })
  }
}
