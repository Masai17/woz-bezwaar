import LegalShell from '../_components/LegalShell'

export const metadata = {
  title: 'Privacyverklaring — Bezwaar.WOZ',
  robots: { index: false },
}

export default function Privacy() {
  return (
    <LegalShell title="Privacyverklaring" updated="30 mei 2026">
      <p>
        Bezwaar.WOZ (handelsnaam van [Bedrijfsnaam], KvK [KvK-nummer]) is verwerkings­verantwoordelijke
        voor de verwerking van uw persoonsgegevens. Wij gaan zorgvuldig met uw gegevens om en houden
        ons aan de Algemene verordening gegevensbescherming (AVG).
      </p>

      <h2>Welke gegevens verwerken wij?</h2>
      <ul>
        <li>Naam, adres, postcode en gemeente van de woning;</li>
        <li>WOZ-waarde, uw geschatte waarde, belastingjaar en uw argumenten/vergelijkingsobjecten;</li>
        <li>Uw e-mailadres en betaalstatus (via onze betaaldienstverlener).</li>
      </ul>

      <h2>Waarvoor en op welke grondslag?</h2>
      <p>
        Wij gebruiken deze gegevens uitsluitend om het bezwaarschrift op te stellen en aan u te
        leveren. De grondslag is de uitvoering van de overeenkomst die u met ons sluit (art. 6 lid 1
        sub b AVG).
      </p>

      <h2>Met wie delen wij gegevens? (verwerkers)</h2>
      <ul>
        <li><strong>Stripe</strong> — betalingsverwerking;</li>
        <li><strong>Anthropic</strong> — het taalmodel dat het bezwaarschrift formuleert (API-invoer wordt niet gebruikt voor training);</li>
        <li><strong>Supabase</strong> — beveiligde opslag van uw aanvraag (EU);</li>
        <li><strong>Vercel</strong> — hosting van de website.</li>
      </ul>
      <p>Met deze partijen zijn verwerkersovereenkomsten gesloten. Wij verkopen uw gegevens niet.</p>

      <h2>Hoe lang bewaren wij uw gegevens?</h2>
      <p>
        Uw persoonsgegevens en het opgestelde document worden <strong>maximaal 30 dagen</strong>
        bewaard en daarna automatisch geanonimiseerd. Gegevens die wij wettelijk langer moeten
        bewaren (zoals de financiële transactiegegevens voor de Belastingdienst) bewaren wij zonder
        de direct herleidbare persoonsgegevens.
      </p>

      <h2>Uw rechten</h2>
      <p>
        U heeft recht op inzage, correctie en verwijdering van uw gegevens, en u kunt bezwaar maken
        tegen de verwerking. Stuur uw verzoek naar
        <a href="mailto:support@wozbezwaar.nl"> support@wozbezwaar.nl</a>. U kunt ook een klacht
        indienen bij de Autoriteit Persoonsgegevens.
      </p>
    </LegalShell>
  )
}
