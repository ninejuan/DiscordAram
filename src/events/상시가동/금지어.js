const client = require('../../base/client')

client.on("messageCreate", async message => {
    if (message.channel.type == "DM") return ;
    if (message.author.bot) return ;
    const Schema = require("../../models/관리/금지어")
    await Schema.find({ serverid: message.guild.id }).exec((err, res) => {
        for (let i = 0; i < res.length; i++) {
            if (message.content.includes(res[i].금지어)) {
                if (res[i].온오프 == "on") {
                    message.delete()
                    const embed = new (require("discord.js")).MessageEmbed()
                        .setTitle("<:disallow:1006582767582203976> 금지어를 감지했어요")
                        .setDescription(`**감지된 채팅**\n**\`\`\`${message.content}\`\`\`**`)
                        .addField("감지된 금지어", `>>> **${res[i].금지어}**`)
                        .setColor(require('../../base/hexcolor').invisible)
                    message.channel.send({ embeds: [embed] }).then(msg => {
                        setTimeout(() => {
                            msg.delete()
                        }, 5000);
                    })
                }
            }
        }
    })
})