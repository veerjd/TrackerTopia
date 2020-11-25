const { getTribe } = require('../util')
const { setScore } = require('../db')

module.exports = {
  name: 'setscore',
  description: 'set vision and visionless score for a tribe and a turn associated with the channel',
  aliases: ['set', 'score'],
  usage(prefix) {
    return `\`${prefix}set {tribe} {turn} {vision} [comment]\`\n` +
      `eg. \`${prefix}set b 2 1300 saw a lumber hut\``
  },
  category: 'Scores',
  // eslint-disable-next-line no-unused-vars
  execute: async function (message, argsStr, embed) {
    if (!argsStr)
      throw 'You need to include the tribe...'

    const times = argsStr.split(',').filter(x => x != '')

    for (const arg of times) {
      try {
        const args = arg.split(/ +/).filter(x => x != '')

        const tribeArg = args.shift().toLowerCase()
        const turn = Number(args.shift())
        const total = Number(args.shift())
        const comment = args.join(' ')

        const tribe = getTribe(tribeArg)

        if (turn < 0)
          throw 'Turn -1 is automatically set by the tribe'
        if (isNaN(turn))
          throw `**${tribe.name}**'s turn was not inputted right. Use this format:`
        if (isNaN(total))
          throw `**${tribe.name}**'s score was not inputted right. Use this format:`

        const isUpdate = await setScore(message.channel.id, message.guild.id, tribe.code, turn, total, comment)
        if (isUpdate) {
          const newMessage = await message.channel.send(`:warning: Careful ${message.author} :warning:\nYou just updated a previously set score.`)
          newMessage.delete({ timeout: 10000 })
        }

        message.channel.send(`**${total}** total score was ${isUpdate ? '__updated__' : 'saved'} for **${tribe.name}** for turn **${turn}**!`)
      } catch (err) { throw `${err}\n${this.usage(process.env.PREFIX)}` }
    }
    return
  }
}