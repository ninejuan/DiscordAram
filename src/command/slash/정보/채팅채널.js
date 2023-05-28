const client = require("../../../base/client")
const Levels = require('discord-xp')
const config = require('../../../setting/config')
const Canvas = require('canvas')
Canvas.registerFont('./src/base/font/NanumGothicBold.ttf', { family: 'NanumGothic', style: 'Bold' })
const { MessageAttachment, MessageEmbed } = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("채팅랭킹")
        .setDescription("해당 서버의 채팅 랭킹을 보여드려요!")
        .addStringOption(option => option
            .setName("확인")
            .setDescription("나 또는 다른 사람의 랭킹을 확인해요!")
            .addChoices(
                { name: `정보`, value: `정보` },
                { name: `랭킹`, value: `랭킹` },
            )
            .setRequired(true))
        .addUserOption(option => option
            .setName("유저")
            .setDescription("선택한 유저의 랭킹 정보를 확인해요!")),
    /**
   * @param { CommandInteraction } Interaction
   */
    async run(interaction) {
        const 확인 = interaction.options.getString("확인")

        if (확인 === "랭킹") {
            const ranking_find = await Levels.fetchLeaderboard(interaction.guild.id, 10)
            if (ranking_find < 1) return interaction.reply({ content: `${interaction.guild.name}의 랭킹 데이터가 존재하지 없어요!`, ephemeral: true })
            const ranking = await Levels.computeLeaderboard(client, ranking_find)
            const lb = ranking.map(r => `${r.position}. ${r.username}#${r.discriminator}\n레벨 : ${r.level.toLocaleString()}\n경험치 : ${r.xp.toLocaleString()}`)
            const embed = new (require("discord.js")).MessageEmbed().setColor("RANDOM").setTimestamp()
            embed.setTitle(`[ ${interaction.guild.name} ] 채팅채널 랭킹`)
            embed.setThumbnail(interaction.guild.iconURL())
            embed.setDescription(`**${lb.join("\n\n")}**`)
            interaction.reply({ embeds: [embed] })
        }
        if (확인 === "정보") {
            let find // 유저 검색
            let 유저
            if (interaction.options.getMember("유저")) {
                유저 = interaction.options.getMember("유저").id
                find = await Levels.fetch(유저, interaction.guild.id)
                if (!find) return interaction.reply({ content: "해당 유저의 정보가 존재하지 않아요.", ephemeral: true })
            } else {
                find = await Levels.fetch(interaction.member.user.id, interaction.guild.id)
                if (!find) return interaction.reply({ content: "본인 정보가 없습니다. 채팅을 입력하시면 자동으로 생성됩니다.", ephemeral: true })
            }

            let searchuser = client.users.cache.get(find.userID) // 유저 정보
            let infoname = searchuser.tag // 유저 닉네임(태그 포함)
            let infolevel = find.level // 유저 현재 레벨
            let infoxp = find.xp // 유저 현재 경험치
            const ranking_find = await Levels.fetchLeaderboard(interaction.guild.id, 100)
            const ranking = await Levels.computeLeaderboard(client, ranking_find)
            const lb = ranking.map(r => {
                if (r.username === searchuser.username) return `${r.position}`
            })
            const rank = lb.join("") // 유저 랭크

            const canvas = Canvas.createCanvas(700, 270)
            const context = canvas.getContext('2d')
            context.strokeStyle = '#0099ff'
            context.strokeRect(0, 0, canvas.width, canvas.height)
            // 백그라운드 --------------------------------------------------------------
            const background = await Canvas.loadImage('./src/base/image-data/chat-background.png')
            context.drawImage(background, 0, 0, canvas.width, canvas.height)
            // ------------------------------------------------------------------------
            // 경험치바 ----------------------------------------------------------------
            context.beginPath()
            context.strokeStyle = "white"
            context.stroke()
            context.lineJoin = "round"
            context.lineWidth = 35
            let bar_width = 396
            context.strokeRect(260, 238, bar_width, 4)
            context.strokeStyle = "#ffe8a8"
            context.strokeRect(262, 240, bar_width - 3, 0)
            context.strokeStyle = "#ffb625"
            context.strokeRect(262, 240, bar_width * infoxp / Levels.xpFor(infolevel + 1), 0)
            context.closePath()
            // -------------------------------------------------------------------------
            // 글자 -------------------------------------------------------------------
            // 닉네임
            context.textAlign = "center"
            context.font = nickText(canvas, `${infoname}`) // 닉네임 부분
            context.fillStyle = '#000000'
            context.fillText(`${infoname}`, 472, 104)
            // 랭크
            context.textAlign = "center"
            if (rank <= 10) {
                context.fillStyle = '#ff7911'
            } else {
                context.fillStyle = '#000000'
            }
            context.font = `30px NanumGothic`
            if (rank) {
                context.fillText(`${rank}등`, 563, 164)
            } else {
                context.fillText("100+등", 563, 164)
            }
            // 레벨
            context.fillStyle = '#ffffff'
            context.textAlign = "center"
            context.font = levelText(canvas, infolevel)
            context.fillText(infolevel, 313, 210)
            // 진행률
            context.fillStyle = '#ffffff'
            context.textAlign = "center"
            context.font = `16px NanumGothic`
            context.fillText(`${((infoxp * 100) / Levels.xpFor(infolevel + 1)).toFixed(0)}%`, 478, 210)
            // 경험치
            context.fillStyle = '#ffffff'
            context.textAlign = "center"
            context.font = expText(canvas, `${infoxp}XP`)
            context.fillText(`${infoxp}XP`, 636, 210)
            // -------------------------------------------------------------------------
            // 아바타 -----------------------------------------------------------------
            const avatar = await Canvas.loadImage((interaction.options.getMember("유저") || interaction.member.user).displayAvatarURL({ format: 'png', dynamic: true }))
            context.beginPath()
            context.arc(125, 125, 100, 0, Math.PI * 2, true)
            context.closePath()
            context.clip()
            context.drawImage(avatar, 25, 25, 200, 200)
            //-------------------------------------------------------------------------
            const rank_image = new MessageAttachment(canvas.toBuffer(), 'chat-profile.png')
            const embed = new MessageEmbed()
                .setColor(config.embed.color)
                .setImage('attachment://chat-profile.png')
            interaction.reply({ embeds: [embed], files: [rank_image] })
        }
    }
}

const nickText = (canvas, text) => { // 닉네임 폰트 함수
    const context = canvas.getContext('2d');
    let fontSize = 40;
    do {
        context.font = `${fontSize -= 5}px NanumGothic`;
    } while (context.measureText(text).width > 339);
    return context.font;
}

const levelText = (canvas, text) => { // 레벨 폰트 함수
    const context = canvas.getContext('2d');
    let fontSize = 16;
    do {
        context.font = `${fontSize -= 1}px NanumGothic`;
    } while (context.measureText(text).width > 57);
    return context.font;
}

const expText = (canvas, text) => { // 경험치 폰트 함수
    const context = canvas.getContext('2d');
    let fontSize = 16;
    do {
        context.font = `${fontSize -= 1}px NanumGothic`;
    } while (context.measureText(text).width > 68);
    return context.font;
}