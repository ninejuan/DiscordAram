const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");


module.exports = {
    data: new SlashCommandBuilder()
    .setName("재난문자")
    .setDescription("안전 안내문자 내용을 확인해요!"),
  /**
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async run(interaction) {
    const fetch = require("node-fetch");
    const req = await fetch(
      "http://m.safekorea.go.kr/idsiSFK/neo/ext/json/disasterDataList/disasterDataList.json"
    );
    const json = await req.json();
    const top5 = json.slice(0, 5);

    const embed = new MessageEmbed()
      .setColor(`YELLOW`)
      .setThumbnail(
        `https://media.discordapp.net/attachments/937006918659108944/991009591825424384/unknown.png?width=676&height=676`
      )

    for (const i of top5) {
      embed.addField(i.SJ, `\`${i.CONT}\``);
      embed.setTitle(`${i.LAST_MODF_DT} 안전 안내문자`)
    }
    embed.setFooter('대한민국 공공API가 사용되었습니다')
    interaction.reply({ embeds: [embed] });
  },
};
