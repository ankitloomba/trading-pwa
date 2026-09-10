import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const after = parseInt(searchParams.get('after') || '0')

  try {
    // Create table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50),
        title VARCHAR(200),
        body TEXT,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)

    const result = await pool.query(
      `SELECT id, type, title, body FROM notifications
       WHERE id > $1 AND read = FALSE
       ORDER BY created_at ASC LIMIT 10`,
      [after]
    )

    // Mark as read
    if (result.rows.length > 0) {
      const ids = result.rows.map(r => r.id)
      await pool.query(
        `UPDATE notifications SET read = TRUE WHERE id = ANY($1)`,
        [ids]
      )
    }

    return Response.json({ notifications: result.rows })
  } catch(e) {
    return Response.json({ notifications: [] })
  }
}

export async function POST(request) {
  const { type, title, body } = await request.json()
  try {
    await pool.query(
      `INSERT INTO notifications (type, title, body) VALUES ($1, $2, $3)`,
      [type, title, body]
    )
    return Response.json({ success: true })
  } catch(e) {
    return Response.json({ success: false })
  }
}
