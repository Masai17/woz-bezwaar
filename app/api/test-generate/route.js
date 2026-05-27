import { NextResponse } from 'next/server'

export async function POST(request) {
  const m = await request.json()
  const vandaag = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
  const wozFormatted = Number(m.wozWaarde).toLocaleString('nl-NL')
  const gewenstFormatted = Number(m.gewensteWaarde).toLocaleString('nl-NL')
  const peildatum = Number(m.belastingjaar) - 1

  const bezwaar = [
    `${m.naam}`,
    `${m.adres}`,
    `${m.postcode} ${m.gemeente}`,
    ``,
    `${m.gemeente}, ${vandaag}`,
    ``,
    `Aan: Het College van Burgemeester en Wethouders`,
    `Gemeente ${m.gemeente}`,
    `t.a.v. de heffingsambtenaar`,
    ``,
    `Betreft: Bezwaarschrift WOZ-waarde ${m.adres}, belastingjaar ${m.belastingjaar}`,
    ``,
    `Geachte heffingsambtenaar,`,
    ``,
    `Ondergetekende, ${m.naam}, wonende te ${m.adres}, ${m.postcode} ${m.gemeente}, maakt hierbij bezwaar tegen de beschikking ingevolge de Wet waardering onroerende zaken (Wet WOZ) voor het belastingjaar ${m.belastingjaar}, waarbij de waarde van de onroerende zaak gelegen aan ${m.adres} te ${m.gemeente} is vastgesteld op €${wozFormatted}.`,
    ``,
    `GRONDEN VAN BEZWAAR`,
    ``,
    `1. Onjuiste waardering conform artikel 17 Wet WOZ`,
    `De vastgestelde waarde van €${wozFormatted} wijkt significant af van de werkelijke marktwaarde per peildatum 1 januari ${peildatum}. Op basis van recente verkooptransacties van vergelijkbare objecten in de directe omgeving schat bezwaarmaker de werkelijke waarde op maximaal €${gewenstFormatted}.`,
    ``,
    `2. Onderscheidende kenmerken niet meegewogen`,
    `${m.argumenten}. Deze factoren hebben een aantoonbaar negatief effect op de marktwaarde en zijn bij de taxatie onvoldoende in aanmerking genomen.`,
    ``,
    m.vergelijkObjecten
      ? `3. Vergelijkingsobjecten ondersteunen lagere waarde\n${m.vergelijkObjecten}. Deze transacties tonen aan dat de marktwaarde van vergelijkbare objecten significant lager ligt dan de vastgestelde WOZ-waarde.`
      : `3. Strijd met het gelijkheidsbeginsel\nVergelijkbare woningen in de directe omgeving zijn getaxeerd op lagere waarden, hetgeen een ongelijke behandeling oplevert die niet door objectieve feiten wordt gerechtvaardigd.`,
    ``,
    `ONDERBOUWING WAARDE`,
    ``,
    `Op basis van bovengenoemde factoren en de actuele marktomstandigheden per peildatum 1 januari ${peildatum} is de werkelijke marktwaarde van de onroerende zaak gelegen aan ${m.adres} te ${m.gemeente} naar de mening van bezwaarmaker niet hoger dan €${gewenstFormatted}.`,
    ``,
    `VERZOEK`,
    ``,
    `Op grond van het bovenstaande verzoekt bezwaarmaker u:`,
    `1. Het bezwaar gegrond te verklaren;`,
    `2. De WOZ-waarde te verlagen naar €${gewenstFormatted}, dan wel een onafhankelijke hertaxatie te laten uitvoeren;`,
    `3. De proceskosten te vergoeden conform het Besluit proceskosten bestuursrecht.`,
    ``,
    `Bezwaarmaker verzoekt uitdrukkelijk gehoord te worden alvorens op dit bezwaar wordt beslist (artikel 7:2 Awb).`,
    ``,
    `Hoogachtend,`,
    ``,
    `${m.naam}`,
    `${m.adres}`,
    `${m.postcode} ${m.gemeente}`,
    ``,
    `_______________________`,
    `Handtekening`,
    ``,
    `Datum: ${vandaag}`
  ].join('\n')

  return NextResponse.json({ bezwaar, naam: m.naam, adres: m.adres, gemeente: m.gemeente })
}
