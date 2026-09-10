const CACHE = 'intragini-v1'
const CHECK_INTERVAL = 30000 // 30 seconds
let lastNotifId = 0

self.addEventListener('install', e => {
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim())
  startPolling()
})

self.addEventListener('push', e => {
  const data = e.data?.json() || {}
  e.waitUntil(
    self.registration.showNotification(data.title || 'Intra Gini 🔥', {
      body: data.body || '',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
      data: data,
      actions: [
        { action: 'open', title: 'View' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    })
  )
})

self.addEventListener('notificationclick', e => {
  e.notification.close()
  if (e.action === 'open' || !e.action) {
    e.waitUntil(clients.openWindow('/'))
  }
})

// Poll DB for new notifications every 30 secs
function startPolling() {
  setInterval(async () => {
    try {
      const res = await fetch(`/api/notifications?after=${lastNotifId}`)
      const data = await res.json()
      if (data.notifications && data.notifications.length > 0) {
        for (const notif of data.notifications) {
          await self.registration.showNotification(notif.title, {
            body: notif.body,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            vibrate: notif.type === 'TRADE_OPEN' ? [300, 100, 300] :
                     notif.type === 'TRADE_CLOSE' ? [200, 100, 200, 100, 200] :
                     [100],
            tag: notif.type,
            data: { url: notif.type === 'DAILY_SUMMARY' ? '/pnl' : '/trades' }
          })
          lastNotifId = Math.max(lastNotifId, notif.id)
        }
      }
    } catch(e) {}
  }, CHECK_INTERVAL)
}
