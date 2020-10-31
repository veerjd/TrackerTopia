const { getTribeCode } = require('../util')
const { saveKill } = require('../db')

module.exports = {
  name: 'addkill',
  description: 'add a kill for a specific tribe associated with the channel',
  aliases: ['add', 'kill', 'k', ''],
  usage(prefix) {
    return `${prefix}kill b`
  },
  // You can have as many categories as you want, just make sure to update the help.js file with them
  category: 'Basic',
  execute: async function(message, argsStr, embed) {
    if(!argsStr)
      throw 'You need to include the tribe...'

    const args = argsStr.split(/ +/).filter(x => x != '')
    const tribe = args[0].toLowerCase()

    try {
      const code = getTribeCode(tribe)
      saveKill(message.channel.id, code)
      const newMessage = await message.channel.send('Saved successfully')
      newMessage.delete({ timeout: 5000 })
    } catch(err) { throw err }
  }
}