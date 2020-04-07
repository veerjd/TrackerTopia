module.exports = {
  name: 'NAME',
  description: 'DESCRIPTION',
  aliases: ['', ''],
  usage(prefix) {
    return `${prefix}NAME`
  },
  // You can have as many categories as you want, just make sure to update the help.js file with them
  category: 'Other',
  // Required perms of the author of the message
  permsAllowed: ['VIEW_CHANNEL'],
  // User that can do the command regardless of .permsAllowed
  usersAllowed: [''],
  execute: async function(message, argsStr, embed) {
    // EXECUTE
  }
};