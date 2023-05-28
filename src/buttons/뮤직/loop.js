const { MessageEmbed } = require('discord.js')
const hexcolor = require('../../base/hexcolor')
const distube = require('../../base/distube')

module.exports = {
    id: "loop",

    async run(interaction) {
        const queue = distube.getQueue(interaction.guild.id)
        if (!queue) {
            const embed = new MessageEmbed()
            .setTitle("<a:warning:977576443590610944>ㅣ오류ㅣ<a:warning:977576443590610944>")
            .setDescription("현재 재생중인 곡이 없어요!")
            .setColor(hexcolor.red2)
            .setTimestamp()

            return interaction.reply({embeds: [embed], ephemeral: true})
        }
        if (queue.repeatMode === 1) {
            const embed = new MessageEmbed()
            .setTitle("<a:warning:977576443590610944>ㅣ오류")
            .setDescription("이미 반복이 설정되어 있어요!")
            .setColor(hexcolor.red2)
            .setTimestamp()

            return interaction.reply({embeds: [embed], ephemeral: true})
        }
        queue.setRepeatMode(1)
            const em1 = new MessageEmbed()
            .setTitle("✅ㅣ반복 설정")
            .setDescription("한곡 반복 재생이 설정됐어요")
            .setColor(hexcolor.orange)
            .setTimestamp()
            return interaction.reply({embeds: [em1], ephemeral: true})
    },
};