const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("서버정보")
    .setDescription("내 서버의 정보에요!"),
  /** 
   * @param {CommandInteraction} interaction 
   */
  async run(interaction) {
    const { guild } = interaction;

    const { ownerId, description, createdTimestamp, members, memberCount, channels, emojis, stickers } = guild;
    const totalmember = memberCount
    const onlinemember = guild.members.cache.filter(member => member?.presence?.status == 'online').size;
    const idlemember = guild.members.cache.filter(member => member?.presence?.status == 'idle').size;
    const dndmember = guild.members.cache.filter(member => member?.presence?.status == 'dnd').size;
    const offlinemember = totalmember - onlinemember - idlemember - dndmember;
    const embed = new MessageEmbed()
      .setTitle("> **서버 정보**")
      .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        {
          name: "<:2899info:977596012413730836> 일반",
          value:
            `
          이름 : ${guild.name}
          📅생성된 날짜 : <t:${parseInt(createdTimestamp / 1000)}:R>
          <:5657roleiconowner:977577342320918529>소유자 : <@${ownerId}>

          설명 : ${description || "없음"}
          `
        },
        {
          name: "👤유저",
          value: `
          👨사람 : ${members.cache.filter((m) => !m.user.bot).size}
          <:2762roleiconbot:977577434427826196> 봇 : ${members.cache.filter((m) => m.user.bot).size}
          합계 : ${memberCount}
          `
        },
        {
          name: "채널",
          value: `
          📝채팅 : ${channels.cache.filter((c) => c.type === "GUILD_TEXT").size}
          🎤음성 : ${channels.cache.filter((c) => c.type === "GUILD_VOICE").size}
          🧵스레드 : ${channels.cache.filter((c) => c.type === "GUILD_PUBLIC_THREAD").size}
           합계 : ${channels.cache.size}
          `
        },
        {
          name: "🙂이모트 & 스티커",
          value: `
          움직이는 이모트 : ${emojis.cache.filter((e) => e.animated).size}
          그냥 이모트 : ${emojis.cache.filter((e) => !e.animated).size}
          스티커 : ${stickers.cache.size}
          `
        },
        {
          name: "<:Boost:977414021097619456>부스트 상태",
          value: `
          부스트 티어 : ${guild.premiumTier}
          부스트 개수 : ${guild.premiumSubscriptionCount}
          `
        },
        {
          name: "멤버 상태",
          value: `
          <:Online:977252234003886150>온라인 : ${onlinemember}명,
          <:DND:977252233748054079>방해금지 : ${dndmember}명,
          <:Idle:977252234050031626>자리 비움 : ${idlemember}명,
          <:Offline:977252233966133279>오프라인 : ${offlinemember}명
          `
        }
      )
    interaction.reply({ embeds: [embed] })
  },
};
