const { deleteGame } = require('../db')

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
      await deleteGame(message.channel.id)

      return 'This game/channel\'s entries were resetted!'
    } catch(err) { throw err }
  }
}