const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, Permissions, MessageActionRow } = require('discord.js')
const config = require('../../../setting/config')
const client = require('../../../base/client')
const schema = require('../../../models/봇시스템/유저데이터')
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("뱃지")
        .setDescription("개발자가 유저에게 아람이 뱃지를 부여해요")
        .addStringOption(option => option
            .setName("옵션")
            .setDescription("옵션이에요")
            .addChoices(
                { name: '주기', value: '주기' },
                { name: '없애기', value: '없애기'},
                { name: '보기', value: '보기' }
            )
            .setRequired(true))
        .addStringOption(option => option
            .setName("유저")
            .setDescription("뱃지 관련 조치를 취할 유저의 ID를 입력하세요")
            .setRequired(true))
        .addStringOption(option => option
            .setName("타입")
            .setDescription("뱃지의 종류를 설정하세요")
            .addChoices(
                { name: '개발자', value: 'developer' },
                { name: '파트너', value: 'partner' },
                { name: '후원자', value: 'supporter' },
                { name: '버그헌터 - NEW', value: 'bughunt' },
                { name: '버그헌터 - SENIOR', value: 'bughunt2' },
                { name: '아람이 MOD', value: 'mod' },
                { name: 'DESIGNER', value: 'design' },
                { name: 'OWNER', value: 'owner' }
            )
            .setRequired(true)),
    /**
     * 
     * @param {import('discord.js').CommandInteraction} interaction 
     * @returns 
     */
    async run(interaction) {
        const option = interaction.options.getString('옵션');
        const userid = interaction.options.getString('유저');
        const type = interaction.options.getString('타입');
        if (!require('../../../../setting').setup.dokdo.devid.includes(interaction.user.id)) {
            interaction.reply("<:disallow:1006582767582203976> 개발자만 쓸 수 있어요")
        } else {
            if (option == '주기') {
                let Find = await schema.findOne({ userid: userid });
                if (Find) {
                    let date = Find.date;
                    let userid = Find.userid;
                    let badges = Find.badges || [];
                    badges.push(type)
                    await schema.deleteOne({ userid: userid });
                    await new schema({
                        userid: userid,
                        date: date,
                        badges: badges
                    }).save();
                    interaction.reply(JSON.stringify(badges) || '0')
                } else {
                    interaction.reply({ 
                        embeds: [
                            new MessageEmbed()
                                .setColor(require('../../../base/hexcolor').invisible)
                                .setTitle(`<:disallow:1006582767582203976> 해당 유저는 아람이에 가입하지 않았어요`)
                        ]
                    })
                }
            } else if (option == '없애기') {

            } else {
                let Find = await schema.findOne({ userid: userid })
                if (Find) {
                    interaction.reply(JSON.stringify(Find.badges) || '없습니다')
                } else {
                    interaction.reply('없습니다')
                }
            }
        }
    }
}