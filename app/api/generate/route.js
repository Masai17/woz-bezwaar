import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseAdmin } from '../../../lib/supabaseAdmin'
import { generateAndDeliver } from '../../../lib/generateBezwaar'

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

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  let order, fetchError
  try {
    ;({ data: order, error: fetchError } = await query.abortSignal(controller.signal).single())
  } finally {
    clearTimeout(timer)
  }

  if (fetchError || !order) {
    console.error('Order niet gevonden:', fetchError)
    return NextResponse.json({ error: 'Aanvraag niet gevonden.' }, { status: 404 })
  }

  const email = session.customer_details?.email || session.customer_email || order.email || null
  if (!email) console.warn('Order zonder e-mailadres:', order.id)

  if (order.payment_status !== 'paid' || (email && email !== order.email)) {
    await supabaseAdmin.from('orders').update({ payment_status: 'paid', email }).eq('id', order.id)
  }

  const respond = (bezwaar) => NextResponse.json({
    bezwaar, naam: order.naam, adres: order.adres, gemeente: order.gemeente,
  })

  // 3) Idempotent: al gegenereerd? Direct teruggeven.
  if (order.bezwaar_text && order.generation_status === 'done') {
    return respond(order.bezwaar_text)
  }

  // 4) Genereren via gedeelde module.
  try {
    const bezwaar = await generateAndDeliver(supabaseAdmin, order, email)
    return respond(bezwaar)
  } catch (err) {
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
