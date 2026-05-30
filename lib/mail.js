// E-mailaflevering van het bezwaarschrift via Resend (REST API, geen extra dependency).
//
// INERT tot deze env-vars zijn gezet (dan stuurt de app automatisch):
//   RESEND_API_KEY  — Resend API-key (re_...)
//   MAIL_FROM       — afzender, bv: Bezwaar.WOZ <noreply@wozbezwaar.nl>
//   MAIL_REPLY_TO   — (optioneel) antwoordadres, standaard support@wozbezwaar.nl
//
// Let op: om vanaf een eigen domein (noreply@wozbezwaar.nl) te sturen moet dat
// domein eerst in Resend geverifieerd worden (DNS-records). Tot die tijd faalt
// het verzenden netjes (gelogd) en blijft de webweergave gewoon werken.

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

export function mailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.MAIL_FROM)
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ))
}

export async function sendBezwaarEmail({ to, naam, adres, gemeente, bezwaar }) {
  if (!mailConfigured()) return { sent: false, reason: 'not_configured' }
  if (!to) return { sent: false, reason: 'no_recipient' }

  const replyTo = process.env.MAIL_REPLY_TO || 'support@wozbezwaar.nl'
  const subject = `Uw WOZ-bezwaarschrift${adres ? ' voor ' + adres : ''}`

  const stappen = [
    'Controleer het document zorgvuldig.',
    'Onderteken het.',
    'Verstuur het binnen de bezwaartermijn (zes weken na dagtekening van uw WOZ-beschikking) naar uw gemeente en vraag om een ontvangstbevestiging.',
  ]

  const text =
    `Beste ${naam || 'klant'},\n\n` +
    `Bedankt voor uw aanvraag. Hieronder vindt u uw WOZ-bezwaarschrift` +
    `${gemeente ? ' voor de gemeente ' + gemeente : ''}.\n\n` +
    `Wat nu te doen:\n` +
    stappen.map((s, i) => `${i + 1}. ${s}`).join('\n') +
    `\n\nLet op: dit document is met behulp van AI opgesteld en is geen persoonlijk ` +
    `juridisch advies; u bent zelf verantwoordelijk voor controle en indiening.\n\n` +
    `--- UW BEZWAARSCHRIFT ---\n\n${bezwaar || ''}\n`

  const html =
    `<div style="font-family:Georgia,'Times New Roman',serif;color:#1a1612;max-width:640px;margin:0 auto">` +
    `<p>Beste ${escapeHtml(naam || 'klant')},</p>` +
    `<p>Bedankt voor uw aanvraag. Hieronder vindt u uw WOZ-bezwaarschrift` +
    `${gemeente ? ' voor de gemeente ' + escapeHtml(gemeente) : ''}.</p>` +
    `<p><strong>Wat nu te doen:</strong></p><ol>` +
    stappen.map((s) => `<li>${escapeHtml(s)}</li>`).join('') +
    `</ol>` +
    `<p style="font-size:13px;color:#6f6354">Dit document is met behulp van AI opgesteld en is ` +
    `geen persoonlijk juridisch advies; u bent zelf verantwoordelijk voor controle en indiening.</p>` +
    `<hr style="border:none;border-top:1px solid #cabd9f;margin:24px 0">` +
    `<pre style="white-space:pre-wrap;font-family:Georgia,serif;font-size:14px;line-height:1.7;margin:0">` +
    `${escapeHtml(bezwaar || '')}</pre></div>`

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: process.env.MAIL_FROM, to: [to], reply_to: replyTo, subject, text, html }),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      return { sent: false, reason: 'send_failed', detail: detail.slice(0, 300) }
    }
    return { sent: true }
  } catch (err) {
    return { sent: false, reason: 'exception', detail: String(err?.message || err).slice(0, 300) }
  }
}
