const { buildTableByTribe, getTribe, getAllTribes } = require('../util')
const { getScores, getTribeArray } = require('../db')
const plotly = require('plotly')(process.env.PLOTLYUSER, process.env.PLOTLYKEY);
const hash = require('hash.js')
const sharp = require('sharp')
const request = require('request');

module.exports = {
  name: 'getscores',
  description: 'get all scores associated with the channel',
  aliases: ['scores', 'get'],
  usage(prefix) {
    return `\`${prefix}get\``
  },
  category: 'Scores',
  // eslint-disable-next-line no-unused-vars
  execute: async function (message, argsStr, embed) {
    try {
      const rows = await getScores(message.channel.id)
      if (rows.length < 1)
        throw `Looks like no scores were captured for this game yet.\nTry \`${this.usage(process.env.PREFIX)}\``

      const tribeArray = await getTribeArray(message.channel.id)
      let tribe

      if (argsStr)
        tribe = [getTribe(argsStr)]
      else
        tribe = getAllTribes()

      const tribes = tribe.filter(x => tribeArray.some(y => y.tribe === x.code))

      if (tribes.length < 1)
        throw `Seems like **${tribe[0].name}** doesn't have any score set for this game/channel :confused:`

      message.channel.startTyping()

      tribes.forEach(trib => {
        const values = buildTableByTribe(trib, rows)
        const data = [{
          type: 'table',
          header: {
            values: [['<b>Turn</b>'], ['<b>ΔScore</b>'], ['<b>Points</b>'], ['<b>Comment</b>']],
            align: 'center',
            line: { width: 1, color: 'black' },
            fill: { color: 'grey' },
            font: { family: 'Arial', size: 12, color: 'white' }
          },
          cells: {
            values: values,
            align: 'center',
            fill: {
              color: '#36393F'
            },
            line: { color: 'black', width: 1 },
            font: { family: 'Arial', size: 11, color: ['white'] }
          }
        }]

        const layout = {
          title: `${trib.name}`,
          paper_bgcolor: '#36393F',
          plot_bgcolor: '#36393F',
          font: {
            color: '#FFFFFF'
          }
        };

        const graphOptions = { layout, filename: `${message.channel.id} ${trib.name}`, fileopt: 'overwrite' };

        plotly.plot(data, graphOptions, async (err, msg) => {
          if (err)
            throw err


          const options = {
            url: msg.url + '.png',
            method: 'get',
            encoding: null
          };

          request(options, async function (error, response, body) {

            if (error) {
              throw error;
            } else {
              try {
                const newImg = await sharp(body)
                newImg.trim(0.1)
                  .extend({
                    top: 10,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: { r: 54, g: 57, b: 63, alpha: 1 }
                  })
                  .toBuffer()

                message.channel.send(msg.url, { files: [{ attachment: newImg, name: `${hash.sha1().update(Math.random().toString()).digest('hex')}.jpg` }] })
              } catch (err) {
                throw err
              }
            }
          });
        });
      })

      return
    } catch (err) { throw err }
  }
}