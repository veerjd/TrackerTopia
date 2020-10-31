const { Collection } = require('discord.js')

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
  if(tribes.has(string))
    return tribes.get(string)
  else if(tribes.some(x => x.alias.some(y => y === string)))
    return tribes.find(x => x.alias.some(y => y === string))
  else
    throw 'The tribe isn\'t valid'
}

const tribes = new Collection()
tribes.set('xin-xi', {
  name: 'Xin-Xi',
  code: 'x',
  alias: ['x', 'xin', 'xinxi', 'xin-xi']
})
tribes.set('imperius', {
  name: 'Imperius',
  code: 'i',
  alias: ['i', 'imp', 'imperius']
})
tribes.set('bardur', {
  name: 'Bardur',
  code: 'b',
  alias: ['b', 'ba', 'bardur']
})
tribes.set('oumaji', {
  name: 'Oumaji',
  code: 'o',
  alias: ['o', 'ou', 'oum', 'oumaji']
})
tribes.set('kickoo', {
  name: 'Kickoo',
  code: 'k',
  alias: ['k', 'kick', 'kickoo']
})
tribes.set('hoodrick', {
  name: 'Hoodrick',
  code: 'h',
  alias: ['h', 'hood', 'hoodrick']
})
tribes.set('luxidoor', {
  name: 'Luxidoor',
  code: 'l',
  alias: ['l', 'lux', 'luxidoor']
})
tribes.set('vengir', {
  name: 'Vengir',
  code: 'v',
  alias: ['v', 'ven', 'vengir']
})
tribes.set('zebasi', {
  name: 'Zebasi',
  code: 'z',
  alias: ['z', 'zeb', 'zebasi']
})
tribes.set('ai-mo', {
  name: 'Ai-Mo',
  code: 'ai',
  alias: ['ai', 'aimo', 'ai-mo']
})
tribes.set('quetzali', {
  name: 'Quetzali',
  code: 'q',
  alias: ['q', 'quetz', 'quetzali']
})
tribes.set('yadakk', {
  name: 'Yadakk',
  code: 'y',
  alias: ['y', 'yad', 'yaddak', 'yadakk']
})
tribes.set('aquarion', {
  name: 'Aquarion',
  code: 'aq',
  alias: ['aq', 'aquarion']
})
tribes.set('elyrion', {
  name: 'Elyrion',
  code: 'e',
  alias: ['e', 'ely', 'elyrion']
})
tribes.set('polaris', {
  name: 'Polaris',
  code: 'p',
  alias: ['p', 'pol', 'polaris']
})