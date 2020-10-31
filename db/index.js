require('dotenv').config()
const { Pool } = require('pg')

const connectionString = process.env.DATABASE_URL

const pool = new Pool({
  connectionString: connectionString
})

module.exports = {
  query: (text, params) => pool.query(text, params),
  saveKill: async (guildId, channelId, tribeCode) => {
    const sql = 'INSERT INTO tracker (guild_id, channel_id, tribe) VALUES ($1, $2, $3)'
    const values = [guildId, channelId, tribeCode]
    try {
      await pool.query(sql, values)
      return true
    } catch(err) { throw err }
  },
  removeKill: async (guildId, channelId, tribeCode) => {
    const sql = 'DELETE FROM tracker WHERE id IN (SELECT id FROM tracker WHERE guild_id = $1 AND channel_id = $2 AND tribe = $3 LIMIT 1)'
    const values = [guildId, channelId, tribeCode]
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
  },
  getChannels: async (guildId) => {
    const sql = 'SELECT DISTINCT channel_id FROM tracker WHERE guild_id = $1'
    const values = [guildId]
    try {
      const { rows } = await pool.query(sql, values)
      return rows
    } catch(err) { throw err }
  },
  getCount: async (channelId, tribeCode) => {
    const sql = 'SELECT channel_id, tribe FROM tracker WHERE channel_id = $1 AND tribe = $2'
    const values = [channelId, tribeCode]
    try {
      const { rows } = await pool.query(sql, values)
      return rows.length
    } catch(err) { throw err }
  }
}