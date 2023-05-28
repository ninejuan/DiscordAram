const { Permissions, MessageEmbed } = require('discord.js')
const durations = [
    { name: "60초", value: 60 * 1000 },
    { name: "5분", value: 5 * 60 * 1000 },
    { name: "10분", value: 10 * 60 * 1000 },
    { name: "30분", value: 30 * 60 * 1000 },
    { name: "1시", value: 60 * 60 * 1000 },
    { name: "1일", value: 24 * 60 * 60 * 1000 },
    { name: "1주일", value: 7 * 24 * 60 * 60 * 1000 },
]
const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("타임아웃")
        .setDescription("선택한 유저를 타임아웃을 해요!")
        .addUserOption(option =>
            option
                .setName("유저")
                .setDescription("타임아웃할 유저를 선택해주세요!")
                .setRequired(true))
        .addNumberOption(option =>
            option
                .setName("처분")
                .setDescription("타임아웃 기간을 선택해요!")
                .addChoices(
                    { name: "60 초", value: 60 * 1000 },
                    { name: "5 분", value: 5 * 60 * 1000 },
                    { name: "10 분", value: 10 * 60 * 1000 },
                    { name: "30 분", value: 30 * 60 * 1000 },
                    { name: "1 시간", value: 60 * 60 * 1000 },
                    { name: "1 일", value: 24 * 60 * 60 * 1000 },
                    { name: "1 주일", value: 7 * 24 * 60 * 60 * 1000 },
                )
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName("사유")
                .setDescription("처분 사유를 적어보세요!")
                .setRequired(false)),
    async run(interaction) {
        await interaction.deferReply({ });
        let member = interaction.options.getMember("유저")
        let duration = interaction.options.getNumber("처분")
        let reason = interaction.options.getString("사유") || "이유가 없어요!"

        const embed0 = {
            title: `${interaction.guild}`,
            author: {
                name: `Aram`,
            },
            thumbnail: {
                url: `${interaction.guild.iconURL()}`,
            },
            fields: [
                {
                    name: `⛔ 경고 ⛔`,
                    value: `이 기능은 관리자 전용 명령어에요!`,
                },
            ],
            timestamp: new Date(),
        };
        
        interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor(`BLUE`)
                    .setDescription(`<a:Onl:977573874076090398>처리중. · · ·`)
            ],
        })
        if (!interaction.member.permissions.has(Permissions.FLAGS.MUTE_MEMBERS)) return interaction.editReply({ embeds: [embed0] })

        if (!member) return interaction.editReply("<a:error:977576443301232680>유저가 올바르지 않아요!<a:error:977576443301232680>")

        try {
            await member.timeout(duration, reason)
            return interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`<a:okcheck:977576443410268190>${member.user.tag}님이 타임아웃 처리 됐습니다!<a:okcheck:977576443410268190>`)
                        .setColor(`BLUE`)
                        .setDescription(`처리시간 : ${durations.find(d => duration === d.value)?.name} \n사유 : ${reason}`)
                ],
            })
        }
        catch (err) {
            if (err) {
                const embed1 = new MessageEmbed()
                    .setTitle(`<a:error:977576443301232680>${member.user.tag}에게 타임아웃 적용을 못 했어요!<a:error:977576443301232680>`)
                    .setDescription(`반환된 에러 : ${err}
                    
에러가 \`DiscordAPIError: Missing Permissions\`인 경우 
권한이나 봇 역할 순위가 낮아서 되지 않아요!`)
                    .setTimestamp()
                return interaction.editReply({ embeds: [embed1] })
            }
        }
    }
}