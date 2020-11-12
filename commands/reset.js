const { deleteScores, deleteKills, isTracked } = require('../db')

module.exports = {
  name: 'reset',
  description: 'clear all the kill entries for the game/channel',
  aliases: [],
  usage(prefix) {
    return `\`${prefix}reset\``
  },
  category: 'Kills',
  // eslint-disable-next-line no-unused-vars
  execute: async function(message, argsStr, embed) {
    try {
      const tracked = await isTracked(message.channel.id)

      console.log(tracked)
      const res = await message.channel.send(`Use the reaction to reset ${ tracked === 'both' ? '**kills**, **scores** or **both**' : '**' + tracked + '**' } for this game/channel.`)
      if(tracked === 'both') {
        res.react('🇰')
        res.react('🇸')
        res.react('🇧')
      }
      if(tracked === 'scores')
        res.react('🇸')
      if(tracked === 'kills')
        res.react('🇰')

      const filter = (reaction, user) => {
        return ['🇰', '🇸', '🇧'].includes(reaction.emoji.name) && user.id === message.author.id;
      };

      const collected = await res.awaitReactions(filter, { max: 1, time: 10000 })

      const reaction = collected.first()

      if(!reaction) {
        await res.delete({ timeout: 1000 })
        throw 'Nothing was deleted since no reactions were inputted'
      }

      let selection
      if (reaction.emoji.name === '🇰') {
        selection = 'Kills'
        await deleteKills(message.channel.id)
      }

      if (reaction.emoji.name === '🇸') {
        selection = 'Scores'
        await deleteScores(message.channel.id)
      }

      if (reaction.emoji.name === '🇧') {
        selection = 'Both'
        await deleteKills(message.channel.id)
        await deleteScores(message.channel.id)
      }

      res.delete({ timeout: 3000 })

      return `${ selection === 'Both' ? 'Both **kills** and **scores**' : '**' + selection + '**' } were reset for this game/channel.`
    } catch(err) { throw err }
  }
}