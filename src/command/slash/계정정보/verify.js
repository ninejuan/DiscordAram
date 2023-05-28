
const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const Schema = require('../../../models/봇시스템/인증')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("인증")
        .setDescription("역할을 받기 위한 인증을 진행해요"),
    /**
     * 
     * @param {import('discord.js').CommandInteraction} interaction 
     */
    async run(interaction, client) {
        const fetch = require('node-fetch')
        const CPTCHA = await Schema.findOne({
            GuildID: interaction.guild.id
        });
        if (CPTCHA) {
            const roid = CPTCHA.RoleID
            await interaction.deferReply({});
            const e1 = new MessageEmbed()
                .setDescription('이미지를 불러오는 중입니다ㆍㆍㆍㆍ')
            interaction.followUp({ embeds: [e1] }).then((i) => {
                const url = "https://api.aramy.net/v1/captcha"
                try {
                    fetch(url).then(res => res.json()).then(async json => {
                        const embed = new MessageEmbed()
                            .setTitle("아래 있는 코드를 입력해주세요 제한시간 : 30초")
                            .setImage(json.url)
                            .setColor("#2F3136")
                            .setFooter(`이미지가 안떴을시 재시도 하시거나 설정 - 텍스트및사진 - 채팅에 링크로 올렸을때를 켜주세요`)

                        const msg = await interaction.editReply({ embeds: [embed] })
                        try {
                            const filter = (m) => {
                                if (m.author.bot) return;
                                if (m.author !== interaction.user) return;
                                if (m.content === json.code) return true;
                                else m.reply({
                                    embeds: [
                                        new MessageEmbed()
                                            .setTitle("에러")
                                            .setColor(`RED`)
                                            .setDescription("<:disallow:1006582767582203976>  알맞지 않는 인증코드 입니다! 대소문자 구분해주세요!")
                                    ]
                                }).then(msg => {
                                    setTimeout(() => {
                                        msg.delete()

                                    }, 5000);
                                })
                            };

                            const response = await msg.channel.awaitMessages({
                                filter,
                                max: 1,
                                time: 30000,
                                errors: ['time']
                            });
                            if (response) {
                                interaction.member.roles.add(roid).then(() => {
                                    interaction.editReply({
                                        embeds: [
                                            new MessageEmbed()
                                                .setTitle("인증 성공")
                                                .setColor(`GREEN`)
                                        ]
                                    })
                                }).catch((err) => {
                                    console.log(err)
                                    interaction.editReply("에러")
                                })
                            }
                        } catch (error) {
                            interaction.editReply({
                                embeds: [
                                    new MessageEmbed()
                                        .setTitle("시간초과")
                                        .setColor(`RED`)
                                        .setDescription("인증시간이 초과 되었어요")
                                ]
                            }).then(msg => {
                                setTimeout(() => {
                                    msg.delete()

                                }, 5000);
                            })
                        }
                    })
                } catch (error) {
                    interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setTitle("오류가 발생했습니다.")
                                .setColor(`RED`)
                                .setDescription('내용 : 저의 역할 순위가 지급되는 역할보다 낮습니다..\n또는 역할 권한이 누락되었습니다!')
                        ]
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete()

                        }, 5000);
                    })
                }
            })
        } else {
            const embed = new MessageEmbed()
                .setTitle("미등록 에러")
            interaction.reply({ embeds: [embed] })
        }
    }
}