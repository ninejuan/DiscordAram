const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const request = require('request');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("맞춤법검사")
        .setDescription("맞춤법이 맞는지 검사해요!")
        .addStringOption(option => option
            .setName("문구")
            .setDescription("확인할 문구를 입력하세요!")
            .setRequired(true)),
    async run(interaction){
        const str = interaction.options.getString("문구")
        let api_url = `https://api.aramy.net/v1/grammar?string=${encodeURI(str)}`
        let options = {
            url: api_url
        }
        request.get(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let json = JSON.parse(body)
                if (!json.wrong || json.wrong == 0) {
                    const notw = new MessageEmbed()
                    .setTitle(`틀린 부분이 없어요`)
                    .setDescription(`\`\`\`${json.original}\`\`\``)
                    .setColor(require('../../../base/hexcolor').invisible)
                    interaction.reply({ embeds: [notw] })
                } else if (json.wrong) {
                    const embed = new MessageEmbed()
                    .setColor(require('../../../base/hexcolor').invisible)
                    .addFields(
                        { name: `원래 문장`, value: `${json.original}` },
                        { name: `틀린 갯수`, value: `${json.wrong || 0}` },
                        { name: '추천', value: `${json.suggestions || '틀린 부분 없음'}` },
                        { name: '해설', value: `${json.more || '틀린 부분 없음'}` }
                    )
                    .setFooter(`라이선스: ${json.license}`)
                    interaction.reply({embeds:[embed]})
                }
            } else {
                console.log('error = ' + response.statusCode);
            }
        });
    }
}