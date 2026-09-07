'use client'
import { useState } from 'react'

const all = [
  { time:'Today 11:30', sym:'BANKNIFTY', entry:57294, exit:57825, pnl:340, pct:0.82, reason:'PROFIT' },
  { time:'Yesterday 12:40', sym:'BANKNIFTY', entry:57968, exit:57719, pnl:-201, pct:-0.43, reason:'STOPLOSS' },
  { time:'Mon 11:30', sym:'BANKNIFTY', entry:57294, exit:58025, pnl:731, pct:1.28, reason:'PROFIT' },
  { time:'Mon 13:10', sym:'BANKNIFTY', entry:57782, exit:57551, pnl:-175, pct:-0.40, reason:'STOPLOSS' },
  { time:'Mon 14:05', sym:'BANKNIFTY', entry:57145, exit:57611, pnl:466, pct:0.82, reason:'PROFIT' },
  { time:'Mon 14:50', sym:'BANKNIFTY', entry:57461, exit:57208, pnl:-253, pct:-0.44, reason:'STOPLOSS' },
]

export default function Trades() {
  const [filter, setFilter] = useState('all')
  const trades = all.filter(t => filter === 'all' ? true : filter === 'wins' ? t.pnl > 0 : t.pnl < 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <p className="text-xs text-gray-400 uppercase font-medium mb-1">Trade History</p>
        <h1 className="text-3xl font-bold text-gray-900">{trades.length} trades</h1>
        <p className="text-sm text-gray-500 mt-1">{all.filter(t=>t.pnl>0).length} wins · {all.filter(t=>t.pnl<0).length} losses</p>
      </div>

      <div className="flex gap-2 px-4 py-3">
        {['all','wins','losses'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-4 py-2 rounded-full font-medium capitalize ${filter === f ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="mx-4 mb-24 bg-white rounded-2xl shadow-sm overflow-hidden">
        {trades.map((t, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-xs text-gray-400">{t.time}</p>
              <p className="text-sm font-bold text-gray-900">{t.sym}</p>
              <p className="text-xs text-gray-400">₹{t.entry.toLocaleString()} → ₹{t.exit.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className={`text-base font-bold ${t.pnl > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {t.pnl > 0 ? '+' : ''}₹{Math.abs(t.pnl)}
              </p>
              <p className={`text-xs font-medium ${t.pnl > 0 ? 'text-green-500' : 'text-red-400'}`}>
                {t.reason} {t.pct > 0 ? '+' : ''}{t.pct}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
