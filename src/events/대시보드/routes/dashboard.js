const express = require('express');
const moment = require('moment');
require('moment-duration-format');
moment.locale('ko')
const { MessageEmbed, Client, CommandInteraction, MessageActionRow, MessageButton, Permissions } = require('discord.js');

const setting = require('../../../../setting');
const config = require('../../../setting/config');

let mode;
if (setting.setup.mode == true) {
    mode = {
        url: setting.dashboard.domain.main
    }
} else if (setting.setup.mode == false) {
    mode = {
        url: `${setting.dashboard.domain.test}:${setting.dashboard.port}`
    }
}

const router = express.Router();

const db = require('../db/manager');
const checkAuth = require('../backend/checkAuth');

router.get('/server/:guildID/profile/:memberId', checkAuth, async (req, res) => {
	const userObj = req.client.guilds.cache.get(req.params.guildID).members.cache.get(req.params.memberId);
	const server = req.client.guilds.cache.get(req.params.guildID)
	const user = req.client.users.cache.get(req.params.memberId)
	const censor = await db.getUserCensor(req.params.memberId);
	let nitrotype;
	if (!user.premium_type || user.premium_type == 0) {
		nitrotype = {
			color: "white",
			msg: "니트로가 없어요"
		}
	} else if (user.premium_type == 1) {
		nitrotype = {
			color: "#f47fff",
			msg: "니트로 클래식"
		}
	} else if (user.premium_type == 2) {
		nitrotype = {
			color: "#f47fff",
			msg: "니트로 프라임"
		}
	}

	const status = {
		'online': '#43b581',
		'idle': '#faa61a',
		'dnd': '#f04747',
		'offline': '#747f8d',
	};

	const statusName = {
		'online': '온라인',
		'idle': '자리 비움',
		'dnd': '방해 금지',
		'offline': '오프라인',
	};

	let statusTypeData;
	let statusColorData;

	if (userObj.presence === null) {
		statusTypeData = '오프라인';
		statusColorData = '#747f8d';
	}
	else {
		statusTypeData = statusName[userObj.presence.status];
		statusColorData = status[userObj.presence.status];
	}

	let mfa_data;
	if (req.user.mfa_enabled) {
		mfa_data = {
			color: "blue",
			msg: "활성화"
		}
	} else if (!req.user.mfa_enabled) {
		mfa_data = {
			color: "red",
			msg: "비활성화"
		}
	}
	let warn = await db.getUserWarning(req.params.guildID, req.params.memberId)
	res.render('dashboard/member/profile', {
		bot: req.client,
		userObj: userObj,
		status: statusTypeData,
		statusColor: statusColorData,
		moment: moment,
		nitro: nitrotype,
		user: user,
		guild: server,
		censor: censor,
		mfadata: mfa_data,
		warn: warn,
		ts: req.query,
	});
});
router.post('/server/:guildID/profile/:memberId', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);

	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=1094679657975&guild_id=${req.params.guildID}`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}

	const data = req.body;
	if (data.manage == 'kick') {
		try {
			await req.client.guilds.cache.get(req.params.guildID).members.cache.get(req.params.memberId).kick();
			res.redirect(`/dashboard/server/${req.params.guildID}/members`)
		} catch (e) {
			res.render('dashboard/fail/kick', {
				bot: req.client,
				user: req.client.users.cache.get(req.params.memberId),
				e: e,
				guild: req.client.guilds.cache.get(req.params.guildID)
			})
		}
	} else if (data.manage == 'ban') {
		try {
			await req.client.guilds.cache.get(req.params.guildID).members.cache.get(req.params.memberId).ban();
			res.redirect(`/dashboard/server/${req.params.guildID}/members`)
		} catch (e) {
			res.render('dashboard/fail/ban', {
				bot: req.client,
				user: req.client.users.cache.get(req.params.memberId),
				e: e,
				guild: req.client.guilds.cache.get(req.params.guildID)
			})
		}
	} else if (data.time) {
		try {
			await req.client.guilds.cache.get(req.params.guildID).members.cache.get(req.params.memberId).timeout(parseInt(data.time), 'reason')
			res.redirect(`/dashboard/server/${req.params.guildID}/members/${req.params.memberId}?ts=true`)
		} catch (e) {
			res.render('dashboard/fail/timeout', {
				bot: req.client,
				e: e,
				user: req.client.users.cache.get(req.params.memberId),
				guild: server,
			})
		}
	}
	else {
		res.render('didyouchangecode', {
			bot: req.client,
			user: req.user || null,
		})
	}
})
router.get('/server/:guildID', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);
	const serverData = await db.findServer(req.params.guildID) || await db.createServer(req.params.guildID);

	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&permissions=8&scope=bot%20applications.commands&guild_id=${req.params.guildID}&disable_guild_select=true`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}
	const channels = server.channels.cache.toJSON()
	res.render('dashboard/manage.ejs', {
		bot: req.client,
		user: req.user || null,
		guild: server,
		serverData: serverData,
		channels: channels,
	});
});
router.post('/server/:guildID', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);
	if (!server) return res.redirect('/dashboard/servers');
	if (!req.client.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id).permissions.has(Permissions.FLAGS.MANAGE_SERVER)) return res.redirect('/dashboard/servers');

	const data = req.body;

	// eslint-disable-next-line no-prototype-builtins
	if (data.hasOwnProperty('prefix')) {
		let newprefix;
		let prefix = await db.getPrefix(req.params.guildID);

		if (!prefix || prefix == null) prefix = '!';
		if (data.prefix.length > 0) newprefix = data.prefix;
		if (newprefix) {
			await db.updateServerPrefix(server.id, newprefix);
		}
	}

	await res.redirect(`/dashboard/server/${req.params.guildID}`);
});
router.get('/server/:guildID/members', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);

	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=1094679657975&guild_id=${req.params.guildID}`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}

	const members = server.members.cache.toJSON();

	res.render('dashboard/member/members.ejs', {
		bot: req.client,
		user: req.user || null,
		guild: server,
		members: members,
		moment: moment,
	});
});
router.get('/server/:guildID/stats', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);

	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=1094679657975&guild_id=${req.params.guildID}`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}

	res.render('dashboard/stats.ejs', {
		bot: req.client,
		user: req.user || null,
		guild: server,
		moment: moment,
	});
});
router.get('/servers', checkAuth, async (req, res) => {
	res.render('dashboard/servers', {
		tag: (req.user ? req.user.tag : 'Login'),
		bot: req.client,
		user: req.user || null,
		guilds: req.user.guilds.filter(u => (u.permissions & 2146958591) === 2146958591),
	});
});

router.get('/server/:guildID/levels', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);

	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=1094679657975&guild_id=${req.params.guildID}`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}

	var levels = await db.getGuildLevels(req.client, req.params.guildID)
	res.render('dashboard/levels.ejs', {
		bot: req.client,
		user: req.user || null,
		guild: server,
		levels: levels,
		moment: moment,
	});
});

router.get('/server/:guildID/ticket', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);

	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=1094679657975&guild_id=${req.params.guildID}`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}
	const channels = server.channels.cache.filter(a => a.type !== "GUILD_CATEGORY").toJSON()

	res.render('dashboard/ticket', {
		bot: req.client,
		user: req.user,
		channels: channels,
		guild: server,
		sent: null,
	})
})
router.post('/server/:guildID/ticket', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);
	if (!server) return res.redirect('/dashboard/servers');
	if (!req.client.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id).permissions.has(Permissions.FLAGS.MANAGE_SERVER)) return res.redirect('/dashboard/servers');

	const data = req.body;

	const row = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId("tk-2")
			.setLabel("📩 서버 문의")
			.setStyle("SUCCESS"),
		new MessageButton()
			.setCustomId('tk-another')
			.setLabel(`📩 기타 문의`)
			.setStyle('PRIMARY'),
		new MessageButton()
			.setCustomId(`tk-report`)
			.setLabel(`🚫 유저 신고`)
			.setStyle('DANGER')
	);
	const embed = new MessageEmbed()
		.setTitle("문의 티켓")
		.setColor(require('../../../base/hexcolor').invisible)
		.setDescription("관리진에게 문의를 하시려면 아래 📩 버튼을 눌러 티켓을 오픈하여 주세요!")

	req.client.channels.cache.get(data.channel).send({ embeds: [embed], components: [row] })
	const channels = server.channels.cache.filter(a => a.type !== "GUILD_CATEGORY").toJSON()
	res.render('dashboard/ticket', {
		bot: req.client,
		user: req.user,
		channels: channels,
		guild: server,
		sent: true,
	})
});

router.get('/server/:guildID/verifyrole', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);

	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=1094679657975&guild_id=${req.params.guildID}`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}

	const roles = server.roles.cache.filter(a => a.name !== "@everyone").toJSON()
	let nowrole;
	let nowroleColor;
	let GetRole = await db.getVRole(req.params.guildID);
	if (GetRole == "설정되지 않았어요") {
		nowrole = '설정되지 않았어요';
		nowroleColor = '#ffffff';
	} else {
		nowrole = server.roles.cache.get(GetRole).name;
		nowroleColor = server.roles.cache.get(GetRole).hexColor;
	}
	
	res.render('dashboard/verifyrole', {
		bot: req.client,
		user: req.user,
		roles: roles,
		guild: server,
		set: null,
		nowrole: nowrole,
		NRColor: nowroleColor
	})
});
router.post('/server/:guildID/verifyrole', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);
	if (!server) return res.redirect('/dashboard/servers');
	if (!req.client.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id).permissions.has(Permissions.FLAGS.MANAGE_SERVER)) return res.redirect('/dashboard/servers');
	const data = req.body;
	await db.UpdateVRole(req.params.guildID, data.role)

	const roles = server.roles.cache.filter(a => a.name !== "@everyone").toJSON()
	let nowrole;
	let nowroleColor;
	let GetRole = await db.getVRole(req.params.guildID);
	if (GetRole == "설정되지 않았어요") {
		nowrole = '설정되지 않았어요';
		nowroleColor = '#ffffff';
	} else {
		nowrole = server.roles.cache.get(GetRole).name;
		nowroleColor = server.roles.cache.get(GetRole).hexColor;
	}
	
	res.render('dashboard/verifyrole', {
		bot: req.client,
		user: req.user,
		roles: roles,
		guild: server,
		set: true,
		nowrole: nowrole,
		NRColor: nowroleColor
	})
});

router.get('/server/:guildID/autovoice', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);

	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=1094679657975&guild_id=${req.params.guildID}`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}
	const cat = server.channels.cache.filter(a => a.type == "GUILD_CATEGORY").toJSON();
	let voice = server.channels.cache.find(ch => ch.name === "🎤 아람보이스")
	res.render('dashboard/autovoice', {
		bot: req.client,
		user: req.user,
		vch: voice,
		guild: server,
		category: cat,
		success: null,
		removed: null,
	})
})
router.post('/server/:guildID/autovoice', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);
	if (!server) return res.redirect('/dashboard/servers');
	if (!req.client.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id).permissions.has(Permissions.FLAGS.MANAGE_SERVER)) return res.redirect('/dashboard/servers');

	const data = req.body;
	let ch = server.channels.cache.find(ch => ch.name == "🎤 아람보이스")
	if (!ch && data.type !== 'remove') {
		server.channels.create('🎤 아람보이스', {
			type: 'GUILD_VOICE',
			parent: data.category,
		}).then(() => {
			const cat = server.channels.cache.filter(a => a.type == "GUILD_CATEGORY").toJSON();
			let voice = server.channels.cache.find(ch => ch.name === "🎤 아람보이스")
			res.render('dashboard/autovoice', {
				bot: req.client,
				user: req.user,
				vch: voice,
				guild: server,
				category: cat,
				success: true,
				removed: null,
			})
		}).catch((err) => {
			const cat = server.channels.cache.filter(a => a.type == "GUILD_CATEGORY").toJSON();
			let voice = server.channels.cache.find(ch => ch.name === "🎤 아람보이스")
			res.render('dashboard/fail/autovoice', {
				bot: req.client,
				user: req.user,
				guild: server,
				e: err,
			})
		})
	} else if (ch && data.type !== 'remove') {
		ch.delete();
		server.channels.create('🎤 아람보이스', {
			type: 'GUILD_VOICE',
			parent: data.category,
		}).then(() => {
			const cat = server.channels.cache.filter(a => a.type == "GUILD_CATEGORY").toJSON();
			let voice = server.channels.cache.find(ch => ch.name === "🎤 아람보이스")
			res.render('dashboard/autovoice', {
				bot: req.client,
				user: req.user,
				vch: voice,
				guild: server,
				category: cat,
				success: true,
				removed: null,
			})
		}).catch((err) => {
				const cat = server.channels.cache.filter(a => a.type == "GUILD_CATEGORY").toJSON();
				let voice = server.channels.cache.find(ch => ch.name === "🎤 아람보이스")
				res.render('dashboard/fail/autovoice', {
					bot: req.client,
					user: req.user,
					guild: server,
					e: err,
				})
		})
	} else if (data.type == 'remove') {
		await ch.delete();
		const cat = server.channels.cache.filter(a => a.type == "GUILD_CATEGORY").toJSON();
		let voice = server.channels.cache.find(ch => ch.name === "🎤 아람보이스")
		res.render('dashboard/autovoice', {
			bot: req.client,
			user: req.user,
			vch: voice,
			guild: server,
			category: cat,
			success: null,
			removed: true,
		})
	}
});

router.get('/server/:guildID/music', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);

	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=1094679657975&guild_id=${req.params.guildID}`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}
	const cat = server.channels.cache.filter(a => a.type == "GUILD_CATEGORY").toJSON();
	let music = server.channels.cache.find(ch => ch.name == "아람뮤직")
	res.render('dashboard/setupmusic', {
		bot: req.client,
		user: req.user,
		mch: music,
		guild: server,
		category: cat,
		success: null,
		removed: null,
	})
})
router.post('/server/:guildID/music', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);
	if (!server) return res.redirect('/dashboard/servers');
	if (!req.client.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id).permissions.has(Permissions.FLAGS.MANAGE_SERVER)) return res.redirect('/dashboard/servers');
	const data = req.body;
	let ch = server.channels.cache.find(ch => ch.name == "아람뮤직")
	if (!ch && data.type !== 'remove') {
		server.channels.create('아람뮤직', {
			type: 'GUILD_TEXT',
			parent: data.category,
		}).then(() => {
			const cat = server.channels.cache.filter(a => a.type == "GUILD_CATEGORY").toJSON();
			let voice = server.channels.cache.find(ch => ch.name === "아람뮤직")
			res.render('dashboard/setupmusic', {
				bot: req.client,
				user: req.user,
				mch: voice,
				guild: server,
				category: cat,
				success: true,
				removed: null,
			})
		}).catch((err) => {
			const cat = server.channels.cache.filter(a => a.type == "GUILD_CATEGORY").toJSON();
			let voice = server.channels.cache.find(ch => ch.name === "아람뮤직")
			res.render('dashboard/fail/setupmusic', {
				bot: req.client,
				user: req.user,
				guild: server,
				e: err,
			})
		})
	} else if (ch && data.type !== 'remove') {
		ch.delete();
		server.channels.create('아람뮤직', {
			type: 'GUILD_TEXT',
			parent: data.category,
		}).then(() => {
			const cat = server.channels.cache.filter(a => a.type == "GUILD_CATEGORY").toJSON();
			let voice = server.channels.cache.find(ch => ch.name === "아람뮤직")
			res.render('dashboard/setupmusic', {
				bot: req.client,
				user: req.user,
				mch: voice,
				guild: server,
				category: cat,
				success: true,
				removed: null,
			})
		}).catch((err) => {
				const cat = server.channels.cache.filter(a => a.type == "GUILD_CATEGORY").toJSON();
				let voice = server.channels.cache.find(ch => ch.name === "아람뮤직")
				res.render('dashboard/fail/music', {
					bot: req.client,
					user: req.user,
					guild: server,
					e: err,
				})
		})
	} else if (data.type == 'remove') {
		await ch.delete();
		const cat = server.channels.cache.filter(a => a.type == "GUILD_CATEGORY").toJSON();
		let voice = server.channels.cache.find(ch => ch.name === "아람뮤직")
		res.render('dashboard/setupmusic', {
			bot: req.client,
			user: req.user,
			mch: voice,
			guild: server,
			category: cat,
			success: null,
			removed: true,
		})
	}
});
router.get('/server/:guildID/logging', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);

	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=1094679657975&guild_id=${req.params.guildID}`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}
	const channels = server.channels.cache.filter(a => a.type !== "GUILD_CATEGORY").toJSON();
	let nowChannel;
	let GetLogCh = await db.GetLogCh(req.params.guildID);
	if (GetLogCh == "설정되지 않았어요") {
		nowChannel = '설정되지 않았어요';
	} else {
		nowChannel = `#${server.channels.cache.get(GetLogCh).name}`
	}
	
	res.render('dashboard/log/logging'	, {
		bot: req.client,
		user: req.user,
		channels: channels,
		guild: server,
		set: null,
		nowChannel: nowChannel,
	})
});
router.post('/server/:guildID/logging', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);
	if (!server) return res.redirect('/dashboard/servers');
	if (!req.client.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id).permissions.has(Permissions.FLAGS.MANAGE_SERVER)) return res.redirect('/dashboard/servers');
	const data = req.body;
	if (data.type == 'remove') {
		await db.RemoveLogCh(req.params.guildID)
	} else if (!data.type) {
		await db.UpdateLogCh(req.params.guildID, data.channel)
	}
	// return console.log(data)
	const channels = server.channels.cache.filter(a => a.type !== "GUILD_CATEGORY").toJSON();
	let nowChannel;
	let GetLogCh = await db.GetLogCh(req.params.guildID);
	if (GetLogCh == "설정되지 않았어요") {
		nowChannel = '설정되지 않았어요';
	} else {
		nowChannel = `#${server.channels.cache.get(GetLogCh).name}`
	}
	
	res.render('dashboard/log/logging', {
		bot: req.client,
		user: req.user,
		channels: channels,
		guild: server,
		set: true,
		nowChannel: nowChannel,
	})
});
router.get('/server/:guildID/joinleave', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);

	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=1094679657975&guild_id=${req.params.guildID}`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}
	const channels = server.channels.cache.filter(a => a.type !== "GUILD_CATEGORY").toJSON();
	let nowChannel;
	let jldb = await db.GetJLData(req.params.guildID);
	let data;
	if (jldb == "설정되지 않았어요") {
		nowChannel = '설정되지 않았어요';
	} else {
		nowChannel = req.client.channels.cache.get(jldb.ChannelID).name;
		data = jldb;
	}
	
	res.render('dashboard/log/joinleave', {
		bot: req.client,
		user: req.user,
		channels: channels,
		guild: server,
		set: null,
		nowChannel: nowChannel,
		data: data || null,
	})
});
router.post('/server/:guildID/joinleave', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);
	if (!server) return res.redirect('/dashboard/servers');
	if (!req.client.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id).permissions.has(Permissions.FLAGS.MANAGE_SERVER)) return res.redirect('/dashboard/servers');
	const data = req.body;
	if (data.type == 'remove') {
		await db.RemoveJLData(req.params.guildID)
	} else {
		await db.UpdateJLData(req.params.guildID, data.channel, data.JoinMsg, data.LeaveMsg)
	}
	// return console.log(data)
	const channels = server.channels.cache.filter(a => a.type !== "GUILD_CATEGORY").toJSON();
	let nowChannel;
	let GetLogCh = await db.GetLogCh(req.params.guildID);
	if (GetLogCh == "설정되지 않았어요") {
		nowChannel = '설정되지 않았어요';
	} else {
		nowChannel = `#${server.channels.cache.get(GetLogCh).name}`
	}
	
	res.render('dashboard/log/joinleave', {
		bot: req.client,
		user: req.user,
		channels: channels,
		guild: server,
		set: true,
		nowChannel: nowChannel,
	})
});

//보내줄 값들
// 1. 보안 링크 이름
// 2. 보안 링크 인증 타입
router.get('/server/:guildID/secureinv', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);

	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=1094679657975&guild_id=${req.params.guildID}`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}
	let data;
	let invData = await db.GetSecInvData(req.params.guildID);
	if (invData == "설정되지 않았어요") {
		data = {
			link: `설정되지 않았어요`,
			type: `설정되지 않았어요`
		} 
	} else {
		data = {
			link: invData.link,
			type: invData.type
		}
	}
	res.render('dashboard/secinv', {
		bot: req.client,
		user: req.user,
		guild: server,
		set: null,
		data: data,
		serviceURL: mode.url,
	})
});
router.post('/server/:guildID/secureinv', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);
	if (!server) return res.redirect('/dashboard/servers');
	if (!req.client.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id).permissions.has(Permissions.FLAGS.MANAGE_SERVER)) return res.redirect('/dashboard/servers');
	const data = req.body;
	console.log(data)
	if (data.type == 'remove') {
		await db.RemoveSecInvData(req.params.guildID)
	} else {
		await db.UpdateSecInvData(req.params.guildID, data.link, data.vtype)
	}
	let Ndata;
	let invData = await db.GetSecInvData(req.params.guildID);
	if (invData == "설정되지 않았어요") {
		Ndata = {
			link: `설정되지 않았어요`,
			type: `설정되지 않았어요`
		} 
	} else {
		Ndata = {
			link: invData.link,
			type: invData.type
		}
	}
	res.render('dashboard/secinv', {
		bot: req.client,
		user: req.user,
		guild: server,
		set: true,
		data: Ndata,
		serviceURL: mode.url,
	})
});
router.get('/server/:guildID/channels', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);

	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=1094679657975&guild_id=${req.params.guildID}`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}
	const channels = server.channels.cache.filter(a => a.type !== "GUILD_CATEGORY").toJSON();
	res.render('dashboard/channel/list', {
		bot: req.client,
		user: req.user,
		channels: channels,
		guild: server,
	})
})
router.post('/server/:guildID/channels', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);
	if (!server) return res.redirect('/dashboard/servers');
	if (!req.client.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id).permissions.has(Permissions.FLAGS.MANAGE_SERVER)) return res.redirect('/dashboard/servers');
	res.redirect(`/dashboard/server/${req.params.guildID}/channels/${req.body.channel}`)
});
router.get('/server/:guildID/channels/:channelID', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);
	const channel = req.client.channels.cache.get(req.params.channelID);
	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=1094679657975&guild_id=${req.params.guildID}`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}
	res.render('dashboard/channel/info', {
		bot: req.client,
		user: req.user,
		guild: server,
		channel: channel,
		ts: req.query,
		moment: moment,
	})
});
router.post('/server/:guildID/channels/:channelID', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);
	const channel = req.client.channels.cache.get(req.params.channelID);
	if (!server) return res.redirect('/dashboard/servers');
	if (!req.client.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id).permissions.has(Permissions.FLAGS.MANAGE_SERVER)) return res.redirect('/dashboard/servers');
	const data = req.body;
	// console.log(data)
	try {
		await channel.setRateLimitPerUser(data.time, `${req.user.tag} - ${req.user.id} - in 아람이 대시보드`);
		res.redirect(`/dashboard/server/${req.params.guildID}/channels/${req.params.channelID}?ts=true`)
	} catch (e) {
		res.render('dashboard/fail/slow', {
			bot: req.client,
			e: e,
			channel: req.client.channels.cache.get(req.params.channelID),
			guild: server,
		})
	}
});
router.get('/server/:guildID/antidobe', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);

	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=1094679657975&guild_id=${req.params.guildID}`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}
	let data = await db.getAntiDobe(req.params.guildID);
	res.render('dashboard/AntiTerror/antidobe', {
		bot: req.client,
		user: req.user,
		data: data,
		set: null,
	})
});
router.post('/server/:guildID/antidobe', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);
	if (!server) return res.redirect('/dashboard/servers');
	if (!req.client.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id).permissions.has(Permissions.FLAGS.MANAGE_SERVER)) return res.redirect('/dashboard/servers');
	let BData = req.body;
	if (BData.mode == 'on') {
		await db.OnAntiDobe(req.params.guildID);
	} else if (BData.mode == 'off') {
		await db.OffAntiDobe(req.params.guildID);
	}
	let data = await db.getAntiDobe(req.params.guildID);
	res.render('dashboard/AntiTerror/antidobe', {
		bot: req.client,
		user: req.user,
		data: data,
		set: true,
	})
});
module.exports = router;