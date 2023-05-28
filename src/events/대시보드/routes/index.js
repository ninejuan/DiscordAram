const express = require('express');
const moment = require('moment');
require('moment-duration-format');
const passport = require('passport');
// const checkAuth = require('../backend/checkAuth');
const secinv = require('../../../models/봇시스템/보안링크');
const config = require('../../../setting/config')
const package = require('../../../../package.json');
const setting = require('../../../../setting');
const client = require('../../../base/client');
const UrlDB = require('../../../models/봇시스템/단축링크');
const unified = require('unified')
const markdown = require('remark-parse')
const remark2rehype = require('remark-rehype')
const html = require('rehype-stringify');
const nodemailer = require('nodemailer');
const keyschema = require('../../../models/보안링크/키');
const validator = require("email-validator");
const KeyMail = require('../public/Template/keymail');
// let key;

let mode;
if (setting.setup.mode == true) {
    mode = {
        token: setting["Discord-Bot"].token.main
    }
} else if (setting.setup.mode == false) {
    mode = {
        token: setting["Discord-Bot"].token.test
    }
}
const { REST } = require('@discordjs/rest');
const rest = new REST({ version: '10' }).setToken(mode.token);

let Callback_RedirectUri;
const checkAuth = (req, res, next) => {
	if (req.isAuthenticated()) {
        return next()
    }
	Callback_RedirectUri = req.url
	res.redirect('/login')
}

const router = express.Router();
//대시보드관련

router.get('/header', async (req, res) => {
	res.render('partials/header', {
		bot: req.client,
		user: req.user,
	})
});

router.get('/footer', async (req, res) => {
	res.render('partials/footer', {
		bot: req.client,
		user: req.user,
	})
});

router.get('/', async (req, res) => {
	res.render('index', {
		tag: (req.user ? req.user.tag : 'Login'),
		bot: req.client,
		user: req.user || null
	});
});
router.get('/invite', async function(req, res) {
	res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${req.client.user.id}&permissions=8&scope=bot%20applications.commands`);
});
router.get('/login', passport.authenticate('discord', { failureRedirect: '/' }), async function(req, res) {
	if (!req.user.id || !req.user.guilds) {
		res.redirect(`${Callback_RedirectUri || '/'}`);
		Callback_RedirectUri = null;
	}
	else {
		res.redirect(`${Callback_RedirectUri || '/'}`);
		Callback_RedirectUri = null;
	}
});
router.get('/logout', async function(req, res) {
	req.session.destroy(() => {
		res.redirect('/');
	});
});
router.get('/support', async function(req, res) {
	res.render('info/support', {
		account: `${config.support.name} ${config.support.number}`,
		bot: req.client,
		user: req.user,
	})
})
//보안URL 관련
router.get('/goback', async (req, res) => {
	res.render('index', {
		tag: (req.user ? req.user.tag : 'Login'),
		bot: req.client,
		user: req.user || null,
	});
});
router.get('/callback', passport.authenticate('discord', { failureRedirect: '/' }), async function(req, res) {
	if (!req.user.id || !req.user.guilds) {
		res.redirect('/goback');
	}
	else {res.redirect('/goback');}
});
router.get('/i/:name', checkAuth, async (req, res) => {
	const SecInvCheck = await secinv.findOne({ link: req.params.name })
	if (!SecInvCheck) {
		res.render('invite/secinv_guild404', {
			bot: req.client,
			user: req.user,
		})
	}
	const guildid = SecInvCheck.guildID;
	const server = req.client.guilds.cache.get(guildid);
	const onlinemember = server.members.cache.filter(member => member?.presence?.status == 'online').size;
	const idlemember = server.members.cache.filter(member => member?.presence?.status == 'idle').size;
    const dndmember = server.members.cache.filter(member => member?.presence?.status == 'dnd').size;
	const omember = onlinemember + idlemember + dndmember
	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(guildid)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=1094679657975&guild_id=${guildid}`);
	}
	else if (!server) {
		res.redirect('/dashboard/servers')
	}
	res.render(`invite/${SecInvCheck.type || 'captcha'}/invite`, {
		bot: req.client,
		user: req.user,
		rest: rest,
		guild: server,
		onlineMember: omember,
		linkname: req.params.name,
	})
})
router.post('/i/:name', checkAuth, async (req, res) => {
	const SecInvCheck = await secinv.findOne({ link: req.params.name })
	if (!SecInvCheck) {
		res.render('invite/secinv_guild404', {
			bot: req.client,
			user: req.user,
		})
	}
	const guildID = SecInvCheck.guildID;
	const server = client.guilds.cache.get(guildID)
	try {
		await rest.put(`/guilds/${guildID}/members/${req.user.id}`, {
			body: {
				'access_token': req.user.accessToken
			}
		})
		res.render('invite/secinv_success', {
			bot: req.client,
			user: req.user,
			guild: server,
		})
	} catch (e) {
		res.render('invite/secinv_fail', {
			bot: req.client,
			user: req.user,
			guild: server,
		})
	}
});

router.post('/i/:name/verify', checkAuth, async (req, res) => {
	const SecInvCheck = await secinv.findOne({ link: req.params.name });
	if (!SecInvCheck) {
		res.render('invite/secinv_guild404', {
			bot: req.client,
			user: req.user,
		})
	}
	const imsi = await keyschema.findOne({ ip: req.ip })
	const guildID = SecInvCheck.guildID;
	const server = client.guilds.cache.get(guildID)
	const onlinemember = server.members.cache.filter(member => member?.presence?.status == 'online').size;
	const idlemember = server.members.cache.filter(member => member?.presence?.status == 'idle').size;
    const dndmember = server.members.cache.filter(member => member?.presence?.status == 'dnd').size;
	const omember = onlinemember + idlemember + dndmember
	
	if (!validator.validate(req.body.email)) {
		res.render('invite/email/invalid_mail', {
			bot: req.client,
			user: req.user,
			onlineMember: omember,
			guild: server,
		})
	} else {
		key = Math.random().toString().substr(2,6);
		const newData = new keyschema({
			ip: req.ip,
			key: key,
		})
		await newData.save();
		const data = req.body;
		const subject = "[아람이] 보안초대링크 인증"
		const text = `아래 코드를 입력하여 인증을 시도하세요\n${key}`
		const sendhtml = KeyMail.value.replace('$$$key$$$', `${key}`)
		
		async function send() {
			const account = nodemailer.createTransport({
				host: setting.mail.smtp.server,
				secure: true,
				auth: {
					user: setting.mail.account.id,
					pass: setting.mail.account.pw
				}
			})
		
			account.sendMail({ 
				from: setting.mail.from,
				to: data.email,
				subject: subject, 
				html: sendhtml
			})
		}
		send().catch(console.error)
		res.render('invite/email/verify', {
			bot: req.client,
			user: req.user,
			guild: server,
			linkname: req.params.name,
			onlineMember: omember,
		})
	}
})

router.post('/i/:name/check', checkAuth, async (req, res) => {
	const data = req.body;
	const SecInvCheck = await secinv.findOne({ link: req.params.name });
	let db = await keyschema.findOne({ ip: req.ip });
	if (!SecInvCheck) {
		res.render('invite/secinv_guild404', {
			bot: req.client,
			user: req.user,
		})
	}
	if (!db) {
		res.render('invite/error', {
			bot: req.client,
			user: req.user,
		})
	}
	if (data.key == db.key) {
		const guildID = SecInvCheck.guildID;
		const server = client.guilds.cache.get(guildID)
		try {
			await rest.put(`/guilds/${guildID}/members/${req.user.id}`, {
				body: {
					'access_token': req.user.accessToken
				}
			})
			await keyschema.remove({ ip: req.ip })
			res.render('invite/secinv_success', {
				bot: req.client,
				user: req.user,
				guild: server,
			})
		} catch (e) {
			await keyschema.remove({ ip: req.ip })
			res.render('invite/secinv_fail', {
				bot: req.client,
				user: req.user,
				guild: server,
			})
		}
	} else {
		await keyschema.remove({ ip: req.ip })
		res.render('invite/error', {
			bot: req.client,
			user: req.user,
		})
	}
})
router.get('/pleasekr', async (req, res) => {
	res.render('invite/kr_ip/abroad_ip', {
		bot: req.client,
		user: req.user,
	})
})
router.get('/noti', async (req, res) => {
	const channelS = req.client.channels.cache.get(config.noti.channel)
	let msgs = [];
	await channelS.messages.fetch().then(messages => { //<---error here
        messages.forEach(msg => {msgs.push(msg)})
      });
	res.render('noti', {
		tag: (req.user ? req.user.tag : 'Login'),
		bot: req.client,
		user: req.user || null,
		msgs: msgs,
		moment: moment,
		unified: unified,
		markdown: markdown,
		remark2rehype: remark2rehype,
		html: html,
	});
});
router.get('/mail', async (req, res) => {
	res.render('example/mail', {
		bot: req.client,
	})
});
router.get('/test', async (req, res) => {
	res.render('example/test')
})
router.get('/:code', async (req, res) => {
	let code = req.params.code;
	const data = await UrlDB.findOne({
		code: code,
	})
	console.log(data)
	if (data) {
		let redUrl = data.origin;
		console.log(data)
		res.redirect(`${redUrl}`)
	}
	console.log('404')
  });
module.exports = router;
