'use client'
import { useState, useEffect } from 'react'

const PERIODS = ['today','week','month','year','all']
const LABELS = {today:'Today',week:'This week',month:'Month',year:'Year',all:'All time'}

const SAMPLE = {
  today:{pnl:340,trades:2,wins:1,losses:1,wr:50,best:340,worst:-201,portfolio:5019,bars:[{label:'Morning',pnl:340},{label:'Afternoon',pnl:-201}]},
  week:{pnl:1426,trades:6,wins:2,losses:4,wr:33,best:731,worst:-253,portfolio:6426,bars:[{label:'Mon',pnl:996},{label:'Tue',pnl:-201},{label:'Wed',pnl:340},{label:'Thu',pnl:-175},{label:'Fri',pnl:466}]},
  month:{pnl:2090,trades:22,wins:8,losses:14,wr:36,best:1240,worst:-380,portfolio:7090,bars:[{label:'W1',pnl:1240},{label:'W2',pnl:-380},{label:'W3',pnl:890},{label:'W4',pnl:340}]},
  year:{pnl:13440,trades:180,wins:72,losses:108,wr:40,best:3200,worst:-800,portfolio:18440,bars:[{label:'Jan',pnl:2100},{label:'Feb',pnl:-800},{label:'Mar',pnl:3200},{label:'Sep',pnl:340}]},
  all:{pnl:13440,trades:180,wins:72,losses:108,wr:40,best:3200,worst:-800,portfolio:18440,bars:[{label:'Aug',pnl:3100},{label:'Sep',pnl:340}]},
}

const fmt = v => (v>=0?'+₹':'-₹')+Math.abs(Math.round(v)).toLocaleString()

export default function PnL() {
  const [period, setPeriod] = useState('week')
  const [summary, setSummary] = useState(null)
  const [bars, setBars] = useState([])
  const [isLive, setIsLive] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/summary?period='+period).then(r=>r.json()),
      fetch('/api/pnl?period='+period).then(r=>r.json())
    ]).then(([s, p]) => {
      if (s.total_trades > 0) {
        setSummary(s)
        setBars(p.bars || [])
        setIsLive(true)
      } else {
        const d = SAMPLE[period]
        setSummary({total_trades:d.trades,wins:d.wins,losses:d.losses,total_pnl:d.pnl,win_rate:d.wr,best_trade:d.best,worst_trade:d.worst,capital_in:5000,net_portfolio:d.portfolio})
        setBars(d.bars)
      }
      setLoading(false)
    }).catch(() => {
      const d = SAMPLE[period]
      setSummary({total_trades:d.trades,wins:d.wins,losses:d.losses,total_pnl:d.pnl,win_rate:d.wr,best_trade:d.best,worst_trade:d.worst,capital_in:5000,net_portfolio:d.portfolio})
      setBars(d.bars)
      setLoading(false)
    })
  }, [period])

  const max = bars.length ? Math.max(...bars.map(b=>Math.abs(b.pnl||0)),1) : 1

  return (
    <div style={{minHeight:'100dvh',background:'#f2f2f7'}}>
      <div style={{background:'linear-gradient(160deg,#1d4ed8 0%,#2563eb 60%,#3b82f6 100%)',padding:'56px 20px 24px',paddingTop:'calc(56px + env(safe-area-inset-top))'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
          <p style={{color:'rgba(255,255,255,0.75)',fontSize:'13px'}}>P&L Report</p>
          {!isLive && !loading && <span style={{background:'rgba(255,255,255,0.2)',color:'white',fontSize:'10px',padding:'2px 8px',borderRadius:'10px',fontWeight:'600'}}>SAMPLE</span>}
          {isLive && <span style={{background:'rgba(134,239,172,0.3)',color:'#86efac',fontSize:'10px',padding:'2px 8px',borderRadius:'10px',fontWeight:'600'}}>LIVE</span>}
        </div>
        <h1 style={{color:'white',fontSize:'38px',fontWeight:'700',letterSpacing:'-1px',lineHeight:1}}>
          {summary ? fmt(summary.total_pnl) : '...'}
        </h1>
        {summary && <p style={{color:'rgba(255,255,255,0.7)',fontSize:'14px',marginTop:'6px'}}>{summary.wins}W · {summary.losses}L · {summary.win_rate}% win rate</p>}
      </div>

      <div style={{padding:'14px 16px 0',display:'flex',gap:'8px',overflowX:'auto'}}>
        {PERIODS.map(p=>(
          <button key={p} onClick={()=>setPeriod(p)} style={{whiteSpace:'nowrap',padding:'8px 18px',borderRadius:'20px',border:'none',fontSize:'14px',fontWeight:'600',cursor:'pointer',background:period===p?'#111827':'white',color:period===p?'white':'#6b7280',boxShadow:period===p?'0 2px 8px rgba(17,24,39,0.2)':'0 1px 4px rgba(0,0,0,0.06)'}}>
            {LABELS[p]}
          </button>
        ))}
      </div>

      {!isLive && !loading && (
        <div style={{margin:'12px 16px 0',background:'#fef9c3',borderRadius:'12px',padding:'10px 14px',display:'flex',alignItems:'center',gap:'8px'}}>
          <span style={{fontSize:'16px'}}>⏳</span>
          <p style={{fontSize:'13px',color:'#854d0e'}}>Sample data. Live P&L appears after first trade.</p>
        </div>
      )}

      {summary && (
        <div style={{padding:'14px 16px'}}>
          <div style={{background:'white',borderRadius:'20px',overflow:'hidden',marginBottom:'12px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
            {[
              ['Total P&L', fmt(summary.total_pnl), summary.total_pnl>=0?'#16a34a':'#dc2626'],
              ['Total trades', summary.total_trades, '#111827'],
              ['Wins', summary.wins, '#16a34a'],
              ['Losses', summary.losses, '#dc2626'],
              ['Win rate', summary.win_rate+'%', '#111827'],
              ['Best trade', fmt(summary.best_trade), '#16a34a'],
              ['Worst trade', fmt(summary.worst_trade), '#dc2626'],
              ['Capital in', '₹'+parseInt(summary.capital_in).toLocaleString(), '#111827'],
              ['Net portfolio', '₹'+Math.round(summary.net_portfolio).toLocaleString(), '#16a34a'],
            ].map(([k,v,c],i,arr)=>(
              <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'13px 18px',borderBottom:i<arr.length-1?'1px solid #f3f4f6':'none'}}>
                <span style={{fontSize:'14px',color:'#6b7280'}}>{k}</span>
                <span style={{fontSize:'15px',fontWeight:'700',color:c}}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{background:'white',borderRadius:'20px',padding:'16px 18px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
            <p style={{fontSize:'13px',fontWeight:'600',color:'#6b7280',marginBottom:'14px',textTransform:'uppercase',letterSpacing:'0.05em'}}>Day by day</p>
            {bars.map((bar,i)=>{
              const v = bar.pnl || bar.v || 0
              const w = Math.max(12, Math.round((Math.abs(v)/max)*82))
              return (
                <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
                  <span style={{fontSize:'12px',color:'#9ca3af',width:'38px',fontWeight:'500'}}>{bar.label||bar.l}</span>
                  <div style={{flex:1,background:'#f3f4f6',borderRadius:'8px',height:'28px',overflow:'hidden'}}>
                    <div style={{width:w+'%',height:'100%',borderRadius:'8px',background:v>=0?'#16a34a':'#ef4444',display:'flex',alignItems:'center',paddingLeft:'10px'}}>
                      <span style={{fontSize:'12px',fontWeight:'700',color:'white',whiteSpace:'nowrap'}}>{fmt(v)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
