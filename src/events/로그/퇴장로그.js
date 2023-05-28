const client = require('../../base/client')
const { MessageAttachment, MessageEmbed } = require('discord.js')

client.on('guildMemberRemove', async (user) => {
  const Schema = require("../../models/로그/joinleave")
  const WelcomeDB = await Schema.findOne({
    GuildID: user.guild.id
  });
  if (WelcomeDB) {
    const ChannelID = WelcomeDB.ChannelID;
    const WMsgData = WelcomeDB.ByeMessage || `{user}님, {guild}에서 있으셨던 시간이 행복하길 바랄게요`
    let WMsg = WMsgData.split('{user}').join(`${user.user.username}`).split('{guild}').join(`${user.guild.name}`);
    const embed = new MessageEmbed()
    .setTitle(`${WMsg}`)
    .setFooter({
      text: `${user.user.tag} - 퇴장`,
      iconURL: user.user.avatarURL()
    })
    .setTimestamp()
    .setThumbnail(user.user.avatarURL())
    client.channels.cache.get(ChannelID).send({embeds: [embed]})
  }
})