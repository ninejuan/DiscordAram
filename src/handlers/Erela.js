module.exports = async () => {
    const client = require('../base/client')
    const { Manager } = require("erela.js")
    const config = require("../setting/config")
    const logger = require('log4js').getLogger(`${config.logname} Erela`)
    const comma = require('comma-number')
    const nodes = [
        {
            host: '127.0.0.1',
            password: '0000',
            port: 2333,
        }
    ];
    client.manager = new Manager({
        nodes,
        send: (id, payload) => {
            const guild = client.guilds.cache.get(id);
            if (guild) guild.shard.send(payload);
        }
    });

    client.manager.on("nodeConnect", node => {
        logger.info(`LavaLink "${node.options.identifier}" 접속 성공!`)
    })

    client.manager.on("nodeError", (node, error) => {
        logger.info(`LavaLink "${node.options.identifier}" 오류가 발생했습니다. : ${error.message}.`)
    })

    client.once("ready", () => {
        client.manager.init(client.user.id);
    });

    client.on("raw", d => client.manager.updateVoiceState(d));

    const { format } = require('../functions/format')
    const logger2 = require('log4js').getLogger(`${config.logname} Music`)

    client.manager.on("trackStart", async (player, track) => {
        const channel = client.channels.cache.get(player.textChannel);
        let playl = new (require('discord.js')).MessageEmbed()
            .setColor("BLUE")
            .setTitle("🎶 노래를 재생합니다! 🎶")
            .setURL(`${track.uri}`)
            .setDescription(`${config.emoji.체크}` + `\`${track.title}\`` + `(이)가 지금 재생되고 있습니다!`)
            .addField("길이", `\`${format(track.duration).split(" | ")[0]}\` | \`${format(track.duration).split(" | ")[1]}\``, true)
            .addField("게시자", `${track.author}`, true)
            .setThumbnail(`${track.thumbnail}`)
        channel.send({ embeds: [playl] })
    })
    client.on('ready', msg => {
        logger2.info(`✅ | 뮤직 재생 시스템`);
    })
    client.manager.on("queueEnd", async (player, track) => {
        const channel = client.channels.cache.get(player.textChannel);
        let playl = new (require('discord.js')).MessageEmbed()
            .setColor("BLUE")
            .setTitle("끝!")
            .setDescription(`노래가 끝났어요!`)
        channel.send({ embeds: [playl] })
    })
    // client.on('ready', msg => {
    //     logger2.info(`✅ | 뮤직 노래 끝`);
    // })
};