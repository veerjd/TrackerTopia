const { buildTraces } = require('../util')
const { getGraph, getTribeArray } = require('../db')
const setscore = require('./setscore')
const plotly = require('plotly')(process.env.PLOTLYUSER, process.env.PLOTLYKEY);
const hash = require('hash.js')
const sharp = require('sharp')
const request = require('request');

module.exports = {
  name: 'getgraph',
  description: 'get graph for all inputted scores for the game/channel',
  aliases: ['graph'],
  usage(prefix) {
    return `\`${prefix}graph\``
  },
  category: 'Scores',
  // eslint-disable-next-line no-unused-vars
  execute: async function (message, argsStr, embed) {
    try {
      const rows = await getGraph(message.channel.id)
      if (rows.length < 1)
        throw `Looks like no scores were captured for this game yet.\nTry ${setscore.usage(process.env.PREFIX)}`

      message.channel.startTyping()

      const tribeArray = await getTribeArray(message.channel.id)

      const data = [];

      const tracesArray = buildTraces(tribeArray, rows)

      tracesArray.forEach(trace => {
        data.push(trace)
      })

      const layout = {
        paper_bgcolor: '#36393F',
        plot_bgcolor: '#36393F',
        legend: {
          font: {
            color: '#FFFFFF'
          }
        },
        grid: {
          yaxes: {
            color: '#FFFFFF',
          }
        },
        xaxis: {
          color: '#FFFFFF',
          type: 'scatter',
          dtick: 1,
          title: {
            text: 'Turns'
          }
        },
        yaxis: {
          color: '#FFFFFF',
          type: 'scatter',
          title: {
            text: 'Scores'
          }
        }
      };
      const graphOptions = { layout: layout, filename: message.channel.id, fileopt: 'overwrite' };

      plotly.plot(data, graphOptions, (err, msg) => {
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
              newImg.trim()
                .extend({
                  top: 10,
                  bottom: 5,
                  left: 5,
                  right: 5,
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

      return
    } catch (err) { throw err }
  }
}