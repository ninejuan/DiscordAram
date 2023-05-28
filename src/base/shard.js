const config = require('../setting/config')
const manager = new (require('discord.js')).ShardingManager('./src/base/login.js', {
    totalShards: 'auto',
    token: config.bot.token
});
const logger = require('log4js').getLogger(`${config.logname} Shard`)
manager.on('shardCreate', shard => logger.info(`로그인된 샤드 ${shard.id}`));
manager.spawn();