module.exports = async () => {
    const client = require('../base/client')
    const fs = require('fs')
    const { Collection, MessageEmbed } = require('discord.js')
    const config = require('../setting/config')
    const logger = require('log4js').getLogger(`${config.logname} Command - message`);
    client.commands = new Collection()
    fs.readdirSync(`./src/command/message`).forEach(dirs2 => {
        const commandsFile = fs.readdirSync(`./src/command/message/${dirs2}/`).filter(file => file.endsWith('.js'))
        for (const file of commandsFile) {
            const command = require(`../command/message/${dirs2}/${file}`)
            logger.info(`현재 로드중인 명령어 파일 : ${dirs2}/${file}`);
            client.commands.set(command.name, command)
        }
    })
    client.on('ready', async () => {
        logger.info(`✅ | 메세지 핸들러`);
    })

};