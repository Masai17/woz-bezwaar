import Stripe from 'stripe'
import { getSupabaseAdmin } from '../../../lib/supabaseAdmin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const toInt = (v) => {
  const n = parseInt(String(v ?? '').replace(/[^\d]/g, ''), 10)
  return Number.isFinite(n) ? n : null
}

export async function POST(req) {
  try {
    const form = await req.json()
    const base = process.env.NEXT_PUBLIC_BASE_URL
    const supabaseAdmin = getSupabaseAdmin()

    // 1) Order opslaan in Supabase (volledige gegevens, geen afkapping).
    const { data: order, error: insertError } = await supabaseAdmin
      .from('orders')
      .insert({
        payment_status: 'pending',
        amount_cents: 2900,
        naam: form.naam || null,
        adres: form.adres || null,
        postcode: form.postcode || null,
        gemeente: form.gemeente || null,
        belastingjaar: form.belastingjaar || null,
        woz_waarde_euro: toInt(form.wozWaarde),
        gewenste_waarde_euro: toInt(form.gewensteWaarde),
        argumenten: form.argumenten || null,
        vergelijk_objecten: form.vergelijkObjecten || null,
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('Supabase insert error:', insertError)
      return Response.json({ error: 'Aanvraag opslaan mislukt.' }, { status: 500 })
    }

    // 2) Stripe-sessie: alleen het order_id in metadata.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'WOZ Bezwaarschrift',
            description: `Professioneel bezwaarschrift voor ${form.adres}, ${form.gemeente}`,
          },
          unit_amount: 2900, // €29,00
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${base}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/`,
      metadata: { order_id: order.id },
      locale: 'nl',
    })

    // 3) Koppel de Stripe-sessie aan de order.
    await supabaseAdmin
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id)

    return Response.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return Response.json({ error: 'Betaalsessie aanmaken mislukt.' }, { status: 500 })
  }
}
