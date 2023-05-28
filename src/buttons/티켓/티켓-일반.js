const Discord = require('discord.js')
const { MessageButton,MessageEmbed } = require('discord.js')
module.exports = {
    id: "tk-2",
/**
     * 
     * @param {import('discord.js').CommandInteraction} interaction 
     * @param {import('discord.js').Channel} channel
     * @returns 
     */
    async run(interaction) {
        const channel = await interaction.guild.channels.create(`일반문의 | ${interaction.user.tag}`)
        channel.setTopic(`${interaction.user.id}`);
        channel.permissionOverwrites.edit(interaction.guild.id, {
            SEND_MESSAGES: false,
            VIEW_CHANNEL: false
        })

        channel.permissionOverwrites.edit(interaction.user, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true
        })
        const msg = await interaction.reply({ content: `**아래 채널로 이동해주세요! ${channel}**`, ephemeral: true })
        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('tk-lock')
                    .setLabel('티켓 닫기')
                    .setStyle('DANGER')
                    .setEmoji('🔒'),
                // new Discord.MessageButton()
                //     .setCustomId('tk-lock')
                //     .setLabel('잠그기')
                //     .setStyle('PRIMARY')
                //     .setEmoji('🔒'),
                // new Discord.MessageButton()
                //     .setCustomId('tk-unlock')
                //     .setLabel('잠금 해제')
                //     .setStyle('PRIMARY')
                //     .setEmoji('🔓')
            )
        const embed = new MessageEmbed()
            .setTitle("문의하실 내용을 적어주세요!")
            .setDescription("아래 버튼을 눌러 티켓을 종료할 수 있습니다!")
        const reactionmsg = await channel.send({ embeds: [embed], components: [row] })
    },
};