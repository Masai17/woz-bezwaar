// Gedeelde opmaak voor de juridische pagina's (voorwaarden/privacy/disclaimer).
export default function LegalShell({ title, updated, children }) {
  return (
    <>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <a href="/" className="brand">
            <span>Bezwaar<span className="dot">.</span>WOZ</span>
            <span className="mono">est. 2025 — NL</span>
          </a>
          <nav className="topnav">
            <a href="/#formulier" className="cta">Start bezwaar</a>
          </nav>
        </div>
      </header>

      <section className="block">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Juridisch</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 40, letterSpacing: '-0.02em', margin: '0 0 8px', lineHeight: 1.1 }}>{title}</h1>
          {updated && (
            <p className="mono" style={{ color: 'var(--ink-3)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 32px' }}>
              Laatst bijgewerkt: {updated}
            </p>
          )}
          <div className="legal-prose">{children}</div>
          <p style={{ marginTop: 44 }}>
            <a href="/" className="btn btn-ghost">← Terug naar home</a>
          </p>
        </div>
      </section>
    </>
  )
}
