const http = require('https');
const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch')
const key = "fi9maPnzn966W0t8SJI2xCjXgUIIuZWS";
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "업로드",
    async run(message) {
        if (!message.author.id == require('../../../setting/config').bot.dev.id) return ;
        if (message.attachments.first()) {
            let file = await fs.createWriteStream(message.attachments.first().name);
            await http.get(message.attachments.first().url, async function (res) {
                await res.pipe(file);
                let up_file = await fs.createReadStream(message.attachments.first().name);
                const form = new FormData();
                form.append('file', up_file, {
                    name: 'file'
                });
                form.append('key', key, {
                    name: 'key'
                });
                let req = await fetch('https://api.upload.systems/images/upload/', {
                    method: 'POST',
                    body: form,
                });
                let json = await req.json()
                const embed = new MessageEmbed()
                .setColor(require('../../../base/hexcolor').invisible)
                .setTitle(`${json.url}`)
                .setDescription(`사진 업로드를 완료했어요!`)
                await message.reply({ embeds: [embed] })
            })
        } else if (!message.attachments.first()) {
            const embed = new MessageEmbed()
            .setColor(require('../../../base/hexcolor').red2)
            .setTitle(`사진도 **같이** 올려주세요`)
            return message.reply({ embeds: [embed] })
        }
    }
}