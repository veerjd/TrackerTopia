const { getKillsChannels, getScoresChannels } = require('../db')

module.exports = {
  name: 'active',
  description: 'get all active/ongoing channels',
  aliases: ['ongoing'],
  usage(prefix) {
    return `\`${prefix}active\``
  },
  category: 'All',
  // eslint-disable-next-line no-unused-vars
  execute: async function(message, argsStr, embed) {
    try {
      const killsRows = await getKillsChannels(message.guild.id)

      const scoresRows = await getScoresChannels(message.guild.id)

      if(scoresRows.length < 1 && killsRows < 1)
        throw 'There are no active channels in this server.'

      let channels = ['Here are the channels for this server with registered **kills**:']

      killsRows.forEach(row => {
        console.log('Kills:', row.channel_id)
        channels.push(message.guild.channels.cache.get(row.channel_id))
      })

      if(channels.length > 1)
        message.channel.send(channels)

      channels = ['Here are the channels for this server with registered **scores**:']
      scoresRows.forEach(row => {
        console.log('Scores:', row.channel_id)
        channels.push(message.guild.channels.cache.get(row.channel_id))
      })

      if(channels.length > 1)
        return channels
    } catch(err) { throw err }
  }
}