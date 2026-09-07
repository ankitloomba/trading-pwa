import Link from 'next/link'

const bots = [
  { name: 'Bank Nifty intraday', desc: '5-min breakout · RSI filter', status: 'live', pnl: '+₹340', trades: 2, drawdown: '-0.3%' },
  { name: 'Long-term SIP', desc: 'Weekly ₹5,000 · Nifty50', status: 'scheduled', pnl: '+₹0', trades: 0, drawdown: '0%' }
]

export default function Home() {
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h1 className="text-lg font-medium">Bot control center</h1>
        <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">1 live</span>
      </div>
      <div className="grid grid-cols-2 gap-2 p-4">
        <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">Total capital</p><p className="text-xl font-medium">₹5,019</p></div>
        <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">Today P&L</p><p className="text-xl font-medium text-green-600">+₹340</p></div>
        <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">This week</p><p className="text-xl font-medium text-green-600">+₹890</p></div>
        <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">Win rate</p><p className="text-xl font-medium">33%</p></div>
      </div>
      <div className="px-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">Active bots</p>
        {bots.map((bot, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 mb-2 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium">{bot.name}</p>
                <p className="text-xs text-gray-400">{bot.desc}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${bot.status === 'live' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {bot.status === 'live' ? 'Live' : 'Scheduled'}
              </span>
            </div>
            <div className="flex gap-2 mb-2">
              {[['P&L', bot.pnl, true], ['Trades', bot.trades, null], ['Drawdown', bot.drawdown, null]].map(([l, v, pos]) => (
                <div key={l} className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-400">{l}</p>
                  <p className={`text-xs font-medium ${pos ? 'text-green-600' : ''}`}>{v}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex-1 text-xs border border-gray-200 rounded-lg py-1.5">⏸ Pause</button>
              <Link href="/trades" className="flex-1 text-xs border border-gray-200 rounded-lg py-1.5 text-center">📋 Trades</Link>
              <Link href="/settings" className="flex-1 text-xs border border-gray-200 rounded-lg py-1.5 text-center">⚙ Settings</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
