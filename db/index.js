require('dotenv').config()
const { Pool } = require('pg')

const connectionString = process.env.DATABASE_URL

const pool = new Pool({
  connectionString: connectionString
})

module.exports = {
  query: (text, params) => pool.query(text, params),
  saveKill: async (guildId, channelId, tribeCode) => {
    const sql = 'INSERT INTO kills (guild_id, channel_id, tribe) VALUES ($1, $2, $3)'
    const values = [guildId, channelId, tribeCode]
    try {
      await pool.query(sql, values)
      return true
    } catch (err) { throw err }
  },
  removeKill: async (guildId, channelId, tribeCode) => {
    const sql = 'DELETE FROM kills WHERE id IN (SELECT id FROM kills WHERE guild_id = $1 AND channel_id = $2 AND tribe = $3 LIMIT 1)'
    const values = [guildId, channelId, tribeCode]
    try {
      await pool.query(sql, values)
      return true
    } catch (err) { throw err }
  },
  getKills: async (channelId) => {
    const sql = 'SELECT tribe, COUNT(channel_id) FROM kills WHERE channel_id = $1 GROUP BY tribe'
    const values = [channelId]
    try {
      const { rows } = await pool.query(sql, values)
      return rows
    } catch (err) { throw err }
  },
  getKillsChannels: async (guildId) => {
    const sql = 'SELECT DISTINCT channel_id FROM kills WHERE guild_id = $1'
    const values = [guildId]
    try {
      const { rows } = await pool.query(sql, values)
      return rows
    } catch (err) { throw err }
  },
  getScoresChannels: async (guildId) => {
    const sql = 'SELECT DISTINCT channel_id FROM scores WHERE guild_id = $1'
    const values = [guildId]
    try {
      const { rows } = await pool.query(sql, values)
      return rows
    } catch (err) { throw err }
  },
  getCount: async (channelId, tribeCode) => {
    const sql = 'SELECT channel_id, tribe FROM kills WHERE channel_id = $1 AND tribe = $2'
    const values = [channelId, tribeCode]
    try {
      const { rows } = await pool.query(sql, values)
      return rows.length
    } catch (err) { throw err }
  },
  isTracked: async (channelId) => {
    const sql1 = 'SELECT id FROM scores WHERE channel_id = $1'
    const sql2 = 'SELECT id FROM kills WHERE channel_id = $1'
    const values = [channelId]
    try {
      const res1 = await pool.query(sql1, values)
      const res2 = await pool.query(sql2, values)

      if (res1.rows.length > 0 && res2.rows.length > 0)
        return 'both'
      else if (res1.rows.length > 0)
        return 'scores'
      else if (res2.rows.length > 0)
        return 'kills'
      else
        return undefined
    } catch (err) { throw err }
  },
  deleteScores: async (channelId) => {
    const sql = 'DELETE FROM scores WHERE channel_id = $1'
    const values = [channelId]
    try {
      await pool.query(sql, values)
      return true
    } catch (err) { throw err }
  },
  deleteKills: async (channelId) => {
    const sql = 'DELETE FROM kills WHERE channel_id = $1'
    const values = [channelId]
    try {
      await pool.query(sql, values)
      return true
    } catch (err) { throw err }
  },
  setScore: async (channelId, guildId, tribeCode, turn, total, comment) => {
    let sql = 'INSERT INTO scores (channel_id, guild_id, tribe, turn, total, comment) VALUES ($1, $2, $3, $4, $5, $6)'
    let values = [channelId, guildId, tribeCode, turn, total, comment]

    const sqlSel = 'SELECT id FROM scores WHERE channel_id = $1 AND tribe = $2 AND turn = $3'
    const valuesSel = [channelId, tribeCode, turn]
    const { rows } = await pool.query(sqlSel, valuesSel)

    if (rows.length > 0) {
      sql = 'UPDATE scores SET total = $1, comment = $2 WHERE id = $3'
      values = [total, comment, rows[0].id]
    }

    try {
      await pool.query(sql, values)
      if (sql.startsWith('UPDATE'))
        return true
      else
        return false
    } catch (err) { throw err }
  },
  getScores: async (channelId) => {
    const sql = 'SELECT tribe, turn, total, comment FROM scores WHERE channel_id = $1 ORDER BY tribe, turn'
    const values = [channelId]
    try {
      const { rows } = await pool.query(sql, values)
      return rows
    } catch (err) { throw err }
  },
  getGraph: async (channelId) => {
    const sql = 'SELECT tribe, turn, total FROM scores WHERE channel_id = $1 ORDER BY tribe, turn'
    const values = [channelId]
    try {
      const { rows } = await pool.query(sql, values)
      return rows
    } catch (err) { throw err }
  },
  getTribeArray: async (channelId) => {
    const sql = 'SELECT DISTINCT tribe FROM scores WHERE channel_id = $1'
    const values = [channelId]
    try {
      const { rows } = await pool.query(sql, values)
      return rows
    } catch (err) { throw err }
  },
}