import './globals.css'
import BottomNav from '../components/BottomNav'

export const metadata = {
  title: 'Bot Control Center',
  description: 'Trading bot monitor and control panel',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'BotCtrl' },
  viewport: { width: 'device-width', initialScale: 1, maximumScale: 1, viewportFit: 'cover' }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
      </head>
      <body style={{
        maxWidth: '430px',
        margin: '0 auto',
        minHeight: '100dvh',
        background: '#f2f2f7',
        position: 'relative',
        paddingBottom: 'calc(72px + env(safe-area-inset-bottom))'
      }}>
        <main>{children}</main>
        <BottomNav />
      </body>
    </html>
  )
}
