module.exports = async () => {
    const client = require('../base/client')
    const fs = require('fs')
    const { Collection } = require('discord.js')
    client.selectCommands = new Collection()
    fs.readdirSync("./src/SelectMenu").forEach(dirs => {
        const selectCommands = fs.readdirSync(`./src/SelectMenu/${dirs}`);
        for (const commandFile of selectCommands) {
            const command = require(`../SelectMenu/${dirs}/${commandFile}`);
            client.selectCommands.set(command.id, command);
        }
    })
}