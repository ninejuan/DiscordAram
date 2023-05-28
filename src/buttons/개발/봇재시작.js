const client = require('../../base/client')
const config = require('../../setting/config')
const wait = require('node:timers/promises').setTimeout;
const logger = require('log4js').getLogger(`${config.logname} System`);
module.exports = {
    id: "bot-reload",
    async run(interaction) {
        if (!interaction.user.id == config.bot.dev) return ;
        logger.info(`${interaction.user.tag}(${interaction.user.id})에 의해 봇 재시작중`)
        interaction.reply({
            embeds: [
                new (require('discord.js')).MessageEmbed()
                    .setColor(config.embed.color)
                    .setDescription(`봇을 재시작 중입니다.`)
            ], ephemeral: true
        })
        await wait(1000)
        process.exit();
    },
};