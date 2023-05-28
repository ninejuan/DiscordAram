const client = require('../../base/client')
const Discord = require('discord.js')
const Levels = require('discord-xp')
const config = require('../../setting/config.js')
Levels.setURL(config.database.mongo)

module.exports = {
    name: "messageCreate",
    async run(msg) {
        // return Levels.deleteGuild(msg.guild.id)
        if (msg.author.bot) return;
        if (msg.content.length >= 1) {
            let find;
            find = await Levels.fetch(msg.author.id, msg.guild.id)
            if (!find) {
                Levels.appendXp(msg.author.id, msg.guild.id, 4)
            }
            if (find) {
                Levels.appendXp(msg.author.id, msg.guild.id, 10)
            }
        }
    }
}