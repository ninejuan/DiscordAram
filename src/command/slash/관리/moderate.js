const { Permissions, MessageActionRow, MessageSelectMenu, MessageEmbed, CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require("@discordjs/builders")
const date = new Date()
const time = Math.round(date.getTime() / 1000)

module.exports = {
    data: new SlashCommandBuilder()
        .setName("유저관리")
        .setDescription("선택한 유저를 관리해요!")
        .addUserOption(option =>
            option
                .setName("유저")
                .setDescription("관리할 유저를 선택해주세요!")
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName("처분")
                .setDescription("처분 영역을 선택해요!")
                .addChoices(
                    {name:`추방`,value:`추방`},
                    {name:`차단`,value:`차단`},
                )
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName("사유")
                .setDescription("처분 영역을 선택해주세요")
                .setRequired(true)),
                /**
                 * 
                 * @param {CommandInteraction} interaction 
                 * @param {*} client 
                 * @returns 
                 */
    async run(interaction, client) {
        await interaction.deferReply({ });
        const dddd = interaction.options.getString("처분")
        const member = interaction.options.getMember("유저")
        const msg = interaction.options.getString("사유")
        const user = member 
        let userin = user.id
        const users = userin || "조회 불가"
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
                    value: `해당 기능은 관리자 명령어여서 쓸 수 없습니다!`,
                },
            ],
            timestamp: new Date(),
        };
        if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return; /*interaction.followUp({ embeds: [embed0] })
        interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor(`BLUE`)
                    .setDescription(`처리중입니다. · · ·`)
            ],
        })*/
        if (dddd == "추방") {
            const embed1 = new MessageEmbed()
                .setTitle(`추방 완료!`)
                .setDescription(`추방된 유저 : ${member}\n사유 : ${msg}\n\n처리시간 : <t:${time}>`)
                .setFooter({
                    text: `${interaction.user.tag}`,
                    iconURL: `${interaction.user.displayAvatarURL()}`
                })
                .setTimestamp()
                .setColor("RED")

            member.kick().then().catch((error) => {
                const embed1 = new MessageEmbed()
                    .setDescription(`${member}이(가) 추방 실패됐어요`)
                    .setFooter(`반환된 에러 : \`${error}\` `)
                    .setTimestamp()
                interaction.editReply({ embeds: [embed1] })
            })
            interaction.editReply({ embeds: [embed1] })
        }
        if (dddd == "차단") { 
            const embed2 = new MessageEmbed()
                .setTitle(`차단 완료!`)
                .setDescription(`차단된 유저 : ${member}\n사유 : ${msg}\n\n처리시간 : <t:${time}>`)
                .setTimestamp()
                .setFooter({
                    text: `${interaction.user.tag}`,
                    iconURL: `${interaction.user.displayAvatarURL()}`
                })
                .setColor("RED")
            member.ban().then().catch((error) => {
                const embed1 = new MessageEmbed()
                    .setDescription(`${member}이(가) 차단 실패됐어요ㅠㅠ`)
                    .setFooter(`반환된 에러 : \`${error}\``)
                    .setTimestamp()
                interaction.editReply({ embeds: [embed1] })
            })
            interaction.editReply({ embeds: [embed2] })
        }
    }
}