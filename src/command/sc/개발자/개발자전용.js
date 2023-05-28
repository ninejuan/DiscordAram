const { MessageEmbed } = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../../../setting/config')
const admin = '927049010072682516'
const { Modal, TextInputComponent, showModal } = require('discord-modals')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("안전안내문자")
        .setDescription("관리자가 특정 유저에게 알림을 보내요!!"),
    async run(interaction, client) {
        if (interaction.user.id !== admin) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("권한이 없습니다.")
                    .setColor(`RED`)
                    .setDescription("개발자 전용 명령어 입니다.")
            ]
        }),
            client.users.fetch(admin).then((user) => {
                const msg = interaction.options.getString("내용")
                const embed1 = new MessageEmbed()
                    .setTitle(`❣ 누군가 명령어를 시도했습니다 DM MSG LOG ❣`)
                    .setColor('BLURPLE')
                    .setAuthor({ name: `개발자 시스템`, iconURL: client.user.displayAvatarURL() })
                    .setDescription(`**내용**\n**\`\`\`` + msg + `\`\`\`**`)
                    .setTimestamp()
                    .setFooter(`시도한 사람 Tag : ${interaction.user.tag}\n시도한 사람 Id : ${interaction.user.id}`)
                client.channels.cache.get(config.log.Dev.Warning).send({ embeds: [embed1] })
                user.send({ embeds: [embed1] })
            })
        let modal = new Modal()
            .setCustomId('dm')
            .setTitle(`유저 DM 전송 시스템`)
            .addComponents([
                new TextInputComponent()
                    .setCustomId('dm-1')
                    .setStyle('SHORT')//장문
                    .setLabel(`유저Id를 입력하세요.`)
                    .setPlaceholder(`전송할 유저 Id를 입력하세요.`)
                    .setMinLength(15)
                    .setMaxLength(18)
                    .setRequired(true),
                new TextInputComponent()
                    .setCustomId('dm-2')
                    .setStyle('LONG')//장문
                    .setLabel(`내용을 입력해주세요.`)
                    .setPlaceholder(`전송할 내용을 입력해주세요.`)
                    .setMinLength(1)
                    .setMaxLength(4000)
                    .setRequired(true),
            ]);
        await showModal(modal, {
            client: client,
            interaction: interaction
        })
        client.on('modalSubmit', async (modal) => {
            if (modal.customId === "dm") {
                await modal.deferReply({ ephemeral: true });
                let userid = modal.getTextInputValue('dm-1')
                let msg = modal.getTextInputValue('dm-2')
                modal.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(`❣ 전송한 안내문 ❣`)
                            .setColor('BLURPLE')
                            .setAuthor({ name: `Dev Korea Team`, iconURL: client.user.displayAvatarURL() })
                            .setDescription(`전송받은 유저 : <@${userid}>\n**내용**\n**\`\`\`` + msg + `\`\`\`**`)
                            .setTimestamp()
                            .setFooter(`${modal.user.tag}`)
                    ]
                })
                if (Number(userid).length = 10) {
                    client.users.fetch(userid).then((user) => {
                        const embed6 = new MessageEmbed()
                            .setTitle(`❣ 안내 ❣`)
                            .setColor('BLURPLE')
                            .setAuthor({ name: `Dev Korea Team`, iconURL: client.user.displayAvatarURL() })
                            .setDescription(`**내용**\n**\`\`\`` + msg + `\`\`\`**`)
                            .setTimestamp()
                            .setFooter(`${modal.user.tag}`)
                        user.send({ embeds: [embed6] })
                    });
                }
                const logembed = {
                    color: '0xFFFFFF',
                    title: `개발자 시스템`,
                    author: {
                        name: "DM 안내 시스템 로그",
                        icon_url: `${client.user.displayAvatarURL()}`,
                    },
                    description: '개발자 시스템',
                    thumbnail: {
                        url: `${modal.user.displayAvatarURL()}`,
                    },
                    fields: [
                        {
                            name: '✅ dm안내를 누군가 사용했습니다.',
                            value: '사용자 정보는 아래에서 확인가능합니다.',
                        },
                        {
                            name: '내용',
                            value: `**\`\`\`` + msg + `\`\`\`**`,
                        },
                        {
                            name: `추가정보`,
                            value: `사용자 닉네임 : ${modal.user.username}
사용자 ID : ${modal.user.id}
사용자 Tag : ${modal.user.tag}
dm을 받은 유저 : <@${userid}>
받은 유저ID : ${userid}`,
                        },
                    ],
                    timestamp: new Date(),
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                    },
                };
                client.channels.cache.get(config.log.Dev.dmmsg).send({ embeds: [logembed] })
                allembedlog.addFields(
                    { name: "\u200b", value: `상세 옵션` },
                    { name: "dm을 받은 유저", value: `<@${userid}>`, inline: true },
                    { name: "받은 유저ID", value: userid, inline: true },
                    { name: "내용", value: msg, inline: true },
                )
            }
        });
    }
}