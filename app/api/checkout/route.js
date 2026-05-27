import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const form = await req.json()
    const base = process.env.NEXT_PUBLIC_BASE_URL

    // Sla formulierdata op in Stripe metadata (max 500 chars per waarde)
    const metadata = {
      naam: form.naam?.slice(0, 200) || '',
      adres: form.adres?.slice(0, 200) || '',
      postcode: form.postcode?.slice(0, 20) || '',
      gemeente: form.gemeente?.slice(0, 100) || '',
      belastingjaar: form.belastingjaar?.slice(0, 10) || '',
      wozWaarde: String(form.wozWaarde || ''),
      gewensteWaarde: String(form.gewensteWaarde || ''),
      argumenten: form.argumenten?.slice(0, 490) || '',
      vergelijkObjecten: form.vergelijkObjecten?.slice(0, 490) || '',
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'WOZ Bezwaarschrift',
            description: `Professioneel bezwaarschrift voor ${form.adres}, ${form.gemeente}`,
          },
          unit_amount: 1900, // €19,00
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${base}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/`,
      metadata,
      locale: 'nl',
    })

    return Response.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return Response.json({ error: 'Betaalsessie aanmaken mislukt.' }, { status: 500 })
  }
}
