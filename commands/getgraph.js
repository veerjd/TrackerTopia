const { buildTraces } = require('../util')
const { getScores, getTribeArray } = require('../db')
const plotly = require('plotly')('alphaSeahorse', process.env.PLOTLYKEY);
const hash = require('hash.js')

module.exports = {
  name: 'getgraph',
  description: 'get graph for all inputted scores for the game/channel',
  aliases: ['graph'],
  usage(prefix) {
    return `\`${prefix}graph\``
  },
  category: 'Score',
  // eslint-disable-next-line no-unused-vars
  execute: async function(message, argsStr, embed) {
    try {
      const rows = await getScores(message.channel.id)
      if(rows.length < 1)
        throw `Looks like no scores were captured for this game yet.\nTry \`${process.env.PREFIX}set vision b 0 550\``

      const tribeArray = await getTribeArray(message.channel.id)

      const data = [];

      const tracesArray = buildTraces(tribeArray, rows)
      console.log(tracesArray)

      tracesArray.forEach(trace => {
        data.push(trace)
      })

      const layout = {
        xaxis: {
          type: 'scatter',
          dtick: 1,
          title: {
            text: 'Turns'
          }
        },
        yaxis: {
          type: 'scatter',
          title: {
            text: 'Scores'
          }
        }
      };
      const graphOptions = { layout: layout, filename: message.channel.id, fileopt: 'overwrite' };

      plotly.plot(data, graphOptions, (err, msg) => {
        console.log(err)
        message.channel.send(msg.url, { files: [{ attachment: `${msg.url}.png`, name: `${hash.sha1().update(Math.random().toString()).digest('hex')}.jpg` }] })
      });

      return
    } catch(err) { throw err }
  }
}