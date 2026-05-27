'use client'
import { useState } from 'react'

const s = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 50%, #2563eb 100%)' },
  hero: { padding: '60px 20px 40px', textAlign: 'center', color: 'white' },
  badge: { display: 'inline-block', background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '6px 16px', fontSize: 14, marginBottom: 20, backdropFilter: 'blur(10px)' },
  h1: { fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.1 },
  sub: { fontSize: 18, opacity: 0.9, maxWidth: 560, margin: '0 auto 40px' },
  steps: { display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 48 },
  step: { background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 20px', fontSize: 14, backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: 8 },
  card: { background: 'white', borderRadius: 24, boxShadow: '0 25px 50px rgba(0,0,0,0.15)', padding: '40px', maxWidth: 640, margin: '0 auto 60px', position: 'relative' },
  cardTitle: { fontSize: 24, fontWeight: 700, margin: '0 0 8px', color: '#1e293b' },
  cardSub: { fontSize: 15, color: '#64748b', margin: '0 0 32px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  fullWidth: { gridColumn: '1 / -1' },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: { width: '100%', padding: '12px 14px', border: '2px solid #e2e8f0', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: 'inherit' },
  textarea: { width: '100%', padding: '12px 14px', border: '2px solid #e2e8f0', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: 100, fontFamily: 'inherit' },
  hint: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  divider: { height: 1, background: '#e2e8f0', margin: '28px 0' },
  priceBox: { background: '#f0f9ff', border: '2px solid #bae6fd', borderRadius: 14, padding: '20px 24px', marginBottom: 24 },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontSize: 15, color: '#0369a1', fontWeight: 600 },
  price: { fontSize: 28, fontWeight: 800, color: '#0369a1' },
  priceNote: { fontSize: 13, color: '#64748b', marginTop: 4 },
  btn: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: 'white', border: 'none', borderRadius: 12, fontSize: 17, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  trust: { display: 'flex', justifyContent: 'center', gap: 24, padding: '0 20px 60px', flexWrap: 'wrap' },
  trustItem: { display: 'flex', alignItems: 'center', gap: 8, color: 'white', fontSize: 14, opacity: 0.9 },
  error: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 16px', color: '#dc2626', fontSize: 14, marginTop: 16 },
}

const initialForm = {
  naam: '', adres: '', postcode: '', gemeente: '',
  belastingjaar: new Date().getFullYear().toString(),
  wozWaarde: '', gewensteWaarde: '',
  argumenten: '',
  vergelijkObjecten: '',
}

export default function Home() {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [testLoading, setTestLoading] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const isValid = form.naam && form.adres && form.postcode && form.gemeente &&
    form.wozWaarde && form.gewensteWaarde && form.argumenten

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isValid) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Er ging iets mis. Probeer opnieuw.')
      }
    } catch {
      setError('Er ging iets mis. Controleer je internetverbinding.')
    } finally {
      setLoading(false)
    }
  }

  async function handleTest(e) {
    e.preventDefault()
    if (!isValid) return
    setTestLoading(true)
    setError('')
    try {
      const res = await fetch('/api/test-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setTestResult(data)
    } catch {
      setError('Test mislukt.')
    } finally {
      setTestLoading(false)
    }
  }

  const inputStyle = (focused) => ({
    ...s.input,
    borderColor: focused ? '#2563eb' : '#e2e8f0',
  })

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={s.badge}>Gemiddeld €800 belastingbesparing</div>
        <h1 style={s.h1}>Jouw WOZ-waarde<br />te hoog?</h1>
        <p style={s.sub}>Wij genereren een professioneel bezwaarschrift op maat. Direct klaar. Voor slechts €19.</p>
        <div style={s.steps}>
          {[['1', 'Vul je gegevens in'], ['2', 'Betaal veilig €19'], ['3', 'Download je bezwaar']].map(([n, t]) => (
            <div key={n} style={s.step}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>{n}.</span> {t}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '0 20px' }}>
        <div style={s.card}>
          <h2 style={s.cardTitle}>Jouw bezwaarschrift</h2>
          <p style={s.cardSub}>Vul je gegevens in en ontvang direct een professioneel bezwaarschrift.</p>

          <div style={s.grid}>
            <div style={s.fullWidth}>
              <label style={s.label}>Volledige naam *</label>
              <input style={s.input} value={form.naam} onChange={set('naam')} placeholder="Jan de Vries" required />
            </div>
            <div style={s.fullWidth}>
              <label style={s.label}>Adres van de woning *</label>
              <input style={s.input} value={form.adres} onChange={set('adres')} placeholder="Kerkstraat 12" required />
            </div>
            <div>
              <label style={s.label}>Postcode *</label>
              <input style={s.input} value={form.postcode} onChange={set('postcode')} placeholder="3220 AB" required />
            </div>
            <div>
              <label style={s.label}>Gemeente *</label>
              <input style={s.input} value={form.gemeente} onChange={set('gemeente')} placeholder="Voorne aan Zee" required />
            </div>
            <div>
              <label style={s.label}>Belastingjaar *</label>
              <input style={s.input} value={form.belastingjaar} onChange={set('belastingjaar')} placeholder="2025" required />
            </div>
            <div>
              <label style={s.label}>WOZ-waarde gemeente (€) *</label>
              <input style={s.input} type="number" value={form.wozWaarde} onChange={set('wozWaarde')} placeholder="485000" required />
              <div style={s.hint}>Staat op je WOZ-beschikking</div>
            </div>
            <div style={s.fullWidth}>
              <label style={s.label}>Jouw schatting werkelijke waarde (€) *</label>
              <input style={s.input} type="number" value={form.gewensteWaarde} onChange={set('gewensteWaarde')} placeholder="420000" required />
              <div style={s.hint}>Waarvoor denk jij dat de woning realistisch verkocht zou worden?</div>
            </div>
            <div style={s.fullWidth}>
              <label style={s.label}>Waarom is de WOZ-waarde te hoog? *</label>
              <textarea
                style={s.textarea}
                value={form.argumenten}
                onChange={set('argumenten')}
                placeholder="Bijv: slechte staat van onderhoud (verouderde keuken, badkamer), ligging aan drukke weg, kleine tuin, geen parkeerplaats..."
                required
              />
            </div>
            <div style={s.fullWidth}>
              <label style={s.label}>Vergelijkbare woningen (optioneel)</label>
              <textarea
                style={{ ...s.textarea, minHeight: 72 }}
                value={form.vergelijkObjecten}
                onChange={set('vergelijkObjecten')}
                placeholder="Bijv: Kerkstraat 8 (vergelijkbare woning, verkocht voor €410.000 in jan 2025)"
              />
              <div style={s.hint}>Voeg adressen toe van soortgelijke woningen die voor minder zijn verkocht. Versterkt je bezwaar enorm.</div>
            </div>
          </div>

          <div style={s.divider} />

          <div style={s.priceBox}>
            <div style={s.priceRow}>
              <div>
                <div style={s.priceLabel}>Professioneel bezwaarschrift</div>
                <div style={s.priceNote}>Direct te downloaden als PDF</div>
              </div>
              <div style={s.price}>€19</div>
            </div>
          </div>

          <button
            type="submit"
            style={{ ...s.btn, ...((!isValid || loading) ? s.btnDisabled : {}) }}
            disabled={!isValid || loading}
          >
            {loading ? 'Doorsturen naar betaling...' : 'Genereer mijn bezwaarschrift →'}
          </button>

          {error && <div style={s.error}>{error}</div>}

          <div style={{ textAlign: 'center', margin: '12px 0 0' }}>
            <button
              type="button"
              onClick={handleTest}
              style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
              disabled={!isValid || testLoading}
            >
              {testLoading ? 'Bezig...' : 'Gratis testen (zonder betaling)'}
            </button>
          </div>

          {testResult && (
            <div style={{ marginTop: 24, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
              <div style={{ fontWeight: 700, marginBottom: 12, color: '#1e293b' }}>Testbezwaar voor {testResult.adres}:</div>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, lineHeight: 1.7, color: '#334155', maxHeight: 300, overflowY: 'auto', fontFamily: 'monospace', margin: 0 }}>{testResult.bezwaar}</pre>
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button onClick={() => navigator.clipboard.writeText(testResult.bezwaar).then(() => alert('Gekopieerd!'))} style={{ padding: '8px 16px', background: '#1d4ed8', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Kopieer</button>
                <button onClick={() => { const w = window.open('','_blank'); w.document.write('<pre style="font-family:serif;font-size:12pt;line-height:1.8;max-width:700px;margin:40px auto;white-space:pre-wrap">'+testResult.bezwaar+'</pre>'); w.document.close(); w.print(); }} style={{ padding: '8px 16px', background: 'white', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Afdrukken / PDF</button>
                <button onClick={() => setTestResult(null)} style={{ padding: '8px 16px', background: 'white', color: '#94a3b8', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Sluiten</button>
              </div>
            </div>
          )}

          <p style={{ textAlign: 'center', fontSize: 13, color: '#94a3b8', marginTop: 16, marginBottom: 0 }}>
            Veilige betaling via Stripe. Na betaling direct beschikbaar.
          </p>
        </div>
      </form>

      <div style={s.trust}>
        {[['Professioneel', 'Juridisch correct Nederlands'], ['Persoonlijk', 'Op jouw situatie afgestemd'], ['Snel', 'Direct beschikbaar na betaling'], ['Veilig', 'SSL + Stripe betaling']].map(([title, sub]) => (
          <div key={title} style={s.trustItem}>
            <span style={{ fontSize: 20 }}>✓</span>
            <div><strong>{title}</strong><br /><span style={{ fontSize: 12 }}>{sub}</span></div>
          </div>
        ))}
      </div>
    </div>
  )
}
