const client = require('../../base/client')
const { MessageEmbed } = require('discord.js')
const config = require('../../setting/config')
const logger = require('log4js').getLogger(`${config.logname} Command - message`);

module.exports = {
    name: "messageCreate",
    async run(message) {
        if (!message.guild) return;
        if (message.author.bot) return;
        const pfSchema = require("../../models/관리/프리픽스")
        const MOD_find = await pfSchema.findOne({
            guildid: message.guild.id
        });
        if (MOD_find) {
            if (!message.content.startsWith(MOD_find.prefix) && !message.content.startsWith(config.cmd.prefix)) return
            var pf

            if (message.content.startsWith(MOD_find.prefix)) {
                pf = pf = MOD_find.prefix
            }

            if (message.content.startsWith(config.cmd.prefix)) {
                pf = pf = config.cmd.prefix
            }

            const prefix = pf;
            const args = message.content.slice(prefix.length).trim().split(/ +/)
            const commandName = args.shift()
            const command = client.commands.get(commandName)
            if (!command) return
            try {
                await command.run(message, args)
            } catch (err) {
                logger.error(err)
                const embed = new MessageEmbed()
                    .setTitle('오류 발생')
                    .setDescription(`에러가 발생하여 명령어가 정상작동 하지 못하였습니다.`)
                    .setColor("RED")
                message.channel.send({ embeds: [embed] })
                const date = new Date()
                const timeset = Math.round(date.getTime() / 1000)
                const errembedlog = new MessageEmbed()
                    .setColor('DARK_BUT_NOT_BLACK')
                    .setTitle("Message Command Error Log")
                    .setAuthor({ name: `${client.user.username} - System`, iconURL: client.user.displayAvatarURL() })
                    .setFields(
                        { name: "사용된 명령어", value: `${prefix.length}`, inline: true },
                        { name: "사용시간", value: `<t:${timeset}>`, inline: true },
                        { name: `접수된 에러 내용입니다.`, value: `\`\`\`${err}\`\`\`` },
                        { name: `사용자`, value: `${message.author}`, inline: true },
                        { name: `사용자 이름`, value: `${message.author.username}`, inline: true },
                        { name: `사용자 태그`, value: `${message.author.tag}`, inline: true },
                        { name: `사용자 ID`, value: `${message.author.id}`, inline: true },
                    )
                    .setTimestamp()
                if (message.guild) {
                    const channel = client.channels.cache.get(message.channel.id)
                    const invite = await channel.createInvite({ maxAge: 0, maxUses: 0 });
                    let user = client.users.cache.get(message.guild.ownerId)
                    if (!user) user = "Unknown#0000"
                    errembedlog.addFields(
                        { name: `사용된 서버 소유자`, value: `${user.tag || user}`, inline: true },
                        { name: "사용서버", value: `${message.guild.name}`, inline: true },
                        { name: "사용서버id", value: `${message.guild.id}`, inline: true },
                        { name: "사용채널", value: `${message.channel}`, inline: true },
                        { name: "사용채널id", value: `${message.channel.id}`, inline: true },
                        { name: "에러발생서버 초대코드", value: `https://discord.gg/${invite.code}` },
                    )
                }
                client.channels.cache.get(config.log.error).send({ embeds: [errembedlog] })
                client.users.fetch('939349343431954462').then((user) => { user.send({ embeds: [errembedlog] }) });
            }
            return;
        }
        if (!MOD_find) {
            if (!message.content.startsWith(config.cmd.prefix)) return
            const args = message.content.slice(config.cmd.prefix.length).trim().split(/ +/)
            const commandName = args.shift()
            const command = client.commands.get(commandName)
            if (!command) return
            try {
                await command.run(message, args)
            } catch (err) {
                logger.error(err)
                const embed = new MessageEmbed()
                    .setTitle('오류 발생')
                    .setDescription(`에러가 발생하여 명령어가 정상작동 하지 못하였습니다.`)
                    .setColor("RED")
                message.channel.send({ embeds: [embed] })
                const date = new Date()
                const timeset = Math.round(date.getTime() / 1000)
                const errembedlog = new MessageEmbed()
                    .setColor('DARK_BUT_NOT_BLACK')
                    .setTitle("Message Command Error Log")
                    .setAuthor({ name: `${client.user.username} - System`, iconURL: client.user.displayAvatarURL() })
                    .setFields(
                        { name: "사용된 명령어", value: `${prefix.length}`, inline: true },
                        { name: "사용시간", value: `<t:${timeset}>`, inline: true },
                        { name: `접수된 에러 내용입니다.`, value: `\`\`\`${err}\`\`\`` },
                        { name: `사용자`, value: `${message.author}`, inline: true },
                        { name: `사용자 이름`, value: `${message.author.username}`, inline: true },
                        { name: `사용자 태그`, value: `${message.author.tag}`, inline: true },
                        { name: `사용자 ID`, value: `${message.author.id}`, inline: true },
                    )
                    .setTimestamp()
                if (message.guild) {
                    const channel = client.channels.cache.get(message.channel.id)
                    const invite = await channel.createInvite({ maxAge: 0, maxUses: 0 });
                    let user = client.users.cache.get(message.guild.ownerId)
                    if (!user) user = "Unknown#0000"
                    errembedlog.addFields(
                        { name: `사용된 서버 소유자`, value: `${user.tag || user}`, inline: true },
                        { name: "사용서버", value: `${message.guild.name}`, inline: true },
                        { name: "사용서버id", value: `${message.guild.id}`, inline: true },
                        { name: "사용채널", value: `${message.channel}`, inline: true },
                        { name: "사용채널id", value: `${message.channel.id}`, inline: true },
                        { name: "에러발생서버 초대코드", value: `https://discord.gg/${invite.code}` },
                    )
                }
                client.channels.cache.get(config.log.error).send({ embeds: [errembedlog] })
                client.users.fetch('939349343431954462').then((user) => { user.send({ embeds: [errembedlog] }) });
            }
        }
    }
}