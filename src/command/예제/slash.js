const { SlashCommandBuilder } = require("@discordjs/builders")
const Discord = require('discord.js')
const config = require('../../setting/config')
const client = require('../../../client/client')
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("")
        .setDescription("")
        .addStringOption(option => option
            .setName("")
            .setDescription("")
            .setRequired(true))
        .addIntegerOption(option => option
            .setName("")
            .setDescription("")
            .setRequired(true))
        .addBooleanOption(option => option
            .setName("")
            .setDescription("")
            .setRequired(true))
        .addUserOption(option => option
            .setName("")
            .setDescription("")
            .setRequired(true))
        .addChannelOption(option => option
            .setName("")
            .setDescription("")
            .setRequired(true))
        .addNumberOption(option => option
            .setName("")
            .setDescription("")
            .setRequired(true))
        .addMentionableOption(option => option
            .setName("")
            .setDescription("")
            .setRequired(true))
        .addAttachmentOption(option => option
            .setName("")
            .setDescription("")
            .setRequired(true))
    ,
    /**
     * 
     * @param {import('discord.js').CommandInteraction} interaction 
     * @returns 
     */
    async run(interaction) {
        const string = interaction.options.getString('');
        const integer = interaction.options.getInteger('');
        const boolean = interaction.options.getBoolean('');
        const user = interaction.options.getUser('');
        const member = interaction.options.getMember('');
        const channel = interaction.options.getChannel('');
        const role = interaction.options.getRole('');
        const number = interaction.options.getNumber('');
        const mentionable = interaction.options.getMentionable('');
        const attachment = interaction.options.getAttachment('');
    }
}