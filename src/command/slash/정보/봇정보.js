const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Logger } = require('log4js');
const config = require('../../../setting/config')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("정보")
    .setDescription("아람이의 정보를 확인해요!"),
  async run(interaction) {
    const embed = new MessageEmbed()
      .setDescription(`**아람이 정보**`)
      .setColor("#ff69b4")
      .setThumbnail("https://github.com/john0128/GuGuBot_Djsv12/blob/master/%EC%95%84%EB%9E%8C.png?raw=true")
      .addField(`<:2899info:977596012413730836> 기본 정보`,
        `이름 : 이아람
            생년월일 : 2008년 1월 9일
            집 주소 : [확인하기](https://discord.gg/W5Eyq6YDq5)
            \u200b`
      )
      .addField('<:4323blurpleverifiedbotdeveloper:977577434096480386> **봇 개발진**',
        `<:Juanemote:977583787498156102> 주안#9900 (927049010072682516) : 개발자`
      )
    interaction.reply({ embeds: [embed] })
  }
}