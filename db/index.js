require('dotenv').config()
const { Pool } = require('pg')

const connectionString = process.env.DATABASE_URL

const pool = new Pool({
  connectionString: connectionString
})

module.exports = {
  query: (text, params) => pool.query(text, params),
  saveKill: async (channelId, tribeCode) => {
    const sql = 'INSERT INTO tracker (channel_id, tribe) VALUES ($1, $2)'
    const values = [channelId, tribeCode]
    try {
      await pool.query(sql, values)
      return true
    } catch(err) { throw err }
  },
  getKills: async (channelId) => {
    const sql = 'SELECT tribe, COUNT(channel_id) FROM tracker WHERE channel_id = $1 GROUP BY tribe'
    const values = [channelId]
    try {
      const { rows } = await pool.query(sql, values)
      return rows
    } catch(err) { throw err }
  }
}