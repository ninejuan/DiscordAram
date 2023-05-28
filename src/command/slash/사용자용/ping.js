const Discord = require('discord.js')
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
data: new SlashCommandBuilder()
    .setName("핑")
    .setDescription("핑을 알려줘요!"),
async run(interaction,client) {
const member = interaction.user.tag

const embed = new Discord.MessageEmbed()
.setTitle(`<a:Onl:977573874076090398>API 지연 시간 ${Date.now() - interaction.createdTimestamp}ms!`)
.setColor('#FFFFFF')
.setTimestamp()

const row = new Discord.MessageActionRow()
.addComponents(
new Discord.MessageButton()
.setLabel("웹소켓 핑!")
.setStyle("SUCCESS")
.setCustomId("error")
)
interaction.reply({ content: "핑 가져오는중..", ephemeral: true })

interaction.channel.send({ embeds: [embed], components: [row] }).then(async (collector) => { 
collector.createMessageComponentCollector().on('collect', async i => {

const msg = new Discord.MessageEmbed()
.setTitle(`웹소켓 지연 시간 ${client.ws.ping}ms`)
.setColor('#ffffff')

if (i.customId == "error") {
      if (i.user.id == interaction.user.id) {
        i.update({ embeds: [msg], components: [] })
      } else {
        i.reply({ content: `이버튼은 ${interaction.user.tag}만 사용 가능해!`, ephemeral: true })
      }
    }
  })
  })
  }
}