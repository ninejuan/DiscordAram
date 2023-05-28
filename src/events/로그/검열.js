const { MessageEmbed } = require('discord.js');
const { check } = require('korcen');
const Schema1 = require("../../models/검열/검열")
const Schema2 = require("../../models/검열/검열제외")
const Schema3 = require("../../models/검열/검열횟수")
const Schema4 = require("../../models/검열/검열로그")

module.exports = {
    id: "messageCreate",
    async run(msg, client) {
        if(!msg.guild) return;
        const MOD_find = await Schema1.findOne({
            guildid: msg.guild.id
        });
        const MOD_find2 = await Schema2.findOne({
            channelid: msg.channel.id
        });
        const MOD_find3 = await Schema4.findOne({
            guildid: msg.guild.id
        });
        if (MOD_find) {
            if (MOD_find2) return;
            if (msg.author.bot) return;
            if (msg.attachments.size > 0) return;
            if (!msg.content) return;
            const date = new Date()
            const time = Math.round(date.getTime() / 1000)
            const c = check(msg.content)
    
            if (c) {
                msg.delete();
                const user = await Schema3.findOne({ userid: msg.author.id })
                if (!user) {
                    const newData = new Schema3({
                        userid: msg.author.id,
                        count: 1
                    })
                    newData.save()
                }
                if (user) {
                    await Schema3.findOneAndRemove({ userid: msg.author.id })
                    const newData = new Schema3({
                        userid: msg.author.id,
                        count: parseInt(user.count) + 1
                    })
                    newData.save()
                }
                const embed = new MessageEmbed()
                    .setTitle(`${msg.author.tag}님의 채팅을 검열했어요`)
                    .setTimestamp()
                    .addFields(
                        { name: `검열된 메세지`, value: `\`\`\`${msg.content}\`\`\`` }
                    )
                    .setFooter("메시지가 검열되었어요")
                    .setColor("#FF0000")
                msg.channel.send({ embeds: [embed] }).then(msg => {
                    setTimeout(() => {
                        msg.delete()
    
                    }, 5000);
                })
                if (MOD_find3) {
                    const jbchannel = MOD_find3.channelid
                    const logembed = new MessageEmbed()
    
                        .setTitle(`단어가 검열되었어요!`)
                        .setThumbnail(`${msg.author.displayAvatarURL()}`)
                        .setDescription(`${msg.channel}에서 단어가 검열되었습니다!`)
                        .addField(`**검열된 메세지**`, `\`\`\`${msg.content}\`\`\``)
                        .addFields(
                            { name: `검열시간`, value: `<t:${time}:F>` },
                            { name: `유저`, value: `${msg.author.tag}` }
                        )
                        .setTimestamp()
    
                    client.channels.cache.get(jbchannel).send({ embeds: [logembed] })
                }
            }
        }
    },
};