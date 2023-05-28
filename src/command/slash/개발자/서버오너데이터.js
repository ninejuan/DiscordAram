const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders')
const client = require('../../../base/client');
module.exports = {
    // 위 코드는 commands 파일쪽에 넣어주세요
    data: new SlashCommandBuilder()
        .setName('ownercount')
        .setDescription('한 사람이 몇개의 서버에 아람이를 초대했는지 띄워요'),
    /**
     * 
     * @param {import('discord.js').CommandInteraction} interaction 
     * @returns 
     */
    async run(interaction) {
        if (interaction.member.user.id !== "927049010072682516") {
            const embed = new MessageEmbed()
                .setTitle('오류')
                .setColor("#ff5757")
                .setDescription('개발자만 명령어 사용이 가능해요!')
            await interaction.reply({ embeds: [embed] })
            return;
        }
        let arr = [];
        client.guilds.cache.forEach(guild => {
            arr.push(`<@${guild.ownerId}>`)
        })
        let result = arr.reduce((accu, curr) => {
            accu[curr] = (accu[curr] || 0) + 1;
            return accu;
        }, {})
        console.log(result)
        interaction.reply(`${JSON.stringify(result) || 'undefined'}`)
    }
}