'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const s = {
  page: { minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { background: 'white', borderRadius: 24, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', padding: '48px 40px', maxWidth: 700, width: '100%' },
  loading: { textAlign: 'center' },
  spinner: { width: 48, height: 48, border: '4px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 24px' },
  successIcon: { width: 64, height: 64, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 32 },
  h2: { fontSize: 26, fontWeight: 700, margin: '0 0 8px', color: '#1e293b', textAlign: 'center' },
  sub: { color: '#64748b', textAlign: 'center', marginBottom: 32 },
  bezwaarBox: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px', whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.7, color: '#334155', maxHeight: 400, overflowY: 'auto', marginBottom: 24, fontFamily: "'Courier New', monospace" },
  btnRow: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  btnPrimary: { flex: 1, minWidth: 160, padding: '14px 20px', background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  btnSecondary: { flex: 1, minWidth: 160, padding: '14px 20px', background: 'white', color: '#374151', border: '2px solid #e2e8f0', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  error: { textAlign: 'center', color: '#dc2626' },
  tip: { background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '16px', marginTop: 20, fontSize: 14, color: '#92400e' },
}

function SuccessContent() {
  const params = useSearchParams()
  const sessionId = params.get('session_id')
  const [status, setStatus] = useState('loading')
  const [bezwaar, setBezwaar] = useState('')
  const [meta, setMeta] = useState({})

  useEffect(() => {
    if (!sessionId) { setStatus('error'); return }
    fetch(`/api/generate?session_id=${sessionId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setStatus('error'); return }
        setBezwaar(data.bezwaar)
        setMeta({ naam: data.naam, adres: data.adres, gemeente: data.gemeente })
        setStatus('done')
      })
      .catch(() => setStatus('error'))
  }, [sessionId])

  function handlePrint() {
    const win = window.open('', '_blank')
    win.document.write(`<!DOCTYPE html><html><head><title>WOZ Bezwaarschrift</title>
      <style>body{font-family:'Times New Roman',serif;font-size:12pt;line-height:1.6;max-width:700px;margin:40px auto;padding:0 20px;color:#000}@media print{body{margin:20px}}</style>
      </head><body><pre style="white-space:pre-wrap;font-family:inherit">${bezwaar}</pre></body></html>`)
    win.document.close()
    win.focus()
    win.print()
  }

  function handleCopy() {
    navigator.clipboard.writeText(bezwaar).then(() => alert('Bezwaarschrift gekopieerd!'))
  }

  if (status === 'loading') return (
    <div style={s.loading}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={s.spinner} />
      <h2 style={{ ...s.h2, textAlign: 'center' }}>Bezwaarschrift wordt gegenereerd...</h2>
      <p style={s.sub}>Dit duurt maximaal 30 seconden.</p>
    </div>
  )

  if (status === 'error') return (
    <div style={s.error}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
      <h2 style={s.h2}>Er ging iets mis</h2>
      <p>Stuur een email naar <strong>support@wozbezwaar.nl</strong> met je sessie-ID: <code>{sessionId}</code></p>
      <p>Je ontvangt je bezwaarschrift alsnog binnen 24 uur.</p>
    </div>
  )

  return (
    <div>
      <div style={s.successIcon}>✓</div>
      <h2 style={s.h2}>Jouw bezwaarschrift is klaar!</h2>
      <p style={s.sub}>Voor {meta.adres} in {meta.gemeente}</p>
      <div style={s.bezwaarBox}>{bezwaar}</div>
      <div style={s.btnRow}>
        <button style={s.btnPrimary} onClick={handlePrint}>Afdrukken / Opslaan als PDF</button>
        <button style={s.btnSecondary} onClick={handleCopy}>Kopieer tekst</button>
      </div>
      <div style={s.tip}>
        <strong>Volgende stap:</strong> Stuur dit bezwaarschrift per post of e-mail naar de gemeente {meta.gemeente}.
        Je hebt 6 weken na de dagtekening van je WOZ-beschikking om bezwaar te maken.
        Vraag om een ontvangstbevestiging.
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <div style={s.page}>
      <div style={s.card}>
        <Suspense fallback={<div style={{ textAlign: 'center' }}>Laden...</div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  )
}
