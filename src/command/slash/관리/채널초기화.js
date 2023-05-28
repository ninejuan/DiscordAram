const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed, MessageManager, MessageActionRow, MessageButton, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("채널초기화")
        .setDescription("이 채널을 초기화합니다! (메세지 전체 삭제)"),
    async run(interaction){
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            const embed = new MessageEmbed()
            .setTitle('<:disallow:1006582767582203976> 사용자에게 `MANAGE_CHANNELS` 권한이 없습니다')
            .setColor(require('../../../base/hexcolor').invisible)
            return interaction.reply({ embeds: [embed] });
        }
        if (!interaction.guild.me.permissions.has(require('discord.js').Permissions.FLAGS.MANAGE_CHANNELS)) {
            const embed = new MessageEmbed()
            .setTitle('<:disallow:1006582767582203976> 권한이 없어요')
            .setDescription('아람이에게 `MANAGE_CHANNELS` 권한이 없어요')
            .setColor(require('../../../base/hexcolor').invisible)
            return interaction.reply({ embeds: [embed] });
        }
        const buttons = [
            // 각 버튼을 배열(array) 자료구조로 만들어요
            {
              customId: "chinit-goahead",
              label: "초기화",
              style: "PRIMARY",
              emoji: '<:allow:1006582759592046702>',
              async action(i) {
                const channel = await interaction.channel.clone()
                interaction.channel.delete()
                channel.send(`${interaction.user}님이 ${interaction.channel.name} 채널을 초기화했어요!`)
              },
            },
            {
              customId: "chinit-cancel",
              label: "취소하기",
              style: "DANGER",
              emoji: "<:disallow:1006582767582203976>",
              async action(i) {
               interaction.deleteReply();
                },
            },
        ];
        const row = new MessageActionRow().addComponents(
            // buttons array를 하나씩 읽어서 버튼을 만들게 됩니다
            buttons.map((button) => {
              return new MessageButton()
                .setCustomId(button.customId)
                .setLabel(button.label)
                .setStyle(button.style)
                .setEmoji(button.emoji)
            })
          );
        const embed = new MessageEmbed()
        .setDescription(`정말로 ${interaction.channel}을/를 초기화 하시겠어요?`)
        .setColor(require('../../../base/hexcolor').invisible)
        interaction.reply({ embeds: [embed], components: [row] });
        const filter = (interaction) => {
            return buttons.filter(
                (button) => button.customId === interaction.customId
            );
        };
          
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 60 * 9000, // 몇초동안 반응할 수 있는지, ms단위라서 3초면 3000으로 입력
        });

        collector.on("collect", async (i) => {
            // 배열(buttons array)에 있는 동작을 자동으로 읽음
            const button = buttons.find(
              (button) => button.customId === i.customId
            );
            if (i.user !== interaction.user) {
                return i.reply({ embeds: [new MessageEmbed()
                    .setColor(require('../../../base/hexcolor').invisible)
                    .setTitle('이 명령어를 호출한 유저만 사용 가능해요')
                ], ephemeral: true })
            } else {
                await button.action(i);
            }
          });
    }
}