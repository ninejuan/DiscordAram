module.exports = () => {
    const client = require('../base/client')
    const config = require('../setting/config')
    const logger = require('log4js').getLogger(`${config.logname} Setup`);
    require('discord-modals')(client)
    const settings = require('../setting/settings.json')
    const Discord = require('discord.js')
    client.message = new Discord.Collection();
    client.slash = new Discord.Collection();
    client.events = new Discord.Collection();
    client.buttons = new Discord.Collection();
    client.logs = new Discord.Collection();
    client.mongo = new Discord.Collection();
    client.music = new Discord.Collection();

    ["events", "message", "slash", "buttons", "mongo", "logs", "Select", "Erela", settings.antiCrash ? "antiCrash" : null]
        .filter(Boolean)
        .forEach(h => {
            require(`./${h}`)(client);
        })
    client.on('ready', async () => {
        logger.info('✅ | Setup.js 파일을 정상적으로 로딩하였습니다.')
    })
};