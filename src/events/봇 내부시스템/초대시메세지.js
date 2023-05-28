const { MessageEmbed } = require('discord.js')
const client = require('../../base/client');
client.on('guildCreate', (guild) => {
    let channelToSend;
    
        guild.channels.cache.forEach((channel) => {
            if (
                channel.type === 'GUILD_TEXT' && !channelToSend
            ) {channelToSend = channel;}
        });
    
        if(!channelToSend) return;
        const embed = new MessageEmbed()
        .setTitle(`<:next_array:1006582763463381124> 아람이를 ${guild.name}에 초대해주셔서 감사해요 <:array:1006527855112495114>`)
        .addFields(
            { name: '<:array:1006527855112495114> 권한', value: '**[관리자]** -> 아람이 서비스를 빠르게 이용하기 위해 필요해요'},
            { name: '<:array:1006527855112495114> :globe_with_meridians: 웹 대시보드', value: `[웹 대시보드 이동하기](https://aramy.net)`},
            { name: '<:array:1006527855112495114> 서포트', value: `[서포트 서버](https://aramy.net/i/laon)`}
        )
        .setDescription(`개발자는 문제 발생 시 이 서버에 들어올 수 있어요.`)
        .setFooter({
            text: '아람이',
            iconURL: client.user.displayAvatarURL()
        })
        channelToSend.send({ embeds: [embed] })
    })
    