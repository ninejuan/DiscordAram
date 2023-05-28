const fs = require("fs");
module.exports = async () => {
    const config = require('../setting/config')
    const client = require('../base/client')
    fs.readdirSync(`./src/events`).forEach(dirs3 => {
        const eventFiles = fs.readdirSync(`./src/events/${dirs3}/`).filter(file => file.endsWith('.js'));
        eventFiles.forEach(file => {
            const event = require(`../events/${dirs3}/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.run(...args, client));
            } else {
                client.on(event.name, async (...args) => await event.run(...args, client));
            }
        })
    })
    const logger = require('log4js').getLogger(`${config.logname} Event`);
    client.on('ready', async () => {
        logger.log(`✅ | 이벤트 핸들러`);
    })
};