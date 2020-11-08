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
  execute(message, argsStr, embed) {
    // Pulling all the commands that are defined in index.js (line 8-13)
    const { commands } = message.client

    embed.setTitle('Help card for all commands')

    const sortedCommands = commands.sort((a, b) => a.category > b.category)

    sortedCommands.forEach(cmd => {
      if(cmd.category === 'hidden')
        return

      embed.addField(`:arrow_right: **${cmd.name}** :arrow_left:`, `**Description:** ${cmd.description}\n**Aliases:** ${cmd.aliases.toString()}\n**Usage:** ${cmd.usage(process.env.PREFIX)}`)
    })

    return embed
  }
}