import LegalShell from '../_components/LegalShell'

export const metadata = {
  title: 'Disclaimer — Bezwaar.WOZ',
  robots: { index: false },
}

export default function Disclaimer() {
  return (
    <LegalShell title="Disclaimer" updated="30 mei 2026">
      <h2>Geen juridisch advies</h2>
      <p>
        Het via Bezwaar.WOZ opgestelde bezwaarschrift is een hulpmiddel en
        <strong> geen persoonlijk juridisch advies</strong>. Wij zijn geen advocaten- of
        belastingadvieskantoor en treden niet namens u op.
      </p>

      <h2>Opgesteld met AI</h2>
      <p>
        Het document wordt automatisch gegenereerd met behulp van kunstmatige intelligentie (het
        taalmodel Claude van Anthropic) op basis van de gegevens die u aanlevert. AI kan fouten
        maken of zaken onvolledig weergeven.
        <strong> Controleer het document daarom altijd zorgvuldig voordat u het ondertekent en indient.</strong>
      </p>

      <h2>Geen garantie op resultaat</h2>
      <p>
        Wij geven geen enkele garantie dat uw bezwaar door de gemeente (geheel of gedeeltelijk) wordt
        toegewezen of dat uw WOZ-waarde wordt verlaagd. De beoordeling ligt volledig bij de gemeente.
      </p>

      <h2>Uw verantwoordelijkheid</h2>
      <p>
        U bent zelf verantwoordelijk voor de juistheid van de aangeleverde gegevens, voor de controle
        van het document, en voor tijdige indiening binnen de wettelijke bezwaartermijn van zes weken
        na dagtekening van uw WOZ-beschikking (art. 6:7 Awb).
      </p>

      <p style={{ marginTop: 24 }}>
        Zie ook onze <a href="/voorwaarden">algemene voorwaarden</a> en
        <a href="/privacy"> privacyverklaring</a>.
      </p>
    </LegalShell>
  )
}
