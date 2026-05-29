'use client'
import { useState } from 'react'

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
      if (data.url) window.location.href = data.url
      else setError(data.error || 'Er ging iets mis. Probeer opnieuw.')
    } catch {
      setError('Er ging iets mis. Controleer uw internetverbinding.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* ===== top bar ===== */}
      <header className="topbar">
        <div className="wrap topbar-inner">
          <a href="#" className="brand">
            <span>Bezwaar<span className="dot">.</span>WOZ</span>
            <span className="mono">est. 2025 — NL</span>
          </a>
          <nav className="topnav">
            <a href="#hoe">Werkwijze</a>
            <a href="#voorbeeld">Voorbeeld</a>
            <a href="#faq">Veelgestelde vragen</a>
            <a href="#formulier" className="cta">Start bezwaar</a>
          </nav>
        </div>
      </header>

      {/* ===== hero ===== */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow">Wet WOZ — art. 22 jo. art. 30 Awr</div>
            <h1>Te hoge WOZ&#8209;waarde?<br /><em>Maak bezwaar</em> — zonder advocaat,<br />binnen één uur.</h1>
            <p className="sub">Wij stellen een juridisch onderbouwd bezwaarschrift voor u op, gebaseerd op uw situatie en de eisen van de Awb. U ondertekent en verzendt het zelf naar uw gemeente. Eenmalige kosten: <strong>€19</strong>. Geen abonnement, geen no&#8209;cure&#8209;no&#8209;pay-bureau dat uw vergoeding inpikt.</p>
            <div className="hero-ctas">
              <a href="#formulier" className="btn btn-primary">Stel mijn bezwaar op <span className="arrow">→</span></a>
              <a href="#voorbeeld" className="btn btn-ghost">Bekijk een voorbeeld</a>
            </div>

            <div className="hero-meta">
              <div><div className="k">Bezwaartermijn</div><div className="v">6 weken</div></div>
              <div><div className="k">Opstellen duurt</div><div className="v">± 60 sec.</div></div>
              <div><div className="k">Eenmalige kosten</div><div className="v">€19</div></div>
            </div>
          </div>

          <aside className="doc" aria-hidden="true">
            <div className="stamp">Concept</div>
            <div className="doc-head"><span>Bezwaarschrift</span><span>WOZ-2025-04918</span></div>
            <h3>Aan het college van burgemeester en wethouders<br />der gemeente Rotterdam</h3>
            <p className="addr">Postbus 70012<br />3000 KP Rotterdam</p>
            <p><strong>Betreft:</strong> Bezwaarschrift inzake WOZ&#8209;beschikking 2025</p>
            <p>Geachte heer/mevrouw,</p>
            <p>Hierbij maak ik, ondergetekende, op grond van artikel 22 van de Wet waardering onroerende zaken juncto artikel 30 van de Algemene wet inzake rijksbelastingen, tijdig bezwaar tegen de WOZ&#8209;beschikking d.d. 28 februari 2025 met betrekking tot de onroerende zaak gelegen aan de Hoogstraat 124 te 3011 PT Rotterdam.</p>
            <p>De vastgestelde waarde van € 485.000 acht ik niet in overeenstemming met de werkelijke waarde in het economisch verkeer per de waardepeildatum 1 januari 2024 …</p>
          </aside>
        </div>
      </section>

      {/* ===== strip ===== */}
      <section className="strip">
        <div className="wrap strip-inner">
          <span><span className="dot"></span> Conform Awb</span>
          <span><span className="dot"></span> Beveiligde betaling via Stripe</span>
          <span><span className="dot"></span> iDEAL geaccepteerd</span>
          <span><span className="dot"></span> Geen abonnement</span>
          <span><span className="dot"></span> Werkt in alle 342 gemeenten</span>
        </div>
      </section>

      {/* ===== werkwijze ===== */}
      <span className="anchor" id="hoe"></span>
      <section className="block">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Werkwijze — drie stappen</div>
              <h2>Snel, sober en juridisch correct.</h2>
            </div>
            <p className="lede">Geen videogesprekken, geen makelaar over de vloer, geen wachtkamer. U levert de feiten — wij leveren de tekst. Het bezwaarschrift voldoet aan de vormvereisten van artikel 6:5 Awb.</p>
          </div>

          <div className="steps">
            <div className="step">
              <div className="num">I.</div>
              <h4>U vult de feiten in</h4>
              <p>Adres, WOZ&#8209;waarde, uw schatting en de argumenten waarom de waarde te hoog is — onderhoud, ligging, vergelijkingsobjecten.</p>
              <div className="meta">± 5 minuten</div>
            </div>
            <div className="step">
              <div className="num">II.</div>
              <h4>Wij stellen het op</h4>
              <p>Een taalmodel formuleert het bezwaarschrift volgens de standaard juridische opbouw, met verwijzing naar de relevante wettelijke bepalingen.</p>
              <div className="meta">± 60 seconden</div>
            </div>
            <div className="step">
              <div className="num">III.</div>
              <h4>U ondertekent en verstuurt</h4>
              <p>U ontvangt het document direct als PDF. Ondertekenen, per post of e&#8209;mail verzenden naar uw gemeente, en een ontvangstbevestiging vragen.</p>
              <div className="meta">Diezelfde dag verzonden</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== voorbeeld ===== */}
      <span className="anchor" id="voorbeeld"></span>
      <section className="block">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Voorbeeld — anonieme casus</div>
              <h2>Hoe een<br /><em>bezwaarschrift</em> eruitziet.</h2>
            </div>
            <p className="lede">Hieronder een fragment uit een werkelijk gegenereerd bezwaar (gegevens geanonimiseerd). De volledige tekst telt 2 – 3 pagina's, afhankelijk van het aantal argumenten en vergelijkingsobjecten dat u aanlevert.</p>
          </div>

          <div className="specimen-wrap">
            <div className="specimen-side">
              <h3>Wat zit er in het document</h3>
              <p>Alle onderdelen die de gemeente verplicht is in behandeling te nemen, in de volgorde zoals de bezwaarcommissie ze verwacht:</p>
              <ul>
                <li><span className="check">✓</span><span>Aanhef en correcte adressering aan B&amp;W</span></li>
                <li><span className="check">✓</span><span>Verwijzing naar artikel 22 Wet WOZ en artikel 6:4 Awb</span></li>
                <li><span className="check">✓</span><span>Onderbouwing van de werkelijke waarde</span></li>
                <li><span className="check">✓</span><span>Uw argumenten, juridisch geformuleerd</span></li>
                <li><span className="check">✓</span><span>Vergelijkingsobjecten met onderbouwing</span></li>
                <li><span className="check">✓</span><span>Verzoek om gehoord te worden (art. 7:2 Awb)</span></li>
                <li><span className="check">✓</span><span>Ondertekeningsblok en bijlagenoverzicht</span></li>
              </ul>
            </div>

            <article className="specimen">
              <div className="doc-meta"><span>Casus 2025-A · geanonimiseerd</span><span>Pagina 1 / 2</span></div>
              <p className="title">Bezwaarschrift inzake WOZ&#8209;beschikking belastingjaar 2025</p>
              <p>Geachte heer/mevrouw,</p>
              <p>Hierbij maak ik, ondergetekende, op grond van artikel 22 van de Wet waardering onroerende zaken juncto artikel 6:4 van de Algemene wet bestuursrecht, tijdig bezwaar tegen de WOZ&#8209;beschikking d.d. 28 februari 2025, met betrekking tot de onroerende zaak gelegen aan [adres], voor het belastingjaar 2025.</p>
              <p>De gemeente heeft de waarde per de waardepeildatum 1 januari 2024 vastgesteld op € 485.000. Ik ben van mening dat deze waarde aanzienlijk te hoog is en niet in overeenstemming met de waarde in het economisch verkeer, zoals bedoeld in artikel 17, tweede lid, Wet WOZ. Naar mijn oordeel bedraagt de werkelijke waarde ten hoogste € 420.000, en wel om de hierna te noemen redenen.</p>
              <p><strong>1. Onderhoudstoestand.</strong> De woning verkeert in een gedateerde staat. De keuken (bouwjaar circa 1998) en badkamer (circa 2001) zijn niet vernieuwd; de cv-installatie dateert uit 2009. Een ervaren koper zal hier rekening mee houden bij een koopprijs, hetgeen door de gemeente niet kenbaar in de waardering is meegewogen…</p>
              <div className="gate">
                <small>— resterende tekst opgenomen in PDF —</small>
                <strong>Volledig bezwaar = 2 pagina's</strong>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ===== formulier ===== */}
      <span className="anchor" id="formulier"></span>
      <section className="block" style={{ background: 'var(--cream-2)' }}>
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Aanvraag — bezwaarschrift</div>
              <h2>Vul uw gegevens in.</h2>
            </div>
            <p className="lede">Alle velden gemarkeerd met * zijn verplicht. Er gaan geen gegevens naar de gemeente totdat ú het document heeft verzonden.</p>
          </div>

          <form className="form-shell" onSubmit={handleSubmit}>
            <div className="doc-meta">
              <span>Aanvraagformulier · WOZ-{new Date().getFullYear()}</span>
              <span>Versie 1.0 — Awb-conform</span>
            </div>
            <h3 className="form-title">Aanvraag bezwaarschrift WOZ</h3>
            <p className="form-sub">De informatie hieronder vormt de feitelijke basis van uw bezwaar. Wees zo specifiek mogelijk — hoe concreter de argumentatie, hoe sterker het bezwaar.</p>

            {/* I */}
            <div className="formsection">
              <div>
                <div className="roman">I.</div>
                <div className="sec-title">Persoonsgegevens</div>
                <div className="sec-hint">Zoals vermeld op uw WOZ-beschikking.</div>
              </div>
              <div className="field-grid">
                <div className="field full">
                  <label>Volledige naam *</label>
                  <input required placeholder="J. de Vries" value={form.naam} onChange={set('naam')} />
                </div>
                <div className="field full">
                  <label>Adres van de woning *</label>
                  <input required placeholder="Kerkstraat 12" value={form.adres} onChange={set('adres')} />
                </div>
                <div className="field">
                  <label>Postcode *</label>
                  <input required placeholder="3011 PT" value={form.postcode} onChange={set('postcode')} />
                </div>
                <div className="field">
                  <label>Gemeente *</label>
                  <input required placeholder="Rotterdam" value={form.gemeente} onChange={set('gemeente')} />
                </div>
              </div>
            </div>

            {/* II */}
            <div className="formsection">
              <div>
                <div className="roman">II.</div>
                <div className="sec-title">Waardegegevens</div>
                <div className="sec-hint">Van uw WOZ-beschikking en uw eigen schatting.</div>
              </div>
              <div className="field-grid">
                <div className="field">
                  <label>Belastingjaar *</label>
                  <input required placeholder="2025" value={form.belastingjaar} onChange={set('belastingjaar')} />
                </div>
                <div className="field">
                  <label>WOZ-waarde gemeente (€) *</label>
                  <input type="number" required placeholder="485000" value={form.wozWaarde} onChange={set('wozWaarde')} />
                </div>
                <div className="field full">
                  <label>Uw schatting werkelijke waarde (€) *</label>
                  <input type="number" required placeholder="420000" value={form.gewensteWaarde} onChange={set('gewensteWaarde')} />
                  <div className="hint">Waarvoor zou de woning naar uw inzicht realistisch verkocht zijn op de waardepeildatum?</div>
                </div>
              </div>
            </div>

            {/* III */}
            <div className="formsection">
              <div>
                <div className="roman">III.</div>
                <div className="sec-title">Argumentatie</div>
                <div className="sec-hint">De kern van uw bezwaar. Wees concreet.</div>
              </div>
              <div className="field-grid">
                <div className="field full">
                  <label>Waarom is de WOZ-waarde te hoog? *</label>
                  <textarea required placeholder="Bijv: verouderde keuken (bouwjaar 1998), gedateerde badkamer, geen isolatie spouwmuren, ligging aan drukke doorgaande weg, geen eigen parkeerplaats, kleine tuin op het noorden…" value={form.argumenten} onChange={set('argumenten')} />
                </div>
                <div className="field full">
                  <label>Vergelijkbare woningen (optioneel)</label>
                  <textarea placeholder={"Kerkstraat 8 — vergelijkbare hoekwoning, verkocht voor € 410.000 in januari 2025.\nKerkstraat 22 — verkocht € 425.000 in november 2024."} value={form.vergelijkObjecten} onChange={set('vergelijkObjecten')} />
                  <div className="hint">Aantoonbaar lagere verkoopprijzen van vergelijkbare woningen versterken uw bezwaar aanzienlijk.</div>
                </div>
              </div>
            </div>

            {/* IV — prijs */}
            <div className="price-block">
              <div>
                <div className="p-label">IV. — Totaal</div>
                <div className="p-desc">Eenmalig honorarium voor het opstellen van uw bezwaarschrift, direct te downloaden als PDF.</div>
              </div>
              <div className="p-amount">€19<small>,—</small></div>
            </div>

            <div className="submit-row">
              <button className="btn btn-primary" type="submit" disabled={!isValid || loading}>
                {loading ? <><span className="spinner"></span> Doorsturen…</> : <>Stel bezwaarschrift op <span className="arrow">→</span></>}
              </button>
            </div>

            {error && <div className="error-note">{error}</div>}

            <p style={{ margin: '36px 0 0', fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', borderTop: '1px solid var(--rule-2)', paddingTop: 20 }}>
              Beveiligde betaling via Stripe · iDEAL · Bancontact · Geen abonnement
            </p>
          </form>
        </div>
      </section>

      {/* ===== faq ===== */}
      <span className="anchor" id="faq"></span>
      <section className="block">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Veelgestelde vragen</div>
              <h2>Wat u moet weten <em>vooraf.</em></h2>
            </div>
            <p className="lede">Bezwaar maken tegen de WOZ is een wettelijk recht. Hieronder de antwoorden op de vragen die wij het vaakst krijgen — eerlijk en zonder verkooppraat.</p>
          </div>

          <div className="faq">
            <details open>
              <summary>Hoeveel tijd heb ik om bezwaar te maken? <span className="plus">+</span></summary>
              <p>Zes weken na de dagtekening van uw WOZ-beschikking (art. 6:7 Awb). Daarna verloopt het recht op bezwaar voor dat belastingjaar — u krijgt dan pas opnieuw een kans bij de volgende beschikking.</p>
            </details>
            <details>
              <summary>Is dit niet hetzelfde als een no&#8209;cure&#8209;no&#8209;pay-bureau? <span className="plus">+</span></summary>
              <p>Nee. Bij no&#8209;cure&#8209;no&#8209;pay innen die bureaus de proceskostenvergoeding van de gemeente — die kan oplopen tot enkele honderden euro's per zaak. Wij vragen eenmalig €19; ú houdt de eventuele proceskostenvergoeding zelf.</p>
            </details>
            <details>
              <summary>Werkt dit voor elke gemeente in Nederland? <span className="plus">+</span></summary>
              <p>Ja. De Wet WOZ is landelijk en gelijk voor alle 342 gemeenten. Het bezwaarschrift wordt geadresseerd aan het college van B&amp;W van de gemeente die de beschikking heeft afgegeven.</p>
            </details>
            <details>
              <summary>Wat als mijn bezwaar wordt afgewezen? <span className="plus">+</span></summary>
              <p>U kunt binnen zes weken na de uitspraak op bezwaar in beroep bij de rechtbank, sector bestuursrecht. Voor het beroepschrift bieden wij momenteel geen dienst aan — daarvoor adviseren wij contact op te nemen met een belastingadviseur.</p>
            </details>
            <details>
              <summary>Hoe wordt het bezwaarschrift opgesteld? <span className="plus">+</span></summary>
              <p>Op basis van uw input door het taalmodel Claude (Anthropic), gestructureerd volgens de standaard juridische opbouw van een Awb-bezwaarschrift. U bent zelf eindverantwoordelijk voor de inhoud — controleer het document zorgvuldig voor verzending.</p>
            </details>
            <details>
              <summary>Worden mijn gegevens bewaard? <span className="plus">+</span></summary>
              <p>Uw aanvraag wordt verwerkt om het document te genereren en wordt vervolgens niet langer dan dertig dagen bewaard. We verkopen geen gegevens en wij delen niets met derden anders dan strikt noodzakelijk voor de betaling (Stripe) en de tekstgeneratie (Anthropic).</p>
            </details>
          </div>
        </div>
      </section>

      {/* ===== footer ===== */}
      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div className="brandblock">
              <div className="name">Bezwaar<span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>.</span>WOZ</div>
              <div className="desc">Een eenvoudige dienst voor het opstellen van WOZ-bezwaarschriften, gemaakt in Nederland.</div>
            </div>
            <div>
              <h5>Dienst</h5>
              <ul>
                <li><a href="#hoe">Werkwijze</a></li>
                <li><a href="#voorbeeld">Voorbeeld</a></li>
                <li><a href="#formulier">Start bezwaar</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h5>Juridisch</h5>
              <ul>
                <li><a href="#">Algemene voorwaarden</a></li>
                <li><a href="#">Privacyverklaring</a></li>
                <li><a href="#">Verwerkersovereenkomst</a></li>
                <li><a href="#">Disclaimer</a></li>
              </ul>
            </div>
            <div>
              <h5>Contact</h5>
              <ul>
                <li><a href="mailto:support@wozbezwaar.nl">support@wozbezwaar.nl</a></li>
                <li>Antwoord binnen 24 uur</li>
                <li>KvK 00000000</li>
              </ul>
            </div>
          </div>

          <div className="foot-bottom">
            <div>© {new Date().getFullYear()} — Bezwaar.WOZ. Alle rechten voorbehouden.</div>
            <div className="badges">
              <span className="badge">Stripe</span>
              <span className="badge">iDEAL</span>
              <span className="badge">SSL · TLS 1.3</span>
              <span className="badge">AVG / GDPR</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
