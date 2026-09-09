'use client'
import { useState } from 'react'

function Toggle({on,onToggle}){return(<button onClick={onToggle} style={{width:'50px',height:'28px',borderRadius:'14px',border:'none',cursor:'pointer',background:on?'#16a34a':'#d1d5db',position:'relative',transition:'background 0.2s',flexShrink:0}}><div style={{width:'24px',height:'24px',borderRadius:'50%',background:'white',position:'absolute',top:'2px',transition:'left 0.2s',left:on?'24px':'2px',boxShadow:'0 1px 4px rgba(0,0,0,0.2)'}}/></button>)}

function Row({label,sub,children}){return(<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 18px',borderBottom:'1px solid #f3f4f6'}}><div style={{flex:1,minWidth:0,paddingRight:'12px'}}><p style={{fontSize:'15px',fontWeight:'600',color:'#111827',marginBottom:'2px'}}>{label}</p>{sub&&<p style={{fontSize:'12px',color:'#9ca3af'}}>{sub}</p>}</div>{children}</div>)}

function Stepper({val,setVal,step=0.1,suffix='%',min=0}){return(<div style={{display:'flex',alignItems:'center',gap:'8px'}}><button onClick={()=>setVal(v=>+(Math.max(min,v-step)).toFixed(1))} style={{width:'32px',height:'32px',borderRadius:'50%',border:'1.5px solid #e5e7eb',background:'white',fontSize:'18px',cursor:'pointer',color:'#374151',display:'flex',alignItems:'center',justifyContent:'center'}}>−</button><span style={{fontSize:'16px',fontWeight:'700',color:'#111827',minWidth:'54px',textAlign:'center'}}>{suffix==='₹'?'₹'+val:val+suffix}</span><button onClick={()=>setVal(v=>+(v+step).toFixed(1))} style={{width:'32px',height:'32px',borderRadius:'50%',border:'1.5px solid #e5e7eb',background:'white',fontSize:'18px',cursor:'pointer',color:'#374151',display:'flex',alignItems:'center',justifyContent:'center'}}>+</button></div>)}

export default function Settings(){
  const [profit,setProfit]=useState(1.0)
  const [stop,setStop]=useState(0.5)
  const [periods,setPeriods]=useState(15)
  const [maxLoss,setMaxLoss]=useState(500)
  const [alerts,setAlerts]=useState(true)
  const [summary,setSummary]=useState(true)
  const [crash,setCrash]=useState(true)
  const [saved,setSaved]=useState(false)

  return(
    <div style={{minHeight:'100dvh',background:'#f2f2f7'}}>
      <div style={{background:'linear-gradient(160deg,#ea580c 0%,#f97316 60%,#fb923c 100%)',padding:'56px 20px 24px',paddingTop:'calc(56px + env(safe-area-inset-top))'}}>
        <p style={{color:'rgba(255,255,255,0.75)',fontSize:'13px',marginBottom:'4px'}}>Configuration</p>
        <h1 style={{color:'white',fontSize:'38px',fontWeight:'700',letterSpacing:'-1px',lineHeight:1}}>Settings</h1>
        <p style={{color:'rgba(255,255,255,0.7)',fontSize:'14px',marginTop:'6px'}}>Bank Nifty intraday · Upstox</p>
      </div>
      <div style={{padding:'14px 16px'}}>
        <p style={{fontSize:'13px',fontWeight:'600',color:'#6b7280',marginBottom:'10px',textTransform:'uppercase',letterSpacing:'0.05em'}}>Strategy</p>
        <div style={{background:'white',borderRadius:'20px',overflow:'hidden',marginBottom:'12px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
          <Row label="Profit target" sub="Exit when trade reaches this gain"><Stepper val={profit} setVal={setProfit} step={0.1}/></Row>
          <Row label="Stop loss" sub="Exit when trade hits this loss"><Stepper val={stop} setVal={setStop} step={0.1}/></Row>
          <Row label="Breakout periods" sub="Candles to look back for high"><Stepper val={periods} setVal={setPeriods} step={1} suffix=" bars" min={5}/></Row>
          <Row label="Max daily loss" sub="Stop bot if loss exceeds this"><Stepper val={maxLoss} setVal={setMaxLoss} step={100} suffix="₹" min={100}/></Row>
        </div>
        <p style={{fontSize:'13px',fontWeight:'600',color:'#6b7280',marginBottom:'10px',textTransform:'uppercase',letterSpacing:'0.05em'}}>Notifications</p>
        <div style={{background:'white',borderRadius:'20px',overflow:'hidden',marginBottom:'16px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
          <Row label="Trade alerts" sub="Notify on every buy/sell"><Toggle on={alerts} onToggle={()=>setAlerts(v=>!v)}/></Row>
          <Row label="Daily summary" sub="End of day P&L report"><Toggle on={summary} onToggle={()=>setSummary(v=>!v)}/></Row>
          <Row label="Crash alerts" sub="If bot stops unexpectedly"><Toggle on={crash} onToggle={()=>setCrash(v=>!v)}/></Row>
        </div>
        <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000)}} style={{width:'100%',padding:'16px',borderRadius:'16px',border:'none',cursor:'pointer',background:saved?'#16a34a':'#111827',color:'white',fontSize:'16px',fontWeight:'700',transition:'background 0.3s',boxShadow:'0 4px 14px rgba(17,24,39,0.25)'}}>
          {saved?'✓ Saved!':'Save and deploy'}
        </button>
      </div>
    </div>
  )
}
