import './globals.css'

export const metadata = {
  title: 'Bezwaar.WOZ — Professioneel bezwaarschrift in één uur',
  description: 'Te hoge WOZ-waarde? Wij stellen een juridisch onderbouwd bezwaarschrift voor u op. Eenmalig €29 — geen no-cure-no-pay-bureau dat uw vergoeding inpikt.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
