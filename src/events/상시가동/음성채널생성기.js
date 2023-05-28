const client = require('../../base/client')

client.on('voiceStateUpdate', async (newState, oldState) => {
    const channel = newState.guild.channels.cache.find(c => c.name === "🎵아람이_음성_생성" || c.name == '🎤 아람보이스');
    if (newState.member.voice.channel) {
        if (!channel) return
        if (newState.member.voice.channel.id !== channel.id) return
        newState.guild.channels.create(`🎤 ${newState.member.user.username}의 채널`, {
            type: "GUILD_VOICE",
            parent: oldState.channel.parent
        }).then(ch => {
            if (!ch) return
            newState.member.voice.setChannel(ch)
            const interval = setInterval(() => {
                if (ch.deleted == true) {
                    clearInterval(interval)
                    return;
                }
                if (ch.members.size == 0) {
                    ch.delete()
                    return;
                }
            }, 5000);
        })
    }
})