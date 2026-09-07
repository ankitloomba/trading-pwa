'use client'
import { useState } from 'react'

const filters = ['today','week','month','year','all']
const labels = { today:'Today', week:'This week', month:'Month', year:'Year', all:'All time' }

const mockData = {
  today: { pnl:340, trades:2, wins:1, losses:1, wr:50, best:340, worst:-201, bars:[{label:'Morning',pnl:340},{label:'Afternoon',pnl:-201}] },
  week: { pnl:1426, trades:6, wins:2, losses:4, wr:33, best:731, worst:-253, bars:[{label:'Mon',pnl:996},{label:'Tue',pnl:-201},{label:'Wed',pnl:340},{label:'Thu',pnl:-175},{label:'Fri',pnl:466}] },
  month: { pnl:2090, trades:22, wins:8, losses:14, wr:36, best:1240, worst:-380, bars:[{label:'W1',pnl:1240},{label:'W2',pnl:-380},{label:'W3',pnl:890},{label:'W4',pnl:340}] },
  year: { pnl:13440, trades:180, wins:72, losses:108, wr:40, best:3200, worst:-800, bars:[{label:'Jan',pnl:2100},{label:'Feb',pnl:-800},{label:'Mar',pnl:3200},{label:'Sep',pnl:340}] },
  all: { pnl:13440, trades:180, wins:72, losses:108, wr:40, best:3200, worst:-800, bars:[{label:'Aug',pnl:3100},{label:'Sep',pnl:340}] },
}

export default function PnL() {
  const [period, setPeriod] = useState('week')
  const d = mockData[period]
  const max = Math.max(...d.bars.map(b => Math.abs(b.pnl)))
  const fmt = v => v >= 0 ? `+₹${v.toLocaleString()}` : `-₹${Math.abs(v).toLocaleString()}`

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <p className="text-xs text-gray-400 uppercase font-medium mb-1">P&L Report</p>
        <h1 className={`text-3xl font-bold ${d.pnl >= 0 ? 'text-green-600' : 'text-red-500'}`}>{fmt(d.pnl)}</h1>
        <p className="text-sm text-gray-500 mt-1">{d.wins}W · {d.losses}L · {d.wr}% win rate</p>
      </div>

      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        {filters.map(f => (
          <button key={f} onClick={() => setPeriod(f)}
            className={`whitespace-nowrap text-xs px-4 py-2 rounded-full font-medium transition-all ${period === f ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            {labels[f]}
          </button>
        ))}
      </div>

      <div className="mx-4 mb-4 bg-white rounded-2xl shadow-sm overflow-hidden">
        {[
          ['Total P&L', fmt(d.pnl), d.pnl >= 0 ? 'text-green-600' : 'text-red-500'],
          ['Total trades', d.trades, 'text-gray-900'],
          ['Wins', d.wins, 'text-green-600'],
          ['Losses', d.losses, 'text-red-500'],
          ['Win rate', `${d.wr}%`, 'text-gray-900'],
          ['Best trade', fmt(d.best), 'text-green-600'],
          ['Worst trade', fmt(d.worst), 'text-red-500'],
          ['Capital in', '₹5,000', 'text-gray-900'],
          ['Net portfolio', `₹${(5000+d.pnl).toLocaleString()}`, 'text-green-600'],
        ].map(([k, v, c]) => (
          <div key={k} className="flex justify-between items-center px-4 py-3 border-b border-gray-50 last:border-0">
            <span className="text-sm text-gray-500">{k}</span>
            <span className={`text-sm font-bold ${c}`}>{v}</span>
          </div>
        ))}
      </div>

      <div className="mx-4 mb-24 bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-xs text-gray-400 uppercase font-medium mb-3">Day by day</p>
        {d.bars.map((bar, i) => (
          <div key={i} className="flex items-center gap-3 mb-2">
            <span className="text-xs text-gray-500 w-10 font-medium">{bar.label}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
              <div className={`h-full rounded-full flex items-center px-3 text-xs font-bold ${bar.pnl >= 0 ? 'bg-green-500 text-white' : 'bg-red-400 text-white'}`}
                style={{ width: `${Math.max(20, Math.round((Math.abs(bar.pnl) / max) * 90))}%` }}>
                {fmt(bar.pnl)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
