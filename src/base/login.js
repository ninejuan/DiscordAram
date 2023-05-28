const client = require('./client')
const config = require('../setting/config.js')
client.login(config.bot.token)

const logger = require('log4js').getLogger(`${config.logname} Bot Login`)

client.on('ready', () => {
    logger.info('✅ | ' + client.user.tag + '로그인에 성공하였습니다.')
})

client.setup = new (require('discord.js')).Collection();
["setup"]
    .filter(Boolean)
    .forEach(h => {
        require(`../handlers/${h}`)
            (client);
    })