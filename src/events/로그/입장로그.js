const client = require('../../base/client')
const { MessageAttachment, MessageEmbed } = require('discord.js')

client.on('guildMemberAdd', async (user) => {
  const Schema = require("../../models/로그/joinleave")
  const WelcomeDB = await Schema.findOne({
    GuildID: user.guild.id
  });
  if (WelcomeDB) {
    const ChannelID = WelcomeDB.ChannelID;
    const WMsgData = WelcomeDB.WelcomeMessage || `{user}님, {guild}에서 앞으로 좋은 시간 보내세요!`
    let WMsg = WMsgData.split('{user}').join(`${user.user.username}`).split('{guild}').join(`${user.guild.name}`);
    const embed = new MessageEmbed()
    .setTitle(`${WMsg}`)
    .setFooter({
      text: `${user.user.tag} - 입장`,
      iconURL: user.user.avatarURL()
    })
    .setTimestamp()
    .setThumbnail(user.user.avatarURL())
    client.channels.cache.get(ChannelID).send({embeds: [embed]})
  }
})