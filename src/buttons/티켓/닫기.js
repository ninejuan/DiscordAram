const { Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const client = require('../../base/client');
const hexcolor = require('../../base/hexcolor')

module.exports = {
    id: "tk-close",
    /**
     * 
     * @param {import('discord.js').CommandInteraction} interaction 
     * @returns 
     */
    async run(interaction) {
        if (interaction.user.bot) return ;
        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            const embed = new MessageEmbed()
            .setTitle("<:disallow:1006582767582203976> 권한 오류!<:disallow:1006582767582203976> ")
            .setColor(hexcolor.invisible)
            .setFooter("아람이에게 `MANAGE_CHANNELS` 권한이 없어요!")
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
            const channel = interaction.channel;
            channel.permissionOverwrites.edit(client.users.cache.get(channel.topic).id, {
                SEND_MESSAGES: false,
                VIEW_CHANNEL: false
            })
            const embed = new MessageEmbed()
            .setTitle(`<:next_array:1006582763463381124> 티켓 메뉴 <:array:1006527855112495114>`)
            .setColor(require('../../base/hexcolor').invisible)
            .setDescription(`아래 메뉴를 통해 티켓을 제어하세요`)
            const row = new MessageActionRow().addComponents(
              new MessageButton()
              .setCustomId('tk-save-transcript')
              .setLabel('저장하기')
              .setStyle('SUCCESS')
              .setEmoji('💾'),
              new MessageButton()
              .setCustomId('tk-remove')
              .setLabel('삭제하기')
              .setStyle('DANGER')
              .setEmoji('<:disallow:1006582767582203976>'),
              new MessageButton()
              .setCustomId('tk-open')
              .setLabel('열기')
              .setStyle('PRIMARY')
              .setEmoji('🔓')
            );
            interaction.reply({ embeds: [embed], components: [row] })
        }
    },
};