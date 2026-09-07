import './globals.css'
import BottomNav from '../components/BottomNav'

export const metadata = {
  title: 'Bot Control Center',
  description: 'Trading bot monitor',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ maxWidth: '430px', margin: '0 auto', minHeight: '100vh', paddingBottom: '80px' }}>
        {children}
        <BottomNav />
      </body>
    </html>
  )
}
