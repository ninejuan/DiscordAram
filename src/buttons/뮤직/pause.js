const { MessageEmbed } = require('discord.js')
const hexcolor = require('../../base/hexcolor')
const distube = require('../../base/distube')

module.exports = {
    id: "pause",

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
                .setDescription("지금 재생중인 곡이 없어요!")
                .setColor(hexcolor.red2)
                .setTimestamp()

            return interaction.reply({ embeds: [embed], ephemeral: true })
        }
        queue.pause()

        const embed = new MessageEmbed()
            .setTitle("✅ㅣ일시정지 성공!")
            .setDescription("노래가 일시정지 됐습니다!")
            .setColor(hexcolor.blue2)
            .setTimestamp()

        return interaction.reply({ embeds: [embed], ephemeral: true })
    },
};