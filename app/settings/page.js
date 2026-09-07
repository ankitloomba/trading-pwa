'use client'
import { useState } from 'react'

export default function Settings() {
  const [profit, setProfit] = useState(0.8)
  const [stop, setStop] = useState(0.4)
  const [periods, setPeriods] = useState(15)
  const [maxLoss, setMaxLoss] = useState(500)
  const [alerts, setAlerts] = useState(true)
  const [summary, setSummary] = useState(true)
  const [crash, setCrash] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <p className="text-xs text-gray-400 uppercase font-medium mb-1">Configuration</p>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Bank Nifty intraday strategy</p>
      </div>

      <div className="mx-4 mt-4 mb-4 bg-white rounded-2xl shadow-sm overflow-hidden">
        <p className="text-xs text-gray-400 uppercase font-medium px-4 pt-4 pb-2">Strategy</p>
        {[
          { label:'Profit target', sub:'Exit at this gain', val:profit, set:setProfit, step:0.1, suffix:'%' },
          { label:'Stop loss', sub:'Exit at this loss', val:stop, set:setStop, step:0.1, suffix:'%' },
          { label:'Breakout periods', sub:'Candles to look back', val:periods, set:setPeriods, step:1, suffix:'' },
          { label:'Max daily loss', sub:'Stop trading above this', val:maxLoss, set:setMaxLoss, step:50, suffix:'₹', prefix:'₹' },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between px-4 py-3 border-t border-gray-50">
            <div>
              <p className="text-sm font-semibold text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-400">{item.sub}</p>
            </div>
            <div className="flex items-center gap-1">
              {item.prefix && <span className="text-sm text-gray-400">{item.prefix}</span>}
              <input type="number" value={item.val} step={item.step}
                onChange={e => item.set(parseFloat(e.target.value))}
                className="w-16 text-right border border-gray-200 rounded-xl px-2 py-1 text-sm font-bold text-gray-900" />
              {item.suffix && <span className="text-sm text-gray-400">{item.suffix}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-4 mb-4 bg-white rounded-2xl shadow-sm overflow-hidden">
        <p className="text-xs text-gray-400 uppercase font-medium px-4 pt-4 pb-2">Notifications</p>
        {[
          { label:'Trade alerts', sub:'Notify on every trade', val:alerts, set:setAlerts },
          { label:'Daily summary', sub:'End of day P&L report', val:summary, set:setSummary },
          { label:'Crash alerts', sub:'If bot stops unexpectedly', val:crash, set:setCrash },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between px-4 py-3 border-t border-gray-50">
            <div>
              <p className="text-sm font-semibold text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-400">{item.sub}</p>
            </div>
            <button onClick={() => item.set(!item.val)}
              className={`w-12 h-6 rounded-full relative transition-colors ${item.val ? 'bg-green-500' : 'bg-gray-200'}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-all ${item.val ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        ))}
      </div>

      <div className="mx-4 mb-24">
        <button className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-md text-base">
          Save and deploy
        </button>
      </div>
    </div>
  )
}
