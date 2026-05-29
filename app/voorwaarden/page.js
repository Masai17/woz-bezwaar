import LegalShell from '../_components/LegalShell'

export const metadata = {
  title: 'Algemene voorwaarden — Bezwaar.WOZ',
  robots: { index: false },
}

export default function Voorwaarden() {
  return (
    <LegalShell title="Algemene voorwaarden" updated="30 mei 2026">
      <h2>1. Wie wij zijn</h2>
      <p>
        Bezwaar.WOZ (hierna: &ldquo;wij&rdquo;) is een handelsnaam van [Bedrijfsnaam], ingeschreven
        bij de Kamer van Koophandel onder nummer [KvK-nummer], te bereiken via
        <a href="mailto:support@wozbezwaar.nl"> support@wozbezwaar.nl</a>.
      </p>

      <h2>2. De dienst</h2>
      <p>
        Wij stellen op basis van de door u verstrekte gegevens een concept-bezwaarschrift op tegen
        een WOZ-beschikking. Het document wordt opgesteld met behulp van kunstmatige intelligentie
        (zie onze <a href="/disclaimer">disclaimer</a>) en wordt u digitaal ter beschikking gesteld.
        <strong> U dient het bezwaarschrift zelf te controleren, te ondertekenen en in te dienen</strong>
        bij de betreffende gemeente. Wij treden niet namens u op en voeren geen procedure.
      </p>

      <h2>3. Prijs en betaling</h2>
      <p>
        De prijs bedraagt <strong>€29</strong> als eenmalig totaalbedrag. Er zijn geen bijkomende
        kosten en het is geen abonnement. Betaling verloopt via onze betaaldienstverlener (Stripe).
        De overeenkomst komt tot stand op het moment dat uw betaling is voltooid.
      </p>

      <h2>4. Directe levering en herroepingsrecht</h2>
      <p>
        Omdat het een op maat opgesteld digitaal product betreft dat direct na betaling wordt
        geleverd, verzoekt u bij het plaatsen van de bestelling uitdrukkelijk om directe uitvoering.
        U verklaart daarbij <strong>afstand te doen van uw herroepingsrecht</strong> zodra het
        bezwaarschrift is opgesteld. Vóór dat moment kunt u de overeenkomst kosteloos ontbinden.
      </p>

      <h2>5. Uw verantwoordelijkheid</h2>
      <ul>
        <li>U bent verantwoordelijk voor de juistheid en volledigheid van de aangeleverde gegevens.</li>
        <li>U controleert het document en bent zelf verantwoordelijk voor tijdige indiening binnen de bezwaartermijn van zes weken (art. 6:7 Awb).</li>
        <li>Wij geven geen garantie dat de gemeente uw bezwaar (geheel of gedeeltelijk) toewijst.</li>
      </ul>

      <h2>6. Aansprakelijkheid</h2>
      <p>
        Wij leveren een hulpmiddel, geen juridisch advies en geen gegarandeerd resultaat. Onze
        aansprakelijkheid is, voor zover wettelijk toegestaan, beperkt tot het door u betaalde bedrag.
        Wij zijn niet aansprakelijk voor gevolgschade, gemiste termijnen of besluiten van de gemeente.
      </p>

      <h2>7. Privacy</h2>
      <p>
        Wij verwerken uw gegevens conform onze <a href="/privacy">privacyverklaring</a>.
      </p>

      <h2>8. Toepasselijk recht</h2>
      <p>
        Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de
        bevoegde Nederlandse rechter.
      </p>
    </LegalShell>
  )
}
