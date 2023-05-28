const { Permissions, MessageEmbed} = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const Schema6 = require("../../../models/로그/joinleave")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("입퇴장알림")
        .setDescription("유저의 입장, 퇴장 알림을 보내요!")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("설정")
                .setDescription("입퇴장 알림 설정 명령어야!")
                .addStringOption(option => option
                    .setName("옵션")
                    .setDescription("입퇴장 알림을 활성화할까여?")
                    .addChoices(
                        {name:`켜기`,value:`켜기`},
                        {name:`끄기`,value:`끄기`},
                    )
                    .setRequired(true))
                .addChannelOption(option => option
                    .setName("채널")
                    .setDescription("입퇴장 알림을 보낼 채널을 선택해보세요!")
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
                    .setTitle("<a:warning:977576443590610944>권한이 없어!<a:warning:977576443590610944>")
                    .setColor(`RED`)
                    .setDescription("당신에게 관리자 권한이 없어서 사용이 불가능합니다!")
            ]
        })
        if (subcmd_name == "설정") {
            if (opt == "켜기") {
                const ChID = interaction.options.getChannel("채널")
                const Welcome = await Schema6.findOne({
                    GuildID: interaction.guild.id
                });
                if (Welcome) return interaction.followUp({ content: "이미 등록되어 있어요!" })
                const newData = new Schema6({
                    GuildID: interaction.guild.id,
                    ChannelID: ChID.id
                })
                newData.save()
                interaction.followUp(`\`${interaction.guild}\`서버의 입퇴장알림 메세지를 ${ChID}에서 보낼게요!`)
            }
            if (opt == "끄기") {
                const Welcome = await Schema6.findOne({
                    GuildID: interaction.guild.id
                });
                if (!Welcome) return interaction.followUp({ content: "등록된 입퇴장알림 메세지가 없습니다!" })
                await Schema6.findOneAndDelete({ GuildID: interaction.guild.id })
                interaction.followUp(`\`${interaction.guild}\`서버의 입퇴장알림 전송을 정지할게요!`)
            }
        }
    }
}