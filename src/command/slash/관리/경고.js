const { SlashCommandBuilder } = require("@discordjs/builders")
const Discord = require('discord.js')
const config = require('../../../setting/config')
const client = require('../../../base/client')
const wait = require('node:timers/promises').setTimeout;
const schema = require('../../../models/관리/warning');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("경고")
        .setDescription("유저에게 경고 관련 조치를 취해요")
        .addStringOption(option => option
            .setName("옵션")
            .setDescription("조치할 수 있는 리스트에요")
            .addChoices(
                { name: "부여", value: "부여" },
                { name: "회수", value: "회수" },
                { name: "확인", value: "확인" }
            )
            .setRequired(true))
        .addUserOption(option => option
            .setName("유저")
            .setDescription("경고 관련 조치를 취할 유저를 선택하세요")
            .setRequired(true)),
            /**
             * 
             * @param {import('discord.js').CommandInteraction} interaction 
             */
    async run(interaction) {
        schema.findOneAndDelete({ serverid: interaction.guild.id})
        const option = interaction.options.getString("옵션")
        const user = interaction.options.getUser('유저');
        if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MODERATE_MEMBERS)) {
            interaction.reply({ embeds: [new Discord.MessageEmbed()
                .setColor(require('../../../base/hexcolor').invisible)
                .setDescription(`<:disallow:1006582767582203976> ${interaction.user}에게는 \`MODERATE_MEMBERS\` 권한이 없네요`)
                .setTimestamp()
            ] })
        }
        if (option == '부여') {
            let find = await schema.findOne({
                serverid: interaction.guild.id,
                userid: user.id,
            })
            if (!find) {
                const newData = new schema({
                    serverid: interaction.guild.id,
                    userid: user.id,
                    number: 1,
                })
                newData.save();
                interaction.reply({ embeds: [new Discord.MessageEmbed()
                    .setColor(require('../../../base/hexcolor').invisible)
                    .setTitle('⚠️ 경고 - **부여** ⚠️')
                    .setDescription(`<:allow:1006582759592046702> ${user}에게 경고를 부여했어요`)
                    .setFooter({ 
                        text: `${user.tag}의 경고는 이제 1회에요`,
                        iconURL: `${user.displayAvatarURL()}`
                    })
                ] })
            } else {
                const newData = new schema({
                    serverid: interaction.guild.id,
                    userid: user.id,
                    number: find.number + 1,
                })
                newData.save();
                interaction.reply({ embeds: [new Discord.MessageEmbed()
                    .setColor(require('../../../base/hexcolor').invisible)
                    .setTitle('⚠️ 경고 - **부여** ⚠️')
                    .setDescription(`<:allow:1006582759592046702> ${user}에게 경고를 부여했어요`)
                    .setFooter({
                        text: `${user.tag}의 경고는 이제 ${find.number + 1}회에요`,
                        iconURL: `${user.displayAvatarURL()}`
                    })
                ] })
            }
        } else if (option == '회수') {
            let find = await schema.findOne({
                serverid: interaction.guild.id,
                userid: user.id,
            })
            if (!find || find.number == 0) {
                interaction.reply({ embeds: [new Discord.MessageEmbed()
                    .setColor(require('../../../base/hexcolor').invisible)
                    .setTitle('⚠️ 경고 - **회수** ⚠️')
                    .setDescription(`<:disallow:1006582767582203976> 이미 ${user}의 경고 수는 0회에요`)
                ] })
            } else {
                let num = find.number;
                await schema.remove({ serverid: interaction.guild.id, userid: user.id })
                const newData = new schema({
                    serverid: interaction.guild.id,
                    userid: user.id,
                    number: num - 1,
                })
                await newData.save();
                interaction.reply({ embeds: [new Discord.MessageEmbed()
                    .setColor(require('../../../base/hexcolor').invisible)
                    .setTitle('⚠️ 경고 - **회수** ⚠️')
                    .setDescription(`<:allow:1006582759592046702> ${user}에게서 경고를 회수했어요`)
                    .setFooter({ 
                        text: `${user.tag}의 경고는 이제 ${find.number - 1}회에요`,
                        iconURL: `${user.displayAvatarURL()}`
                    })
                ] });
            }
        } else if (option == '확인') {
            let find = await schema.findOne({
                serverid: interaction.guild.id,
                userid: user.id,
            })
            if (!find || find.number == 0) {
                interaction.reply({ embeds: [new Discord.MessageEmbed()
                    .setColor(require('../../../base/hexcolor').invisible)
                    .setDescription(`<:disallow:1006582767582203976> ${user}에겐 경고가 없어요`)
                ] })
            }
            interaction.reply({ embeds: [new Discord.MessageEmbed()
                .setColor(require('../../../base/hexcolor').invisible)
                .setDescription(`<:allow:1006582759592046702> ${user}에겐 ${find.number}개의 경고가 있어요`)
                .setFooter({
                    text: `${user.tag}`,
                    iconURL: `${user.displayAvatarURL()}`
                })
            ] })
        }
    }
}