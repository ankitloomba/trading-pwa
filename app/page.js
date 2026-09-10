'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'

function NotifBanner() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') setShow(true)
  }, [])
  const enable = async () => {
    const perm = await Notification.requestPermission()
    if (perm === 'granted' && 'serviceWorker' in navigator) await navigator.serviceWorker.register('/sw.js')
    setShow(false)
  }
  if (!show) return null
  return (
    <div style={{margin:'12px 16px 0',background:'#111827',borderRadius:'16px',padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px'}}>
      <div>
        <p style={{color:'white',fontSize:'13px',fontWeight:'600',marginBottom:'2px'}}>🔔 Enable trade alerts</p>
        <p style={{color:'#9ca3af',fontSize:'12px'}}>Get notified on every buy/sell</p>
      </div>
      <button onClick={enable} style={{background:'#16a34a',color:'white',border:'none',borderRadius:'10px',padding:'8px 14px',fontSize:'13px',fontWeight:'700',cursor:'pointer'}}>Enable</button>
    </div>
  )
}

export default function Home() {
  const [data, setData] = useState({
    capital: 5000, todayPnl: 0, winRate: 0, trades: 0,
    stockPositions: [], optionsPositions: []
  })
  const [isLive, setIsLive] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(null)
  const [pullY, setPullY] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const [pulling, setPulling] = useState(false)
  const startY = useRef(0)

  const refresh = useCallback(async () => {
    try {
      const [sumRes, posRes] = await Promise.all([
        fetch('/api/summary?period=today'),
        fetch('/api/positions')
      ])
      const sum = await sumRes.json()
      const pos = await posRes.json()
      if (sum.total_trades > 0 || (pos.positions && pos.positions.length > 0)) {
        const stocks = (pos.positions || []).filter(p => !p.instrument_key)
        const options = (pos.positions || []).filter(p => p.instrument_key)
        setData({
          capital: sum.net_portfolio || 5000,
          todayPnl: sum.total_pnl || 0,
          winRate: sum.win_rate || 0,
          trades: sum.total_trades || 0,
          stockPositions: stocks,
          optionsPositions: options
        })
        setIsLive(true)
      }
      setLastRefresh(new Date().toLocaleTimeString('en-IN', {timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit'}))
    } catch(e) {}
  }, [])

  useEffect(() => {
    refresh()
    const onStart = e => { if(window.scrollY===0){startY.current=e.touches[0].clientY;setPulling(true)} }
    const onMove = e => { if(!pulling)return;const d=e.touches[0].clientY-startY.current;if(d>0&&window.scrollY===0){e.preventDefault();setPullY(Math.min(d*0.5,80))} }
    const onEnd = async () => { if(pullY>=60){setRefreshing(true);setPullY(0);setPulling(false);await refresh();setRefreshing(false)}else{setPullY(0);setPulling(false)} }
    window.addEventListener('touchstart',onStart,{passive:true})
    window.addEventListener('touchmove',onMove,{passive:false})
    window.addEventListener('touchend',onEnd)
    return()=>{window.removeEventListener('touchstart',onStart);window.removeEventListener('touchmove',onMove);window.removeEventListener('touchend',onEnd)}
  }, [pulling, pullY, refresh])

  const hour = new Date().getHours()
  const greeting = hour<12?'Good morning':hour<17?'Good afternoon':'Good evening'
  const fmt = v => v>=0?`+₹${Math.round(v).toLocaleString()}`:`-₹${Math.abs(Math.round(v)).toLocaleString()}`

  return (
    <div style={{minHeight:'100dvh',background:'#f2f2f7',transform:`translateY(${pullY}px)`,transition:pullY>0?'none':'transform 0.3s'}}>
      {(pullY>0||refreshing)&&(
        <div style={{position:'fixed',top:0,left:0,right:0,height:`${pullY||50}px`,background:'rgba(22,163,74,0.1)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:999}}>
          {refreshing?<div style={{width:'20px',height:'20px',border:'3px solid #16a34a',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>:<span style={{fontSize:'18px',transform:`rotate(${Math.min(pullY/60*180,180)}deg)`,display:'inline-block'}}>↓</span>}
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div style={{background:'linear-gradient(160deg,#15803d 0%,#16a34a 60%,#22c55e 100%)',padding:'56px 20px 28px',paddingTop:'calc(56px + env(safe-area-inset-top))'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div>
            <p style={{color:'rgba(255,255,255,0.75)',fontSize:'14px',marginBottom:'4px'}}>{greeting}, Ankit</p>
            <h1 style={{color:'white',fontSize:'40px',fontWeight:'700',letterSpacing:'-1px',lineHeight:1}}>₹{Math.round(data.capital).toLocaleString()}</h1>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginTop:'6px'}}>
              <span style={{background:'rgba(255,255,255,0.2)',color:'white',fontSize:'13px',fontWeight:'600',padding:'3px 10px',borderRadius:'20px'}}>{data.todayPnl>=0?'↑':'↓'} {fmt(data.todayPnl)} today</span>
              <span style={{background:isLive?'rgba(134,239,172,0.3)':'rgba(255,255,255,0.2)',color:isLive?'#86efac':'white',fontSize:'11px',padding:'2px 8px',borderRadius:'10px',fontWeight:'600'}}>{isLive?'LIVE':'SAMPLE'}</span>
            </div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:'28px'}}>🔥</div>
            {lastRefresh&&<p style={{color:'rgba(255,255,255,0.6)',fontSize:'10px',marginTop:'4px'}}>{lastRefresh}</p>}
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px',marginTop:'20px'}}>
          {[{label:'Win rate',value:data.winRate+'%'},{label:'Trades',value:data.trades},{label:'Daily P&L',value:fmt(data.todayPnl)}].map(s=>(
            <div key={s.label} style={{background:'rgba(255,255,255,0.15)',borderRadius:'14px',padding:'10px 12px'}}>
              <p style={{color:'rgba(255,255,255,0.7)',fontSize:'11px',marginBottom:'3px'}}>{s.label}</p>
              <p style={{color:'white',fontSize:'15px',fontWeight:'700'}}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <NotifBanner />

      {!isLive&&(
        <div style={{margin:'12px 16px 0',background:'#fef9c3',borderRadius:'14px',padding:'10px 14px',display:'flex',gap:'8px',alignItems:'center'}}>
          <span>⏳</span><p style={{fontSize:'13px',color:'#854d0e'}}>Sample data · Pull to refresh · Live after first trade</p>
        </div>
      )}

      <div style={{padding:'16px'}}>

        {/* Stock Positions */}
        <div style={{marginBottom:'12px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
            <p style={{fontSize:'13px',fontWeight:'700',color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em'}}>📈 Stocks</p>
            <span style={{fontSize:'12px',color:'#16a34a',fontWeight:'600'}}>{data.stockPositions.length} open</span>
          </div>
          <div style={{background:'white',borderRadius:'16px',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
            {data.stockPositions.length === 0 ? (
              <div style={{padding:'16px 18px',display:'flex',alignItems:'center',gap:'10px'}}>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#22c55e',boxShadow:'0 0 0 3px rgba(34,197,94,0.2)'}}></div>
                <p style={{fontSize:'14px',color:'#6b7280'}}>Scanning 6 symbols every 60s...</p>
              </div>
            ) : data.stockPositions.map((p,i) => (
              <div key={i} style={{padding:'14px 18px',borderBottom:i<data.stockPositions.length-1?'1px solid #f3f4f6':'none',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <p style={{fontSize:'15px',fontWeight:'700',color:'#111827'}}>{p.symbol}</p>
                  <p style={{fontSize:'12px',color:'#9ca3af'}}>₹{p.entry_price} → ₹{p.current_price}</p>
                </div>
                <p style={{fontSize:'16px',fontWeight:'800',color:p.unrealised_pnl>=0?'#16a34a':'#dc2626'}}>{p.unrealised_pnl>=0?'+':''}₹{Math.round(p.unrealised_pnl)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Options Positions */}
        <div style={{marginBottom:'12px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
            <p style={{fontSize:'13px',fontWeight:'700',color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em'}}>🎯 Options</p>
            <span style={{fontSize:'12px',color:'#7c3aed',fontWeight:'600'}}>{data.optionsPositions.length} open</span>
          </div>
          <div style={{background:'white',borderRadius:'16px',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
            {data.optionsPositions.length === 0 ? (
              <div style={{padding:'16px 18px',display:'flex',alignItems:'center',gap:'10px'}}>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#7c3aed',boxShadow:'0 0 0 3px rgba(124,58,237,0.2)'}}></div>
                <p style={{fontSize:'14px',color:'#6b7280'}}>Bank Nifty + Nifty CE/PE ready</p>
              </div>
            ) : data.optionsPositions.map((p,i) => (
              <div key={i} style={{padding:'14px 18px',borderBottom:i<data.optionsPositions.length-1?'1px solid #f3f4f6':'none'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'3px'}}>
                      <span style={{background:p.option_type==='CE'?'#f0fdf4':'#fef2f2',color:p.option_type==='CE'?'#16a34a':'#dc2626',fontSize:'11px',fontWeight:'700',padding:'2px 8px',borderRadius:'6px'}}>{p.option_type}</span>
                      <p style={{fontSize:'15px',fontWeight:'700',color:'#111827'}}>{p.index_name} {p.strike}</p>
                    </div>
                    <p style={{fontSize:'12px',color:'#9ca3af'}}>Premium ₹{p.entry_premium} → ₹{p.current_premium}</p>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <p style={{fontSize:'16px',fontWeight:'800',color:p.unrealised_pnl>=0?'#16a34a':'#dc2626'}}>{p.unrealised_pnl>=0?'+':''}₹{Math.round(p.unrealised_pnl)}</p>
                    <p style={{fontSize:'11px',color:'#9ca3af'}}>{p.lot_size} lots</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div style={{display:'flex',gap:'8px',marginBottom:'12px'}}>
          <Link href="/trades" style={{flex:1,background:'white',borderRadius:'14px',padding:'14px',textAlign:'center',textDecoration:'none',boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
            <p style={{fontSize:'20px',marginBottom:'4px'}}>📋</p>
            <p style={{fontSize:'12px',fontWeight:'600',color:'#374151'}}>Trades</p>
          </Link>
          <Link href="/pnl" style={{flex:1,background:'white',borderRadius:'14px',padding:'14px',textAlign:'center',textDecoration:'none',boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
            <p style={{fontSize:'20px',marginBottom:'4px'}}>📊</p>
            <p style={{fontSize:'12px',fontWeight:'600',color:'#374151'}}>P&L</p>
          </Link>
          <Link href="/settings" style={{flex:1,background:'white',borderRadius:'14px',padding:'14px',textAlign:'center',textDecoration:'none',boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
            <p style={{fontSize:'20px',marginBottom:'4px'}}>⚙️</p>
            <p style={{fontSize:'12px',fontWeight:'600',color:'#374151'}}>Settings</p>
          </Link>
        </div>

        <Link href="/pnl" style={{display:'block',background:'#111827',color:'white',textAlign:'center',padding:'16px',borderRadius:'16px',fontSize:'15px',fontWeight:'700',textDecoration:'none'}}>View full P&L report →</Link>
      </div>
    </div>
  )
}
