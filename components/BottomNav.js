'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', label: 'Home', icon: '⌂' },
  { href: '/pnl', label: 'P&L', icon: '📊' },
  { href: '/trades', label: 'Trades', icon: '📋' },
  { href: '/settings', label: 'Settings', icon: '⚙' },
]

export default function BottomNav() {
  const path = usePathname()
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', background: 'white', borderTop: '1px solid #f0f0f0', display: 'flex', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {tabs.map(t => (
        <Link key={t.href} href={t.href} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 4px 8px', fontSize: '11px', color: path === t.href ? '#16a34a' : '#9ca3af', textDecoration: 'none', gap: '2px', fontWeight: path === t.href ? '600' : '400' }}>
          <span style={{ fontSize: '20px' }}>{t.icon}</span>
          {t.label}
        </Link>
      ))}
    </nav>
  )
}
