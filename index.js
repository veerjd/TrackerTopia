require('dotenv').config()
const { Client, MessageEmbed, Collection } = require('discord.js')
const bot = new Client()
const fs = require('fs')
const prefix = process.env.PREFIX
const { deleteKills } = require('./db')
let logChannel = {}

// bot.commands as a collection(Map) of commands from ./commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
bot.commands = new Collection()
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  bot.commands.set(command.name, command)
}

// --------------------------------------
//
//       EVENT ON LOGIN
//
// --------------------------------------
bot.on('ready', () => {
  // eslint-disable-next-line no-console
  console.log(`Logged in as ${bot.user.username} ${prefix}`)
  logChannel = bot.channels.cache.get('775560585143648256')

  bot.user.setActivity(`${prefix}help`, { type: 'PLAYING' })
})

// --------------------------------------
//
//      EVENT ON MESSAGE
//
// --------------------------------------
bot.on('message', async message => {
  if (message.author.bot || !message.content.startsWith(prefix) || message.content === prefix)
    return

  // Handling
  const textStr = message.content.slice(prefix.length)
  const commandName = textStr.split(/ +/).shift().toLowerCase()
  const argsStr = textStr.slice(commandName.length + 1)

  // Map all the commands
  const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

  if (message.channel.id === '775560585143648256')
    console.log(command)
  // Return if the command doesn't exist
  if (!command)
    return

  // Instantiate the embed that's sent to every command execution
  const embed = new MessageEmbed().setColor('#aa0000')

  try {
    // EXECUTE COMMAND
    const reply = await command.execute(message, argsStr, embed)

    await logChannel.send(`\`${message.cleanContent}\` by ${message.author} (${message.author.username})\n${message.url}`)

    message.channel.stopTyping()

    // if there's a reply, send it
    if (reply)
      message.channel.send(reply)
        .then().catch(console.error)
    return
  } catch (error) {
    // If error, log it and reply it
    console.log('error:', error)
    return message.channel.send(`${error}`)
      .then().catch(console.error)
  }
})

bot.on('channelDelete', async channelDelete => {
  try {
    await deleteKills(channelDelete.id)
  } catch (err) { throw err }
})

bot.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();

  if (reaction.partial) await reaction.fetch();

  if (user.id === bot.user.id)
    return

  if (reaction.message.author.id !== bot.user.id)
    return

  if (reaction.emoji.name !== '🗑️')
    return

  return reaction.message.delete()
})

bot.login(process.env.TOKEN)