const { getChannels } = require('../db')

module.exports = {
  name: 'active',
  description: 'get all active/ongoing channels',
  aliases: ['ongoing'],
  usage(prefix) {
    return `\`${prefix}active\``
  },
  category: 'Kills',
  // eslint-disable-next-line no-unused-vars
  execute: async function(message, argsStr, embed) {
    try {
      const rows = await getChannels(message.guild.id)

      const channels = []

      rows.forEach(row => {
        channels.push(message.guild.channels.cache.get(row.channel_id))
      })
      if(channels.length < 1)
        throw 'There are no active channels in this server.'

      channels.unshift('Here are the channels for this server with registered kills:')

      return channels
    } catch(err) { throw err }
  }
}