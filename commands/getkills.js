const { getTribe } = require('../util')
const { getKills } = require('../db')

module.exports = {
  name: 'getkills',
  description: 'get kills for this game/channel',
  aliases: ['kills'],
  usage(prefix) {
    return `\`${prefix}kills\``
  },
  category: 'Kills',
  execute: async function(message, argsStr, embed) {
    try {
      const rows = await getKills(message.channel.id)

      if(rows.length === 0)
        throw 'No kills were registered yet (or the game/channel was resetted)'

      rows.forEach(row => {
        const tribe = getTribe(row.tribe)
        embed.addField(tribe.name, `${row.count} kill${row.count < 2 ? '' : 's'}`)
      })

      return embed
    } catch(err) { throw err }
  }
}