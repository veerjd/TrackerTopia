const { Collection } = require('discord.js')

const tribes = new Collection()
tribes.set('xin-xi', {
  name: 'Xin-Xi',
  code: 'x',
  color: 'rgb(238, 30, 24)',
  alias: ['x', 'xin', 'xinxi', 'xin-xi'],
  vision: 515,
  raw: 390
})
tribes.set('imperius', {
  name: 'Imperius',
  code: 'i',
  color: 'rgb(8, 110, 223)',
  alias: ['i', 'imp', 'imperius'],
  vision: 515,
  raw: 390
})
tribes.set('bardur', {
  name: 'Bardur',
  code: 'b',
  color: 'rgb(5, 0, 29)',
  alias: ['b', 'ba', 'bardur'],
  vision: 515,
  raw: 390
})
tribes.set('oumaji', {
  name: 'Oumaji',
  code: 'o',
  color: 'rgb(255, 255, 0)',
  alias: ['o', 'ou', 'oum', 'oumaji'],
  vision: 520,
  raw: 295
})
tribes.set('kickoo', {
  name: 'Kickoo',
  code: 'k',
  color: 'rgb(0, 255, 0)',
  alias: ['k', 'kick', 'kickoo'],
  vision: 515,
  raw: 390
})
tribes.set('hoodrick', {
  name: 'Hoodrick',
  code: 'h',
  color: 'rgb(153, 102, 0)',
  alias: ['h', 'hood', 'hoodrick'],
  vision: 620,
  raw: 495
})
tribes.set('luxidoor', {
  name: 'Luxidoor',
  code: 'l',
  color: 'rgb(171, 59, 214)',
  alias: ['l', 'lux', 'luxidoor'],
  vision: 515,
  raw: 390
})
tribes.set('vengir', {
  name: 'Vengir',
  code: 'v',
  color: 'rgb(179, 179, 179)',
  alias: ['v', 'ven', 'vengir'],
  vision: 730,
  raw: 605
})
tribes.set('zebasi', {
  name: 'Zebasi',
  code: 'z',
  color: 'rgb(255, 153, 0)',
  alias: ['z', 'zeb', 'zebasi'],
  vision: 615,
  raw: 490
})
tribes.set('ai-mo', {
  name: 'Ai-Mo',
  code: 'ai',
  color: 'rgb(100, 212, 212)',
  alias: ['ai', 'aimo', 'ai-mo'],
  vision: 615,
  raw: 490
})
tribes.set('quetzali', {
  name: 'Quetzali',
  code: 'q',
  color: 'rgb(128, 0, 128)',
  alias: ['q', 'quetz', 'quetzali'],
  vision: 620,
  raw: 496
})
tribes.set('yadakk', {
  name: 'Yadakk',
  code: 'y',
  color: 'rgb(153, 45, 45)',
  alias: ['y', 'yad', 'yaddak', 'yadakk'],
  vision: 615,
  raw: 490
})
tribes.set('aquarion', {
  name: 'Aquarion',
  code: 'aq',
  color: 'rgb(248, 118, 118)',
  alias: ['aq', 'aquarion'],
  vision: 415,
  raw: 290
})
tribes.set('elyrion', {
  name: 'Elyrion',
  code: 'e',
  color: 'rgb(255, 0, 153)',
  alias: ['e', 'ely', 'elyrion'],
  vision: 515,
  raw: 390
})
tribes.set('polaris', {
  name: 'Polaris',
  code: 'p',
  color: 'rgb(189, 161, 127)',
  alias: ['p', 'pol', 'polaris'],
  vision: 630,
  raw: 505
})
module.exports.getAllTribes = function() {
  return tribes.array()
}
module.exports.getTribeCode = function(string) {
  if(tribes.has(string)) {
    const tribe = tribes.get(string)
    const { code } = tribe
    return code
  } else if(tribes.some(x => x.alias.some(y => y === string))) {
    const tribe = tribes.find(x => x.alias.some(y => y === string))
    const { code } = tribe
    return code
  } else
    throw 'The tribe isn\'t valid'
}

module.exports.getTribe = function(string) {
  string = string.toLowerCase()
  if(tribes.has(string))
    return tribes.get(string)
  else if(tribes.some(x => x.alias.some(y => y === string)))
    return tribes.find(x => x.alias.some(y => y === string))
  else
    throw 'The tribe isn\'t valid'
}

module.exports.isVisionScore = function(string) {
  if(string.startsWith('vi'))
    return true
  else if(string.startsWith('vl') || string.startsWith('l') || string.startsWith('r'))
    return false
  else
    throw 'Score type should start with `vi` for vision and `vl` or just `l` for visionless.'
}

module.exports.buildTableByTribe = function(tribe, rows) {

}

module.exports.buildTraces = function(tribeArray, rows) {
  const raw = rows.filter(x => !x.is_vision)
  const vision = rows.filter(x => x.is_vision)
  const tracesArray = new Collection()

  tribeArray.forEach(tribe => {
    const tribeRaw = raw.filter(x => tribe.tribe === x.tribe)
    const tribeVision = vision.filter(x => tribe.tribe === x.tribe)

    const tribeName = module.exports.getTribe(tribe.tribe)

    const xRaw = []
    const yRaw = []
    const tRaw = []
    tribeRaw.forEach((x, index) => {
      xRaw.push(x.turn)
      yRaw.push(x.score)
      if(tribeVision[index - 1])
        tRaw.push(`${ x.score - tribeVision[index - 1].score }Δ`)
      else
        tRaw.push('')
    })
    const rawTrace = {
      name: `${tribeName.code.toUpperCase()} raw`,
      x: xRaw,
      y: yRaw,
      text: tRaw,
      marker: {
        color: tribeName.color
      },
      mode: 'markers+text',
      textposition: 'top center',
      type: 'scatter',
      texttemplate: 'hello'
    }

    tracesArray.set(`${tribeName.name} Raw`, rawTrace)

    const xVision = []
    const yVision = []
    const tVision = []
    tribeVision.forEach((x, index) => {
      xVision.push(x.turn)
      yVision.push(x.score)
      if(tribeVision[index - 1])
        tVision.push(`${ x.score - tribeVision[index - 1].score }Δ`)
      else
        tVision.push('')
    })
    const visionTrace = {
      name: `${tribeName.code.toUpperCase()} vision`,
      x: xVision,
      y: yVision,
      text: tVision,
      marker: {
        color: tribeName.color
      },
      mode: 'markers+text',
      textposition: 'top center',
      type: 'scatter',
      texttemplate: 'hello'
    }

    tracesArray.set(`${tribeName.name} Vision`, visionTrace)
  })
  return tracesArray
}

module.exports.buildTable = function(tribeArray, rows) {
  const raw = rows.filter(x => !x.is_vision)
  const vision = rows.filter(x => x.is_vision)
  const tracesArray = new Collection()

  tribeArray.forEach(tribe => {
    const tribeRaw = raw.filter(x => tribe.tribe === x.tribe)
    const tribeVision = vision.filter(x => tribe.tribe === x.tribe)

    console.log(tribeRaw)
    console.log(tribeVision)
    const tribeName = module.exports.getTribe(tribe.tribe)

    const xRaw = []
    const yRaw = []
    const tRaw = []
    tribeRaw.forEach((x, index) => {
      xRaw.push(x.turn)
      yRaw.push(x.score)
      if(tribeVision[index - 1])
        tRaw.push(`${ x.score - tribeVision[index - 1].score }Δ`)
      else
        tRaw.push('')
    })
    const rawTrace = {
      name: `${tribeName.code.toUpperCase()} raw`,
      x: xRaw,
      y: yRaw,
      text: tRaw,
      marker: {
        color: tribeName.color
      },
      mode: 'markers+text',
      textposition: 'top center',
      type: 'scatter',
      texttemplate: 'hello'
    }

    tracesArray.set(`${tribeName.name} Raw`, rawTrace)

    const xVision = []
    const yVision = []
    const tVision = []
    tribeVision.forEach((x, index) => {
      xVision.push(x.turn)
      yVision.push(x.score)
      if(tribeVision[index - 1])
        tVision.push(`${ x.score - tribeVision[index - 1].score }Δ`)
      else
        tVision.push('')
    })
    const visionTrace = {
      name: `${tribeName.code.toUpperCase()} vision`,
      x: xVision,
      y: yVision,
      text: tVision,
      marker: {
        color: tribeName.color
      },
      mode: 'markers+text',
      textposition: 'top center',
      type: 'scatter',
      texttemplate: 'hello'
    }

    tracesArray.set(`${tribeName.name} Vision`, visionTrace)
  })
  return tracesArray
}