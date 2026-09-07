'use client'
import { useState, useEffect } from 'react'

const filterOptions = ['all','wins','losses']

export default function Trades() {
  const [filter, setFilter] = useState('all')
  const [period, setPeriod] = useState('week')
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/trades?filter=${filter}&period=${period}`)
      .then(r => r.json())
      .then(d => { setTrades(d.trades || []); setLoading(false) })
  }, [filter, period])

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h1 className="text-lg font-medium">Trade history</h1>
        <span className="text-sm text-gray-400">{trades.length} trades</span>
      </div>

      <div className="flex gap-2 px-4 py-2 overflow-x-auto">
        {['today','week','month','year'].map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition-all ${period === p ? 'bg-blue-50 text-blue-600 border-blue-200' : 'border-gray-200 text-gray-500'}`}>
            {p.charAt(0).toUpperCase()+p.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex gap-2 px-4 pb-2">
        {filterOptions.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${filter === f ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-500'}`}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-gray-400 text-sm">Loading...</div>
      ) : (
        <div className="px-4">
          {trades.length === 0 ? (
            <p className="text-center py-8 text-gray-400 text-sm">No trades found</p>
          ) : trades.map((t, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-xs text-gray-400">{t.entry_time}</p>
                <p className="text-sm font-medium">{t.symbol} · BUY → SELL</p>
                <p className="text-xs text-gray-400">Entry ₹{parseFloat(t.entry_price).toLocaleString()} · Exit ₹{parseFloat(t.exit_price).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${t.pnl > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {t.pnl > 0 ? '+' : ''}₹{Math.abs(parseFloat(t.pnl)).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">{t.reason} {parseFloat(t.pnl_pct) > 0 ? '+' : ''}{parseFloat(t.pnl_pct).toFixed(2)}%</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
