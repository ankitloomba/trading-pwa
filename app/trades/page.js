'use client'
import { useState } from 'react'

const TRADES = [
  {time:'Today 11:30',sym:'BANKNIFTY',entry:57294,exit:57825,pnl:340,pct:0.82,reason:'PROFIT'},
  {time:'Yesterday 12:40',sym:'BANKNIFTY',entry:57968,exit:57719,pnl:-201,pct:-0.43,reason:'STOPLOSS'},
  {time:'Mon 11:30',sym:'BANKNIFTY',entry:57294,exit:58025,pnl:731,pct:1.28,reason:'PROFIT'},
  {time:'Mon 13:10',sym:'BANKNIFTY',entry:57782,exit:57551,pnl:-175,pct:-0.40,reason:'STOPLOSS'},
  {time:'Mon 14:05',sym:'BANKNIFTY',entry:57145,exit:57611,pnl:466,pct:0.82,reason:'PROFIT'},
  {time:'Mon 14:50',sym:'BANKNIFTY',entry:57461,exit:57208,pnl:-253,pct:-0.44,reason:'STOPLOSS'},
]

export default function Trades() {
  const [filter, setFilter] = useState('All')
  const trades = TRADES.filter(t=>filter==='All'?true:filter==='Wins'?t.pnl>0:t.pnl<0)
  const totalPnl = trades.reduce((s,t)=>s+t.pnl,0)

  return (
    <div style={{minHeight:'100dvh',background:'#f2f2f7'}}>
      <div style={{background:'linear-gradient(160deg,#7c3aed 0%,#8b5cf6 60%,#a78bfa 100%)',padding:'56px 20px 24px',paddingTop:'calc(56px + env(safe-area-inset-top))'}}>
        <p style={{color:'rgba(255,255,255,0.75)',fontSize:'13px',marginBottom:'4px'}}>Trade history</p>
        <h1 style={{color:'white',fontSize:'38px',fontWeight:'700',letterSpacing:'-1px',lineHeight:1}}>{trades.length} trades</h1>
        <p style={{color:'rgba(255,255,255,0.7)',fontSize:'14px',marginTop:'6px'}}>
          {trades.filter(t=>t.pnl>0).length}W · {trades.filter(t=>t.pnl<0).length}L · <span style={{color:totalPnl>=0?'#86efac':'#fca5a5',fontWeight:'700'}}>{totalPnl>=0?'+':''}{totalPnl}</span>
        </p>
      </div>
      <div style={{padding:'14px 16px 0',display:'flex',gap:'8px'}}>
        {['All','Wins','Losses'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{padding:'8px 20px',borderRadius:'20px',border:'none',fontSize:'14px',fontWeight:'600',cursor:'pointer',background:filter===f?'#111827':'white',color:filter===f?'white':'#6b7280',boxShadow:filter===f?'0 2px 8px rgba(17,24,39,0.2)':'0 1px 4px rgba(0,0,0,0.06)'}}>
            {f}
          </button>
        ))}
      </div>
      <div style={{padding:'14px 16px'}}>
        <div style={{background:'white',borderRadius:'20px',overflow:'hidden',boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
          {trades.length===0?(
            <p style={{textAlign:'center',padding:'40px 20px',color:'#9ca3af',fontSize:'15px'}}>No trades found</p>
          ):trades.map((t,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 18px',borderBottom:i<trades.length-1?'1px solid #f3f4f6':'none'}}>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:'12px',color:'#9ca3af',marginBottom:'3px'}}>{t.time}</p>
                <p style={{fontSize:'15px',fontWeight:'700',color:'#111827',marginBottom:'2px'}}>{t.sym}</p>
                <p style={{fontSize:'12px',color:'#9ca3af'}}>₹{t.entry.toLocaleString()} → ₹{t.exit.toLocaleString()}</p>
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <p style={{fontSize:'17px',fontWeight:'800',color:t.pnl>0?'#16a34a':'#dc2626',marginBottom:'3px'}}>{t.pnl>0?'+':''}{t.pnl}</p>
                <span style={{fontSize:'11px',fontWeight:'600',padding:'3px 8px',borderRadius:'8px',background:t.pnl>0?'#f0fdf4':'#fef2f2',color:t.pnl>0?'#16a34a':'#dc2626'}}>{t.reason} {t.pct>0?'+':''}{t.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
