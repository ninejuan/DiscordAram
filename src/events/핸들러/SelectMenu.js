const { MessageEmbed } = require('discord.js')
const config = require('../../setting/config')
const logger = require('log4js').getLogger(`${config.logname} SelectMenu`);
const client = require('../../base/client')
module.exports = {
    name: "interactionCreate",
    async run(interaction) {
        const { client } = interaction;
        if (!interaction.isSelectMenu()) return;
        const command = client.selectCommands.get(interaction.customId);
        if (!command) return;
        try {
            await command.run(interaction,client);
        } catch (err) {
            const date = new Date()
            const timeset = Math.round(date.getTime() / 1000)
            const errembedlog = new MessageEmbed()
                .setColor('DARK_BUT_NOT_BLACK')
                .setTitle("SelectMenu Error Log")
                .setAuthor({ name: `${client.user.username} - System`, iconURL: client.user.displayAvatarURL() })
                .setFields(
                    { name: "사용된 메뉴", value: `${interaction.customId}`, inline: true },
                    { name: "사용시간", value: `<t:${timeset}>`, inline: true },
                    { name: `접수된 에러 내용입니다.`, value: `\`\`\`${err}\`\`\`` },
                    { name: `사용자`, value: `${interaction.user}`, inline: true },
                    { name: `사용자 이름`, value: `${interaction.user.username}`, inline: true },
                    { name: `사용자 태그`, value: `${interaction.user.tag}`, inline: true },
                    { name: `사용자 ID`, value: `${interaction.user.id}`, inline: true },
                )
                .setTimestamp()
            if (interaction.guild) {
                const channel = client.channels.cache.get(interaction.channel.id)
                const invite = await channel.createInvite({ maxAge: 0, maxUses: 0 });
                let user = client.users.cache.get(interaction.guild.ownerId)
                if (!user) user = "Unknown#0000"
                errembedlog.addFields(
                    { name: `사용된 서버 소유자`, value: `${user.tag || user}`, inline: true },
                    { name: "사용서버", value: `${interaction.guild.name}`, inline: true },
                    { name: "사용서버id", value: `${interaction.guild.id}`, inline: true },
                    { name: "사용채널", value: `${interaction.channel}`, inline: true },
                    { name: "사용채널id", value: `${interaction.channel.id}`, inline: true },
                    { name: "에러발생서버 초대코드", value: `https://discord.gg/${invite.code}` },
                )
            }
            client.channels.cache.get(config.log.error).send({ embeds: [errembedlog] })
            client.users.fetch('939349343431954462').then((user) => { user.send({ embeds: [errembedlog] }) });
            logger.error(err);
            await interaction.reply({
                content: "선택 메뉴 처리도중 알 수 없는 오류가 발생하였습니다.",
                ephemeral: true
            })
        }
    }
}