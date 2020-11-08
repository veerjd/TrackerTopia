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
    } catch(err) { throw err }
  },
  removeKill: async (guildId, channelId, tribeCode) => {
    const sql = 'DELETE FROM kills WHERE id IN (SELECT id FROM kills WHERE guild_id = $1 AND channel_id = $2 AND tribe = $3 LIMIT 1)'
    const values = [guildId, channelId, tribeCode]
    try {
      await pool.query(sql, values)
      return true
    } catch(err) { throw err }
  },
  getKills: async (channelId) => {
    const sql = 'SELECT tribe, COUNT(channel_id) FROM kills WHERE channel_id = $1 GROUP BY tribe'
    const values = [channelId]
    try {
      const { rows } = await pool.query(sql, values)
      return rows
    } catch(err) { throw err }
  },
  getChannels: async (guildId) => {
    const sql = 'SELECT DISTINCT channel_id FROM kills WHERE guild_id = $1'
    const values = [guildId]
    try {
      const { rows } = await pool.query(sql, values)
      return rows
    } catch(err) { throw err }
  },
  getCount: async (channelId, tribeCode) => {
    const sql = 'SELECT channel_id, tribe FROM kills WHERE channel_id = $1 AND tribe = $2'
    const values = [channelId, tribeCode]
    try {
      const { rows } = await pool.query(sql, values)
      return rows.length
    } catch(err) { throw err }
  },
  deleteGame: async (channelId) => {
    const sql = 'DELETE FROM kills WHERE channel_id = $1'
    const values = [channelId]
    try {
      await pool.query(sql, values)
      return true
    } catch(err) { throw err }
  },
  setScore: async (channelId, guildId, isVision, tribeCode, turn, score) => {
    let sql = 'INSERT INTO scores (channel_id, guild_id, is_vision, tribe, turn, score) VALUES ($1, $2, $3, $4, $5, $6)'
    let values = [channelId, guildId, isVision, tribeCode, turn, score]

    const sqlSel = 'SELECT id FROM scores WHERE channel_id = $1 AND tribe = $2 AND turn = $3 AND is_vision = $4'
    const valuesSel = [channelId, tribeCode, turn, isVision]
    const { rows } = await pool.query(sqlSel, valuesSel)

    if(rows.length > 0) {
      sql = 'UPDATE scores SET score = $1 WHERE id = $2'
      values = [score, rows[0].id]
    }

    try {
      await pool.query(sql, values)
      if(sql.startsWith('UPDATE'))
        return true
      else
        return false
    } catch(err) { throw err }
  },
  getScores: async (channelId) => {
    const sql = 'SELECT is_vision, tribe, turn, score FROM scores WHERE channel_id = $1 ORDER BY tribe, is_vision, turn'
    const values = [channelId]
    try {
      const { rows } = await pool.query(sql, values)
      return rows
    } catch(err) { throw err }
  },
  // getTraceCount:  async (channelId) => {
  //   const sql = 'SELECT COUNT(id), is_vision, tribe FROM scores WHERE channel_id = $1 GROUP BY is_vision, tribe'
  //   const values = [channelId]
  //   try {
  //     const { rows } = await pool.query(sql, values)
  //     console.log(rows)
  //     return rows
  //   } catch(err) { throw err }
  // },
  getTribeArray:  async (channelId) => {
    const sql = 'SELECT DISTINCT tribe FROM scores WHERE channel_id = $1'
    const values = [channelId]
    try {
      const { rows } = await pool.query(sql, values)
      return rows
    } catch(err) { throw err }
  },
}