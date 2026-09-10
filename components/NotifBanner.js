'use client'
import { useState, useEffect } from 'react'

export default function NotifBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      setShow(true)
    }
  }, [])

  const enable = async () => {
    const perm = await Notification.requestPermission()
    if (perm === 'granted') {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.register('/sw.js')
        console.log('SW registered')
      }
      new Notification('Intra Gini 🔥', {
        body: 'Notifications enabled! You will be alerted on every trade.',
        icon: '/icon-192.png'
      })
    }
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={{
      margin: '12px 16px 0',
      background: '#111827',
      borderRadius: '16px',
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px'
    }}>
      <div>
        <p style={{ color: 'white', fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>🔔 Enable trade alerts</p>
        <p style={{ color: '#9ca3af', fontSize: '12px' }}>Get notified on every buy/sell</p>
      </div>
      <button onClick={enable} style={{
        background: '#16a34a', color: 'white',
        border: 'none', borderRadius: '10px',
        padding: '8px 14px', fontSize: '13px',
        fontWeight: '700', cursor: 'pointer',
        whiteSpace: 'nowrap'
      }}>
        Enable
      </button>
    </div>
  )
}
