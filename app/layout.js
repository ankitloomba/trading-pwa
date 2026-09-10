import './globals.css'
import BottomNav from '../components/BottomNav'

export const metadata = {
  title: 'Intra Gini 🔥',
  description: 'Intelligent intraday trading bot',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Intra Gini' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#15803d" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', async () => {
              try {
                const reg = await navigator.serviceWorker.register('/sw.js')
                console.log('SW registered')

                // Request notification permission
                if (Notification.permission === 'default') {
                  const perm = await Notification.requestPermission()
                  console.log('Notification permission:', perm)
                }
              } catch(e) {
                console.log('SW failed:', e)
              }
            })
          }
        `}} />
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
