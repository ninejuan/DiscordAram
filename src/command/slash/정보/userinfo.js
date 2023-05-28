const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const moment = require('moment')
const schema = require('../../../models/봇시스템/유저데이터')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("유저정보")
    .setDescription("유저정보!")
    .addUserOption(option =>
      option
          .setName("유저")
          .setDescription("정보를 확인할 유저를 선택해주세요!")
          .setRequired(true)),
  async run(interaction) {
      const Target = interaction.options.getUser("유저")
      const Member = interaction.guild.members.cache.get(Target.id)
      let badge = await require('../../../base/functions').ReplaceBadge(Target.id)
      const Response = new MessageEmbed()
      .setTitle(`${Target.tag}의 정보`)
      //.setAuthor(`${Target.tag || Target.user.tag}`, Target.displayAvatarURL({dynamic: true}))
      .setThumbnail(Member.displayAvatarURL({dynamic: true}))
      .setColor("#00D166")
      .addField("유저", `${Member}`, true)
      .addField("#태그", `\`#${Target.discriminator}\``, true)
      .addField("ID", `\`${Target.id}\``, true)
      .addField("역할", `${Member.roles.cache.map(r => r).join(' ') || '역할이 없어요'}`, false)
      .addField("뱃지", `${badge}`, false)
      interaction.reply({embeds: [Response]})
  },
};
