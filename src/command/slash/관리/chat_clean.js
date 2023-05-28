const { CommandInteraction, MessageEmbed, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const crl = 'FFFFFF'
const client = require('../../../base/client')

const logger = require('log4js').getLogger('Aram');

module.exports = {
	data: new SlashCommandBuilder()
        .setName("채팅청소")
        .setDescription(`메시지 청소를 해요!`)
        .addStringOption(option => option
            .setName("갯수")
            .setDescription("청소할 채팅의 갯수를 1에서 100의 수를 입력해주세요!")
            .setRequired(true))
        .addUserOption(option => option
            .setName("유저")
            .setDescription("특정한 유저를 선택하면 그 유저의 채팅만 삭제할게요!")
            .setRequired(false)),
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async run(interaction) {
        const { channel, option } = interaction;

        const Amount = interaction.options.getString("갯수");
        const Target = interaction.options.getMember("유저");
        const embed0 = {
            color: `${crl}`,
            title: `${interaction.guild}`,
            thumbnail: {
                url: `${interaction.guild.iconURL() || client.user.displayAvatarURL({ dynamic: true })}`,
            },
            fields: [
                {
                    name: `<:disallow:1006582767582203976>  경고 <:disallow:1006582767582203976> `,
                    value: `해당 기능은 관리자 명령어에요!
        \u200b\n`,
                },
                {
                    name: `사용자 닉네임`,
                    value: `${interaction.user}`,
                    inline: true,
                },
                {
                    name: `사용자 ID`,
                    value: `${interaction.user.id}`,
                    inline: true,
                },
                {
                    name: `사용 서버`,
                    value: `${interaction.guild}`,
                    inline: true,
                },
                {
                    name: `사용 채널`,
                    value: `${interaction.channel}`,
                    inline: true,
                },
                {
                    name: `사용 채널 ID`,
                    value: `${interaction.channel.id}`,
                    inline: true,
                },
            ],
            timestamp: new Date(),
        };
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {logger.error("Author don't have permission");return interaction.reply({embeds: [embed0]})}
        const embed1 = {
            color: `${crl}`,
            title: `${interaction.guild}`,
            thumbnail: {
                url: `${interaction.guild.iconURL() || client.user.displayAvatarURL({ dynamic: true })}`,
            },
            fields: [
                {
                    name: `<:disallow:1006582767582203976>  경고 <:disallow:1006582767582203976> `,
                    value: `1에서 100의 숫자를 입력해주세요!`,
                },
                {
                    name: `입력한 메시지 내용`,
                    value: `${Amount}`,
                    inline: true,
                },
                {
                    name: `사용자 닉네임`,
                    value: `${interaction.user}`,
                    inline: true,
                },
                {
                    name: `사용자 ID`,
                    value: `${interaction.user.id}`,
                    inline: true,
                },
                {
                    name: `사용 서버`,
                    value: `${interaction.guild}`,
                    inline: true,
                },
                {
                    name: `사용 채널`,
                    value: `${interaction.channel}`,
                    inline: true,
                },
                {
                    name: `사용 채널 ID`,
                    value: `${interaction.channel.id}`,
                    inline: true,
                },
            ],
            timestamp: new Date(),
        };
        if (isNaN(Amount)) return interaction.reply({embeds: [embed1], ephemeral: true })
        const MessageCount = parseInt(Amount)
        if(MessageCount < 0 || MessageCount > 100){ logger.error("Argument Range Error");return interaction.reply({embeds: [embed1], ephemeral: true })}

        const Messages = await channel.messages.fetch();

        const Response = new MessageEmbed()
        .setColor("LUMINOUS_VIVID_PINK");

        if(Target) {
            let i = 0;
            const filtered = [];
            (await Messages).filter((m) => {
                if(m.author.id === Target.id && Amount > i) {
                    filtered.push(m);
                    i++;
                }
            })

            await channel.bulkDelete(filtered, true).then(messages => {
                let size;
                if (messages.size == 0) {
                    size = 1
                } else {
                    size = messages.size;
                }
                const embed2 = {
                    color: `${crl}`,
                    title: `${interaction.guild}`,
                    thumbnail: {
                        url: `${interaction.guild.iconURL() || client.user.displayAvatarURL({ dynamic: true })}`,
                    },
                    fields: [
                        {
                            name: `<:allow:1006582759592046702>  특정 유저 채팅 청소 완료! <:allow:1006582759592046702> `,
                            value: `정상적으로 특정 유저의 채팅의 청소를 완료했습니다!
자세한 내용은 아래 써놨어요!\n`,
                        },
                        {
                            name: `🧹입력한 메시지`,
                            value: `${Amount}`,
                            inline: true,
                        },
                        {
                            name: `🧹청소된 메시지 갯수`,
                            value: `${size}`,
                            inline: true,
                        },
                        {
                            name: `청소한 특정유저`,
                            value: `${Target}`,
                            inline: true,
                        },
                        {
                            name: `사용자 닉네임`,
                            value: `${interaction.user}`,
                            inline: true,
                        },
                        {
                            name: `사용자 ID`,
                            value: `${interaction.user.id}`,
                            inline: true,
                        },
                        {
                            name: `\u200b`,
                            value: `\u200b`,
                            inline: true,
                        },
                    ],
                    timestamp: new Date(),
                };
                interaction.reply({embeds: [embed2]});
                setTimeout(() => {
                    interaction.deleteReply()
                }, 7000);
                logger.info(`Deleted ${Amount} Msg in ${interaction.guild.name} / ${interaction.channel.name}`)
            })
        } else {
            await channel.bulkDelete(Amount, true).then(messages => {
                let size;
                if (messages.size == 0) {
                    size = 1
                } else {
                    size = messages.size;
                }
                const embed2 = {
                    color: `${crl}`,
                    title: `${interaction.guild}`,
                    thumbnail: {
                        url: `${interaction.guild.iconURL() || client.user.displayAvatarURL({ dynamic: true })}`,
                    },
                    fields: [
                        {
                            name: `<:allow:1006582759592046702>  청소 완료 <:allow:1006582759592046702> `,
                            value: `정상적으로 청소가 완료됐어요!
    자세한 내용은 아래 써놨어요!\n`,
                        },
                        {
                            name: `🧹입력한 메시지`,
                            value: `${Amount}`,
                            inline: true,
                        },
                        {
                            name: `🧹청소된 메시지 갯수`,
                            value: `${size}`,
                            inline: true,
                        },
                        {
                            name: `\u200b`,
                            value: `\u200b`,
                            inline: true,
                        },
                        {
                            name: `커맨드 사용자`,
                            value: `${interaction.user}`,
                            inline: true,
                        },
                        {
                            name: `커맨드 사용자 ID`,
                            value: `${interaction.user.id}`,
                            inline: true,
                        },
                        {
                            name: `\u200b`,
                            value: `\u200b`,
                            inline: true,
                        },
                    ],
                    timestamp: new Date(),
                };
                interaction.reply({embeds: [embed2]})
                setTimeout(() => {
                    interaction.deleteReply()
                }, 7000);
                logger.info(`Deleted ${Amount} Msg in ${interaction.guild.name} / ${interaction.channel.name}`)
            })
        }
    }
}