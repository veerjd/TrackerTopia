const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'help',
  description: 'list all the commands details',
  aliases: ['commands', 'command', 'h'],
  usage(prefix) {
    return `\`${prefix}help\``
  },
  category: 'hidden', // Since 'hidden' category isn't in the categoriesMapped (see line 36), it won't display in the help command
  // User that can do the command regardless of .permsAllowed
  usersAllowed: [''],
  async execute(message, argsStr, embed) {
    // Pulling all the commands that are defined in index.js (line 8-13)
    const { commands } = message.client

    embed.setTitle('Help card for all commands')

    const kills = commands.filter(x => x.category.toLowerCase() === 'kills')
    const scores = commands.filter(x => x.category.toLowerCase() === 'scores')
    const all = commands.filter(x => x.category.toLowerCase() === 'all')

    try {
      embed.setTitle('Tracking Kills:')
      all.forEach(cmd => {
        if(cmd.category === 'hidden')
          return

        embed.addField(`:arrow_right: **${cmd.name}** :arrow_left:`, `**Description:** ${cmd.description}\n**Aliases:** ${cmd.aliases.toString()}\n**Usage:** ${cmd.usage(process.env.PREFIX)}`)
      })

      const msg1 = await message.channel.send(embed)
      await msg1.react('🗑️')

      const otherEmbed = new MessageEmbed().setColor('#aa0000').setTitle('Tracking Scores:')

      kills.forEach(cmd => {
        if(cmd.category === 'hidden')
          return

        otherEmbed.addField(`:arrow_right: **${cmd.name}** :arrow_left:`, `**Description:** ${cmd.description}\n**Aliases:** ${cmd.aliases.toString()}\n**Usage:** ${cmd.usage(process.env.PREFIX)}`)
      })

      const msg2 = await message.channel.send(otherEmbed)
      await msg2.react('🗑️')

      const otherOtherEmbed = new MessageEmbed().setColor('#aa0000').setTitle('Tracking Scores:')

      scores.forEach(cmd => {
        if(cmd.category === 'hidden')
          return

        otherOtherEmbed.addField(`:arrow_right: **${cmd.name}** :arrow_left:`, `**Description:** ${cmd.description}\n**Aliases:** ${cmd.aliases.toString()}\n**Usage:** ${cmd.usage(process.env.PREFIX)}`)
      })

      const msg3 = await message.channel.send(otherOtherEmbed)
      await msg3.react('🗑️')

      return
    } catch (error) {
      throw error
    }
  }
}