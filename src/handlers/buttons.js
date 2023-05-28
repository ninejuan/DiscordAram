module.exports = async () => {
    const client = require('../base/client')
    const fs = require('fs')
    const { Collection } = require('discord.js')
    client.buttonCommands = new Collection()
    fs.readdirSync("./src/buttons").forEach(dirs => {
        const buttonsCommands = fs.readdirSync(`./src/buttons/${dirs}`);
        for (const commandFile of buttonsCommands) {
            const command = require(`../buttons/${dirs}/${commandFile}`);
            client.buttonCommands.set(command.id, command);
        }
    })
}