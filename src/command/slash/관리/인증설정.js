const Schema = require('../../../models/봇시스템/인증')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("인증설정")
        .setDescription("자동 캡차 인증 시스템!")
        .addStringOption(option => option
          .setName("옵션")
          .setDescription("온/오프 세팅을 해요!")
          .addChoices(
              {name:`켜기`,value:`켜기`},
              {name:`끄기`,value:`끄기`},
          )
          .setRequired(true))
        .addRoleOption(option => option
          .setName("역할")
          .setDescription("인증 완료 시 받을 역할을 설정하세요!")),
    async run(interaction){
      if (!interaction.guild.me.permissions.has(require('discord.js').Permissions.FLAGS.MANAGE_ROLES)) {
        const embed = new MessageEmbed()
        .setTitle('<:disallow:1006582767582203976> 권한이 없어요')
        .setDescription('아람이에게 `MANAGE_ROLES` 권한이 없어요')
        .setColor(require('../../../base/hexcolor').invisible)
        return interaction.reply({ embeds: [embed] });
    }
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
      const embed = new MessageEmbed()
      .setTitle('<:disallow:1006582767582203976> 권한이 없어요')
      .setDescription('**사용자에게** `MANAGE_ROLES` 권한이 없어요')
      .setColor(require('../../../base/hexcolor').invisible)
      return interaction.reply({ embeds: [embed] });
    }
      await interaction.deferReply({ ephemeral: true });
        const opt = interaction.options.getString("옵션")
        const role = interaction.options.getRole("역할") || "없음"
        if (opt == "켜기") {
          if(role == "없음") {
            const embed = new MessageEmbed()
            .setTitle("<a:warning:977576443590610944> Option Not Found <a:warning:977576443590610944>")
            .setDescription("무슨 역할을 줄 지 선택해주세요!")
            .setColor(0xffff00)
            .setTimestamp()
            return interaction.reply({embeds: [embed]})
          }
          const MOD_find = await Schema.findOne({
            GuildID: interaction.guild.id
        });
        if (MOD_find) {
          return interaction.followUp({ content: "이미 등록된 상태입니다!" })
        }
        const newData = new Schema({
          RoleID: role.id,
          GuildID: interaction.guild.id,
        })
        newData.save()
        interaction.followUp(`\`${interaction.guild}\` 인증 시작!`)
        } else if (opt == "끄기") {
          const MOD_find = await Schema.findOne({
            GuildID: interaction.guild.id
        });
        if (!MOD_find) return interaction.followUp({ content: "더 이상 인증을 하지 않아요!" })
                await Schema.findOneAndDelete({ GuildID: interaction.guild.id })
                interaction.followUp(`\`${interaction.guild}\` 더 이상 캡차 인증이 불가해요!`)
        }
    }
}