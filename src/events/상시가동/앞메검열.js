const client = require('../../base/client')
const { MessageEmbed, Permissions } = require('discord.js')
const hexcolor = require('../../base/hexcolor')

client.on('messageCreate', async (msg) => {
    if (!msg.guild) return
    const apmes = require('../../models/검열/앞메검열')
    const apdb = await apmes.findOne({ GuildID: msg.guild.id })
    if (!apdb) return;
    if (msg.author.bot) return;
    if (msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return ;
    if (msg.content.startsWith("http") || msg.content.startsWith("discord.gg") || msg.content.startsWith("https")) {
        const embed = new MessageEmbed()
            .setTitle("<a:warning:977576443590610944>주의!<a:warning:977576443590610944>")
            .setDescription("위 링크에 대해 잘 모를 시 들어가지 마세요!")
            .setColor(0xffff00)
            .addField("아람이 앞메검열 시스템", "Aram Link Censoring")
            .setThumbnail('https://github.com/ninejuan/GuGuBot_Djsv12/blob/master/warn.png?raw=true')
        const noti = new MessageEmbed()
            .setTitle(`${msg.guild.name}에서 문제가 발생했어요!`)
            .setDescription("관리자 권한이 없는 누군가가 링크가 포함된 메세지를 보냈어요!")
            .addField("메세지 내용", `실수로 클릭하지 않게 주의하세요!\n||${msg.content}||`)
            .setColor(hexcolor.invisible)
            .setThumbnail('https://github.com/ninejuan/GuGuBot_Djsv12/blob/master/warn.png?raw=true')
        const mguild = await client.guilds.cache.get(`${msg.guild.id}`)
        if (mguild.systemChannel) {
            mguild.systemChannel.send({ embeds: [noti] })
        }
        msg.reply({ embeds: [embed] })
        return msg.react('⚠️');
    }
})