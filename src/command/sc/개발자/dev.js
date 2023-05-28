/**
 * [ README ]
 * ㄴ 본 코드는 라이트#3287에 의해 작성되었으며 다른 방식으로 다른 사람이 제작할수도 있습니다
 * ㄴ 슬래쉬커맨드 빌더를 사용했으며 접두사커맨드와 일반 슬래쉬커맨드는 본인이 직접 수정해야합니다.
 * ㄴ 2차 수정은 가능하나 배포는 금지합니다
 * ㄴ 오류는 라이트#3287 Dm을 통하여 질문해주세요
 * ㄴ © 2022. 라이트#3287 ALL RIGHTS RESERVED
 * ㄴ README 구간은 삭제를 금지합니다
 */
const client = require('../../../base/client')
const { SlashCommandBuilder, time } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Discord = require('discord.js');
const { exec } = require('child_process')


module.exports = {
  data: new SlashCommandBuilder()
    .setName("dev")
    .setDescription("개발자 전용 명령어")
    .addStringOption(option => option
      .setName("명령어")
      .setDescription("사용할 명령어를 입력하세요!")),

  async run(interaction) {
    if (interaction.user.id !== '927049010072682516') return interaction.reply({ content: "해당 명령어는 개발자 전용 명령어입니다." });
    const op = interaction.options.getString("명령어") || "없음"
    if (!op == '없음') {
      exec(op, (err, res) => {

        const stdout = res.slice(0, 2000)
        if (res.length > 2000) {
          return interaction.reply({ files: [new Discord.MessageAttachment(Buffer.from(res), "output.txt")], ephemeral: true })
        }
      })
    }
    const date = client.readyAt
    const relative = time(date, 'R');
    if (interaction.user.id !== '927049010072682516') return interaction.reply({ content: "해당 명령어는 개발자 전용 명령어입니다." });

    const 메인페이지 = new MessageEmbed()
      .setTitle("개발자 전용 명령어")
      .addFields(
        { name: "`봇 현황`", value: `ㄴ 현재 봇 상태 확인하기`, inline: false },
        { name: "`봇 정보`", value: `ㄴ 봇 정보 확인하기`, inline: false },

      )
      .setColor('GREEN')
      .setTimestamp()

    const 봇현황 = new MessageEmbed()
      .setTitle("[ ✅ ] 현재 ARAM의 현황")
      .addFields(
        { name: "핑", value: `> ${interaction.client.ws.ping} ms`, inline: true },
        { name: "서버 수", value: `> ${interaction.client.guilds.cache.size} Servers`, inline: true },
        { name: "유저 수", value: `> ${interaction.client.users.cache.size} Users`, inline: true },
        { name: "업타임", value: `> ${relative}`, inline: true },
        { name: "서버 OS", value: `> ${process.platform}`, inline: true },
        { name: "프로세스 넘버", value: `> ${process.pid}`, inline: true },
        { name: "Discord.JS 버전", value: `> v${Discord.version}`, inline: true },
        { name: "NodeJS 버전", value: `> ${process.version}`, inline: true },
        { name: "아람이 버전", value: '> v3.0', inline: true },

      )
      .setColor('GREEN')
      .setTimestamp()

    const 봇블랙 = new MessageEmbed()
      .setTitle("[ ✅ ] 봇 정보")
      .addFields(
        { name: "`블랙리스트`", value: `없음`, inline: true },
      )
      .setColor('GREEN')
      .setTimestamp()

    const buttons = [
      {
        customId: "Statue",
        label: "📊 현재 봇 현황",
        style: "PRIMARY",
        async action(interaction) {
          await interaction.reply({ embeds: [봇현황], ephemeral: true });
        },
      },
      {
        customId: "Black",
        label: "📊 봇 정보",
        style: "PRIMARY",
        async action(interaction) {
          await interaction.reply({ embeds: [봇블랙], ephemeral: true });
        },
      },
      {
        customId: "Delete",
        label: "🔒 삭제",
        style: "DANGER",
        async action(interaction) {
          await interaction.update({
            components: [],
          });
        },
      },
    ];

    const row = new MessageActionRow().addComponents(
      buttons.map((button) => {
        return new MessageButton()
          .setCustomId(button.customId)
          .setLabel(button.label)
          .setStyle(button.style);
      })
    );

    await interaction.reply({ embeds: [메인페이지], components: [row], ephemeral: true });

    const filter = (interaction) => {
      return buttons.filter(
        (button) => button.customId === interaction.customId
      );
    };

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 120 * 1000,
    });


    collector.on("collect", async (interaction) => {

      const button = buttons.find(
        (button) => button.customId === interaction.customId
      );
      await button.action(interaction);
    });

    collector.on("end", async (collect) => {
      interaction.channel.send({ content: "시간초과 상태가 되어 개발자 명령어를 사용하실 수 없습니다.", ephemeral: true });
    });
  },
};