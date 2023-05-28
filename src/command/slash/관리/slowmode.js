const { MessageEmbed, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("슬로우")
        .setDescription("해당 채널에 슬로우모드를 적용해요!")
        .addIntegerOption(op =>
            op.setName("딜레이")
                .setDescription("슬로우모드 초를 입력해주세요!")
                .setRequired(true)
                .setMaxValue(21600)
                .setMinValue(0)),
    /**
     *
     * @param {import('discord.js').CommandInteraction} interaction
     */
    async run(interaction){
        const slowtime = interaction.options.getInteger("딜레이")
        const embed = new MessageEmbed()
        .setTitle("<a:error:977576443301232680>권한이 없어요!<a:error:977576443301232680>")
        .setDescription(`해당 명령어를 사용하기 위해서는 \`MANAGE_CHANNELS\` 권한이 필요해요!`) 
        .setColor(`RANDOM`)
        .setFooter(`${interaction.member.user.tag}`,  interaction.member.user.displayAvatarURL()) 
        .setTimestamp() 
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return interaction.reply({ embeds: [embed] });
        if (!interaction.guild.me.permissions.has(require('discord.js').Permissions.FLAGS.MANAGE_CHANNELS)) {
            const embed = new MessageEmbed()
            .setTitle('<:disallow:1006582767582203976> 권한이 없어요')
            .setDescription('아람이에게 `MANAGE_CHANNELS` 권한이 없어요')
            .setColor(require('../../../base/hexcolor').invisible)
            return interaction.reply({ embeds: [embed] });
        }
        interaction.channel.setRateLimitPerUser(`${slowtime}`);
        if (slowtime == 0) {
            interaction.reply({ embeds: [new MessageEmbed()
                .setColor(require('../../../base/hexcolor').invisible)
                .setTitle(`<a:Onl:977573874076090398> 슬로우가 해제되었어요! <a:Onl:977573874076090398>`)
            ] })
        } else {
            const embeds  = new MessageEmbed()    
            .setTitle("슬로우 모드 적용완료") 
            .setDescription(`<a:okcheck:977576443410268190>해당 채널에 ${slowtime}초 딜레이가 적용됐어요!<a:okcheck:977576443410268190>`) 
            .setColor(`RANDOM`) 
            .setFooter(`${interaction.member.user.tag}`,  interaction.member.user.displayAvatarURL())
            .setTimestamp()
            const sent = await interaction.reply("<a:Onl:977573874076090398> 슬로우를 걸고 있는 중이에요...")
            const sente = await interaction.editReply("<a:Onl:977573874076090398> 슬로우를 걸고 있는 중이에요...")
            interaction.editReply({ content:"<a:Onl:977573874076090398> 슬로우를 걸었어요!", embeds: [embeds] })
        }
    }
}