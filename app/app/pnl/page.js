'use client'
import { useState, useEffect } from 'react'

const filters = ['today','week','month','year','all']
const labels = { today:'Today', week:'This week', month:'Month', year:'Year', all:'All time' }

export default function PnL() {
  const [period, setPeriod] = useState('week')
  const [summary, setSummary] = useState(null)
  const [bars, setBars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`/api/summary?period=${period}`).then(r => r.json()),
      fetch(`/api/pnl?period=${period}`).then(r => r.json())
    ]).then(([s, p]) => {
      setSummary(s)
      setBars(p.bars || [])
      setLoading(false)
    })
  }, [period])

  const max = bars.length ? Math.max(...bars.map(b => Math.abs(b.pnl))) : 1
  const fmt = v => v >= 0 ? `+₹${v.toLocaleString()}` : `-₹${Math.abs(v).toLocaleString()}`

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h1 className="text-lg font-medium">P&L</h1>
        <span className="text-sm text-gray-400">Export ↓</span>
      </div>

      <div className="flex gap-2 px-4 py-2 overflow-x-auto">
        {filters.map(f => (
          <button key={f} onClick={() => setPeriod(f)}
            className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition-all ${period === f ? 'bg-blue-50 text-blue-600 border-blue-200' : 'border-gray-200 text-gray-500'}`}>
            {labels[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-gray-400 text-sm">Loading...</div>
      ) : summary && (
        <>
          <div className="mx-4 mb-3 bg-gray-50 rounded-xl p-3">
            {[
              ['Total P&L', fmt(summary.total_pnl), summary.total_pnl >= 0],
              ['Total trades', summary.total_trades, null],
              ['Wins', summary.wins, true],
              ['Losses', summary.losses, false],
              ['Win rate', `${summary.win_rate}%`, null],
              ['Best trade', fmt(summary.best_trade), true],
              ['Worst trade', fmt(summary.worst_trade), false],
              ['Capital in', `₹${summary.capital_in?.toLocaleString()}`, null],
              ['Capital out', `₹${summary.capital_out?.toLocaleString()}`, null],
              ['Net portfolio', `₹${Math.round(summary.net_portfolio)?.toLocaleString()}`, true],
            ].map(([k, v, pos]) => (
              <div key={k} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-500">{k}</span>
                <span className={`text-sm font-medium ${pos === true ? 'text-green-600' : pos === false ? 'text-red-500' : ''}`}>{v}</span>
              </div>
            ))}
          </div>

          <div className="px-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">Day by day</p>
            {bars.map((bar, i) => (
              <div key={i} className="flex items-center gap-2 mb-1.5">
                <span className="text-xs text-gray-400 w-8">{bar.label}</span>
                <div className="flex-1 bg-gray-100 rounded h-5 overflow-hidden">
                  <div className={`h-full rounded flex items-center px-2 text-xs font-medium ${bar.pnl >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}
                    style={{ width: `${Math.round((Math.abs(bar.pnl) / max) * 85) + 5}%` }}>
                    {fmt(bar.pnl)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
