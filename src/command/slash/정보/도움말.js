const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions, MessageActionRow, MessageButton, MessageSelectMenu, Collector } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName("도움말")
		.setDescription("아람이의 메인 기능의 도움말을 확인해요!"),
	async run(interaction) {
		const author = interaction.user
		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('❓보고 싶은 도움말을 선택해주세요!')
					.addOptions([
						{
							label: '일반 명령어',
							description: '아람이가 가진 일반 기능의 도움말을 보여줘요!',
							value: 'util',
							emoji: '♻️',
						},
						{
							label: `채팅 관리 명령어`,
							description: '채팅 관리에 필요한 명령어들이에요!',
							value: 'chat_mod',
							emoji: `💬`,
						},
						{
							label: '서버 관리 명령어',
							description: '서버 관리에 필요한 명령어들이에요!',
							value: 'server_mod',
							emoji: '🛠️',
						},
						{
							label: '음악 명령어',
							description: '음악 기능과 관련된 명령어들이에요!',
							value: 'music',
							emoji: '🎵'
						},
						{
							label: '문의 & 답변',
							description: '문의와 답변입니다!',
							value: 'qna',
							emoji: '📱',
						},
					]),
			);
		const embed = new MessageEmbed()
			.setTitle("만나서 반가워요! 전 아람이에요!")
			.setDescription(`**
> 아람이가 할 수 있는걸 적어놨어요!
> 아래 메뉴에서 원하시는걸 골라주세요!
> 이 도움말은 메인 기능만을 담아뒀어요!
**`)
			.addField("**개발자**", `[팀 라온](https://laon.dev)`)
			.setColor(0xff69b4)
		const rowmsg = await author.send({ embeds: [embed], components: [row] }).then(() => {
			interaction.reply({
				embeds: [new MessageEmbed()
					.setTitle("DM을 확인해주세요!")
					.setColor(require('../../../base/hexcolor').invisible)
				]
			})
		}).catch((err) => {
			// console.log(err)
			interaction.reply({
				embeds: [new MessageEmbed()
					.setColor(require('../../../base/hexcolor').invisible)
					.setTitle("DM으로 보내지 못했어요ㅠㅠ")
				]
			})
		})
	}
}