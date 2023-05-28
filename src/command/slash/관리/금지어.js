const Schema = require("../../../models/관리/금지어")
const { Permissions, MessageEmbed } = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const hexcolor = require('../../../base/hexcolor')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("금지어")
        .setDescription("서버의 금지어를 추가하거나 삭제해요")
        .addStringOption(option => option
            .setName("옵션")
            .setDescription("원하시는 옵션을 선택하세요")
            .addChoices(
                {name:`추가`,value:`추가`},
                {name:`삭제`,value:`삭제`},
                {name:`비활성화`,value:`비활성화`},
                {name:`목록`,value:`목록`},
            )
            .setRequired(true))
        .addStringOption(option => option
            .setName("단어")
            .setDescription("금지어로 설정할 단어를 입력하세요")
            .setRequired(false)
        ),
    async run(interaction, client) {
        if(!interaction.guild) return interaction.reply("서버에서만 사용할 수 있어요!")
        const op = interaction.options.getString("옵션")
        const text = interaction.options.getString("단어")
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: "<:disallow:1006582767582203976> 관리자 권한이 없어서 해당 명령어 사용이 불가능해요!<:disallow:1006582767582203976> ", ephemeral: true });
        if (!interaction.guild.me.permissions.has(require('discord.js').Permissions.FLAGS.ADMINISTRATOR)) {
            const embed = new (require('discord.js')).MessageEmbed()
            .setTitle('<:disallow:1006582767582203976> 권한이 없어요')
            .setDescription('아람이에게 `ADMINISTRATOR` 권한이 없어요')
            .setColor(require('../../../base/hexcolor').invisible)
            return interaction.reply({ embeds: [embed] });
        }
        if (op == "비활성화") {
            if (!text) return interaction.reply("단어를 입력해주세요!")
            const ff = await Schema.findOne({ serverid: interaction.guild.id, 금지어: text })
            const noembed = new MessageEmbed()
            .setTitle("<:disallow:1006582767582203976> 금지어에 포함되지 않는 단어에요<:disallow:1006582767582203976> ")
            .setColor(hexcolor.invisible)
            if (!ff) return interaction.reply({embeds: [noembed]})
            await Schema.findOneAndUpdate({ serverid: interaction.guild.id, 금지어: text }, {
                serverid: interaction.guild.id,
                금지어: text,
                온오프: "off"
            })
            const embed = new MessageEmbed()
            .setTitle(`${text}을/를 금지어 리스트에서 비활성화 했어요!`)
            .setColor(hexcolor.green2)
            interaction.reply({embeds: [embed]})
        }
        if (op == "추가") {
            if (!text) {
                const embed = new MessageEmbed()
                .setColor(require('../../../base/hexcolor').invisible)
                .setTitle(`<:disallow:1006582767582203976>  단어를 입력해주세요`)
                return interaction.reply({embeds: [embed]})
            }
            const find = await Schema.findOne({ serverid: interaction.guild.id, 금지어: text })
            if (find) {
                const alr = new MessageEmbed()
                .setTitle("<:disallow:1006582767582203976> 이미 금지된 단어에요ㅠㅠ<:disallow:1006582767582203976> ")
                .setColor(hexcolor.invisible)
                if (find.온오프 == "on") return interaction.reply({embeds: [alr]})
                await Schema.findOneAndUpdate({ serverid: interaction.guild.id, 금지어: text }, {
                    serverid: interaction.guild.id,
                    금지어: text,
                    온오프: "on"
                })
                const embed = new MessageEmbed()
                .setTitle(`<:allow:1006582759592046702> ${text}을/를 금지어로 지정했어요!`)
                .setColor(hexcolor.invisible)
                interaction.reply({embeds: [embed]})
            } else {
                const newData = new Schema({
                    serverid: interaction.guild.id,
                    금지어: text,
                    온오프: "on"
                })
                newData.save()
                const embed = new MessageEmbed()
                .setTitle(`<:allow:1006582759592046702> ${text}을/를 금지어로 지정했어요!`)
                .setColor(hexcolor.invisible)
                interaction.reply({embeds: [embed]})
            }
        }
        if(op=="삭제"){
            if (!text) return interaction.reply("단어를 입력해주세요!")
            await Schema.findOneAndDelete({ 금지어: text })
            const embed = new MessageEmbed()
                .setTitle(`<:disallow:1006582767582203976>  ${text}을/를 삭제했어요!`)
                .setColor(hexcolor.invisible)
            interaction.reply({embeds: [embed]})
        }
        if(op=="목록"){
            await Schema.find({ serverid: interaction.guild.id }).sort([['count', 'descending']]).limit(10).exec((err, res) => {
                const embed = new (require("discord.js")).MessageEmbed().setTitle("금지어 목록").setColor("GREEN").setTimestamp()
                for (let i = 0; i < res.length; i++) {
                    embed.addFields(
                        { name: `금지어 : ${res[i].금지어}`, value: `가동여부 : ${res[i].온오프}`, inline: true },
                        )
                }
                interaction.reply({ embeds: [embed] })
            })
            return
        }
    }
}