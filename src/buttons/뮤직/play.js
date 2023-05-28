const { MessageEmbed } = require('discord.js')
const hexcolor = require('../../base/hexcolor')
const distube = require('../../base/distube')

module.exports = {
    id: "play",

    async run(interaction) {
        const queue = distube.getQueue(interaction.guild.id);
        const channel = interaction.member.voice.channel;
        if (!channel) {
            const embed = new MessageEmbed()
                .setTitle("<a:warning:977576443590610944>ㅣ오류")
                .setDescription("보이스 채널에 들어가서 명령어를 사용해주세요!")
                .setColor(hexcolor.red2)
                .setTimestamp()

            return interaction.reply({ embeds: [embed], ephemeral: true })
        }
        if (!queue) {
            const embed = new MessageEmbed()
                .setTitle("<a:warning:977576443590610944>ㅣ오류")
                .setDescription("현재 재생중인 곡이 없어요!")
                .setColor(hexcolor.red2)
                .setTimestamp()

            return interaction.reply({ embeds: [embed], ephemeral: true })
        }
        queue.resume()
            .then((message) => {
                const embed = new MessageEmbed()
                    .setTitle("✅ㅣ이어서 재생 성공!")
                    .setDescription("노래가 이어서 재생될 거에요!")
                    .setColor(hexcolor.blue2)
                    .setTimestamp()

                interaction.reply({ embeds: [embed], ephemeral: true })
            }).catch((err) => {
                const embed = new MessageEmbed()
                    .setTitle("<a:warning:977576443590610944>ㅣ오류")
                    .setDescription("노래가 일시정지 되어있지 않아요!")
                    .setColor(hexcolor.red2)
                    .setTimestamp()

                return interaction.reply({ embeds: [embed], ephemeral: true })
            })
    },
};