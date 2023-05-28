const client = require('../../base/client')
const { MessageEmbed, Permissions } = require('discord.js')
const hexcolor = require('../../base/hexcolor')

client.on('messageCreate', async (msg) => {
    if (!msg.guild) return
    const aev = require('../../models/봇시스템/안티에블')
    const aevdb = await aev.findOne({ GuildID: msg.guild.id })
    if (!aevdb) return;
    if (msg.author.bot) return;
    if (msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return ;
    if (msg.content.includes('@everyone') || msg.content.includes('@here')) {
        msg.delete()
        msg.member.timeout(300000, 'trying to raid 테러 시도')
        const embed = new MessageEmbed()
            .setTitle("<a:warning:977576443590610944>주의!<a:warning:977576443590610944>")
            .setDescription('관리자 권한이 없는 사용자가 에브리원 멘션을 시도했어요!')
            .addFields(
                { name: '사용자', value: `${msg.author.tag}` },
                { name: 'ID', value: `${msg.author.id}` }
                )
            .setColor(hexcolor.invisible)
            .addField("아람이 안티 에브리원 시스템", "Aram Anit Everyone Mention")
            .setFooter("유저를 5분간 타임아웃했어요!")
            .setThumbnail('https://github.com/ninejuan/GuGuBot_Djsv12/blob/master/warn.png?raw=true')
        const noti = new MessageEmbed()
        .setTitle(`${msg.guild.name}에서 문제가 발생했어요!`)
        .setDescription("관리자 권한이 없는 누군가가 모두를 멘션하려 시도했어요!")
        .addField("메세지 내용", `실수로 클릭하지 않게 주의하세요!\n||${msg.content}||`)
        .setColor(hexcolor.invisible)
        .setThumbnail('https://github.com/ninejuan/GuGuBot_Djsv12/blob/master/warn.png?raw=true')
        const mguild = await client.guilds.cache.get(`${msg.guild.id}`)
        if (mguild.systemChannel) {
            mguild.systemChannel.send({ embeds: [noti] })
        }
        return msg.channel.send({ embeds: [embed] });
    }
})