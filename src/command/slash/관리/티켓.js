const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Client, CommandInteraction, MessageActionRow, MessageButton, Permissions } = require('discord.js')
const client = require('../../../base/client')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("티켓")
    .setDescription("문의 티켓!"),
  async run(interaction,client) {
    if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        const embed = new MessageEmbed()
        .setTitle("<a:error:977576443301232680>`ADMINISTRATOR`권한이 없어요!<a:error:977576443301232680>")
        .setColor("#FF0000")
        .setTimestamp()
        return interaction.reply({embeds:[embed]})
    }
    if(!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
      const embed = new MessageEmbed()
        .setTitle(`<a:error:977576443301232680>${client.user.username}에게 \`MANAGE_CHANNELS\`권한이 없어요!<a:error:977576443301232680>`)
        .setColor("#FF0000")
        .setTimestamp()
      return interaction.reply({embeds:[embed]})
        
    }
    //await interaction.reply(`:ping_pong:  Pong! ${}ms`)
    interaction.reply({
      embeds:[
        new MessageEmbed()
          .setDescription('티켓 생성완료')
      ],ephemeral: true
    })
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("tk-2")
                .setLabel("📩 서버 문의")
                .setStyle("SUCCESS"),
            new MessageButton()
                .setCustomId('tk-another')
                .setLabel(`📩 기타 문의`)
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId(`tk-report`)
                .setLabel(`🚫 유저 신고`)
                .setStyle('DANGER')
        );
        const embed = new MessageEmbed()
            .setTitle("문의 티켓")
            .setColor("#FF0000")
            .setDescription("관리진에게 문의를 하시려면 아래 📩 버튼을 눌러 티켓을 오픈하여 주세요!")
        
            interaction.channel.send({ embeds: [embed], components: [row] })
    }
  }
