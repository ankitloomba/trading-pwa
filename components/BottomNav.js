'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href:'/', label:'Home', icon:'⌂' },
  { href:'/pnl', label:'P&L', icon:'📊' },
  { href:'/trades', label:'Trades', icon:'📋' },
  { href:'/settings', label:'Settings', icon:'⚙️' },
]

export default function BottomNav() {
  const path = usePathname()
  return (
    <nav style={{
      position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
      width:'100%', maxWidth:'430px',
      background:'rgba(255,255,255,0.92)',
      backdropFilter:'blur(20px)',
      WebkitBackdropFilter:'blur(20px)',
      borderTop:'1px solid rgba(0,0,0,0.08)',
      display:'flex',
      paddingBottom:'env(safe-area-inset-bottom)',
      zIndex:100
    }}>
      {TABS.map(t=>{
        const active = path===t.href
        return (
          <Link key={t.href} href={t.href} style={{
            flex:1, display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
            padding:'10px 4px 8px',
            textDecoration:'none',
            gap:'3px',
            minHeight:'56px'
          }}>
            <span style={{fontSize:'22px',lineHeight:1}}>{t.icon}</span>
            <span style={{
              fontSize:'11px',fontWeight:active?'700':'500',
              color:active?'#16a34a':'#9ca3af',
              letterSpacing:'0.02em'
            }}>{t.label}</span>
            {active && <div style={{
              width:'4px',height:'4px',borderRadius:'50%',
              background:'#16a34a',marginTop:'1px'
            }}/>}
          </Link>
        )
      })}
    </nav>
  )
}
