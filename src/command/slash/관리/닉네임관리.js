const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js')
const hexcolor = require('../../../base/hexcolor')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("닉네임관리")
        .setDescription("유저의 닉네임을 변경해요!")
        .addUserOption(option =>
            option
                .setName("유저")
                .setDescription("닉네임을 바꿀 유저를 선택해주세요")
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName("닉네임")
                .setDescription("바꿀 닉네임을 입력하세요")
                .setRequired(true)),
    async run(interaction) {
        const member = interaction.options.getMember('유저');
        const nickname = interaction.options.getString('닉네임');
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) return interaction.reply("`MANAGE_NICKNAMES`권한이 없어서 닉네임 관리가 불가능하답니다")
        if (!interaction.guild.me.permissions.has(require('discord.js').Permissions.FLAGS.MANAGE_NICKNAMES)) {
            const embed = new MessageEmbed()
            .setTitle('<:disallow:1006582767582203976> 권한이 없어요')
            .setDescription('아람이에게 `MANAGE_NICKNAMES` 권한이 없어요')
            .setColor(require('../../../base/hexcolor').invisible)
            return interaction.reply({ embeds: [embed] });
        }
        const buttons = [
            {
              customId: "nickname-change-proceed",
              label: "바꾸기",
              style: "PRIMARY",
              emoji: '<:allow:1006582759592046702>',
              async action(i) {
                try {
                    await member.setNickname(nickname, `By: ${interaction.user.tag}`);
                    const embed = new MessageEmbed()
                    .setTitle(`<:allow:1006582759592046702> 닉네임 부여 성공!`)
                    .setColor(hexcolor.invisible)
                    .setDescription(`${member.user.tag}에게 \n ${nickname}을/를 부여했어요`)
                    interaction.reply({embeds: [embed]})
                } catch (e) {
                    const embed = new MessageEmbed()
                    .setTitle("<a:error:977576443301232680>아람이의 권한이 조금 낮아요<a:error:977576443301232680>")
                    .setColor(hexcolor.invisible)
                    interaction.reply({embeds: [embed]})
                }
              },
            },
            {
              customId: "nickname-change-cancel",
              label: "취소하기",
              style: "DANGER",
              emoji: "<:disallow:1006582767582203976>",
              async action(i) {
                interaction.deleteReply();
                },
            },
        ];
        
    }
}