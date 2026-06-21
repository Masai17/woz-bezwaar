import Stripe from 'stripe'
import { getSupabaseAdmin } from '../../../lib/supabaseAdmin'
import { generateAndDeliver } from '../../../lib/generateBezwaar'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  const sig = req.headers.get('stripe-signature')
  let event
  try {
    const body = await req.text()
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return Response.json({ error: 'Webhook signature ongeldig: ' + err.message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const orderId = session.metadata?.order_id
    if (!orderId) return Response.json({ ok: true })

    const email = session.customer_details?.email ?? null
    const supabase = getSupabaseAdmin()

    // Betaalstatus bijwerken (alleen als nog pending, voor idempotentie).
    await supabase.from('orders')
      .update({ payment_status: 'paid', email })
      .eq('id', orderId)
      .eq('payment_status', 'pending')

    // Order ophalen en generatie triggeren als nog niet gedaan.
    const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single()
    if (order && order.generation_status !== 'done') {
      try {
        await generateAndDeliver(supabase, order, email)
      } catch (err) {
        console.error('Webhook: generatie mislukt voor order', orderId, err)
        await supabase.from('orders').update({
          generation_status: 'failed',
          generation_error: String(err?.message || err).slice(0, 1000),
        }).eq('id', orderId)
      }
    }
  }

  // Altijd 200 teruggeven — Stripe retries zijn nutteloos als betaling al is opgeslagen.
  return Response.json({ ok: true })
}
