const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js')
const Schema = require("../../../models/봇시스템/출석체크")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("출첵")
    .setDescription("출석체크를 해요!"),
  async run(interaction) {
    let newData
        const user = await Schema.findOne({ userid: interaction.user.id })
        const t = new Date()
        const date = "" + t.getFullYear() + (t.getMonth() + 1) + t.getDate()
        if (!user) {
            newData = new Schema({ count: 1, userid: interaction.user.id, guildid: interaction.guild.id, date: date })
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("출석체크가 완료되었어요! ✅")
                        .setColor(`GREEN`)
                        .setFooter(`앞으로 자주 활동해주세요!`)
                ],
            })
        } else {
            if (user.guildid == interaction.guild.id, user.date == date) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("<:disallow:1006582767582203976>  이미 출석체크를 완료했어요!")
                        .setColor(`GREEN`)
                        .setFooter(`내일 또 해주세요 :)`)
                ],
            })
            await Schema.findOneAndRemove({ guildid: interaction.guild.id, userid: interaction.user.id })
            newData = new Schema({ count: parseInt(user.count) + 1, userid: interaction.user.id, guildid: interaction.guild.id, date: date })
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("출석체크가 완료되었어요! ✅")
                        .setColor(`GREEN`)
                        .setFooter(`누적 출석체크 횟수 : ${parseInt(user.count) + 1}`)
                ],
            })
        }
        newData.save();
  },
};
