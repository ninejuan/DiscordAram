const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Client } = require('discord.js');
const { Logger } = require('log4js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("서버수")
    .setDescription("아람이의 서버 수를 확인해요!"),
  async run(interaction) {
    const client = require('../../../base/client')
    const config = require('../../../setting/config')
    const setting = require('../../../../setting')
    client.guilds.cache.map(g => g.name).join('\n')
    const embed = new MessageEmbed()
      .setTitle(`${client.guilds.cache.size}곳의 서버에서 일 하는 중이에요!`)
      .setColor('RANDOM')
    if (!setting.setup.dokdo.devid.includes(interaction.user.id)) return interaction.reply({ embeds: [embed] })
    if (setting.setup.dokdo.devid.includes(interaction.user.id)) {
      return interaction.reply(
        {
          embeds: [
            new MessageEmbed()
              .setDescription(
                client.guilds.cache.map(g => `서버 이름: ${g.name}\n  멤버 수: ${g.members.cache.size}\n 길드 아이디: ${g.id}`).join('\n\n')
              )
          ]
        }
      )
    }
    interaction.reply({ embeds: [embed] })
  }
}