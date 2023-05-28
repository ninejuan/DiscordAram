const client = require('../../base/client')
const log_Schema = require("../../models/로그/logchannel")
const logs = require('discord-logs');
const { MessageEmbed } = require('discord.js')
const Discord = require('discord.js')
let time = Date.now()

client.on('guildMemberAdd', async function (member) {
    const jbid = await log_Schema.findOne({ GuildID: member.guild.id })
    if (!jbid) return ;
    const jbchannel = jbid.ChannelID
    const joinembed = new MessageEmbed()
        .setTitle(`✋서버에 누군가 들어왔어요!✋`)
        .setThumbnail(`${member.user.displayAvatarURL()}`)
        .setDescription(`${member.user.tag} 님이 서버에 들어오셨어요!`)
        .setTimestamp()
        .setFooter("입장로그")
        .setColor("#ffc0cb")
    member.guild.channels.cache.get(jbchannel)?.send({ embeds: [joinembed] })
});
client.on('guildMemberRemove', async function (member) {//퇴장로그

    const bid = await log_Schema.findOne({ GuildID: member.guild.id })
    if (!bid) return
    const bchannel = bid.ChannelID

    const byeembed = new MessageEmbed()
        .setTitle(`😥서버에서 누군가 나갔어요!😥`)
        .setDescription(`${member.user.tag} 님이 서버에 나가셨어요ㅠㅠ`)
        .setThumbnail(`${member.user.displayAvatarURL()}`)
        .setTimestamp()
        .setFooter("퇴장로그")
        .setColor(0xff0000)

    member.guild.channels.cache.get(bchannel)?.send({ embeds: [byeembed] })
});

//메세지로그
client.on('messageDelete', async (message) => {//삭제로그
    //try {
    if(message.author.bot) return;
    const delid = await log_Schema.findOne({ GuildID: message.guild.id })
    if (!delid) return
    const delc = delid.ChannelID
    try {
        if (message.content === ('')) {
            let embed = new MessageEmbed()
                .setDescription(`🖼️사진이 <#${message.channel.id}>에서 삭제됐어요!🖼️`)
                .setColor('#FF0000')
                .addField('**내용**', '없음 (📷사진)')
                .addField('**아이디**', `\`\`\`cs\n유저 = ${message.author.id} \n채널 = ${message.channel.id}\`\`\``)
                .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL(``))
                .setFooter("사진 삭제로그")
            client.channels.cache.get(delc).send({ embeds: [embed] })
        } else {
            const embed = new MessageEmbed()
                .setDescription(`✍️메세지가 <#${message.channel.id}>에서 삭제됐어요!✍️`)
                .setColor('#FF0000')
                .addField('**내용**', message.content)
                .addField('**아이디**', `\`\`\`cs\n유저 = ${message.author.id} \n채널 = ${message.channel.id}\`\`\``)
                .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL(``))
                .setTimestamp()
                .setFooter("채팅 삭제로그")
            client.channels.cache.get(delc).send({ embeds: [embed] })
        }
    } catch (error) { console.log(error); };
    //} catch (err) { }
});
client.on("messageUpdate", async function (oldMessage, newMessage) {//메세지 수정
    if (oldMessage.author.bot) return;
    const delid = await log_Schema.findOne({ GuildID: oldMessage.guild.id })
    if (!delid) return
    const delc = delid.ChannelID
    try {
        let main = await oldMessage.fetch();
        if (oldMessage.content === newMessage.content) return;
        let message = newMessage;
        let embed = new MessageEmbed();
        embed
            .setAuthor(oldMessage.author.tag, message.guild.iconURL())
            .setColor("#0000FF")
            .setThumbnail(oldMessage.author.avatarURL({ dynamic: true }))
            .addField("수정전 메세지", `\`${oldMessage.content}\``)
            .addField("수정후 메세지", `\`${newMessage.content}\``)
            .setTimestamp()
            .setFooter("메세지 수정")
            .setDescription(`🔥<#${message.channel.id}> 채널에서 메세지가 수정됐어요!🔥\n 수정한 사람 : **${main.author}**\n 편집된 메세지: [클릭](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`);
        return client.channels.cache.get(delc).send({ embeds: [embed] });
    } catch (err) { }

});

//채널로그
client.on("channelCreate", async function (channel) {//채널생성로그

    const logsdb = await log_Schema.findOne({ GuildID: channel.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID

    const entry = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_CREATE' }).then(audit => audit.entries.first());

    let status = {
        GUILD_TEXT: "💬채팅채널",
        GUILD_CATEGORY: "카테고리",
        GUILD_VOICE: "🎤음성채널"
    };

    const embed = new MessageEmbed()
        .setAuthor(entry.executor.tag, channel.guild.iconURL())
        .setDescription(`**#${channel.name}**(\`${channel.id}\`) 채널이 생성됐어요!\n\n 생성한 사람 : ${entry.executor} (\`${entry.executor.id}\`) \n\n 채널 유형 : ** ${status[channel.type]}**`)
        .setThumbnail(entry.executor.avatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("채널생성")
        .setColor("#00FF00")

    return client.channels.cache.get(logchannel).send({ embeds: [embed] })
});
client.on("channelUpdate", async function (oldChannel, newChannel) {//채널업데이트

    const logsdb = await log_Schema.findOne({ GuildID: oldChannel.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID

    let channel = oldChannel;
    const entry = await channel.guild.fetchAuditLogs({ type: "CHANNEL_UPDATE" }).then(audit => audit.entries.first());
    let status = {
        GUILD_TEXT: "💬채팅채널",
        GUILD_CATEGORY: "카테고리",
        GUILD_VOICE: "🎤음성채널"
    };
    let embed = new MessageEmbed()

        .setAuthor(entry.executor.tag, channel.guild.iconURL())

        .setDescription(

            ` ✍️**#${channel.name}**(\`${channel.id}\`) 채널 설정이 수정됐어요!✍️\n수정된 채널명 : ${channel}\n\n 사용자 : ${entry.executor}(\`${entry.executor.id}\`)${entry.executor.tag}  \n\n 변경된 채널 유형 : ${status[channel.type]}`

        )
        .setTimestamp()
        .setFooter("채널 업데이트")

        .setColor("#0000FF");

    return client.channels.cache.get(logchannel).send({ embeds: [embed] });

});
//유저로그
client.on('guildBanAdd', async (user) => {
    const LogDB = await log_Schema.findOne({
        GuildID: user.guild.id
    });
    if (LogDB) {
        const logch = LogDB.ChannelID
        const logembed = new MessageEmbed()
        .setTitle("<a:error:977576443301232680>유저가 차단됐어요!<a:error:977576443301232680>")
        .addFields({
            name: "밴 된 유저 정보",
            value: `
            닉네임 : \`${user.user.tag}\`,
            **ID** \`\`\`cs\n유저 = ${user.user.id}\`\`\`
            봇 여부 : ${user.user.bot}
            `
        })
        .setTimestamp()
        client.channels.cache.get(logch).send({ embeds: [logembed] })
    }
})
client.on('guildBanRemove', async (user) => {
    const LogDB = await Schema5.findOne({
        GuildID: user.guild.id
    });
    if (LogDB) {
        const logch = LogDB.ChannelID
        const logembed = new MessageEmbed()
        .setTitle("유저가 차단이 해제됐어요!")
        .addFields({
            name: "차단 해제된 유저 정보",
            value: `
            닉네임 : \`${user.user.tag}\`,
            **ID**\`\`\`cs\n${user.user.id}\`\`\`
            봇 여부 : ${user.user.bot}
            `
        })
        .setTimestamp()
        client.channels.cache.get(logch).send({ embeds: [logembed] })
    }
})
client.on("guildMemberNicknameUpdate", async (member, oldNickname, newNickname) => {//유저 닉네임 수정
    const logsdb = await log_Schema.findOne({ GuildID: member.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID
    const entry = await member.guild.fetchAuditLogs({ type: '' }).then(audit => audit.entries.first());


    let embed = new Discord.MessageEmbed();
    embed.setAuthor(`${member.user.username}${member.user.discriminator}`, member.user.avatarURL({ dynamic: true }))
        .setColor('#E70000')

        .setDescription(`✍️ <@${member.user.id}> **서버에서 사용자 이름이 바뀌었어요!** ✍️\n\n 사용자 : ${entry.executor}(\`${entry.executor.id}\`)${entry.executor.tag}\``)
        .addField("수정전 닉네임: ", `\`\`\`${oldNickname}\`\`\`` || `\`\`\`${member.user.username}\`\`\``, true)
        .addField("수정후 닉네임: ", `\`\`\`${newNickname}\`\`\`` || `\`\`\`${member.user.username}\`\`\``, true)
        .setThumbnail(member.user.avatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("유저 닉네임 수정")
    client.channels.cache.get(logchannel).send({ embeds: [embed] });

});

//역할로그
client.on("guildMemberRoleRemove", async (member, role) => {//유저 역할 제거
    const logsdb = await log_Schema.findOne({ GuildID: member.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID
    const entry = await member.guild.fetchAuditLogs({ type: '' }).then(audit => audit.entries.first());
    let embed = new Discord.MessageEmbed();
    embed
        .setAuthor(`${member.user.username}${member.user.discriminator}`, member.user.avatarURL({ dynamic: true }))
        .setColor(0xff0000)
        .setTitle("<a:error:977576443301232680>역할이 삭제됐어요!<a:error:977576443301232680>")
        .setDescription(`✍️ ${member.user}(${member.user.tag})${member.user.id} **역할을 제거당한 유저!**`)
        .addField("제거된 역할:", `${role}`, true)
        .addField(`사용자`, `**${entry.executor}**(\`${entry.executor.id}\`)${entry.executor.tag}`)
        .setThumbnail(member.user.avatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("유저 역할 제거")
    client.channels.cache.get(logchannel).send({ embeds: [embed] });

});
client.on("guildMemberRoleAdd", async (member, role) => {//유저 역할 추가
    const logsdb = await log_Schema.findOne({ GuildID: member.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID
    const entry = await member.guild.fetchAuditLogs({ type: '' }).then(audit => audit.entries.first());

    let embed = new Discord.MessageEmbed();
    embed
        .setAuthor(`${member.user.username}${member.user.discriminator}`, member.user.avatarURL({ dynamic: true }))
        .setColor(0x00ff00)
        .setTitle("<a:okcheck:977576443410268190>역할이 부여됐어요!<a:okcheck:977576443410268190>")
        .setDescription(`✍️ <@${member.user.id}> **역할을 받은 유저!**`)
        .addField("주어진 역할:", ` ${role}`, true)
        .addField(`사용자`, `**${entry.executor}**(\`${entry.executor.id}\`)${entry.executor.tag}`)
        .setThumbnail(member.user.avatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("유저 역할 추가")
    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("roleCreate", async function (role) {//역할 추가
    const logsdb = await log_Schema.findOne({ GuildID: role.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID
    const entry = await role.guild.fetchAuditLogs().then(audit => audit.entries.first());
    let embed = new MessageEmbed();
    embed
        .setAuthor(entry.executor.tag, role.guild.iconURL())

        .setDescription(

            ` **${role.name}**(\`${role.id}\`) 역할이 추가됐어요!\n\n 사용자 : ${entry.executor}(\`${entry.executor.id}\`)${entry.executor.tag}\``)
        .setTimestamp()
        .setFooter("역할 추가")
        .setThumbnail(entry.executor.avatarURL({ dynamic: true }))
        .setColor("#00FF00");

    return client.channels.cache.get(logchannel).send({ embeds: [embed] });

});
client.on("roleDelete", async function (role) {//역할 제거
    const logsdb = await log_Schema.findOne({ GuildID: role.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID
    const entry = await role.guild.fetchAuditLogs().then(audit => audit.entries.first());


    let embed = new MessageEmbed();

    embed

        .setAuthor(entry.executor.tag, role.guild.iconURL())

        .setDescription(`**${role.name}**(\`${role.id}\`) 에게서 역할이 삭제됐어요!\n\n 사용자 : ${entry.executor}(\`${entry.executor.id}\`)${entry.executor.tag}\``)
        .setThumbnail(entry.executor.avatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("역할 제거")
        .setColor("#E70000");

    return client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("rolePermissionsUpdate", async (role, oldPermissions, newPermissions) => {//역할 권한 업데이트
    const logsdb = await log_Schema.findOne({ GuildID: role.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID
    const entry = await role.guild.fetchAuditLogs({ type: '' }).then(audit => audit.entries.first());
    let embed = new Discord.MessageEmbed()
        .setAuthor(entry.executor.tag, role.guild.iconURL())
        .setColor('#ffc0cb')
        .setDescription(`⚒️ **역할의 권한이 변경됐어요! => ${role}!**`)
        .addField(`사용자`, `**${entry.executor}**(\`${entry.executor.id}\`)${entry.executor.tag}`)
        .setThumbnail(role.guild.iconURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("역할 권한 업데이트")


    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});

//부스트 로그
client.on("guildMemberBoost", async (member) => {//길드 부스트
    const logsdb = await log_Schema.findOne({ GuildID: member.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID

    let embed = new Discord.MessageEmbed();
    embed.setAuthor(`${member.guild.name}`, member.user.avatarURL({ dynamic: true }))
        .setColor("#f47fff")

        .setDescription(`<:Boost:977414021097619456>**<@${member.user.id}>**(\`${member.user.id}\`)님이 **서버에 부스트를 했어요!**<:Boost:977414021097619456>`)
        .setThumbnail(member.user.avatarURL({ dynamic: true }))
        .setTimestamp()
        .setTimestamp()
        .setFooter("길드 부스트")

    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("guildMemberUnboost", async (member) => {//길드 부스트 취소
    const logsdb = await log_Schema.findOne({ GuildID: member.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID


    let embed = new Discord.MessageEmbed();
    embed.setAuthor(`${member.guild.name}`, member.user.avatarURL({ dynamic: true }))
        .setColor("#f47fff")

        .setDescription(`<:Boost:977414021097619456>**<@${member.user.id}>**(\`${member.user.id}\`) **사용자가 우리 서버에 부스트를 취소했어요ㅠㅠ**<:Boost:977414021097619456>`)
        .setThumbnail(member.user.avatarURL({ dynamic: true }))
        .setTimestamp()
        .setTimestamp()
        .setFooter("길드 부스트 취소")

    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("guildBoostLevelUp", async (guild, oldLevel, newLevel) => {//길드 부스트 레벨 업
    const logsdb = await log_Schema.findOne({ GuildID: guild.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID


    let embed = new Discord.MessageEmbed();
    embed.setAuthor(`${guild.name}`, guild.iconURL({ dynamic: true }))
        .setColor("#f47fff")

        .setDescription(`<:Boost:977414021097619456>**서버 부스트 레벨이 올라갔어요!**<:Boost:977414021097619456>`)
        .addField("이전 레벨: ", `\`\`\`${oldLevel}\`\`\``, true)
        .addField("현제 레벨: ", `\`\`\`${newLevel}\`\`\``, true)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("길드 부스트 레벨 🔺")


    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("guildBoostLevelDown", async (guild, oldLevel, newLevel) => {//길드 부스트 레벨 다운
    const logsdb = await log_Schema.findOne({ GuildID: guild.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID


    let embed = new Discord.MessageEmbed();
    embed.setAuthor(`${guild.name}`, guild.iconURL({ dynamic: true }))
        .setColor("#f47fff")

        .setDescription(`<:Boost:977414021097619456>**서버 부스트 레벨이 내려갔어요ㅠㅠ**<:Boost:977414021097619456>`)
        .addField("이전 레벨: ", `\`\`\`${oldLevel}\`\`\``, true)
        .addField("현제 레벨: ", `\`\`\`${newLevel}\`\`\``, true)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("길드 부스트 레벨 🔻")


    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});

//음성로그
client.on("voiceChannelJoin", async (member, channel) => {//음성채널 참가
    const logsdb = await log_Schema.findOne({ GuildID: member.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID

    let embed = new Discord.MessageEmbed();
    embed.setAuthor(`${member.user.username}${member.user.discriminator}`, member.user.avatarURL({ dynamic: true }))
        .setColor('#00ff00')
        .setDescription(`🔊${member.user}(\`${member.user.id}\`)${member.user.tag} **유저가 <#${channel.id}> 음성 채널에 들어갔어요!**🔊`)
        .setThumbnail(member.user.avatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("음성채널 참가", client.user.avatarURL())
    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("voiceChannelLeave", async (member, channel) => {//음성채널 나감
    const logsdb = await log_Schema.findOne({ GuildID: member.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID


    let embed = new Discord.MessageEmbed();
    embed.setAuthor(`${member.user.username}${member.user.discriminator}`, member.user.avatarURL({ dynamic: true }))
        .setColor('#E70000')
        .setDescription(`🔊${member.user}(\`${member.user.id}\`)${member.user.tag} **유저가 <#${channel.id}> 음성 채널에서 나갔어요!**🔊`)
        .setThumbnail(member.user.avatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("음성채널 퇴장", client.user.avatarURL())


    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
//여기부터
client.on("voiceChannelSwitch", async (member, oldChannel, newChannel) => {//음성채널 스위치
    const logsdb = await log_Schema.findOne({ GuildID: member.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID
    let embed = new Discord.MessageEmbed();
    embed.setAuthor(`${member.user.username}${member.user.discriminator}`, member.user.avatarURL({ dynamic: true }))
        .setColor('#0000ff')
        .setDescription(`${member.user}(\`${member.user.id}\`)${member.user.tag} **사용자가 다른 채널로 전환했어요!**`)
        .addField(`이동전 음성채널: `, `\`\`\`${oldChannel.name}\`\`\``, true)
        .addField(`이동후 음성채널: `, `\`\`\`${newChannel.name}\`\`\``, true)
        .setThumbnail(member.user.avatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("음성채널 이동", client.user.avatarURL())

    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("voiceChannelMute", async (member, muteType) => {//음성채널 뮤트
    const logsdb = await log_Schema.findOne({ GuildID: member.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID


    let embed = new Discord.MessageEmbed();
    embed.setAuthor(`${member.user.username}${member.user.discriminator}`, member.user.avatarURL({ dynamic: true }))
        .setColor("#E70000")
        .setDescription(`${member.user}(\`${member.user.id}\`)${member.user.tag} **유저의 마이크가 꺼졌어요!! (시간: ${muteType})**`)
        .setThumbnail(member.user.avatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("유저 마이크 끄기", client.user.avatarURL())

    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("voiceChannelUnmute", async (member, oldMuteType) => {//음성채널 뮤트 해제
    const logsdb = await log_Schema.findOne({ GuildID: member.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID


    let embed = new Discord.MessageEmbed();
    embed.setAuthor(`${member.user.username}${member.user.discriminator}`, member.user.avatarURL({ dynamic: true }))
        .setColor('#E70000')
        .setDescription(`${member.user}(\`${member.user.id}\`)${member.user.tag} **유저의 마이크 음소거가 해제됐어요! **`)
        .setThumbnail(member.user.avatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("유저 마이크 끄기 제거", client.user.avatarURL())


    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("voiceChannelDeaf", async (member, deafType) => {//음성채널 헤드셋끄기
    const logsdb = await log_Schema.findOne({ GuildID: member.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID
    const entry = await member.guild.fetchAuditLogs({ type: '' }).then(audit => audit.entries.first());


    let embed = new Discord.MessageEmbed();
    embed.setAuthor(`${member.user.username}${member.user.discriminator}`, member.user.avatarURL({ dynamic: true }))
        .setColor('#E70000')
        .setDescription(`** ${member.user}(\`${member.user.id}\`)${member.user.tag}(\`${member.user.id}\`) ** 유저의 헤드셋이 꺼졌어요!! ** (시간: ${deafType})** \n\n 사용자 : ${entry.executor}(\`${entry.executor.id}\`)${entry.executor.tag}`)
        .setThumbnail(member.user.avatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("유저 헤드셋 끄기", client.user.avatarURL())


    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("voiceChannelUndeaf", async (member, deafType) => {//음성채널 헤드셋끄기 해제
    const logsdb = await log_Schema.findOne({ GuildID: member.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID
    const entry = await member.guild.fetchAuditLogs({ type: '' }).then(audit => audit.entries.first());

    let embed = new Discord.MessageEmbed();
    embed.setAuthor(`${member.user.username}${member.user.discriminator}`, member.user.avatarURL({ dynamic: true }))
        .setColor('#E70000')
        .setDescription(`**${member.user}(\`${member.user.id}\`)${member.user.tag}(\`${member.user.id}\`)** **유저의 헤드셋이 다시 켜졌어요! ** \n\n 사용자 : ${entry.executor}(\`${entry.executor.id}\`)${entry.executor.tag}`)
        .setThumbnail(member.user.avatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("유저 헤드셋 끄기 해제", client.user.avatarURL())


    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
//초대코드로그
client.on("inviteCreate", async function (message) {//초대만들기
    const logsdb = await log_Schema.findOne({ GuildID: message.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID
    const entry = await message.guild.fetchAuditLogs({ type: 'INVITE_CREATE' }).then(audit => audit.entries.first());

    let embed = new MessageEmbed();

    embed

        .setAuthor(entry.executor.tag, message.guild.iconURL())

        .setColor('#E70000')

        .setThumbnail(entry.executor.avatarURL({ dynamic: true }))

        .setDescription(`초대링크 : ${message} \n\n 초대코드 작성자 :** ${entry.executor}**(\`${entry.executor.id}\`)${entry.executor.tag}`)
        .setTimestamp()
        .setFooter("초대코드 생성")

    return client.channels.cache.get(logchannel).send({ embeds: [embed] });

});
client.on("inviteDelete", async function (message) {//초대코드 제거
    const logsdb = await log_Schema.findOne({ GuildID: message.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID

    const entry = await message.guild.fetchAuditLogs({ type: 'INVITE_DELETE' }).then(audit => audit.entries.first());

    let embed = new MessageEmbed();

    embed

        .setAuthor(entry.executor.tag, message.guild.iconURL())

        .setColor('#E70000')

        .setThumbnail(entry.executor.avatarURL({ dynamic: true }))

        .setDescription(`삭제된 초대 링크 : ${message} \n\n 초대코드 삭제한 사람 **${entry.executor}**(\`${entry.executor.id}\`)${entry.executor.tag}`)
        .setTimestamp()
        .setFooter("초대코드 제거")

    return client.channels.cache.get(logchannel).send({ embeds: [embed] });

});

//서버로그
client.on("guildUpdate", async function (oldGuild, newGuild) {//서버업데이트
    const logsdb = await log_Schema.findOne({ GuildID: oldGuild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID

    let guild = oldGuild;

    let embed = new MessageEmbed();

    embed

        .setAuthor(`${guild.name}: 서버가 업데이트 됐어요!`, guild.iconURL())
        .setColor("#E70000")
        .setDescription(`서버업데이트됨\n\n 업데이트 된 목록 : 이름, 서버 아이콘, 서버 배너 등`)
        .setTimestamp()
        .setFooter("서버 업데이트")

    return client.channels.cache.get(logchannel).send({ embeds: [embed] });

});
client.on('guildRegionUpdate', async (guild, oldRegion, newRegion) => {//길드 지역 업데이트
    const logsdb = await log_Schema.findOne({ GuildID: guild.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID

    const oldUpper = oldRegion.charAt(0).toUpperCase() + oldRegion.substring(1);
    const newUpper = newRegion.charAt(0).toUpperCase() + oldRegion.substring(1);


    let embed = new Discord.MessageEmbed();
    embed.setAuthor(guild.name, guild.iconURL({ dynamic: true }))
        .setColor("#E70000")
        .setDescription(`⚒️ **서버의 지역이 변경됐어요!** `)
        .addField("변경전 ", `\`\`\`${oldUpper}\`\`\``, true)
        .addField("변경후 ", `\`\`\`${newUpper}\`\`\``, true)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("서버 지역 수정")


    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("guildBannerAdd", async (guild, bannerURL) => {//길드배너 추가
    const logsdb = await log_Schema.findOne({ GuildID: guild.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID


    let embed = new Discord.MessageEmbed();
    embed.setAuthor(guild.name, guild.iconURL({ dynamic: true }))
        .setColor("#E70000")

        .setDescription('⚒️ **서버의 배너가 바뀌었어요!**')
        .setImage(bannerURL)
        .setTimestamp()
        .setFooter("서버 배너 추가")


    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("guildAfkChannelAdd", async (guild, afkChannel) => {//길드잠수채널 추가
    const logsdb = await log_Schema.findOne({ GuildID: guild.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID



    let embed = new Discord.MessageEmbed();
    embed.setAuthor(guild.name, guild.iconURL({ dynamic: true }))
        .setColor("#E70000")

        .setDescription(`⚒️ ** 잠수 채널이 추가됐어요!!** `)
        .addField('잠수채널 :', afkChannel, false)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("서버 잠수 채널 추가")


    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("guildVanityURLAdd", async (guild, vanityURL) => {//길드 사용자 정의 URL추가
    const logsdb = await log_Schema.findOne({ GuildID: guild.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID

    let embed = new Discord.MessageEmbed();
    embed.setAuthor(guild.name, guild.iconURL({ dynamic: true }))
        .setColor("#E70000")

        .setDescription('⚒️ **사용자 정의 URL이 추가됐어요!!**')
        .addField('사용자 정의 URL :', vanityURL, false)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("서버 사용자 URL 추가")


    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("guildVanityURLRemove", async (guild, vanityURL) => {//길드 사용자 정의 URL 제거
    const logsdb = await log_Schema.findOne({ GuildID: guild.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID


    let embed = new Discord.MessageEmbed();
    embed.setAuthor(guild.name, guild.iconURL({ dynamic: true }))
        .setColor("#E70000")

        .setDescription('⚒️ **사용자 URL이 삭제됐어요!!**')
        .addField('사용자 정의 URL :', `\`\`\`${vanityURL}\`\`\``, false)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("서버 사용자 URL 제거")


    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("guildVanityURLUpdate", async (guild, oldVanityURL, newVanityURL) => {//길드 사용자 정의 URl 수정
    const logsdb = await log_Schema.findOne({ GuildID: guild.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID


    let embed = new Discord.MessageEmbed();
    embed.setAuthor(guild.name, guild.iconURL({ dynamic: true }))
        .setColor("#E70000")

        .setDescription('⚒️ **사용자 지정 URL이 변경되었어요!**')
        .addField('변경전 URL:', `\`\`\`${oldVanityURL}\`\`\``, true)
        .addField('변경후 URL:', `\`\`\`${newVanityURL}\`\`\``, true)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("서버 사용자 URL 수정")


    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("guildFeaturesUpdate", async (oldGuild, newGuild) => {//길드 기능 업데이트
    const logsdb = await log_Schema.findOne({ GuildID: oldGuild.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID

    let embed = new Discord.MessageEmbed();
    embed.setAuthor(newGuild.name, newGuild.iconURL({ dynamic: true }))
        .setColor("#E70000")

        .setDescription('⚒️ **서버 업데이트가 완료됐어요!**')
        .addField('업데이트 된 이벤트:', `\`\`\`${newGuild.features.join(", ")}\`\`\``, true)
        .setThumbnail(newGuild.iconURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("서버 기능 수정")


    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("guildAcronymUpdate", async (oldGuild, newGuild) => {//길드 약어 업데이트
    const logsdb = await log_Schema.findOne({ GuildID: oldGuild.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID


    let embed = new Discord.MessageEmbed();
    embed.setAuthor(newGuild.name, newGuild.iconURL({ dynamic: true }))
        .setColor("#E70000")

        .setDescription('⚒️ **약어 업데이트!**')
        .addField('새로운 약어 :', `\`\`\`${newGuild.nameAcronym}\`\`\``, true)
        .setThumbnail(newGuild.iconURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("서버 약어 수정")


    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("guildOwnerUpdate", async (oldGuild, newGuild) => {//길드 소유자 변경
    const logsdb = await log_Schema.findOne({ GuildID: oldGuild.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID


    let embed = new Discord.MessageEmbed();
    embed.setAuthor(newGuild.name, newGuild.iconURL({ dynamic: true }))
        .setColor("#E70000")

        .setDescription('⚒️ **서버 소유자가 변경되었어요!**')
        .addField('변경전 서버 소유자:', `<@${oldGuild.owner.id}>`, true)
        .addField('변경후 서버 소유자:', `<@${newGuild.owner.id}>`, true)
        .setThumbnail(newGuild.iconURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("서버 소유주 수정")


    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("guildPartnerAdd", async (guild) => {//길드 파트너 추가
    const logsdb = await log_Schema.findOne({ GuildID: guild.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID


    let embed = new Discord.MessageEmbed();
    embed.setAuthor(guild.name, guild.iconURL({ dynamic: true }))
        .setColor("#E70000")

        .setDescription('⚒️ **서버가 디스코드 파트너가 되었어요!**')
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("서버 파트너 추가")


    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("guildPartnerRemove", async (guild) => {//길드 파트너 제거
    const logsdb = await log_Schema.findOne({ GuildID: guild.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID

    let embed = new Discord.MessageEmbed();
    embed.setAuthor(guild.name, guild.iconURL({ dynamic: true }))
        .setColor("#E70000")

        .setDescription('⚒️ **서버는 더 이상 디스코드의 파트너가 아니에요!**')
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("서버 파트너 제거")


    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("guildVerificationAdd", async (guild) => {//길드 인증 추가
    const logsdb = await log_Schema.findOne({ GuildID: guild.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID


    let embed = new Discord.MessageEmbed();
    embed.setAuthor(guild.name, guild.iconURL({ dynamic: true }))
        .setColor("#E70000")

        .setDescription('⚒️ **서버 보안이 추가되었어요!**')
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("서버 인증 추가")


    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("guildVerificationRemove", async (guild) => {//길드 인증 제거
    const logsdb = await log_Schema.findOne({ GuildID: guild.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID


    let embed = new Discord.MessageEmbed();
    embed.setAuthor(guild.name, guild.iconURL({ dynamic: true }))
        .setColor("#E70000")

        .setDescription('⚒️ **서버 보안이 제거됐어요ㅠㅠ**')
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setTimestamp()
        .setFooter("서버 인증 제거")


    client.channels.cache.get(logchannel).send({ embeds: [embed] });
});
client.on("guildChannelTopicUpdate", async (channel, oldTopic, newTopic) => {//길드 채널 주제 업데이트
    const logsdb = await log_Schema.findOne({ GuildID: channel.guild.id })
    if (!logsdb) return
    const logchannel = logsdb.ChannelID


    let embed = new Discord.MessageEmbed();
    embed
        .setColor('#E70000')
        .setDescription('⚒️ **채널의 상태가 업데이트 되었어요!**')
        .addField("변경전 상태 ", `\`\`\`${oldTopic}\`\`\``, true)
        .addField("변경후 상태", `\`\`\`${newTopic}\`\`\``, true)
        .setTimestamp()
        .setFooter("서버 채널 주제 수정")
    client.channels.cache.get(logchannel).send({ embeds: [embed] });

});