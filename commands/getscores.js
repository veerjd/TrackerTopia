const { buildTableByTribe, getTribe, getAllTribes } = require('../util')
const { getScores, getTribeArray } = require('../db')
const plotly = require('plotly')(process.env.PLOTLYUSER, process.env.PLOTLYKEY);
const hash = require('hash.js')

module.exports = {
  name: 'getscores',
  description: 'get all scores associated with the channel',
  aliases: ['scores', 'get'],
  usage(prefix) {
    return `\`${prefix}get\``
  },
  category: 'Scores',
  // eslint-disable-next-line no-unused-vars
  execute: async function(message, argsStr, embed) {
    try {
      const rows = await getScores(message.channel.id)
      if(rows.length < 1)
        throw `Looks like no scores were captured for this game yet.\nTry \`${this.usage(process.env.PREFIX)}\``

      const tribeArray = await getTribeArray(message.channel.id)
      let tribe

      if(argsStr)
        tribe = [getTribe(argsStr)]
      else
        tribe = getAllTribes()

      const tribes = tribe.filter(x => tribeArray.some(y => y.tribe === x.code))

      if(tribes.length < 1)
        throw `Seems like **${tribe[0].name}** doesn't have any score set for this game/channel :confused:`

      message.channel.startTyping()

      tribes.forEach(trib => {
        const values = buildTableByTribe(trib, rows)
        console.log(values)
        const data = [{
          type: 'table',
          header: {
            values: [['<b>Turn</b>'], ['<b>ΔRaw</b>'], ['<b>ΔSeen</b>'], ['<b>Points</b>'], ['<b>Raw</b>'], ['<b>Comment</b>']],
            align: 'center',
            line: { width: 1, color: 'black' },
            fill: { color: 'grey' },
            font: { family: 'Arial', size: 12, color: 'white' }
          },
          cells: {
            values: values,
            align: 'center',
            line: { color: 'black', width: 1 },
            font: { family: 'Arial', size: 11, color: ['black'] }
          }
        }]

        const graphOptions = { layout: { title: `${trib.name}` }, filename: `${message.channel.id} ${trib.name}`, fileopt: 'overwrite' };

        plotly.plot(data, graphOptions, (err, msg) => {
          if(err)
            throw err
          message.channel.stopTyping()
          message.channel.send(msg.url, { files: [{ attachment: `${msg.url}.png`, name: `${hash.sha1().update(Math.random().toString()).digest('hex')}.jpg` }] })
        });
      })

      return
    } catch(err) { throw err }
  }
}