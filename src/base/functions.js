const schema = require('../models/봇시스템/유저데이터');
const config = require('../setting/config');

module.exports = {
    duration: function(ms) {
        const sec = Math.floor((ms / 1000) % 60).toString()
        const min = Math.floor((ms / (60 * 1000)) % 60).toString()
        const hrs = Math.floor((ms / (60 * 60 * 1000)) % 60).toString()
        const days = Math.floor((ms / (24 * 60 * 60 * 1000)) % 60).toString()
        return `${days}일 ${hrs}시간 ${min}분 ${sec}초`
    },
    delay: function(delayInms) {
        try {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(2);
                }, delayInms);
            });
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    },
    format: function(millis) {
        
      },
    getRandomDbl: function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    },
    getRandomInt: function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
    },
    ReplaceBadge: async function ReplaceUserBadge(uid) {
        let find = await schema.findOne({ userid: uid });
        if (find) {
            if (!find.badges) {
                return '배지가 없습니다';
            } else {
                let badgeArr = JSON.stringify(find.badges)
                    .split(',').join(' ')
                    .split('developer').join(`${config.emoji.badges.developer}`)
                    .split('partner').join(`${config.emoji.badges.partner}`)
                    .split('supporter').join(`${config.emoji.badges.supporter}`)
                    .split('bughunt').join(`${config.emoji.badges.bughunt}`)
                    .split('bughunt2').join(`${config.emoji.badges.bughunt2}`)
                    .split('mod').join(`${config.emoji.badges.mod}`)
                    .split('design').join(`${config.emoji.badges.design}`)
                    .split('owner').join(`${config.emoji.badges.owner}`)
                return JSON.parse(badgeArr);
            }
        } else {
            return "유저가 아람이에 가입하지 않았어요";
        }
    }
}