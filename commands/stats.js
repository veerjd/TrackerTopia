const { getTribe } = require('../util')
const { getKills } = require('../db')

module.exports = {
  name: 'stats',
  description: 'get kills for this game/channel',
  aliases: ['get', 'all'],
  usage(prefix) {
    return `${prefix}get`
  },
  // You can have as many categories as you want, just make sure to update the help.js file with them
  category: 'Basic',
  execute: async function(message, argsStr, embed) {
    try {
      const rows = await getKills(message.channel.id)

      rows.forEach(row => {
        const tribe = getTribe(row.tribe)
        embed.addField(tribe.name, `${row.count} kill${row.count < 2 ? '' : 's'}`)
      })

      await message.channel.send(embed)
    } catch(err) { throw err }
  }
}