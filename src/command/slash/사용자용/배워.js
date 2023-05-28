const Schema = require("../../../models/봇시스템/배워")
const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("배워")
        .setDescription("아람이가 단어를 배워요!")
        .addStringOption(option => option
            .setName("낱말")
            .setDescription("아람이가 학습할 단어를 입력해주세요!")
            .setRequired(true))
        .addStringOption(option => option
            .setName("정의")
            .setDescription("아람이가 학습할 단어의 뜻을 입력해 주세요!")
            .setRequired(true)
        ),
    async run(interaction) {
        const text1 = interaction.options.getString("낱말")
        const text2 = interaction.options.getString("정의")
        const find = await Schema.findOne({ wrd: text1.trim() })
        if (find) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("<a:error:977576443301232680>이미 저장된 단어에요!<a:error:977576443301232680>")
                    .setColor(`#2F3136`)
            ]
        })
        const newData = new Schema({
            userid: interaction.member.id,
            wrd: text1.trim(),
            mean: text2.trim()
        })
        newData.save()
        const embed = new (require("discord.js")).MessageEmbed()
            .setTitle("아람이가 단어를 학습했어요!")
            .setColor("#2F3136")
            .setTimestamp()
            .addField(`단어 : ${text1.trim()}`, `뜻 : ${text2.trim()}`)
            .addField(`이렇게 말해주세요!`, `아람아 ${text1}`)
            .setThumbnail(interaction.member.displayAvatarURL())
        interaction.reply({ embeds: [embed] })
    }
}