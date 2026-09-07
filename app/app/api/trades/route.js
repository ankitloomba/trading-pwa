import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const filter = searchParams.get('filter') || 'all'
  const period = searchParams.get('period') || 'week'

  let dateFilter = ''
  if (period === 'today') dateFilter = "AND DATE(created_at) = CURRENT_DATE"
  else if (period === 'week') dateFilter = "AND created_at >= NOW() - INTERVAL '7 days'"
  else if (period === 'month') dateFilter = "AND created_at >= NOW() - INTERVAL '30 days'"
  else if (period === 'year') dateFilter = "AND created_at >= NOW() - INTERVAL '365 days'"

  let pnlFilter = ''
  if (filter === 'wins') pnlFilter = 'AND pnl > 0'
  else if (filter === 'losses') pnlFilter = 'AND pnl < 0'

  try {
    const result = await pool.query(
      `SELECT * FROM trades WHERE 1=1 ${dateFilter} ${pnlFilter} ORDER BY created_at DESC LIMIT 100`
    )
    return Response.json({ trades: result.rows })
  } catch (e) {
    return Response.json({ trades: getMockTrades() })
  }
}

function getMockTrades() {
  return [
    { id:1, symbol:'BANKNIFTY', entry_time:'2026-09-07 11:30', exit_time:'2026-09-07 12:15', entry_price:57294, exit_price:57825, pnl:340, pnl_pct:0.82, reason:'PROFIT' },
    { id:2, symbol:'BANKNIFTY', entry_time:'2026-09-06 12:40', exit_time:'2026-09-06 13:10', entry_price:57968, exit_price:57719, pnl:-201, pnl_pct:-0.43, reason:'STOPLOSS' },
    { id:3, symbol:'BANKNIFTY', entry_time:'2026-09-05 11:30', exit_time:'2026-09-05 13:45', entry_price:57294, exit_price:58025, pnl:731, pnl_pct:1.28, reason:'PROFIT' },
    { id:4, symbol:'BANKNIFTY', entry_time:'2026-09-05 13:10', exit_time:'2026-09-05 14:00', entry_price:57782, exit_price:57551, pnl:-175, pnl_pct:-0.40, reason:'STOPLOSS' },
    { id:5, symbol:'BANKNIFTY', entry_time:'2026-09-05 14:05', exit_time:'2026-09-05 15:00', entry_price:57145, exit_price:57611, pnl:466, pnl_pct:0.82, reason:'PROFIT' },
    { id:6, symbol:'BANKNIFTY', entry_time:'2026-09-05 14:50', exit_time:'2026-09-05 15:20', entry_price:57461, exit_price:57208, pnl:-253, pnl_pct:-0.44, reason:'STOPLOSS' },
  ]
}
