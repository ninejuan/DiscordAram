const setting = require('../../setting')
let mode;
if (setting.setup.mode == true) {
    mode = {
        clientId: setting['Discord-Bot'].clientId.main,
        token: setting['Discord-Bot'].token.main,
        SECRET: setting.dashboard.CLIENT_SECRET.main,
        URL: setting.dashboard.domain.main,
        notiId: setting['Discord-Bot'].notice.main,
        mongo: `mongodb+srv://${setting.database.main.id}:${setting.database.main.pw}@cluster${setting.database.main.cluster}.${setting.database.main.code}.mongodb.net/${setting.database.main.folder}`
    }
} else if (setting.setup.mode == false) {
    mode = {
        clientId: setting['Discord-Bot'].clientId.test,
        token: setting['Discord-Bot'].token.test,
        SECRET: setting.dashboard.CLIENT_SECRET.test,
        URL: `${setting.dashboard.domain.test}:${setting.dashboard.port}`,
        notiId: setting['Discord-Bot'].notice.test,
        mongo: `mongodb+srv://${setting.database.test.id}:${setting.database.test.pw}@cluster${setting.database.test.cluster}.${setting.database.test.code}.mongodb.net/${setting.database.test.folder}`
    }
}

module.exports = {
    logname: setting.logname,
    bot: {
        clientId: mode.clientId,
        token: mode.token,
        Invitationcode: `https://discord.com/api/oauth2/authorize?client_id=${mode.clientId}&permissions=${setting['Discord-Bot'].Invitationpermissions}&scope=bot%20applications.commands`,
        dev: setting.setup.dokdo.devid
    },
    database: {
        mongo: mode.mongo
    },
    mainserver: {
        joinurl: setting.serverurl,
        add: {
            guild: []
        },
        delete: {
            guild: []
        },
        ticket: {
            guide: "",
            channel: ""
        },
        staff: ""
    },
    cmd: {
        prefix: setting['Discord-Bot'].prefix,
        talk: "아람아 ",
        Music: "아람뮤직2 ",
        Thinking: "~!@#$%^&*_+=-,./?;:",
        client: "<@970677290667217006>",
        status_msg: "제 소개를 봐주세요!"

    },
    log: {
        error: "1005348071552589875",
        ticket: "",
        Dev: {
            Warning: "995849930818207856",
            dmmsg: "995849700878073896",
            answer: "995853590482661461"
        },
        User: {
            help: "995898763124158465",
            category: "995898673676431441",
            help_Guild: "995847591747129415"
        }
    },
    dm: {
        ticket: {
            channel: "",
            guide: "",
            guild: "",
            log: ""
        }
    },
    embed: {
        color: "0x2f3136",
        name: ""
    },
    emoji: {
        체크: {
            버튼용: "",
            일반: "",
            구름: ""
        },
        엑스: "",
        아바타: {
            아람이: '<:a6098291ba73f8fa076924888f498a7e:1024234077060091945>'
        },
        badges: {
            developer: '<:developer:1024235682505441321>',
            partner: '<:partner:1024235689652539442>',
            supporter: '<:supporter:1024235691833561118>',
            bughunt: '<:bughunt:1024235674725011457>',
            bughunt2: '<:bughunt2:1024235676826353665>',
            mod: '<:mod:1024235684652929045>',
            design: '<:design:1024235680131469373>',
            owner: '<:owner:1024235686578098256>'
        }
    },
    github: {
        repository: ""
    },
    dashboard: {
        CLIENT_SECRET: mode.SECRET,
        CALLBACK_URL: `${mode.URL}/login`,
        SUPPORT_SERVER: setting.serverurl,
        PORT: setting.dashboard.port
    },
    api: {
        naver: {
            client_id: "",
            client_secret: ""
        },
        other: {
            nasa: ""
        }
    },
    support: { // 후원 계좌
        name: '',
        number: ''
    },
    noti: {
        channel: mode.notiId
    }
}