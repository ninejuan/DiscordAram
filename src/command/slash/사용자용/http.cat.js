const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("http-cat")
    .setDescription("http.cat사이트에서 정보")
    .addIntegerOption(option => option
        .setName("코드")
        .setDescription("HTTP 코드를 입력하세요")
        .setRequired(true)
        .setMaxValue(599)
        .setMinValue(100)),
    async run(interaction) {
          const han = new MessageEmbed() 
          .setTitle(`HTTP CODE ${interaction.options.getInteger("코드")}`)
          .setImage(`https://http.cat/${interaction.options.getInteger("코드")}.jpg`)
          .setFooter("만약 사진이 로딩되지 않으면 당신은 틀린 코드를 입력한 거에요!")
          interaction.reply({ embeds: [han] }).catch(() => {
            console.log('err')
          })
    }
}