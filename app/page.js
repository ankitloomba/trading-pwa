'use client'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import PullToRefresh from '../../components/PullToRefresh'

export default function Home() {
  const [summary, setSummary] = useState({
    capital: 5000, todayPnl: 0, weekPnl: 0, winRate: 0, trades: 0
  })
  const [isLive, setIsLive] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(null)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/summary?period=today')
      const d = await res.json()
      if (d.total_trades > 0) {
        setSummary({
          capital: d.net_portfolio || 5000,
          todayPnl: d.total_pnl || 0,
          weekPnl: d.total_pnl || 0,
          winRate: d.win_rate || 0,
          trades: d.total_trades || 0
        })
        setIsLive(true)
      }
      setLastRefresh(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }))
    } catch(e) {}
  }, [])

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const fmt = v => v >= 0 ? `+₹${Math.round(v).toLocaleString()}` : `-₹${Math.abs(Math.round(v)).toLocaleString()}`

  return (
    <PullToRefresh onRefresh={refresh}>
      <div style={{ minHeight: '100dvh', background: '#f2f2f7' }}>

        <div style={{
          background: 'linear-gradient(160deg, #15803d 0%, #16a34a 60%, #22c55e 100%)',
          padding: '56px 20px 28px',
          paddingTop: 'calc(56px + env(safe-area-inset-top))'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', marginBottom: '4px' }}>
                {greeting}, Ankit
              </p>
              <h1 style={{ color: 'white', fontSize: '40px', fontWeight: '700', letterSpacing: '-1px', lineHeight: 1 }}>
                ₹{Math.round(summary.capital).toLocaleString()}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <span style={{
                  background: 'rgba(255,255,255,0.2)', color: 'white',
                  fontSize: '13px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px'
                }}>
                  {summary.todayPnl >= 0 ? '↑' : '↓'} {fmt(summary.todayPnl)} today
                </span>
                {isLive
                  ? <span style={{ background: 'rgba(134,239,172,0.3)', color: '#86efac', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>LIVE</span>
                  : <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>SAMPLE</span>
                }
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '28px' }}>🔥</div>
              {lastRefresh && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', marginTop: '4px' }}>Updated {lastRefresh}</p>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '20px' }}>
            {[
              { label: 'This week', value: fmt(summary.weekPnl), up: summary.weekPnl >= 0 },
              { label: 'Win rate', value: summary.winRate + '%', up: null },
              { label: 'Trades', value: summary.trades, up: null },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '14px', padding: '10px 12px', backdropFilter: 'blur(10px)' }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginBottom: '3px' }}>{s.label}</p>
                <p style={{ color: 'white', fontSize: '16px', fontWeight: '700' }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {!isLive && (
          <div style={{ margin: '12px 16px 0', background: '#fef9c3', borderRadius: '14px', padding: '10px 14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span>⏳</span>
            <p style={{ fontSize: '13px', color: '#854d0e' }}>Sample data. Pull down to refresh. Live data appears after first trade.</p>
          </div>
        )}

        <div style={{ padding: '16px' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active bots</p>

          <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', marginBottom: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)', padding: '16px 18px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#86efac', boxShadow: '0 0 0 3px rgba(134,239,172,0.3)' }}></div>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Live</span>
                  </div>
                  <p style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '2px' }}>Bank Nifty intraday</p>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>5-min breakout · RSI · Trailing stop</p>
                </div>
                <div style={{ fontSize: '28px' }}>🤖</div>
              </div>
            </div>
            <div style={{ padding: '14px 18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
                {[
                  { label: "Today's P&L", value: fmt(summary.todayPnl), color: summary.todayPnl >= 0 ? '#16a34a' : '#dc2626' },
                  { label: 'Trades', value: summary.trades, color: '#111827' },
                  { label: 'Win rate', value: summary.winRate + '%', color: '#111827' }
                ].map(s => (
                  <div key={s.label} style={{ background: '#f9fafb', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                    <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '3px' }}>{s.label}</p>
                    <p style={{ fontSize: '15px', fontWeight: '700', color: s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1.5px solid #e5e7eb', background: 'white', fontSize: '13px', fontWeight: '600', color: '#374151', cursor: 'pointer' }}>⏸ Pause</button>
                <Link href="/trades" style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1.5px solid #e5e7eb', background: 'white', fontSize: '13px', fontWeight: '600', color: '#374151', textAlign: 'center', textDecoration: 'none' }}>📋 Trades</Link>
                <Link href="/settings" style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1.5px solid #e5e7eb', background: 'white', fontSize: '13px', fontWeight: '600', color: '#374151', textAlign: 'center', textDecoration: 'none' }}>⚙️ Config</Link>
              </div>
            </div>
          </div>

          <Link href="/pnl" style={{ display: 'block', background: '#111827', color: 'white', textAlign: 'center', padding: '16px', borderRadius: '16px', fontSize: '15px', fontWeight: '700', textDecoration: 'none', boxShadow: '0 4px 14px rgba(17,24,39,0.25)' }}>
            View full P&L report →
          </Link>
        </div>
      </div>
    </PullToRefresh>
  )
}
