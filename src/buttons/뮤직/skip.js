const { MessageEmbed } = require('discord.js')
const hexcolor = require('../../base/hexcolor')
const distube = require('../../base/distube')

module.exports = {
    id: "skip",

    async run(interaction) {
        const channel = interaction.member.voice.channel;
      if (!channel) {
          const embed = new MessageEmbed()
          .setTitle("<a:warning:977576443590610944>ㅣ오류ㅣ<a:warning:977576443590610944>")
          .setDescription("보이스 채널에 들어가서 명령어를 사용해주세요!")
          .setColor(hexcolor.red2)
          .setTimestamp()

          return interaction.reply({embeds: [embed], ephemeral: true})
      }
      const queue = distube.getQueue(interaction.guild.id);
      if (!queue) {
          const embed = new MessageEmbed()
          .setTitle("<a:warning:977576443590610944>ㅣ오류")
          .setDescription("현재 재생중인 곡이 없답니다")
          .setColor(hexcolor.red2)
          .setTimestamp()

          return interaction.reply({embeds: [embed], ephemeral: true})
      }
      queue.skip()
      .then(() => {
          const embed = new MessageEmbed()
          .setTitle("<a:okcheck:977576443410268190>ㅣ스킵 성공!ㅣ<a:okcheck:977576443410268190>")
          .setDescription(`잠시 후 다음곡이 재생될거에요!\n\n음악을 스킵한 사용자는 ${interaction.user}입니다!`)
          .setColor(hexcolor.blue2)
          .setTimestamp()

          interaction.reply({embeds: [embed], ephemeral: true})
      }).catch(() => {
          const embed = new MessageEmbed()
              .setTitle("<a:warning:977576443590610944>ㅣ오류ㅣ<a:warning:977576443590610944>")
              .setDescription("예약된 곡이 없어서 스킵할 수 없어요!")
              .setColor(hexcolor.red2)
              .setTimestamp()

              return interaction.reply({embeds: [embed], ephemeral: true})
      })
    },
};