'use client'
import { useState, useEffect } from 'react'

const SAMPLE_TRADES = [
  {entry_time:'Sample 11:30',symbol:'BANKNIFTY',entry_price:57294,exit_price:57825,pnl:340,pnl_pct:0.82,reason:'PROFIT'},
  {entry_time:'Sample 12:40',symbol:'BANKNIFTY',entry_price:57968,exit_price:57719,pnl:-201,pnl_pct:-0.43,reason:'STOPLOSS'},
  {entry_time:'Sample 11:30',symbol:'BANKNIFTY',entry_price:57294,exit_price:58025,pnl:731,pnl_pct:1.28,reason:'PROFIT'},
  {entry_time:'Sample 13:10',symbol:'BANKNIFTY',entry_price:57782,exit_price:57551,pnl:-175,pnl_pct:-0.40,reason:'STOPLOSS'},
  {entry_time:'Sample 14:05',symbol:'BANKNIFTY',entry_price:57145,exit_price:57611,pnl:466,pnl_pct:0.82,reason:'PROFIT'},
  {entry_time:'Sample 14:50',symbol:'BANKNIFTY',entry_price:57461,exit_price:57208,pnl:-253,pnl_pct:-0.44,reason:'STOPLOSS'},
]

export default function Trades() {
  const [filter, setFilter] = useState('All')
  const [trades, setTrades] = useState(SAMPLE_TRADES)
  const [isLive, setIsLive] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/trades?period=week')
      .then(r => r.json())
      .then(d => {
        if (d.trades && d.trades.length > 0) {
          setTrades(d.trades)
          setIsLive(true)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = trades.filter(t =>
    filter === 'All' ? true : filter === 'Wins' ? t.pnl > 0 : t.pnl < 0
  )
  const totalPnl = filtered.reduce((s, t) => s + parseFloat(t.pnl), 0)

  return (
    <div style={{minHeight:'100dvh',background:'#f2f2f7'}}>
      <div style={{background:'linear-gradient(160deg,#7c3aed 0%,#8b5cf6 60%,#a78bfa 100%)',padding:'56px 20px 24px',paddingTop:'calc(56px + env(safe-area-inset-top))'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
          <p style={{color:'rgba(255,255,255,0.75)',fontSize:'13px'}}>Trade history</p>
          {!isLive && !loading && (
            <span style={{background:'rgba(255,255,255,0.2)',color:'white',fontSize:'10px',padding:'2px 8px',borderRadius:'10px',fontWeight:'600'}}>SAMPLE</span>
          )}
          {isLive && (
            <span style={{background:'rgba(134,239,172,0.3)',color:'#86efac',fontSize:'10px',padding:'2px 8px',borderRadius:'10px',fontWeight:'600'}}>LIVE</span>
          )}
        </div>
        <h1 style={{color:'white',fontSize:'38px',fontWeight:'700',letterSpacing:'-1px',lineHeight:1}}>{filtered.length} trades</h1>
        <p style={{color:'rgba(255,255,255,0.7)',fontSize:'14px',marginTop:'6px'}}>
          {filtered.filter(t=>t.pnl>0).length}W · {filtered.filter(t=>t.pnl<0).length}L ·
          <span style={{color:totalPnl>=0?'#86efac':'#fca5a5',fontWeight:'700'}}> {totalPnl>=0?'+':''}{Math.round(totalPnl)}</span>
        </p>
      </div>

      <div style={{padding:'14px 16px 0',display:'flex',gap:'8px'}}>
        {['All','Wins','Losses'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{padding:'8px 20px',borderRadius:'20px',border:'none',fontSize:'14px',fontWeight:'600',cursor:'pointer',background:filter===f?'#111827':'white',color:filter===f?'white':'#6b7280',boxShadow:filter===f?'0 2px 8px rgba(17,24,39,0.2)':'0 1px 4px rgba(0,0,0,0.06)'}}>
            {f}
          </button>
        ))}
      </div>

      {!isLive && !loading && (
        <div style={{margin:'12px 16px 0',background:'#fef9c3',borderRadius:'12px',padding:'10px 14px',display:'flex',alignItems:'center',gap:'8px'}}>
          <span style={{fontSize:'16px'}}>⏳</span>
          <p style={{fontSize:'13px',color:'#854d0e'}}>Showing sample data. Live trades appear after 9:15am when Intra Gini 🔥 starts trading.</p>
        </div>
      )}

      <div style={{padding:'14px 16px'}}>
        <div style={{background:'white',borderRadius:'20px',overflow:'hidden',boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
          {filtered.length===0?(
            <p style={{textAlign:'center',padding:'40px 20px',color:'#9ca3af',fontSize:'15px'}}>No trades yet</p>
          ):filtered.map((t,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 18px',borderBottom:i<filtered.length-1?'1px solid #f3f4f6':'none'}}>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:'12px',color:'#9ca3af',marginBottom:'3px'}}>{t.entry_time}</p>
                <p style={{fontSize:'15px',fontWeight:'700',color:'#111827',marginBottom:'2px'}}>{t.symbol || 'BANKNIFTY'}</p>
                <p style={{fontSize:'12px',color:'#9ca3af'}}>₹{parseFloat(t.entry_price).toLocaleString()} → ₹{parseFloat(t.exit_price).toLocaleString()}</p>
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <p style={{fontSize:'17px',fontWeight:'800',color:t.pnl>0?'#16a34a':'#dc2626',marginBottom:'3px'}}>
                  {t.pnl>0?'+':''}{Math.round(t.pnl)}
                </p>
                <span style={{fontSize:'11px',fontWeight:'600',padding:'3px 8px',borderRadius:'8px',background:t.pnl>0?'#f0fdf4':'#fef2f2',color:t.pnl>0?'#16a34a':'#dc2626'}}>
                  {t.reason} {parseFloat(t.pnl_pct)>0?'+':''}{parseFloat(t.pnl_pct).toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
