const { DiscordTogether } = require('discord-together')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("유튜브")
        .setDescription("유튜브를 봐요!"),
    async run(interaction,client){
        client.dtg = new DiscordTogether(client)
        client.dtg.createTogetherCode(interaction.member.voice.channel.id, 'youtube').then(async invite => {
            const embed = new MessageEmbed()
            .setTitle(`${invite.code}`)
            .setFooter(`https://www.npmjs.com/package/discord-together 모듈이 사용되었습니다`)
            interaction.reply({embeds:[embed]})
        })
    }
}