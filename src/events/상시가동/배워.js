const client = require('../../base/client')
const { MessageEmbed } = require('discord.js')
const config = require('../../setting/config')

client.on('messageCreate', async message => {
    if (!message.guild) return
    if (message.content.startsWith(config.cmd.talk)) {
        const lsc = require("../../models/봇시스템/배워")
        const args = message.content.slice(config.cmd.talk.length).trim().split(/ +/)
        const argsjoin = args.join(" ")
        const ff = await lsc.findOne({ wrd: argsjoin })
        if (ff) {
            let ur = client.users.cache.get(ff.userid)
            if (!ur) ur = "알 수 없음"
            const embed = new MessageEmbed()
                .setTitle(`**${ff.mean}**`)
                .setFooter({
                    text: `By - ${client.users.cache.get(ur.id).tag}`,
                    iconURL: `${client.users.cache.get(ur.id).displayAvatarURL()}`
                })
                .setColor(require('../../base/hexcolor').invisible)
            message.reply({ embeds: [embed] })
        }
    }
})