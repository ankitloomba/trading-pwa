import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || 'week'

  let groupBy = "DATE(created_at)"
  let dateFilter = "created_at >= NOW() - INTERVAL '7 days'"
  let labelFormat = "TO_CHAR(DATE(created_at), 'Dy')"

  if (period === 'today') {
    groupBy = "DATE_TRUNC('hour', created_at)"
    dateFilter = "DATE(created_at) = CURRENT_DATE"
    labelFormat = "TO_CHAR(DATE_TRUNC('hour', created_at), 'HH24:MI')"
  } else if (period === 'month') {
    groupBy = "DATE_TRUNC('week', created_at)"
    dateFilter = "created_at >= NOW() - INTERVAL '30 days'"
    labelFormat = "'W'||TO_CHAR(DATE_TRUNC('week', created_at), 'W')"
  } else if (period === 'year') {
    groupBy = "DATE_TRUNC('month', created_at)"
    dateFilter = "created_at >= NOW() - INTERVAL '365 days'"
    labelFormat = "TO_CHAR(DATE_TRUNC('month', created_at), 'Mon')"
  } else if (period === 'all') {
    groupBy = "DATE_TRUNC('month', created_at)"
    dateFilter = "1=1"
    labelFormat = "TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YY')"
  }

  try {
    const result = await pool.query(`
      SELECT ${labelFormat} as label, ROUND(SUM(pnl)::numeric, 2) as pnl
      FROM trades WHERE ${dateFilter}
      GROUP BY ${groupBy} ORDER BY ${groupBy}
    `)
    return Response.json({ bars: result.rows })
  } catch (e) {
    const mockBars = {
      today: [{label:'AM',pnl:340},{label:'PM',pnl:-201}],
      week: [{label:'Mon',pnl:996},{label:'Tue',pnl:-201},{label:'Wed',pnl:340},{label:'Thu',pnl:-175},{label:'Fri',pnl:466}],
      month: [{label:'W1',pnl:1240},{label:'W2',pnl:-380},{label:'W3',pnl:890},{label:'W4',pnl:340}],
      year: [{label:'Jan',pnl:2100},{label:'Feb',pnl:-800},{label:'Mar',pnl:3200},{label:'Sep',pnl:340}],
      all: [{label:'Aug 26',pnl:3100},{label:'Sep 26',pnl:340}]
    }
    return Response.json({ bars: mockBars[period] || mockBars.week })
  }
}
