const { MessageEmbed, Client } = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../../../setting/config')
const adminid = '927049010072682516'
const anchannel = config.log.User.help;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("문의")
        .setDescription("DM HELP 관리자에게 문의사항을 전송해요!")
        .addStringOption(options => options
            .setName("내용")
            .setDescription("문의할 내용을 입력해주세요!")
            .setRequired(true)
        ),
    async run(interaction,client) {
    const msg = interaction.options.getString("내용")
    interaction.reply({embeds: [
        new MessageEmbed()
            .setTitle(`<a:okcheck:977576443410268190>문의가 정상적으로 접수됐습니다!<a:okcheck:977576443410268190>`)
            .setColor('BLURPLE')
            .setAuthor({ name : `문의시스템`, iconURL : client.user.displayAvatarURL()})
            .setDescription(`접수한 문의는 DM으로 확인할 수 있고\n추가적으로 문의를 하고 싶으면 /문의 (내용)으로 할 수 있어요!`)
            .setTimestamp()
            .setFooter(`${interaction.user.tag}`)], ephemeral: true })
    client.users.fetch(interaction.user.id).then((user) => {
        const embed6 = new MessageEmbed()
            .setTitle(`<a:okcheck:977576443410268190>접수한 문의 내용이에요!<a:okcheck:977576443410268190>`)
            .setColor('BLURPLE')
            .setAuthor({ name : `문의시스템`, iconURL : client.user.displayAvatarURL()})
            .setDescription(`**내용**\n**\`\`\``+msg+`\`\`\`**`)
            .setTimestamp()
            .setFooter(`문의해줘서 고마워요!`)
        user.send({ embeds : [embed6] })
    });
    client.users.fetch(adminid).then((user) => {
        const embed6 = new MessageEmbed()
            .setTitle(`<a:warning:977576443590610944>유저로 부터 문의가 도착했어요!<a:warning:977576443590610944>`)
            .setColor('BLURPLE')
            .setAuthor({ name : `문의시스템`, iconURL : client.user.displayAvatarURL()})
            .setDescription(`**내용**\n**\`\`\``+msg+`\`\`\`**`)
            .setTimestamp()
            .setFooter(`답변 방법 : /답변 ${interaction.user.id} (답변 내용)`)
        user.send({ embeds : [embed6] })
        client.channels.cache.get(anchannel).send({ embeds: [embed6] })
    });
    }
}