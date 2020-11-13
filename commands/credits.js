module.exports = {
  name: 'credits',
  description: 'show the team!',
  aliases: ['cred', 'credit'],
  usage(prefix) {
    return `${prefix}cred`
  },
  category: 'All',
  execute: function(message, argsStr, embed) {
    embed.setTitle('**TrackerTopia bot credits!**')
      .addField('Developer', 'jd (alphaSeahorse)')
      .addField('Contributions', 'Legorooj, Kunegetes, A Big Tree, pomthom and ulthripe.')

    return embed
  }
};