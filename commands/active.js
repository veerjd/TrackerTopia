const { getChannels } = require('../db')

module.exports = {
  name: 'active',
  description: 'get all active/ongoing channels',
  aliases: ['ongoing'],
  usage(prefix) {
    return `${prefix}active`
  },
  // You can have as many categories as you want, just make sure to update the help.js file with them
  category: 'Basic',
  // eslint-disable-next-line no-unused-vars
  execute: async function(message, argsStr, embed) {
    try {
      const rows = await getChannels(message.guild.id)

      const channels = []
      console.log(rows)
      rows.forEach(row => {
        channels.push(message.guild.channels.cache.get(row.channel_id))
      })
      if(channels.length < 1)
        throw 'There are no active channels in this server.'

      return channels
    } catch(err) { throw err }
  }
}