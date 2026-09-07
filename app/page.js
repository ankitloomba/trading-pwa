import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 pt-12 pb-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500 mb-1">Good morning, Ankit</p>
        <h1 className="text-3xl font-bold text-gray-900">₹5,019</h1>
        <p className="text-sm text-green-600 font-medium mt-1">↑ +₹340 today (+6.8%)</p>
      </div>

      <div className="grid grid-cols-3 gap-3 px-4 py-4">
        {[
          { label: 'This week', value: '+₹890', color: 'text-green-600' },
          { label: 'Win rate', value: '33%', color: 'text-gray-900' },
          { label: 'Trades', value: '6', color: 'text-gray-900' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-3 shadow-sm text-center">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="px-4 mb-4">
        <div className="bg-green-500 rounded-2xl p-4 text-white shadow-md">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-green-100 text-xs font-medium">LIVE BOT</p>
              <p className="text-white font-bold text-lg mt-0.5">Bank Nifty intraday</p>
              <p className="text-green-100 text-xs mt-0.5">5-min breakout · RSI filter</p>
            </div>
            <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium">● Live</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[['Today P&L', '+₹340'], ['Trades', '2'], ['Drawdown', '-0.3%']].map(([l, v]) => (
              <div key={l} className="bg-white/15 rounded-xl p-2 text-center">
                <p className="text-green-100 text-xs">{l}</p>
                <p className="text-white font-bold text-sm">{v}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-white/20 text-white text-xs font-medium py-2 rounded-xl">⏸ Pause</button>
            <Link href="/trades" className="flex-1 bg-white/20 text-white text-xs font-medium py-2 rounded-xl text-center">📋 Trades</Link>
            <Link href="/settings" className="flex-1 bg-white/20 text-white text-xs font-medium py-2 rounded-xl text-center">⚙ Config</Link>
          </div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-gray-400 text-xs font-medium">SCHEDULED</p>
              <p className="text-gray-900 font-bold text-base mt-0.5">Long-term SIP</p>
              <p className="text-gray-400 text-xs mt-0.5">Weekly ₹5,000 · Nifty50</p>
            </div>
            <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full font-medium">Auto</span>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 border border-gray-200 text-gray-700 text-xs font-medium py-2 rounded-xl">📊 Details</button>
            <button className="flex-1 border border-gray-200 text-gray-700 text-xs font-medium py-2 rounded-xl">✏️ Edit</button>
          </div>
        </div>
      </div>

      <div className="px-4 mb-24">
        <Link href="/pnl" className="block bg-gray-900 text-white text-center font-semibold py-4 rounded-2xl shadow-md">
          View full P&L report →
        </Link>
      </div>
    </div>
  )
}
