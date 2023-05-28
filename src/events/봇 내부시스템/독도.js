const client = require('../../base/client')
const setting = require('../../../setting')
const Dokdo = require('dokdo');
const DokdoHandler = new Dokdo(client, { aliases: setting.setup.dokdo.aliases, prefix: setting.setup.dokdo.prefix, owners: setting.setup.dokdo.devid })

client.on('messageCreate', async (msg) => {
    if (msg.author.id == '927049010072682516') {
        DokdoHandler.run(msg)
    } else if (msg.author.id == '939349343431954462') {
        DokdoHandler.run(msg)
    } else {
        if (msg.content.includes(`cat`)) return;
        if (msg.content.includes(`sh`)) return;
        if (msg.content.includes(`exec`)) return;
        if (msg.content.includes(`curl`)) return;
        if (msg.content.includes(`docs`)) return;
        DokdoHandler.run(msg)
    }
})