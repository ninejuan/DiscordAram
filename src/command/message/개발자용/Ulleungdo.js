const client = require('../../../base/client')
const { SlashCommandBuilder , time} = require("@discordjs/builders");
const { MessageActionRow, MessageButton , MessageEmbed, MessageAttachment } = require("discord.js");
const Discord = require('discord.js');
const hc = require('../../../base/hexcolor')
const system = require('../../../functions/system')
const DateFormatting = require('../../../functions/DateFormatting')
const { exec } = require('child_process');

module.exports = {
    name: "울릉도",
    async run(message, args) {
        if (!message.author.id == '927049010072682516' || !message.author.id == '939349343431954462' || !message.author.id == '907983184904482836' || !message.author.id == '761561385477341185') return ;
        if (args[0] == 'sh') {
            if (!args[1]) {
                const embed = new MessageEmbed()
                .setTitle('<:disallow:1006582767582203976> 실행할 명령어가 보이지 않아요')
                .setColor(require('../../../base/hexcolor').invisible)
                message.react('<:disallow:1006582767582203976>')
                return message.reply({ embeds: [embed]})
            } else if (args[1]) {
                let argument = args.join(' ')
                const shell = process.env.SHELL || (process.platform === 'win32' ? 'powershell' : null)
                if (!shell) return message.channel.send('Sorry, we are not able to find your default shell.\nPlease set `process.env.SHELL`.')
                let command = argument.slice(3)
                exec(command, (err, res) => {

                    const stdout = res.slice(0, 2000)
                    if(res.length > 2000) {
                        message.react('<:allow:1006582759592046702> ')
                        return message.reply({ files: [new MessageAttachment(Buffer.from(res), "output.txt")] })
                    }
                
                
                    if(err) {
                        const embed = new MessageEmbed()
                        .setTitle("⚠️ㅣ오류")
                        .setDescription(`명령어를 처리하는 도중에 오류가 발생하였어요\n오류코드: ${iconv.decode}`)
                        .setColor(0xff4444)
                        .setTimestamp()
                        message.react('⚠️')
                        return message.reply({ embeds: [embed] })
                    }
                    message.react('<:allow:1006582759592046702> ')
                    message.reply("```\n" + stdout + "\n```")
                })
            }
        } else if (!args[0]) {
            let MongoClient = require('mongodb').MongoClient
            let ping_stat;
            let ping = client.ws.ping
            if (599 < ping) ping_stat = '<:dnd:1006586196224376873>'
            if (199 < ping < 600) ping_stat = `<:idle:1006586198451556378>`
            if (ping < 200) ping_stat = '<:online:1006586200691310702>';
            const cache = `${client.guilds.cache.size} guild(s) and ${client.users.cache.size} user(s)`
            if (client.shard) {

                const guilds = await client.shard.fetchClientValues('guilds.cache.size').then(r => r.reduce((prev, val) => prev + val, 0))
                const embed = new MessageEmbed()
                .setColor(hc.invisible)
                .setDescription(`
                    ${require('../../../../package.json').name} v${require('../../../../package.json').version}, discord.js \`${require('discord.js').version}\`, Node.js \`${process.version}\` on \`${process.platform}\`
                    Process started at ${DateFormatting.relative(system.processReadyAt())}, bot was ready at ${DateFormatting.relative(client.readyAt)}.
            
                    <:array:1006527855112495114> Using \`${system.memory().rss}\`, PID \`${process.pid}\` for this client, PID \`${process.ppid}\` for the parent process <:next_array:1006582763463381124>

                    <:array:1006527855112495114> Ping Status: ${ping_stat} || \`${client.ws.ping}ms\` <:next_array:1006582763463381124>
                    <:array:1006527855112495114> Shard Info: <:allow:1006582759592046702>  **${Array.isArray(client.shard.shards) ? client.shard.shards.length : client.shard.count}** shards <:next_array:1006582763463381124>

                    Can see ${cache} in this client.
                `)
                return message.reply({ embeds: [embed] })
            }

            const embed = new MessageEmbed()
            .setColor(hc.invisible)
            .setDescription(`
                ${require('../../../../package.json').name} v${require('../../../../package.json').version}, discord.js \`${require('discord.js').version}\`, Node.js \`${process.version}\` on \`${process.platform}\`
                Process started at ${DateFormatting.relative(system.processReadyAt())}, bot was ready at ${DateFormatting.relative(client.readyAt)}.
                
                <:array:1006527855112495114> Using \`${system.memory().rss}\`, PID \`${process.pid}\` <:next_array:1006582763463381124>

                <:array:1006527855112495114> Ping Status: ${ping_stat} || \`${client.ws.ping}ms\` <:next_array:1006582763463381124> 
                <:array:1006527855112495114> Shard: <:disallow:1006582767582203976> <:next_array:1006582763463381124>

                This bot is not sharded and can see ${cache}.
            `)
            message.reply({embeds: [embed]})
            // const { system, DateFormatting } = require('../../../functions')
            // let summary = `Aram v${require('../../../../package.json').version}, discord.js \`${Discord.version}\`, \`Node.js ${process.version}\` on \`${process.platform}\`\nProcess started at ${DateFormatting.relative(system.processReadyAt())}, bot was ready at ${DateFormatting.relative(client.readyAt)}.\n`

            // summary += `\nUsing ${system.memory().rss} at this process.\n`
        
            // if (client.shard) {
            //   const guilds = await client.shard.fetchClientValues('guilds.cache.size').then(r => r.reduce((prev, val) => prev + val, 0))
            //   summary += `Running on PID ${process.pid} for this client, and running on PID ${process.ppid} for the parent process.\n\nThis bot is sharded in ${Array.isArray(parent.client.shard.shards) ? parent.client.shard.shards.length : parent.client.shard.count} shard(s) and running in ${guilds} guild(s).\nCan see ${cache} in this client.`
            // } else summary += `Running on PID ${process.pid}\n\nThis bot is not sharded and can see ${cache}.`
        
            // summary += `\nAverage websocket latency: ${client.ws.ping}ms`
            // message.reply(summary)
            function kill (res, signal) {
                if (process.platform === 'win32') return child.exec(`powershell -File "..\\utils\\KillChildrenProcess.ps1" ${res.pid}`, { cwd: __dirname })
                else return res.kill('SIGINT' || signal)
              }
        }
    }
}
/*
\<:array:1006527855112495114> 
\<:next_array:1006582763463381124> 
\<:allow:1006582759592046702> 
\<:disallow:1006582767582203976> 
\<:dnd:977422731584893008> 
\<:idle:977422763721642064> 
\<:online:977422792305819688> 
*/