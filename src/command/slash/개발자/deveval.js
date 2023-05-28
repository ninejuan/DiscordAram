
const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const Schema = require('../../../models/봇시스템/인증');
const Discord = require('discord.js');
const setting = require('../../../../setting');
const config = require('../../../setting/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("eval")
        .addStringOption(op => op
            .setName("구문")
            .setDescription("구문")
            .setRequired(true)),
    /**
     * 
     * @param {import('discord.js').CommandInteraction} interaction 
     */
    async run(interaction, client) {
        if (interaction.user.id !== '927049010072682516') {
            return ;
        } else {
            const command = interaction.options.getString("구문")
            if(command.includes(client.token))
                command = command.replace(client.token, "토큰")

            if(command.indexOf("exit") != -1 && command.indexOf("process") != -1) {
                return interaction.reply("봇을 끌려 하지 마요!!ㅠㅠ")
            } else {
                    const result = new Promise(r => r(eval(command)))
                    return result.then(value => {
                        if(typeof(value) !== "string") 
                            value = require('util').inspect(value, {depth: 0})
                        if(value.includes(client.token))
                            value = value.replace(client.token, "토큰")
                        
                        if(value.length > 1024) return interaction.reply({ files: [new Discord.MessageAttachment(Buffer.from(value), "출력.txt")], ephemeral: true })
                        let embed = new Discord.MessageEmbed()
                        .setColor("GREEN")
                        .addFields(
                            {name:"입력", value: "" + command + ""},
                            {name:"출력", value: "" + value + ""},
                            {name:"유형", value: "" + typeof value + ""}
                        );
                        interaction.reply({ embeds: [embed] })
                    }).catch(error => {
                        const errorembed = new Discord.MessageEmbed()
                        .setTitle("오류발생!")
                        .setDescription("오류가 발생했어요! 아래 내용을 확인해 주세요.")
                        .setColor("RED")
                        .addField("오류 내용", "" + error + "");
                        interaction.reply({ embeds: [errorembed] })
                })
            }
        }
    }
}