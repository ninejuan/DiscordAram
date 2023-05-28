module.exports = async () => {
	const client = require('../base/client')
	const config = require('../setting/config')
	const fs = require('fs')
	const { REST } = require("@discordjs/rest")
	const { Routes } = require("discord-api-types/v10")
	const { Collection } = require('discord.js')
	const logger = require('log4js').getLogger(`${config.logname} Command - Slash`);
	const commands = []
	client.slashcommands = new Collection()
	fs.readdirSync("./src/command/slash").forEach(dirs => {
		const commandfolder = fs.readdirSync(`./src/command/slash/${dirs}/`).filter(file => file.endsWith(".js"))
		for (const file of commandfolder) {
			const command = require(`../command/slash/${dirs}/${file}`)
			commands.push(command.data.toJSON());
			client.slashcommands.set(command.data.name, command)
		}
	})
	const rest = new REST({ version: '9' }).setToken(config.bot.token)

	const commandssc = []
	client.slashcommandssc = new Collection()
	fs.readdirSync("./src/command/sc").forEach(dirs => {
		const commandfolder = fs.readdirSync(`./src/command/sc/${dirs}/`).filter(file => file.endsWith(".js"))
		for (const file of commandfolder) {
			const command = require(`../command/sc/${dirs}/${file}`)
			commandssc.push(command.data.toJSON());
			client.slashcommandssc.set(command.data.name, command)
		}
	})

	client.once('ready', async () => {
		try {
			logger.info(`❓ | 빗금 커맨드 푸쉬중 . . .`)
			await rest.put(
				Routes.applicationCommands(client.user.id),
				{ body: commands }
			)
			logger.info(`✅ | 빗금 커맨드 푸쉬 완료`)
		} catch (e) {
			logger.error(e)
		}
		config.mainserver.add.guild.map(async (guildId) => {
			logger.info(`❓ | 길드 커맨드 푸쉬중 . . .`)
			try {
				await rest.put(Routes.applicationGuildCommands(config.bot.clientId, guildId), {
					body: commandssc,
				});
				logger.info(`✅ | ${guildId} 길드 커맨드 푸쉬 완료`)
			} catch (error) {
				logger.error(error)
			}
		});
		config.mainserver.delete.guild.map(async (guildId) => {
			logger.info(`❓ | 길드 커맨드 푸쉬제거중 . . .`)
			try {
				await rest.put(Routes.applicationGuildCommands(config.bot.clientId, guildId), {
					body: {},
				});
				logger.info(`✅ | ${guildId} 길드 커맨드 푸쉬 제거완료`)
			} catch (error) {
				logger.error(error)
			}
		});
	})
};