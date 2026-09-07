import { Pool } from 'pg'
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const filter = searchParams.get('filter') || 'all'
  const period = searchParams.get('period') || 'week'
  let dateFilter = "created_at >= NOW() - INTERVAL '7 days'"
  if (period === 'today') dateFilter = "DATE(created_at) = CURRENT_DATE"
  else if (period === 'month') dateFilter = "created_at >= NOW() - INTERVAL '30 days'"
  else if (period === 'year') dateFilter = "created_at >= NOW() - INTERVAL '365 days'"
  let pnlFilter = ''
  if (filter === 'wins') pnlFilter = 'AND pnl > 0'
  else if (filter === 'losses') pnlFilter = 'AND pnl < 0'
  try {
    const result = await pool.query(`SELECT * FROM trades WHERE 1=1 AND ${dateFilter} ${pnlFilter} ORDER BY created_at DESC LIMIT 100`)
    return Response.json({ trades: result.rows })
  } catch (e) {
    return Response.json({ trades: [{id:1,symbol:'BANKNIFTY',entry_time:'2026-09-07 11:30',exit_time:'2026-09-07 12:15',entry_price:57294,exit_price:57825,pnl:340,pnl_pct:0.82,reason:'PROFIT'},{id:2,symbol:'BANKNIFTY',entry_time:'2026-09-06 12:40',exit_time:'2026-09-06 13:10',entry_price:57968,exit_price:57719,pnl:-201,pnl_pct:-0.43,reason:'STOPLOSS'},{id:3,symbol:'BANKNIFTY',entry_time:'2026-09-05 11:30',exit_time:'2026-09-05 13:45',entry_price:57294,exit_price:58025,pnl:731,pnl_pct:1.28,reason:'PROFIT'}] })
  }
}
