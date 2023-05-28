const { Permissions, MessageEmbed, MessageAttachment } = require('discord.js')
const hexcolor = require('../../base/hexcolor')
const discordTranscripts = require('discord-html-transcripts');

module.exports = {
    id: "tk-save-transcript",

    async run(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            const embed = new MessageEmbed()
            .setTitle("<:disallow:1006582767582203976> 권한 오류!<:disallow:1006582767582203976> ")
            .setColor(hexcolor.invisible)
            .setFooter("사용자에게 `MANAGE_CHANNELS` 권한이 없어요!")
            interaction.reply({ embeds: [embed], ephemeral: true })       
        } else {
            const attachment = await discordTranscripts.createTranscript(interaction.channel);
            interaction.reply({
                content: `<:next_array:1006582763463381124> **${interaction.channel.name} - 티켓이 저장되었어요** <:array:1006527855112495114>`,
                files: [attachment]
            });
            interaction.user.send({
                content: `<:next_array:1006582763463381124> **${interaction.channel.name} - 티켓이 저장되었어요** <:array:1006527855112495114>\n
                discord-html-transcripts 모듈이 사용되었습니다 https://www.npmjs.com/package/discord-html-transcripts`,
                files: [attachment]
            })
        }
    },
};