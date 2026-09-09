import Link from 'next/link'

export default function Home() {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ minHeight: '100dvh', background: '#f2f2f7' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, #15803d 0%, #16a34a 60%, #22c55e 100%)',
        padding: '56px 20px 28px',
        paddingTop: 'calc(56px + env(safe-area-inset-top))'
      }}>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', marginBottom: '4px' }}>
          {greeting}, Ankit
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', marginBottom: '2px' }}>Total capital</p>
            <h1 style={{ color: 'white', fontSize: '40px', fontWeight: '700', letterSpacing: '-1px', lineHeight: 1 }}>
              ₹5,019
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '13px',
                fontWeight: '600',
                padding: '3px 10px',
                borderRadius: '20px'
              }}>↑ +₹340 today</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>+6.8%</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              width: '44px', height: '44px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px'
            }}>📈</div>
          </div>
        </div>

        {/* Mini stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginTop: '20px'
        }}>
          {[
            { label: 'This week', value: '+₹890', up: true },
            { label: 'Win rate', value: '33%', up: null },
            { label: 'Trades', value: '6', up: null },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '14px',
              padding: '10px 12px',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginBottom: '3px' }}>{s.label}</p>
              <p style={{ color: 'white', fontSize: '16px', fontWeight: '700' }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', paddingBottom: '8px' }}>

        {/* Section label */}
        <p style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Active bots
        </p>

        {/* Live Bot Card */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '12px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #15803d, #22c55e)',
            padding: '16px 18px 14px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#86efac', boxShadow: '0 0 0 3px rgba(134,239,172,0.3)' }}></div>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Live</span>
                </div>
                <p style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '2px' }}>Bank Nifty intraday</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>5-min breakout · RSI filter</p>
              </div>
              <div style={{ fontSize: '28px' }}>🤖</div>
            </div>
          </div>

          <div style={{ padding: '14px 18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
              {[
                { label: "Today's P&L", value: '+₹340', color: '#16a34a' },
                { label: 'Trades', value: '2', color: '#111827' },
                { label: 'Drawdown', value: '-0.3%', color: '#6b7280' }
              ].map(s => (
                <div key={s.label} style={{ background: '#f9fafb', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '3px' }}>{s.label}</p>
                  <p style={{ fontSize: '15px', fontWeight: '700', color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                flex: 1, padding: '10px', borderRadius: '12px',
                border: '1.5px solid #e5e7eb', background: 'white',
                fontSize: '13px', fontWeight: '600', color: '#374151', cursor: 'pointer'
              }}>⏸ Pause</button>
              <Link href="/trades" style={{
                flex: 1, padding: '10px', borderRadius: '12px',
                border: '1.5px solid #e5e7eb', background: 'white',
                fontSize: '13px', fontWeight: '600', color: '#374151',
                textAlign: 'center', textDecoration: 'none'
              }}>📋 Trades</Link>
              <Link href="/settings" style={{
                flex: 1, padding: '10px', borderRadius: '12px',
                border: '1.5px solid #e5e7eb', background: 'white',
                fontSize: '13px', fontWeight: '600', color: '#374151',
                textAlign: 'center', textDecoration: 'none'
              }}>⚙️ Config</Link>
            </div>
          </div>
        </div>

        {/* SIP Bot Card */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '12px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
        }}>
          <div style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d1d5db' }}></div>
                  <span style={{ color: '#9ca3af', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Scheduled</span>
                </div>
                <p style={{ fontSize: '17px', fontWeight: '700', color: '#111827', marginBottom: '2px' }}>Long-term SIP</p>
                <p style={{ fontSize: '13px', color: '#9ca3af' }}>Weekly ₹5,000 · Nifty50</p>
              </div>
              <div style={{
                background: '#f3f4f6', borderRadius: '12px',
                padding: '6px 12px', fontSize: '12px', fontWeight: '600', color: '#6b7280'
              }}>Auto</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                flex: 1, padding: '10px', borderRadius: '12px',
                border: '1.5px solid #e5e7eb', background: 'white',
                fontSize: '13px', fontWeight: '600', color: '#374151', cursor: 'pointer'
              }}>📊 Details</button>
              <button style={{
                flex: 1, padding: '10px', borderRadius: '12px',
                border: '1.5px solid #e5e7eb', background: 'white',
                fontSize: '13px', fontWeight: '600', color: '#374151', cursor: 'pointer'
              }}>✏️ Edit</button>
            </div>
          </div>
        </div>

        {/* P&L Button */}
        <Link href="/pnl" style={{
          display: 'block',
          background: '#111827',
          color: 'white',
          textAlign: 'center',
          padding: '16px',
          borderRadius: '16px',
          fontSize: '15px',
          fontWeight: '700',
          textDecoration: 'none',
          marginBottom: '8px',
          boxShadow: '0 4px 14px rgba(17,24,39,0.25)'
        }}>
          View full P&L report →
        </Link>
      </div>
    </div>
  )
}
