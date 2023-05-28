const config = require('../../setting/config')
const client = require('../../base/client')
const hexcolor = require('../../base/hexcolor')
const pagination = require("discord.js-pagination");
const { MessageEmbed } = require('discord.js')
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    let MusicPrefix = config.cmd.Music
    if (!message.content.startsWith(MusicPrefix)) return;
    const args = message.content.slice(MusicPrefix.length).trim().split(" ");
    const cmd = args.shift()?.toLowerCase();
    if (cmd === "volume" || cmd === "v" || cmd === "vol" || cmd === "볼륨" || cmd === "소리") {
        if (!args[0]) return;
        const channel = message.member.voice.channel;
        if (!channel) {
            const embed = new MessageEmbed()
                .setTitle("<a:warning:977576443590610944>ㅣ오류ㅣ<a:okcheck:977576443410268190>")
                .setDescription("보이스 채널에 들어가서 명령어를 사용해줘!")
                .setColor(hexcolor.red2)
                .setTimestamp()

            return message.channel.send({ embeds: [embed] })
        }
        const amount = parseInt(args[0])
        if (amount > 100) {
            const embed = new MessageEmbed()
                .setTitle("<a:warning:977576443590610944>ㅣ오류")
                .setDescription("볼륨을 100 이상으로 올릴 수 없어!")
                .setColor(hexcolor.red2)
                .setTimestamp()

            return message.channel.send({ embeds: [embed] })
        }
        if (amount < 1) {
            const embed = new MessageEmbed()
                .setTitle("<a:warning:977576443590610944>ㅣ오류")
                .setDescription("볼륨은 최소 1이상 이여야 해!")
                .setColor(hexcolor.red2)
                .setTimestamp()

            return message.channel.send({ embeds: [embed] })
        }
        const queue = distube.getQueue(message.guild.id);
        if (!queue.songs.length) {
            const embed = new MessageEmbed()
                .setTitle("<a:warning:977576443590610944>ㅣ오류")
                .setDescription("현재 재생중인 곡이 없어!")
                .setColor(hexcolor.red2)
                .setTimestamp()

            return message.channel.send({ embeds: [embed] })
        }
        queue.setVolume(amount)

        const embed = new MessageEmbed()
            .setTitle("🔈ㅣ볼륨 조절")
            .setDescription(`볼륨이 ${amount}% 으로 조정됐어!`)
            .setColor(hexcolor.sky)
            .setTimestamp()

        return message.channel.send({ embeds: [embed] })
    } else if (cmd === "queue" || cmd === "큐" || cmd === "q") {
        const queue = distube.getQueue(message.guild.id)
        const channel = message.member.voice.channel
        if (!channel) {
            const embed = new MessageEmbed()
                .setTitle("<a:warning:977576443590610944>ㅣ오류")
                .setDescription("보이스 채널에 들어가서 명령어를 사용해줘!")
                .setColor(hexcolor.red2)
                .setTimestamp()

            return message.channel.send({ embeds: [embed] })
        }
        if (!queue) {
            const embed = new MessageEmbed()
                .setTitle("<a:warning:977576443590610944>ㅣ오류")
                .setDescription("현재 재생중인 곡이 없어!")
                .setColor(hexcolor.red2)
                .setTimestamp()

            return message.channel.send({ embeds: [embed] })
        }
        if (queue.playing) {
            const embedsc = queue.songs.map((song, index) => {
                return `${index + 1}. ${song.name} - \`${song.formattedDuration}\``
            })

            const queuepage1 = new MessageEmbed()
                .setTitle("✏️ㅣ큐")
                .setDescription(embedsc.slice(0, 25).join("\n"))
                .setColor(hexcolor.blue)
                .setFooter(`${queue.songs.length}개의 음악이 대기열에 있어!`)
                .setTimestamp()

            const queuepage2 = new MessageEmbed()
                .setTitle("✏️ㅣ큐")
                .setDescription(embedsc.slice(25, 50).join("\n") || "이 페이지는 비어있어!\n 25개 이하는 1페이지에 있어!")
                .setColor(hexcolor.blue)
                .setFooter(`${queue.songs.length}개의 음악이 대기열에 있어!`)
                .setTimestamp()

            const queuepage3 = new MessageEmbed()
                .setTitle("✏️ㅣ큐")
                .setDescription(embedsc.slice(50, 75).join("\n") || "이 페이지는 비어있어!\n 50개 이하는 2페이지에 있어!")
                .setColor(hexcolor.blue)
                .setFooter(`${queue.songs.length}개의 음악이 대기열에 있어!`)
                .setTimestamp()

            const queuepage4 = new MessageEmbed()
                .setTitle("✏️ㅣ큐")
                .setDescription(embedsc.slice(75, 100).join("\n") || "이 페이지는 비어있어!\n 75개 이하는 3페이지에 있어!")
                .setColor(hexcolor.blue)
                .setFooter(`${queue.songs.length}개의 음악이 대기열에 있어!`)
                .setTimestamp()

            const embedPage = [queuepage1, queuepage2, queuepage3, queuepage4]

            const emoji = ["👈", "👉"]
            const timeout = '30000'

            pagination(message, embedPage, emoji, timeout)
        }
    } else if (cmd === "nowplaying" || cmd === "np" || cmd === "재생중" || cmd === "현재곡") {
        const queue = distube.getQueue(message.guild.id)
        if (!queue.songs.length) {
            const embed = new MessageEmbed()
                .setTitle("<a:warning:977576443590610944>ㅣ오류")
                .setDescription("현재 재생중인 곡이 없어!")
                .setColor(hexcolor.red2)
                .setTimestamp()

            return message.channel.send({ embeds: [embed] })
        }
        const song = queue.songs[0]
        const embed = new MessageEmbed()
            .setTitle("🎵ㅣ현재 재생중...")
            .setDescription(`${song.name}`)
            .addFields(
                { name: "아티스트", value: song.uploader.name },
                { name: "재생/길이", value: `${queue.formattedCurrentTime}/${song.formattedDuration}` },
                { name: "조회수", value: `${song.views.toLocaleString()}` },
                { name: "같이 듣기", value: `[${song.name} 유튜브에서 시청하기!](${song.url})` },
            )
            .setTimestamp()
            .setColor(hexcolor.mint)
            .setThumbnail(song.thumbnail)

        return message.channel.send({ embeds: [embed] })
    } else if (cmd === "help" || cmd === "h" || cmd === "도움말" || cmd === "도움" || cmd === "명령어") {
        const helpembed1 = new MessageEmbed()
            .setTitle("📝ㅣ도움말")
            .setDescription("다음장을 눌러서 명령어를 확인해봐!")
            .setColor(hexcolor.green3)
            .setTimestamp()

        const helpembed2 = new MessageEmbed()
            .setTitle("📝ㅣ도움말")
            .addFields(
                { name: "play", value: "음악을 재생해!" },
                { name: "stop", value: "음악을 정지해!" },
                { name: "skip", value: "음악을 넘겨!" },
                { name: "queue", value: "현재 큐를 보여줘!" },
                { name: "volume", value: "볼륨을 조절해!" },
                { name: "loop", value: "반복을 설정해!" },
                { name: "ping", value: "핑을 보여줘!" },
                { name: "pause", value: "음악을 일시정지해!" },
                { name: "resume", value: "음악을 이어서 재생해!" },
                { name: "nowplaying", value: "현재 재생중인 음악의 정보를 보여줘!" },
            )
            .setColor(hexcolor.green3)
            .setTimestamp()

        const embedPage = [helpembed1, helpembed2]

        const emoji = ["👈", "👉"]
        const timeout = '30000'

        pagination(message, embedPage, emoji, timeout)

    } else if (cmd === "uptime" || cmd === "time" || cmd === "구동시간" || cmd === "가동시간" || cmd === "업타임") {
        const time = ms(client.uptime)

        let embed = new MessageEmbed()
            .setTitle("⏲️ㅣ구동 시간")
            .setDescription(`${time.days}일 ${time.hours}시간 ${time.minutes}분 ${time.seconds}초`)
            .setColor(hexcolor.pink2)
            .setTimestamp()

        return message.channel.send({ embeds: [embed] })

    } else if (cmd === "lyrics" || cmd === "가사" || cmd === "ly" || cmd === "rktk") {
        if (!message.content.startsWith(MusicPrefix)) return

        let singer;
        let song;
        let pages = []
        let current = 0

        const filter = msg => msg.author.id === message.author.id
        let options = {
            max: 1
        };

        message.channel.send(new MessageEmbed().setTitle("❓ㅣ질문 2번째중 1번째").setDescription("아티스트를 입력해 줘!").setColor(hexcolor.sky2).setTimestamp())
        let col = await message.channel.awaitMessages(filter, options)
        if (col.first().content === 'cancel') {
            const embed = new MessageEmbed()
                .setTitle("<:disallow:1006582767582203976> ㅣ취소")
                .setDescription("검색이 취소됐어!\n처음부터 다시 검색해줘!")
                .setColor(hexcolor.sky2)
                .setTimestamp()

            return message.channel.send({ embeds: [embed] })
        }
        singer = col.first().content

        message.channel.send(new MessageEmbed().setTitle("❓ㅣ질문 2번째중 2번째").setDescription("노래 제목을 입력해줘!").setColor(hexcolor.sky2).setTimestamp())
        let col2 = await message.channel.awaitMessages(filter, options)
        if (col2.first().content === 'cancel') {
            const embed = new MessageEmbed()
                .setTitle("<:disallow:1006582767582203976> ㅣ취소")
                .setDescription("검색이 취소됐어!\n처음부터 다시 검색해줘!")
                .setColor(hexcolor.sky2)
                .setTimestamp()

            return message.channel.send({ embeds: [embed] })
        }
        song = col2.first().content

        let res = await lyricsFinder(singer, song) || "검색 결과가 없어!"

        for (let i = 0; i < res.length; i += 1024) {
            const lyric = res.substring(i, Math.min(res.length, i + 1024));
            const msg = new MessageEmbed()
                .setTitle(`${song} 가사`)
                .setDescription(lyric)
                .setTimestamp()
            pages.push(msg)
        }

        const filter2 = (reaction, user) => ["👈", "👉"].includes(reaction.emoji.name) && (message.author.id == user.id)
        const embed = await message.channel.send(`가사 페이지: ${current + 1}/${pages.length}`, pages[current])
        await embed.react("👈")
        await embed.react("👉")

        let ReactionCol = embed.createReactionCollector(filter2)

        ReactionCol.on('collect', (reaction, user) => {
            reaction.users.remove(reaction.users.cache.get(message.author.id))
            if (reaction.emoji.name == "👉") {
                if (current < pages.length - 1) {
                    current += 1
                    embed.edit(`가사 페이지: ${current + 1}/${pages.length}`, pages[current])
                }
            } else {
                if (reaction.emoji.name === '👈') {
                    if (current !== 0) {
                        current -= 1
                        embed.edit(`가사 페이지: ${current + 1}/${pages.length}`, pages[current])
                    }
                }
            }
        })
    }
})