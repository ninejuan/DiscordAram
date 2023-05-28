const client = new (require('discord.js')).Client({ intents: (require('../../setting')).setup.intent })
module.exports = client;