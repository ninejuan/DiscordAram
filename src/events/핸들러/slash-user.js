const client = require('../../base/client')
const { Collection, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const config = require('../../setting/config')
const logger = require('log4js').getLogger(`${config.logname} Command - Slash`);
const Schema = require("../../models/개발자/블랙리스트.js");
const Schema2 = require("../../models/봇시스템/유저데이터.js");

module.exports = {
	name: "interactionCreate",
	/**
	 * 
	 * @param {import('discord.js').CommandInteraction} interaction 
	 * @returns 
	 */
	async run(interaction) {
		if (!interaction.isCommand() || interaction.isContextMenu) {
			const command = client.slashcommands.get(interaction.commandName)
			if (!command) return
			if (!interaction.guild) return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(config.embed.color)
						.setDescription(`${client.user}봇은 DM으로 명령어 사용이 불가능합니다.\n문의를 하실경우 문의 내용을 알려주세요! (DM문의)`)
				]
			})
			const black = await Schema.findOne({ userid: interaction.member.user.id })
			if (black) {
				return interaction.reply({
					embeds: [
						new MessageEmbed()
							.setTitle("오류")
							.setColor('#2F3136')
							.setDescription('❌ 당신은 봇 사용이 정지 당하셨어요!, 풀고 싶으시다면 개발자에게 문의를 해보세요 !')
					]
				})
			}
			try {
				const isReg = await Schema2.findOne({ userid: interaction.member.user.id })
				if (!isReg) {
					interaction.reply({ 
						embeds: [
							new MessageEmbed()
								.setTitle('<:next_array:1006582763463381124> 아람이에 회원가입 <:array:1006527855112495114>')
								.addFields({
									name: '**수집하는 개인정보**',
									value: `
										\`유저 ID\`: DB에서의 유저 식별을 위해 사용됩니다
										\`서버 ID\`: DB에서의 유저 식별을 위해 사용됩니다
										\`유저의 계정 정보\`: 대시보드, 보안초대링크에서 서버 불러오기, 유저 프로필 로드 등등에 필요합니다.
									`
								})
								.setThumbnail(client.user.displayAvatarURL())
								.setColor(require('../../base/hexcolor').invisible)
						],
						components: [
							new MessageActionRow().addComponents(
								new MessageButton()
									.setCustomId('joinaram-goahead')
									.setLabel('가입하기')
									.setEmoji('<:allow:1006582759592046702>')
									.setStyle('SECONDARY'),
								new MessageButton()
									.setCustomId('joinaram-cancel')
									.setLabel('취소하기')
									.setEmoji('<:disallow:1006582767582203976>')
									.setStyle('SECONDARY'),
								new MessageButton()
									.setLabel('이용약관')
									.setEmoji('📙')
									.setStyle('LINK')
									.setURL('https://docs.aramy.net/terms')
							)
						]
					});
					const collector = interaction.channel.createMessageComponentCollector({ time: 1 * 60 * 1000 });
					collector.on('collect', async i => {
						if (!i.user.id == interaction.user.id) {
							i.reply({ embeds: [
								new MessageEmbed()
									.setColor(require('../../base/hexcolor').invisible)
									.setTitle('<:disallow:1006582767582203976> 버튼을 사용할 수 없어요')
							], ephemeral: true })
						}
						if (i.customId == 'joinaram-goahead') {
							const dt = new Date()
							let date = dt.getFullYear().toString() + dt.getMonth().toString() + dt.getDate().toString() + dt.getHours().toString() + dt.getMinutes().toString() + dt.getSeconds().toString()
							const newData = new Schema2({
								userid: interaction.user.id,
								date: date,
							})
							await newData.save();
							i.reply('가입에 성공했어요')
							i.deleteReply();
							interaction.editReply({ 
								embeds: [
									new MessageEmbed()
										.setTitle(`${config.emoji.아바타.아람이} 가입에 성공했어요`)
										.setTimestamp()
								],
								components: [
									new MessageActionRow().addComponents(
										new MessageButton()
											.setCustomId('129379447576235982637523094')
											.setDisabled(true)
											.setLabel('가입 성공')
											.setStyle('SUCCESS')
									)
								]
							})
						} else if (i.customId == 'joinaram-cancel') {
							interaction.deleteReply();
						}
					})
				} else {
					await command.run(interaction, client)
				}
			} catch (err) {
				const date = new Date()
				const timeset = Math.round(date.getTime() / 1000)
				const errembedlog = new MessageEmbed()
					.setColor('DARK_BUT_NOT_BLACK')
					.setTitle("SlashCommands Error Log")
					.setAuthor({ name: `${client.user.username} - System`, iconURL: client.user.displayAvatarURL() })
					.setFields(
						{ name: "사용된 명령어", value: `${interaction.commandName}`, inline: true },
						{ name: "사용시간", value: `<t:${timeset}>`, inline: true },
						{ name: `접수된 에러 내용입니다.`, value: `\`\`\`${err}\`\`\`` },
						{ name: `사용자`, value: `${interaction.user}`, inline: true },
						{ name: `사용자 이름`, value: `${interaction.user.username}`, inline: true },
						{ name: `사용자 태그`, value: `${interaction.user.tag}`, inline: true },
						{ name: `사용자 ID`, value: `${interaction.user.id}`, inline: true },
					)
					.setTimestamp()
				if (interaction.guild) {
					const channel = client.channels.cache.get(interaction.channel.id)
					const invite = await channel.createInvite({ maxAge: 0, maxUses: 0 });
					let user = client.users.cache.get(interaction.guild.ownerId)
					if (!user) user = "Unknown#0000"
					errembedlog.addFields(
						{ name: `사용된 서버 소유자`, value: `${user.tag || user}`, inline: true },
						{ name: "사용서버", value: `${interaction.guild.name}`, inline: true },
						{ name: "사용서버id", value: `${interaction.guild.id}`, inline: true },
						{ name: "사용채널", value: `${interaction.channel}`, inline: true },
						{ name: "사용채널id", value: `${interaction.channel.id}`, inline: true },
						{ name: "에러발생서버 초대코드", value: `https://discord.gg/${invite.code}` },
					)
				}
				client.channels.cache.get(config.log.error).send({ embeds: [errembedlog] })
				client.users.fetch('939349343431954462').then((user) => { user.send({ embeds: [errembedlog] }) });
				logger.error(err)
				await interaction.reply({ content: "오류가 발생했습니다", ephemeral: true })
			}
		}
	}
}