'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

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
      <style>body{font-family:'Times New Roman',serif;font-size:12pt;line-height:1.7;max-width:700px;margin:40px auto;padding:0 20px;color:#000}@media print{body{margin:20px}}</style>
      </head><body><pre style="white-space:pre-wrap;font-family:inherit">${bezwaar}</pre></body></html>`)
    win.document.close()
    win.focus()
    win.print()
  }

  function handleCopy() {
    navigator.clipboard.writeText(bezwaar).then(() => alert('Bezwaarschrift gekopieerd!'))
  }

  if (status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3, margin: '0 auto 28px', borderColor: 'rgba(26,22,18,.15)', borderTopColor: 'var(--accent)' }}></div>
        <div className="eyebrow" style={{ marginBottom: 14 }}>In behandeling</div>
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 32, margin: '0 0 12px', letterSpacing: '-0.015em' }}>Uw bezwaarschrift wordt opgesteld…</h2>
        <p style={{ color: 'var(--ink-2)', maxWidth: '40ch', margin: '0 auto' }}>Dit duurt maximaal dertig seconden. Sluit dit venster niet — uw document wordt hier direct getoond.</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div style={{ padding: '40px 0' }}>
        <div className="eyebrow" style={{ marginBottom: 14, color: 'var(--danger)' }}>Fout</div>
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 32, margin: '0 0 16px', letterSpacing: '-0.015em' }}>Er is iets misgegaan</h2>
        <p style={{ color: 'var(--ink-2)' }}>Stuur een e-mail naar <a href="mailto:support@wozbezwaar.nl">support@wozbezwaar.nl</a> met uw sessie-ID:</p>
        <code style={{ display: 'inline-block', marginTop: 12, padding: '8px 12px', background: 'var(--cream-2)', fontFamily: 'var(--mono)', fontSize: 13 }}>{sessionId || '—'}</code>
        <p style={{ color: 'var(--ink-2)', marginTop: 16 }}>U ontvangt uw bezwaarschrift alsnog binnen 24 uur. Uw betaling is veilig — er is niets verloren.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 14, color: 'var(--positive)' }}>Voltooid · {new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
      <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 36, margin: '0 0 12px', letterSpacing: '-0.018em', lineHeight: 1.1 }}>
        Uw bezwaarschrift is gereed.
      </h2>
      <p style={{ color: 'var(--ink-2)', margin: '0 0 36px', fontSize: 17 }}>
        Voor <strong>{meta.adres}</strong> te {meta.gemeente}. Druk af, onderteken en verzend per post of e-mail naar uw gemeente. Vraag om een ontvangstbevestiging.
      </p>

      <article className="specimen" style={{ marginBottom: 32 }}>
        <div className="doc-meta">
          <span>Bezwaarschrift WOZ · {meta.gemeente}</span>
          <span>{new Date().toLocaleDateString('nl-NL')}</span>
        </div>
        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 14, lineHeight: 1.78, margin: 0, color: 'var(--ink)' }}>{bezwaar}</pre>
      </article>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={handlePrint}>Afdrukken / Opslaan als PDF <span className="arrow">→</span></button>
        <button className="btn btn-ghost" onClick={handleCopy}>Kopieer tekst</button>
      </div>

      <div style={{ marginTop: 36, padding: 24, background: 'var(--cream-2)', border: '1px solid var(--rule)' }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Volgende stap</div>
        <p style={{ margin: 0, color: 'var(--ink-2)', lineHeight: 1.6 }}>
          Verstuur dit bezwaarschrift per post of e-mail naar de gemeente <strong>{meta.gemeente}</strong>. U heeft <strong>zes weken</strong> na de dagtekening van uw WOZ-beschikking om bezwaar te maken (art. 6:7 Awb). Bewaar een kopie en vraag om een ontvangstbevestiging.
        </p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <a href="/" className="brand">
            <span>Bezwaar<span className="dot">.</span>WOZ</span>
            <span className="mono">est. 2025 — NL</span>
          </a>
        </div>
      </header>

      <section style={{ padding: '80px 0', minHeight: 'calc(100vh - 80px)' }}>
        <div className="wrap" style={{ maxWidth: 820 }}>
          <Suspense fallback={<div style={{ textAlign: 'center', padding: 40 }}>Laden…</div>}>
            <SuccessContent />
          </Suspense>
        </div>
      </section>
    </>
  )
}
