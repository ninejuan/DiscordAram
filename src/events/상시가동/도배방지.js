const client = require('../../base/client')
const { MessageEmbed, Permissions } = require('discord.js')
let dobecool = 500;
let dobeuser = {};
let dobelist = [];
let dobecount = 4;
let dobei = 0;
client.on('messageCreate', async message => {
    if (!message.guild) return
    const dobes = require('../../models/관리/도배')
    const dobedb = await dobes.findOne({ GuildID: message.guild.id })
    if (!dobedb) return;
    if (message.author.bot || !message.guild) return;
    if (message.content.includes("")) {
        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            let author = dobeuser[message.author.id]
            if (!author) {
                dobeuser[message.author.id] = {
                    time: 0,
                    interval: null,
                    muted: false
                }
            } else {
                if (author.interval != null) {
                    if (dobecool >= author.time && !author.muted) {
                        message.member.timeout(1 * 60 * 1000, '스팸감지 - By아람이')
                        author.muted = true
                        const embed = new MessageEmbed()
                            .setTitle("도배 감지")
                            .setDescription(`**${message.author.tag}**님의 도배가 감지되었어요\n전 채팅과의 시간차 : \`${author.time}ms\`\n${message.author.username}님을 60초동안 타임아웃 했어요`)
                            .setColor(require('../../base/hexcolor').invisible)
                            .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
                        (await message.channel.messages.fetch()).filter((m) => {
                            if (m.author.id == message.author.id && dobecount > dobei) {
                                dobelist.push(m)
                                dobei++
                            }
                        })
                        await message.channel.bulkDelete(dobelist).then((dobecount) => message.channel.send({ embeds: [embed] }).then((msg) => setTimeout(() => { msg.delete() }, 60000)))
                    }
                    clearInterval(author.interval)
                    author.interval = null
                } else if (!author.muted) {
                    author.interval = setInterval(() => {
                        author.time++
                    }, 1)
                }
                author.time = 0
            }
        }
    }
});