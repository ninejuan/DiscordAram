const { Permissions, MessageEmbed} = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const Schema5 = require("../../../models/로그/logchannel")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("로깅")
        .setDescription("메세지를 로깅해요!")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("설정")
                .setDescription("로깅 설정 명령어에요!")
                .addStringOption(option => option
                    .setName("옵션")
                    .setDescription("로깅을 활성화할까요?")
                    .addChoices(
                        {name:`켜기`,value:`켜기`},
                        {name:`끄기`,value:`끄기`},
                    )
                    .setRequired(true))
                .addChannelOption(option => option
                    .setName("채널")
                    .setDescription("로깅할 채널을 선택해주세요!")
                    .setRequired(false))
        ),
    async run(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        if (!interaction.guild) return
        const subcmd_name = interaction.options.getSubcommand()
        const opt = interaction.options.getString("옵션")
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setTitle("<a:warning:977576443590610944>권한이 없어요!<a:warning:977576443590610944>")
                    .setColor(`RED`)
                    .setDescription("사용자에게 관리자 권한이 없어서 사용이 불가능합니다!")
            ]
        })
        if (subcmd_name == "설정") {
            if (opt == "켜기") {
                const ChID = interaction.options.getChannel("채널")
                const LOGGER = await Schema5.findOne({
                    GuildID: interaction.guild.id
                });
                if (LOGGER) return interaction.followUp({ content: "이미 등록되어 있어요!" })
                const newData = new Schema5({
                    GuildID: interaction.guild.id,
                    ChannelID: ChID.id
                })
                newData.save()
                interaction.followUp(`\`${interaction.guild}\`서버의 로깅을 ${ChID}에서 시작할게여!`)
            }
            if (opt == "끄기") {
                const LOGGER = await Schema5.findOne({
                    GuildID: interaction.guild.id
                });
                if (!LOGGER) return interaction.followUp({ content: "등록된 서버 로거가 없습니다!" })
                await Schema5.findOneAndDelete({ GuildID: interaction.guild.id })
                interaction.followUp(`\`${interaction.guild}\`서버의 로깅을 정지할게여!`)
            }
        }
    }
}