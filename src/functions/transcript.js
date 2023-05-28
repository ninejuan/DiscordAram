const { generateTranscript } = require('reconlx');

async function transcript(channel, guild) {
    let msgs = (await channel.messages.fetch()).map(x => x).reverse();
    let transcript = await generateTranscript({ messages: msgs, guild: guild, channel: channel });
    let html = transcript.toString();

    html = html.replace("\n", "").replace(`Transcripted ${msgs.length} messages.`, `${msgs.length}개의 메세지가 저장되었습니다.`);
    transcript = Buffer.from(html, "utf-8");

    return transcript;
}

module.exports = transcript;
