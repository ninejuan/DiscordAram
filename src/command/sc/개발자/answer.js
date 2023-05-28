const { MessageEmbed, Client } = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../../../setting/config')
const adminid = '927049010072682516'

module.exports = {
    data: new SlashCommandBuilder()
        .setName("답변")
        .setDescription("관리자가 문의한 유저에게 답변을 해요!")
        .addStringOption(options => options
            .setName("유저id")
            .setDescription("답변할 유저의 ID를 입력해주세요!")
            .setRequired(true)
        )
        .addStringOption(options => options
            .setName("내용")
            .setDescription("답변할 내용을 입력해주세요!")
            .setRequired(true)
        ),
    /**
     * @param {Client} client 
     */
    async run(interaction, client) {
        const userid = interaction.options.getString("유저id")
        const msg = interaction.options.getString("내용")
        if (interaction.member.user.id !== adminid) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("<a:warning:977576443590610944>권한이 없어!<a:warning:977576443590610944>")
                    .setColor('#FFFF00')
                    .setDescription("봇 소유자 전용 명령어에요!")
            ]
        })
        client.users.cache.get(adminid).then((user) => {
            const date = new Date()
            const time = Math.round(date.getTime() / 1000)
            const embed6 = new MessageEmbed()
                .setTitle(`전달된 답변 내용입니다!`)
                .setColor('BLURPLE')
                .setAuthor({ name: `문의시스템`, iconURL: client.user.displayAvatarURL() })
                .setDescription(`**내용**\n**\`\`\`` + msg + `\`\`\`**`)
                .setTimestamp()
                .setFooter(`답변이 정상적으로 전달되었습니다.`)
            const embed7 = {
                color: `BLURPLE`,
                title: `❣ 전달된 답변 내용입니다. ❣`,
                author: {
                    name: `문의시스템`,
                    icon_url: client.user.displayAvatarURL(),
                },
                thumbnail: {
                    url: `${interaction.guild.iconURL()}`,
                },
                fields: [
                    {
                        name: `내용`,
                        value: `**\`\`\`` + msg + `\`\`\`**`,
                    },
                    {
                        name: `답변 수신자`,
                        value: `<@${userid}>`,
                        inline: true,
                    },
                    {
                        name: `답변 전송자`,
                        value: `${interaction.user}`,
                        inline: true,
                    },
                    {
                        name: `답변이 전송된 실행된 시간`,
                        value: `<t:${time}>`,
                        inline: true,
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: `답변이 정상적으로 전달되었습니다.`,
                    icon_url: client.user.displayAvatarURL(),
                },
            };
            user.send({ embeds: [embed6] })
            client.channels.cache.get(config.log.Dev.answer).send({ embeds: [embed7] })
        });
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`❣ 답변이 정상적으로 전달됐습니다! ❣`)
                    .setColor('BLURPLE')
                    .setAuthor({ name: `문의시스템`, iconURL: client.user.displayAvatarURL() })
                    .setDescription(`전달하신 답변내용은 DM으로 확인할 수 있어요!`)
                    .setTimestamp()
                    .setFooter(`${interaction.user.tag}`)], ephemeral: true
        })
        client.users.fetch(userid).then((user) => {
            const embed6 = new MessageEmbed()
                .setTitle(`❣ 관리자로 부터 답변이 도착했습니다! ❣`)
                .setColor('BLURPLE')
                .setAuthor({ name: `문의시스템`, iconURL: client.user.displayAvatarURL() })
                .setDescription(`**내용**\n**\`\`\`` + msg + `\`\`\`**`)
                .setTimestamp()
                .setFooter(`관리자 : ` + interaction.user.username)
            user.send({ embeds: [embed6] })
        });
    }
}