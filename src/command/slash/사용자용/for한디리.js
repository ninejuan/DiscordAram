const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("for한디리")
        .setDescription("for 한디리 봇 검수팀"),
    async run(interaction,client){
        const embed = new MessageEmbed()
        .setDescription(`안녕하세요. 아람이에 해당 명령어를 만든 주안입니다.\n
        먼저 많은 봇들을 검수하시느라 고생하신다는 말부터 남깁니다.\n
        일단 2번을 검수하셨을때 아람이의 기능과는 현재의 기능이 많이 삭제되었다는 것을 보셨을겁니다\n
        해당 기능은 한디리 통과용으로 삭제되지 않았으며, 추후 해당 기능이 복구되더라도\n
        **자체개발로** 돌아올 예정입니다.\n
        보시기 쉽게 아래 package.json 파일의 모듈 부분을 첨부합니다.\n  
        \`\`\`
        "@discordjs/builders": "^1.2.0",
        "@discordjs/rest": "^1.1.0",
        "@distube/spotify": "^1.3.2",
        "body-parser": "^1.20.0",
        "canvas": "^2.9.3",
        "child_process": "^1.0.2",
        "comma-number": "^2.1.0",
        "common-tags": "^1.8.2",
        "cookie-parser": "^1.4.6",
        "discord-api-types": "^0.37.0",
        "discord-html-transcripts": "^2.6.1",
        "discord-logs": "^2.0.1",
        "discord-modals": "^1.3.9",
        "discord-together": "^1.3.31",
        "discord-xp": "^1.1.16",
        "discord.js": "^13.9.2",
        "discord.js-pagination": "^1.0.3",
        "distube": "^3.3.4",
        "dokdo": "^0.5.1",
        "dotenv": "^16.0.2",
        "ejs": "^3.1.8",
        "email-validator": "^2.0.4",
        "erela.js": "^2.3.3",
        "express": "^4.18.1",
        "express-rate-limit": "^5.5.1",
        "express-session": "^1.17.3",
        "korcen": "^0.2.4",
        "log4js": "^6.6.1",
        "moment": "^2.29.4",
        "moment-duration-format": "^2.3.2",
        "mongoose": "^6.5.4",
        "nodemailer": "^6.7.8",
        "passport": "^0.6.0",
        "passport-discord": "^0.1.4",
        "passport-github": "^1.1.0", (실사용 X)
        "passport-google-oauth20": "^2.0.0", (실사용 X)
        "passport-kakao": "^1.0.1", (실사용 X)
        "passport-local": "^1.0.0", (실사용 X)
        "passport-naver": "^1.0.6", (실사용 X)
        "pretty-ms": "^7.0.0",
        "rehype-stringify": "^8.0.0",
        "remark-parse": "^9.0.0",
        "remark-rehype": "^7.0.0",
        "request": "^2.88.2",
        "unified": "^9.0.0",
        "uuid-apikey": "^1.5.3",
        "valid-url": "^1.0.9"
          \`\`\`\n
          감사합니다.
          그리고 해당 명령어는 한디리 검수 기간에만 작동될 명령어입니다.\n
          한디리 검수가 끝난 후 이 명령어는 삭제됩니다.
        `)
        const nem = new MessageEmbed()
        .setDescription(`
        /인증 명령어는 아람이 API를 사용하여 개발되었습니다.
        보안 초대 링크는 제가 만들어서 제가 제 팀 깃허브에 오픈소스로 공개하였으므로 라이선스 표시 안했습니다.
        보안 초대 링크는 팀 라온의 팀원에 한해 라이선스 표시 안해도 되도록 허가해둔 상태입니다.
        단축 URL도 아람이API를 사용하여 개발되었습니다.
        `)
        interaction.reply({ embeds: [embed, nem] })
    }
}