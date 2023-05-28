const { Permissions, MessageEmbed, MessageAttachment } = require('discord.js')
const hexcolor = require('../../base/hexcolor')

module.exports = {
    id: "tk-remove",

    async run(interaction) {
        if (interaction.user.bot) return ;
        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            const embed = new MessageEmbed()
            .setTitle("<:disallow:1006582767582203976> 권한 오류!<:disallow:1006582767582203976> ")
            .setColor(hexcolor.invisible)
            .setFooter("아람이에게 권한이 없어요!")
            interaction.reply({ embeds: [embed] })
            setTimeout(() => {
                interaction.deleteReply()
              }, 5000);
            return ;
        } else if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            const embed = new MessageEmbed()
            .setTitle("<:disallow:1006582767582203976> 권한 오류!<:disallow:1006582767582203976> ")
            .setColor(hexcolor.invisible)
            .setFooter("사용자에게 `MANAGE_CHANNELS` 권한이 없어요!")
            interaction.reply({ embeds: [embed], ephemeral: true })       
        } else {
            interaction.reply("**채널이 3초뒤에 삭제됩니다**")
            setTimeout(() => { interaction.channel.delete() }, 3000);
        }
    },
};