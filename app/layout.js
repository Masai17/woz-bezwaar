export const metadata = {
  title: 'WOZ Bezwaar | Professioneel bezwaarschrift in minuten',
  description: 'Is jouw WOZ-waarde te hoog? Wij genereren een professioneel bezwaarschrift voor slechts €19. Direct te downloaden.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#f8fafc', color: '#1e293b' }}>
        {children}
      </body>
    </html>
  )
}
