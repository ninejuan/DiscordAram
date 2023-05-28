const { Permissions, MessageEmbed } = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const Schema = require("../../../models/관리/프리픽스")
const hexcolor = require('../../../base/hexcolor')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("접두사지정")
        .setDescription("서버 접두사를 설정해요!")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("설정")
                .setDescription("서버 접두사를 설정해요!")
                .addStringOption(option => option
                    .setName("프리픽스")
                    .setDescription("설정할 접두사를 알려주세요!")
                    .setRequired(true)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("삭제")
                .setDescription("서버 접두사를 삭제해요!")
        )
        .addSubcommand((subcommand) => subcommand 
            .setName("확인")
            .setDescription("이 서버의 접두사를 확인해요")
        ),
    async run(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        if (!interaction.guild) return
        const subcmd_name = interaction.options.getSubcommand()
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setTitle("권한이 없어요!")
                    .setColor(require('../../../base/hexcolor').invisible)
                    .setDescription("<:disallow:1006582767582203976> 아람이에게 `ADMINISTRATOR` 권한이 없어서 사용이 불가해요!")
            ]
        })
        if (subcmd_name == "설정") {
            const pf = interaction.options.getString("프리픽스")
            const MOD_find = await Schema.findOne({
                guildid: interaction.guild.id
            });
            if (MOD_find) return interaction.followUp({ content: `음.. 이미 서버 접두사가 지정되어 있는거 같아요! ( \`지정된 접두사 : ${MOD_find.prefix}\` )` })
            const newData = new Schema({
                guildid: interaction.guild.id,
                prefix: pf
            })
            newData.save()
            interaction.followUp(`\`${interaction.guild}\`서버의 접두사는 이제부터 \`${pf}\`로 작동해요!`)
        }
        if (subcmd_name == "삭제") {
            const MOD_find = await Schema.findOne({
                guildid: interaction.guild.id
            });
            if (!MOD_find) return interaction.followUp({ content: "접두사가 등록되어 있지 않아요!"})
            await Schema.findOneAndDelete({ guildid: interaction.guild.id })
            interaction.followUp(`\`${interaction.guild}\`서버의 접두사를 삭제했어요!`)
        }
        if (subcmd_name == '확인') {
            const MOD_find = await Schema.findOne({
                guildid: interaction.guild.id
            })
            if (!MOD_find) {
                const embed = new MessageEmbed()
                .setTitle("서버의 접두사가 설정되어 있지 않아요")
                .setColor(hexcolor.invisible)
                return interaction.followUp({ embeds: [embed] })
            }
            const pf = MOD_find.prefix
            const embed = new MessageEmbed()
            .setTitle(`이 서버의 접두사는 **__${pf}__** 에요`)
            .setColor(hexcolor.invisible)
            interaction.followUp({ embeds: [embed] })
        }
    }
}