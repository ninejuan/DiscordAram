const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed, Permissions } = require('discord.js');
const request = require('request')
const config = require('../../../setting/config')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("단축링크")
    .setDescription("주어진 URL을 단축시켜요!")
    .addStringOption(option => option
        .setName("주소")
        .setDescription("줄일 URL을 적어주세요!")
        .setRequired(true)),
    /**
     * 
     * @param {import('discord.js').CommandInteraction} interaction 
     */
  async run(interaction) {
    let link = interaction.options.getString('주소')
    let api_url = `https://api.aramy.net/v1/shorten?url=${encodeURI(link)}`
    const request = require('request');
    let options = {
        url: api_url
    }
    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          let json = JSON.parse(body)
          const embed = new MessageEmbed()
          .setColor('LUMINOUS_VIVID_PINK')
          .addFields(
            { name: '단축URL', value: `[이동하기](${json.url}) // ${json.url}`},
            { name: "URL 해시", value: json.code },
            { name: "원본 URL", value: `[이동하기](${json.original}) // ${json.original}` }
          )
          interaction.reply({ embeds: [embed] })
        } else {
          const embed = new MessageEmbed()
          .setColor(require('../../../base/hexcolor').invisible)
          .setTitle(`<:disallow:1006582767582203976> ${response.statusCode} 에러가 발생했어요`)
          return interaction.reply({ embeds: [embed] })
        }
    });
  },
};
