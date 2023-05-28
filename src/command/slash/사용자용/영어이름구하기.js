const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed, Permissions } = require('discord.js');
const request = require('request')
const config = require('../../../setting/config')
const api_url = `https://openapi.naver.com/v1/krdict/romanization?query=`;
const client_id = config.api.naver.client_id;
const client_secret = config.api.naver.client_secret;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("영어이름")
    .setDescription("자신의 이름을 영어로 바꿔요!")
    .addStringOption(option => option
        .setName("이름")
        .setDescription("영어로 바꿀 자신의 이름을 적어주세요!")
        .setRequired(true)),
  async run(interaction) {
    const input = interaction.options.getString("이름")
    const api_url = `https://openapi.naver.com/v1/krdict/romanization?query=${encodeURI(interaction.options.getString("이름"))}`;
    const options = {
        url: api_url,
        headers: {
          "X-Naver-Client-Id": client_id,
          "X-Naver-Client-Secret": client_secret,
        },
      };
    request.post(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          const ps = JSON.parse(body)
          try {
            const embed = new MessageEmbed()
            .setTitle("<a:okcheck:977576443410268190>영어로 이름 바꾸기!<a:okcheck:977576443410268190>")
            .setDescription(`입력된 이름 : **__${interaction.options.getString("이름")}__**`)
            .setColor(0xff69b4)
            .addFields(
              { name: `1순위 - __${ps.aResult[0].aItems[0].score || "알 수 없음"}__점`, value: `${ps.aResult[0].aItems[0].name || "알 수 없음"}`},
              { name: `2순위 - __${ps.aResult[0].aItems[1].score || "알 수 없음"}__점`, value: `${ps.aResult[0].aItems[1].name || "알 수 없음"}`},
              { name: `3순위 - __${ps.aResult[0].aItems[2].score || "알 수 없음"}__점`, value: `${ps.aResult[0].aItems[2].name || "알 수 없음"}`}
            )
            .setTimestamp()
            .setThumbnail()
            interaction.reply({ embeds: [embed]})
          } catch (err) {
            const embed = new MessageEmbed()
            .setTitle("<a:warning:977576443590610944>오류가 발생했어요!<a:warning:977576443590610944>")
            .setDescription(`${err}`)
            interaction.reply({ embeds: [embed]})
          }
        } else {
          const embed = new MessageEmbed()
          .setTitle("<a:error:977576443301232680>연결 문제 발생!<a:error:977576443301232680>")
          .setDescription(`Error Code ${response.statusCode}`)
          .setColor("#FF0000")
          return interaction.reply({ embeds: [embed]})
        }
      });
  },
};
