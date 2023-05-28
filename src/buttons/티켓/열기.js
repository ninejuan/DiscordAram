const client = require('../../base/client')
const config = require('../../setting/config')
const { Permissions, MessageEmbed } = require('discord.js')

module.exports = {
    id: "tk-open",
    async run(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            const embed = new MessageEmbed()
            .setTitle("<:disallow:1006582767582203976> 권한 오류!<:disallow:1006582767582203976> ")
            .setColor(hexcolor.invisible)
            .setFooter("사용자에게 `MANAGE_CHANNELS` 권한이 없어요!")
            interaction.reply({ embeds: [embed], ephemeral: true })       
        } else {
            const channel = interaction.channel;
            channel.permissionOverwrites.edit(client.users.cache.get(channel.topic).id, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true
            })
            const embed = new MessageEmbed()
            .setColor(require('../../base/hexcolor').invisible)
            .setTitle('🔓 티켓이 잠금 해제되었어요')
            interaction.reply({ embeds: [embed] })
        }
    },
};