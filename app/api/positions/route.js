import { Pool } from 'pg'
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export async function GET() {
  try {
    const result = await pool.query(`SELECT * FROM positions WHERE status='OPEN' ORDER BY created_at DESC`)
    return Response.json({ positions: result.rows })
  } catch (e) {
    return Response.json({ positions: [] })
  }
}
