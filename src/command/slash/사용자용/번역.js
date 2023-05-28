const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed, Permissions } = require('discord.js');
const request = require('request')
const config = require('../../../setting/config')
const api_url = "https://openapi.naver.com/v1/papago/n2mt";
const client_id = config.api.naver.client_id;
const client_secret = config.api.naver.client_secret;
const query = "papago open api translation success!";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("번역")
    .setDescription("5개의 언어로 번역할 수 있어요")
    .addStringOption(option => option
      .setName("번역할언어")
      .setDescription("입력된 말을 선택한 언어로 번역해요!")
      .addChoices(
        { name: `한국어Kor`, value: `ko` },
        { name: `영어Eng`, value: `en` },
        { name: `중국어Cn`, value: `zh-CN` },
        { name: `스페인어Sp`, value: `es` },
        { name: `프랑스어Fra`, value: `fr` },
        { name: `베트남어Vi`, value: `vi` },
        { name: `태국어`, value: `ti` },
      )
      .setRequired(true))
    .addStringOption(option => option
      .setName("번역할말")
      .setDescription("한국어로 번역할 말을 적어주세요!")
      .setRequired(true)),
  async run(interaction) {
    const lang = interaction.options.getString("번역할언어")
    const input = interaction.options.getString("번역할말")
    var lapi_url = 'https://openapi.naver.com/v1/papago/detectLangs';
    var loptions = {
      url: lapi_url,
      form: { 'query': interaction.options.getString("번역할말") },
      headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
    };
    request.post(loptions, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const options = {
          url: api_url,
          form: { source: JSON.parse(body).langCode, target: lang, text: input },
          headers: {
            "X-Naver-Client-Id": client_id,
            "X-Naver-Client-Secret": client_secret,
          },
        };
        request.post(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            const embed = new MessageEmbed()
              .setTitle("번역이 완료됐어요!")
              .addField(`번역 전 : \`${interaction.options.getString("번역할말")}\``, `**번역 후 : \`${JSON.parse(body).message.result.translatedText}\`**`)
            interaction.reply({ embeds: [embed] })
          } else {
            console.log("error = " + response.statusCode);
          }
        });
      } else {
        console.log('error = ' + response.statusCode);
      }
    });
    // const options = {
    //     url: api_url,
    //     form: { source: "ko", target: lang, text: input },
    //     headers: {
    //       "X-Naver-Client-Id": client_id,
    //       "X-Naver-Client-Secret": client_secret,
    //     },
    //   };
    // request.post(options, function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         const embed = new MessageEmbed()
    //         .setTitle("번역이 완료됐어요!")
    //         .addField(`번역 전 : \`${interaction.options.getString("번역할말")}\``, `**번역 후 : \`${JSON.parse(body).message.result.translatedText}\`**`)
    //         interaction.reply({embeds: [embed]})
    //         // console.log(JSON.parse(body).message.result.translatedText);
    //     } else {
    //       console.log("error = " + response.statusCode);
    //     }
    //   });
    // const embed = new MessageEmbed()
    // .setTitle("번역이 완료됐어요!")
    // .addField(`번역 전 : \`${input}\``)
    // .addField(`번역 후 : \`${comp}\``)
    // interaction.reply({embeds: [embed]})
  },
};
