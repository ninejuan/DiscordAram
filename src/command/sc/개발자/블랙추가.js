const { MessageEmbed } = require("discord.js");
const Schema = require("../../../models/개발자/블랙리스트");
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    // 위 코드는 commands 파일쪽에 넣어주세요
    data: new SlashCommandBuilder()
        .setName('블랙리스트')
        .setDescription('사용자를 블랙리스트에 추가해요!')
        .addUserOption(option =>
            option.setName('유저')
                .setDescription('차단할 유저를 선택해주세요!')
                .setRequired(true)),
    async run(interaction) {
        // await Schema.findOneAndDelete({ userid: '927049010072682516' })
        // return ;
        const user = interaction.options.getMember("유저")
        if (user.id == '927049010072682516') return;
        if (interaction.member.user.id !== "927049010072682516") {
            const embed = new MessageEmbed()
                .setTitle('오류')
                .setColor("#ff5757")
                .setDescription('개발자만 명령어 사용이 가능해요!')
            await interaction.reply({ embeds: [embed] })
            return;
        }
        const t = new Date()
        const date = "" + t.getFullYear() + (t.getMonth() + 1) + t.getDate()
        userinfodata = new Schema({ userid: user.id, date: date })
        interaction.reply({ content: "블랙 추가 완료" })
        userinfodata.save()
    }
}