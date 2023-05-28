const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("음성")
        .setDescription("자동으로 개인 음성 채널을 만들어요!"),
    async run(interaction){
      if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
        const embed = new MessageEmbed()
        .setTitle('<:disallow:1006582767582203976> 권한이 없어요')
        .setDescription('**사용자에게** `MANAGE_ROLES` 권한이 없어요')
        .setColor(require('../../../base/hexcolor').invisible)
        return interaction.reply({ embeds: [embed] });
      }
        let loggingChannel = interaction.guild.channels.cache.find(ch => ch.name === "🎤 아람보이스")
            if (!loggingChannel) {
                interaction.guild.channels.create('🎤 아람보이스', {
                    type: 'GUILD_VOICE'
                  }).then(() => {
                    const embed = new MessageEmbed()
                    .setTitle("<a:MusicBeat:986922025924833300>성공!<a:MusicBeat:986922025924833300>")
                    .setDescription("채널명을 바꾸지 마세요!")
                    .setColor(0xff00ff)
                    return interaction.reply({embeds: [embed]})
                  }).catch((err) => {
                    const embed = new MessageEmbed()
                    .setTitle("<a:error:977576443301232680>에러 발생!<a:error:977576443301232680>")
                    .setColor(0xff0000)
                    interaction.reply({ embeds: [embed]})
                  })
                } else if (loggingChannel) {
                    const embed = new MessageEmbed()
                    .setTitle("<a:MusicBeat:986922025924833300>이미 설정이 되어있어요!<a:MusicBeat:986922025924833300>")
                    .setColor(0xff00ff)
                    return interaction.reply({embeds: [embed]})
                }
    }
}