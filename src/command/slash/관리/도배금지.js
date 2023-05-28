const { Permissions, MessageEmbed } = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const Schema = require("../../../models/관리/도배")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("도배금지")
        .setDescription("서버 채팅 도배 관련 설정이에요!")
        .addStringOption(option => option
            .setName("옵션")
            .setDescription("도배를 금지할지 허가할지 정해요!")
            .addChoices(
                {name:`켜기`,value:`켜기`},
                {name:`끄기`,value:`끄기`},
            )
            .setRequired(true)),
    async run(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        const op = interaction.options.getString("옵션")
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setTitle("<a:error:977576443301232680> 권한이 없어요 <a:error:977576443301232680>")
                    .setColor(`RED`)
                    .setDescription("<a:error:977576443301232680>사용자에겐 `ADMINISTRATOR`권한이 없어서 사용이 불가능합니다!<a:error:977576443301232680>")
            ]
        });
        if (!interaction.guild.me.permissions.has(require('discord.js').Permissions.FLAGS.ADMINISTRATOR)) {
            const embed = new MessageEmbed()
            .setTitle('<:disallow:1006582767582203976> 권한이 없어요')
            .setDescription('아람이에게 ADMINISTRATOR 권한이 없어요')
            .setColor(require('../../../base/hexcolor').invisible)
            return interaction.reply({ embeds: [embed] });
        }
            if (op == "켜기") {
                const MOD_find = await Schema.findOne({
                    GuildID: interaction.guild.id
                });
                if (MOD_find) return interaction.followUp({ content: "이미 도배가 불가능해요!" })
                const newData = new Schema({
                    GuildID: interaction.guild.id,
                })
                newData.save();
                interaction.followUp(`\`${interaction.guild}\` 서버에선 도배가 불가능해요!`)
            }
            if (op == "끄기") {
                const MOD_find = await Schema.findOne({
                    GuildID: interaction.guild.id
                });
                if (!MOD_find) return interaction.followUp({ content: "이미 도배가 가능해요!" })
                await Schema.findOneAndDelete({ GuildID: interaction.guild.id })
                interaction.followUp(`\`${interaction.guild}\`서버의 도배를 가능하게 해요!`)
            }
    }
}