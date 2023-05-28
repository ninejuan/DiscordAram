const { Permissions, MessageEmbed } = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const Schema = require("../../../models/봇시스템/안티에블")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("안티에브리원")
        .setDescription("서버에서 @everyone 멘션을 못하게 해요")
        .addStringOption(option => option
            .setName("옵션")
            .setDescription("서버에서 @everyone 멘션을 못하게 할까요?")
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
                    .setTitle("<a:error:977576443301232680>권한이 없어요!<a:error:977576443301232680>")
                    .setColor(`RED`)
                    .setDescription("<a:error:977576443301232680>사용자에겐 `ADMINISTRATOR`권한이 없어서 사용이 불가능합니다!<a:error:977576443301232680>")
            ]
        })
            if (op == "켜기") {
                const MOD_find = await Schema.findOne({
                    GuildID: interaction.guild.id
                });
                if (MOD_find) return interaction.followUp({ content: "이미 관리자 권한이 없는 유저는 모두를 멘션할 수 없어요!" })
                const newData = new Schema({
                    GuildID: interaction.guild.id,
                })
                newData.save()
                interaction.followUp(`\`${interaction.guild}\` 서버에선 이제 관리자 권한이 있어야 모두를 멘션할 수 있어요!`)
            }
            if (op == "끄기") {
                const MOD_find = await Schema.findOne({
                    GuildID: interaction.guild.id
                });
                if (!MOD_find) return interaction.followUp({ content: "이미 관리자 권한이 없어도 모두를 멘션할 수 있어요!" })
                await Schema.findOneAndDelete({ GuildID: interaction.guild.id })
                interaction.followUp(`\`${interaction.guild}\`서버에선 이제 관리자 권한이 없어도 모두를 멘션할 수 없어요!`)
            }
    }
}