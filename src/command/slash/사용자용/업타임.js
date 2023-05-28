const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const style = "R";
const hexcolor = require('../../../base/hexcolor')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("업타임")
        .setDescription("아람이의 업타임을 확인해요!"),
    async run(interaction,client){
      const prettyMilliseconds = require("pretty-ms");
        const starttime =
  `<t:${Math.floor(client.readyAt / 1000)}` + (style ? `:${style}` : "") + ">";
        const uptimeEmbed = new MessageEmbed()
      .setTitle("**아람이 업타임!**")
      .setDescription(
        `\`\`\`fix\n[업타임 : ${prettyMilliseconds(client.uptime)}]\n\`\`\``
      )
      .setColor(hexcolor.invisible)
      .setTimestamp();
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("primary")
        .setLabel("아람이")
        .setStyle("DANGER")
        .setDisabled(true)
    );
    interaction.reply({ embeds: [uptimeEmbed], components: [row] });
    }
}