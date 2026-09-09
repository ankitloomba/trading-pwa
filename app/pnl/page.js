'use client'
import { useState } from 'react'

const PERIODS = ['Today','Week','Month','Year','All']
const DATA = {
  Today: { pnl:340, trades:2, wins:1, losses:1, wr:50, best:340, worst:-201, portfolio:5019, bars:[{l:'Morning',v:340},{l:'Afternoon',v:-201}] },
  Week:  { pnl:1426, trades:6, wins:2, losses:4, wr:33, best:731, worst:-253, portfolio:6426, bars:[{l:'Mon',v:996},{l:'Tue',v:-201},{l:'Wed',v:340},{l:'Thu',v:-175},{l:'Fri',v:466}] },
  Month: { pnl:2090, trades:22, wins:8, losses:14, wr:36, best:1240, worst:-380, portfolio:7090, bars:[{l:'W1',v:1240},{l:'W2',v:-380},{l:'W3',v:890},{l:'W4',v:340}] },
  Year:  { pnl:13440, trades:180, wins:72, losses:108, wr:40, best:3200, worst:-800, portfolio:18440, bars:[{l:'Jan',v:2100},{l:'Feb',v:-800},{l:'Mar',v:3200},{l:'Apr',v:1400},{l:'May',v:-600},{l:'Jun',v:2800},{l:'Jul',v:1900},{l:'Aug',v:3100},{l:'Sep',v:340}] },
  All:   { pnl:13440, trades:180, wins:72, losses:108, wr:40, best:3200, worst:-800, portfolio:18440, bars:[{l:'Aug',v:3100},{l:'Sep',v:340}] },
}
const fmt = v => (v>=0?'+₹':'-₹')+Math.abs(v).toLocaleString()

export default function PnL() {
  const [period, setPeriod] = useState('Week')
  const d = DATA[period]
  const max = Math.max(...d.bars.map(b=>Math.abs(b.v)),1)

  return (
    <div style={{minHeight:'100dvh',background:'#f2f2f7'}}>
      <div style={{background:'linear-gradient(160deg,#1d4ed8 0%,#2563eb 60%,#3b82f6 100%)',padding:'56px 20px 24px',paddingTop:'calc(56px + env(safe-area-inset-top))'}}>
        <p style={{color:'rgba(255,255,255,0.75)',fontSize:'13px',marginBottom:'4px'}}>P&L Report</p>
        <h1 style={{color:'white',fontSize:'38px',fontWeight:'700',letterSpacing:'-1px',lineHeight:1}}>{fmt(d.pnl)}</h1>
        <p style={{color:'rgba(255,255,255,0.7)',fontSize:'14px',marginTop:'6px'}}>{d.wins}W · {d.losses}L · {d.wr}% win rate</p>
      </div>
      <div style={{padding:'14px 16px 0',display:'flex',gap:'8px',overflowX:'auto'}}>
        {PERIODS.map(p=>(
          <button key={p} onClick={()=>setPeriod(p)} style={{whiteSpace:'nowrap',padding:'8px 18px',borderRadius:'20px',border:'none',fontSize:'14px',fontWeight:'600',cursor:'pointer',background:period===p?'#111827':'white',color:period===p?'white':'#6b7280',boxShadow:period===p?'0 2px 8px rgba(17,24,39,0.2)':'0 1px 4px rgba(0,0,0,0.06)'}}>
            {p}
          </button>
        ))}
      </div>
      <div style={{padding:'14px 16px'}}>
        <div style={{background:'white',borderRadius:'20px',overflow:'hidden',marginBottom:'12px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
          {[['Total P&L',fmt(d.pnl),d.pnl>=0?'#16a34a':'#dc2626'],['Total trades',d.trades,'#111827'],['Wins',d.wins,'#16a34a'],['Losses',d.losses,'#dc2626'],['Win rate',d.wr+'%','#111827'],['Best trade',fmt(d.best),'#16a34a'],['Worst trade',fmt(d.worst),'#dc2626'],['Capital in','₹5,000','#111827'],['Net portfolio','₹'+d.portfolio.toLocaleString(),'#16a34a']].map(([k,v,c],i,arr)=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'13px 18px',borderBottom:i<arr.length-1?'1px solid #f3f4f6':'none'}}>
              <span style={{fontSize:'14px',color:'#6b7280'}}>{k}</span>
              <span style={{fontSize:'15px',fontWeight:'700',color:c}}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{background:'white',borderRadius:'20px',padding:'16px 18px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
          <p style={{fontSize:'13px',fontWeight:'600',color:'#6b7280',marginBottom:'14px',textTransform:'uppercase',letterSpacing:'0.05em'}}>Day by day</p>
          {d.bars.map((bar,i)=>{
            const w=Math.max(12,Math.round((Math.abs(bar.v)/max)*82))
            const pos=bar.v>=0
            return (
              <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
                <span style={{fontSize:'12px',color:'#9ca3af',width:'38px',fontWeight:'500'}}>{bar.l}</span>
                <div style={{flex:1,background:'#f3f4f6',borderRadius:'8px',height:'28px',overflow:'hidden'}}>
                  <div style={{width:w+'%',height:'100%',borderRadius:'8px',background:pos?'#16a34a':'#ef4444',display:'flex',alignItems:'center',paddingLeft:'10px'}}>
                    <span style={{fontSize:'12px',fontWeight:'700',color:'white',whiteSpace:'nowrap'}}>{fmt(bar.v)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
