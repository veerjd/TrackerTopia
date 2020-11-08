const { getTribe, isVisionScore } = require('../util')
const { setScore } = require('../db')

module.exports = {
  name: 'setscore',
  description: 'set vision and visionless score for a tribe and a turn associated with the channel',
  aliases: ['set', 'score'],
  usage(prefix) {
    return `\`${prefix}set [scoretype] [tribe] [turn] [value]\`\n` +
           `eg. \`${prefix}set vision b 2 700\`\n` +
           `eg. \`${prefix}set raw ai 4 1300\`\n`
  },
  category: 'Score',
  // eslint-disable-next-line no-unused-vars
  execute: async function(message, argsStr, embed) {
    if(!argsStr)
      throw 'You need to include the tribe...'
    try {
      const args = argsStr.split(/ +/).filter(x => x != '')
      if(args.length !== 4)
        throw `The format is not right. Use this format:\n${this.usage(process.env.PREFIX)}`

      const isVision = isVisionScore(args[0].toLowerCase())
      const tribeArg = args[1].toLowerCase()
      const turn = Number(args[2])
      const score = Number(args[3])

      if(turn < 0)
        throw 'Turn -1 is automatically set by the tribe'
      if(isNaN(turn))
        throw `The turn is not set right. Use this format:\n${this.usage(process.env.PREFIX)}`
      if(isNaN(score))
        throw `The score is not set right. Use this format:\n${this.usage(process.env.PREFIX)}`

      const tribe = getTribe(tribeArg)

      const isUpdate = await setScore(message.channel.id, message.guild.id, isVision, tribe.code, turn, score)
      if(isUpdate) {
        const newMessage = await message.channel.send(`:warning: Careful ${message.author} :warning:\nYou just updated a previously set score.`)
        newMessage.delete({ timeout: 10000 })
      }

      return `**${isVision ? 'Vision' : 'Raw'}** score, **${score}**, was ${isUpdate ? '__updated__' : 'saved'} for **${tribe.name}** for turn **${turn}**!`
    } catch(err) { throw err }
  }
}