const Server = require('../../../models/관리/프리픽스');
const Levels = require('discord-xp');
const Censor = require('../../../models/검열/검열횟수');
const Warning = require('../../../models/관리/warning');
const VerifyRole = require('../../../models/봇시스템/인증');
const Logging = require('../../../models/로그/logchannel');
const JoinLeave = require('../../../models/로그/joinleave');
const SecInv = require('../../../models/봇시스템/보안링크');
const LinkC = require('../../../models/검열/앞메검열');
const AntiEv = require('../../../models/봇시스템/안티에블');
const AntiDobe = require('../../../models/관리/도배');

module.exports = class Manager {
	static async createServer(id) {
		const result = new Server({
			guildid: id,
			prefix: '아람!',
		});
		await result.save();
		// result;
		return result;
	}

	static async findServer(id) {
		const result = await Server.findOne({ guildid: id });

		return result;
	}

	static async getPrefix(id) {
		const result = await Server.findOne({ guildid: id });

		return result.prefix;
	}

	static async updateServerPrefix(id, prefix) {
		const result = await Server.findOne({ guildid: id });
		if (!result) {
			await new Server({ guildid: id, prefix: prefix }).save();
		} else if (result) {
			await Server.findOneAndUpdate({ guildid: id }, { guildid: id, prefix: prefix })
		}
	}
	static async getGuildLevels(client, guild) {
		const ranking_find = await Levels.fetchLeaderboard(guild, 10)
		if (ranking_find < 1) return null;
		const ranking = await Levels.computeLeaderboard(client, ranking_find)
		return ranking;
	}

	static async getUserCensor(id) {
		const db = await Censor.findOne({ userid: id })
		if (!db) return "기록되지 않음";
		if (db.count == null) return "0회";
		return db.count + "회";
	}

	static async getUserWarning(sid, uid) {
		const db = await Warning.findOne({
			serverid: sid,
			userid: uid
		})
		// console.log(db)
		if (!db) {
			return "경고가 없어요";
		}
		if (db.number == null) {
			return "0회";
		}
		return db.number+"회";
	}
	static async getVRole(sid) {
		const db = await VerifyRole.findOne({ GuildID: sid })
		if (!db) return "설정되지 않았어요";
		if (db.RoleID == null) return "설정되지 않았어요";
		return `${db.RoleID}`;
	}
	static async UpdateVRole(sid, rid) {
		const db = await VerifyRole.findOne({ GuildID: sid })
		if (!db) {
			await new VerifyRole({ GuildID: sid, RoleID: rid }).save();
		} else if (db) {
			await VerifyRole.findOneAndUpdate({ GuildID: sid }, { GuildID: sid, RoleID: rid })
		}
	}
	static async GetLogCh(sid) {
		const db = await Logging.findOne({ GuildID: sid })
		if (!db) return "설정되지 않았어요";
		if (db.ChannelID == null) return "설정되지 않았어요";
		return `${db.ChannelID}`;
	}
	static async UpdateLogCh(sid, cid) {
		const db = await Logging.findOne({ GuildID: sid })
		if (!db) {
			await new Logging({ GuildID: sid, ChannelID: cid }).save();
		} else if (db) {
			await Logging.findOneAndUpdate({ GuildID: sid }, { GuildID: sid, ChannelID: cid })
		}
	}
	static async RemoveLogCh(sid) {
		const db = await Logging.findOne({ GuildID: sid })
		if (db) {
			await Logging.remove({ GuildID: sid })
		}
	}
	static async GetJLData(sid) {
		const db = await JoinLeave.findOne({ GuildID: sid })
		if (!db) return "설정되지 않았어요";
		if (db.ChannelID == null) return "설정되지 않았어요";
		let data = {
			ChannelID: db.ChannelID,
			WelcomeMessage: db.WelcomeMessage || "{user}님, {guild}에서 앞으로 좋은 시간 보내세요!",
			ByeMessage: db.ByeMessage || "{user}님, {guild}에서 있으셨던 시간이 행복했었길 바랄게요"
		}
		return data;
	}
	static async UpdateJLData(sid, cid, wmsg, bmsg) {
		const db = await JoinLeave.findOne({ GuildID: sid })
		if (!db) {
			await new JoinLeave({ GuildID: sid, ChannelID: cid, WelcomeMessage: wmsg, ByeMessage: bmsg }).save();
		} else if (db) {
			await JoinLeave.findOneAndUpdate({ GuildID: sid }, { GuildID: sid, ChannelID: cid, WelcomeMessage: wmsg, ByeMessage: bmsg })
		}
	}
	static async RemoveJLData(sid) {
		const db = await JoinLeave.findOne({ GuildID: sid })
		if (db) {
			await JoinLeave.remove({ GuildID: sid })
		}
	}
	static async GetSecInvData(sid) {
		const db = await SecInv.findOne({ GuildID: sid })
		if (!db) return "설정되지 않았어요";
		if (db.link == null) return "설정되지 않았어요";
		let data = {
			link: db.link,
			type: db.type
		}
		return data;
	}
	static async UpdateSecInvData(sid, link, type) {
		const db = await SecInv.findOne({ guildID: sid })
		if (db) {
			await SecInv.remove({ guildID: sid})
		}
		// await SecInv.findOneAndUpdate({ guildID: sid }, { guildID: sid, link: link, type: type })
		await new SecInv({ guildID: sid, link: link, type: type }).save();
	}
	static async RemoveSecInvData(sid) {
		const db = await SecInv.findOne({ guildID: sid })
		if (db) {
			await SecInv.remove({ guildID: sid })
		}
	}
	static async getLinkC(sid) {
		const db = await LinkC.findOne({ GuildID: sid })
		if (!db) return "설정되지 않았어요";
		return "켜져있어요";
	}
	static async OnLinkC(sid) {
		const db = await LinkC.findOne({ GuildID: sid })
		if (!db) {
			await new LinkC({ GuildID: sid }).save();
		}
	}
	static async OffLinkC(sid) {
		const db = await LinkC.findOne({ GuildID: sid })
		if (db) {
			await LinkC.remove({ GuildID: sid })
		}
	}
	static async getAntiEv(sid) {
		const db = await AntiEv.findOne({ GuildID: sid })
		if (!db) return "설정되지 않았어요";
		return "켜져있어요";
	}
	static async OnAntiEv(sid) {
		const db = await AntiEv.findOne({ GuildID: sid })
		if (!db) {
			await new AntiEv({ GuildID: sid }).save();
		}
	}
	static async OffAntiEv(sid) {
		const db = await AntiEv.findOne({ GuildID: sid })
		if (db) {
			await AntiEv.remove({ GuildID: sid })
		}
	}
	static async getAntiDobe(sid) {
		const db = await AntiDobe.findOne({ GuildID: sid })
		if (!db) return "설정되지 않았어요";
		return "켜져있어요";
	}
	static async OnAntiDobe(sid) {
		const db = await AntiDobe.findOne({ GuildID: sid })
		if (!db) {
			await new AntiDobe({ GuildID: sid }).save();
		}
	}
	static async OffAntiDobe(sid) {
		const db = await AntiDobe.findOne({ GuildID: sid })
		if (db) {
			await AntiDobe.remove({ GuildID: sid })
		}
	}
};