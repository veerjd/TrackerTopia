const { getTribe } = require('../util')
const { setScore } = require('../db')
const getScore = require('./getscores')

module.exports = {
  name: 'setscore',
  description: 'set vision and visionless score for a tribe and a turn associated with the channel',
  aliases: ['set', 'score'],
  usage(prefix) {
    return `\`${prefix}set {tribe} {turn} {vision} {raw} [comment]\`\n` +
           `eg. \`${prefix}set b 2 1300 700 saw a lumber hut\``
  },
  category: 'Scores',
  // eslint-disable-next-line no-unused-vars
  execute: async function(message, argsStr, embed) {
    if(!argsStr)
      throw 'You need to include the tribe...'
    try {
      const args = argsStr.split(/ +/).filter(x => x != '')

      const tribeArg = args.shift().toLowerCase()
      const turn = Number(args.shift())
      const total = Number(args.shift())
      let raw = Number(args.shift())
      const comment = args.join(' ')

      if(turn < 0)
        throw 'Turn -1 is automatically set by the tribe'
      if(isNaN(turn))
        throw `The turn is not set right. Use this format:\n${this.usage(process.env.PREFIX)}`
      if(isNaN(total))
        throw `The score is not set right. Use this format:\n${this.usage(process.env.PREFIX)}`
      if(isNaN(raw))
        raw = undefined
      if(total < raw)
        throw 'Score with vision should be before raw score'

      const tribe = getTribe(tribeArg)

      const isUpdate = await setScore(message.channel.id, message.guild.id, tribe.code, turn, total, raw, comment)
      if(isUpdate) {
        const newMessage = await message.channel.send(`:warning: Careful ${message.author} :warning:\nYou just updated a previously set score.`)
        newMessage.delete({ timeout: 10000 })
      }

      message.channel.send(`**${total}** total and **${raw}** raw scores, were ${isUpdate ? '__updated__' : 'saved'} for **${tribe.name}** for turn **${turn}**!`)
      return getScore.execute(message, tribe.code, embed)
    } catch(err) { throw err }
  }
}