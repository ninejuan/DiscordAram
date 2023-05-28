const { Permissions, MessageEmbed, MessageManager, MessageActionRow, MessageButton, ComponentType } = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const schema = require('../../../models/봇시스템/보안링크')
const setting = require('../../../../setting')
let mode;
if (setting.setup.mode == true) {
    mode = {
        URL: setting.dashboard.domain.main,
    }
} else if (setting.setup.mode == false) {
    mode = {
        URL: `${setting.dashboard.domain.test}:${setting.dashboard.port}`
    }
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('보안링크')
    .setDescription('보안 링크를 설정해요')
    .addStringOption(option => option
        .setName("옵션")
        .setDescription('보안 초대장을 끌지 말지 정해요')
        .setRequired(true)
        .addChoices(
            { name: '켜기', value: 'on' },
            { name: "끄기", value: 'off' },
            { name: '확인', value: 'check' }
        ))
    .addStringOption(option => option
        .setName('이름')
        .setDescription('보안 초대장의 이름을 설정해요')
        .setRequired(true))
    .addStringOption(option => option
        .setName("보안")
        .setDescription("인증의 종류를 결정해요")
        .addChoices(
          { name: "캡챠", value: 'captcha' },
          { name: "이메일 인증", value: "email" },
          { name: "캡챠 + 해외 IP 차단", value: 'kr_ip' },
          // { name: "소셜 로그인 + 캡챠", value: 'social' }
        )
        .setRequired(true)),
/**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   * @returns
   */
    async run(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            const embed = new MessageEmbed()
            .setTitle('<:disallow:1006582767582203976> 권한이 없어요')
            .setDescription('MANAGE_GUILD 권한이 없어요')
            .setColor(require('../../../base/hexcolor').invisible)
            return interaction.reply({ embeds: [embed] });
        }
        if (!interaction.guild.me.permissions.has(require('discord.js').Permissions.FLAGS.ADMINISTRATOR)) {
            const embed = new MessageEmbed()
            .setTitle('<:disallow:1006582767582203976> 권한이 없어요')
            .setDescription('아람이에게 ADMINISTRATOR 권한이 없어요')
            .setColor(require('../../../base/hexcolor').invisible)
            return interaction.reply({ embeds: [embed] });
        }
        const linkname = interaction.options.getString("이름");
        const option = interaction.options.getString('옵션');
        const sectype = interaction.options.getString("보안")
        if (option == 'on') {
            const isUnAvailable = await schema.findOne({
                link: linkname
            })
            if (isUnAvailable) { // 링크가 사용중일때
                const embed = new MessageEmbed()
                .setTitle(`<:disallow:1006582767582203976> 현재 \`${linkname}\` 주소는 이용중이에요`)
                .setColor(require('../../../base/hexcolor').invisible)
                return interaction.reply({ embeds: [embed] })
            } else if (!isUnAvailable) {
                const SecInv = await schema.findOne({
                    guildID: interaction.guild.id
                });
                if (SecInv) {
                    const buttons = [
                        // 각 버튼을 배열(array) 자료구조로 만들어요
                        {
                          customId: "secinv-change-goahead",
                          label: "바꾸기",
                          style: "PRIMARY",
                          emoji: '<:allow:1006582759592046702>',
                          async action(i) {
                            const embed = new MessageEmbed()
                            .setTitle('<:next_array:1006582763463381124>보안 초대 링크 변경됨<:array:1006527855112495114>')
                            .setDescription(`보안 초대 링크를 변경한 유저: <@${i.user.id}>`)
                            .addFields(
                                { name: '변경 전', value: `${mode.URL}/i/${SecInv.link}` },
                                { name: '변경 후', value: `${mode.URL}/i/${linkname}` }
                            )
                            .setColor(require('../../../base/hexcolor').invisible)
                            await schema.findOneAndDelete({ guildID: interaction.guild.id });
                            const newData = new schema({
                                guildID: interaction.guild.id,
                                link: linkname,
                                type: `${sectype}`,
                            })
                            newData.save();
                            interaction.deleteReply()
                            return interaction.channel.send({ embeds: [embed] })
                          },
                        },
                        {
                          customId: "secinv-change-maintain",
                          label: "유지하기",
                          style: "DANGER",
                          emoji: "<:disallow:1006582767582203976>",
                          async action(i) {
                            const embed = new MessageEmbed()
                               .setTitle(`<:disallow:1006582767582203976> 그대로 보안 초대 링크를 유지할게요`)
                                .setDescription(`보안 초대 링크는 \`${mode.URL}/i/${SecInv.link}\`이에요 `)
                                .setColor(require('../../../base/hexcolor').invisible)
                                interaction.deleteReply()
                                return interaction.channel.send({ embeds: [embed] })
                            },
                        },
                    ];
                    const row = new MessageActionRow().addComponents(
                      // buttons array를 하나씩 읽어서 버튼을 만들게 됩니다
                      buttons.map((button) => {
                        return new MessageButton()
                          .setCustomId(button.customId)
                          .setLabel(button.label)
                          .setStyle(button.style)
                          .setEmoji(button.emoji)
                      })
                    );
                    const embed = new MessageEmbed()
                      .setTitle(`정말로 보안 초대 URL을 \`/${SecInv.link}\`에서 \`${linkname}\`으로 바꾸실래요?`)
                      .setColor(require('../../../base/hexcolor').invisible)
                    interaction.reply({embeds: [embed], components: [row]})
                      const filter = (interaction) => {
                          return buttons.filter(
                              (button) => button.customId === interaction.customId
                          );
                      };
                        
                      const collector = interaction.channel.createMessageComponentCollector({
                          filter,
                          time: 60 * 9000, // 몇초동안 반응할 수 있는지, ms단위라서 3초면 3000으로 입력
                      });
      
                      collector.on("collect", async (interaction) => {
                          // 배열(buttons array)에 있는 동작을 자동으로 읽음
                          const button = buttons.find(
                            (button) => button.customId === interaction.customId
                          );
                          await button.action(interaction);
                        });
                } else {
                  const newData = new schema({
                      guildID: interaction.guild.id,
                      link: linkname,
                      type: `${sectype}`,
                  })
                  newData.save();
                  const embed = new MessageEmbed()
                  .setTitle('<:next_array:1006582763463381124> 보안 초대 링크가 생성되었어요 <:array:1006527855112495114>')
                  .setDescription(`${mode.URL}/i/${linkname}`)
                  .setColor(require('../../../base/hexcolor').invisible)
                  return interaction.reply({ embeds: [embed] })
              }
            }
        } else if (option == 'off') {
            const SecInv = await schema.findOne({
                guildID: interaction.guild.id
            });
            if (!SecInv) {
                const embed = new MessageEmbed()
                .setTitle('<:disallow:1006582767582203976> 이미 보안 초대 링크가 작동중이지 않아요')
                .setColor(require('../../../base/hexcolor').invisible)
                return interaction.reply({ embeds: [embed] })
            }
            const buttons = [
                // 각 버튼을 배열(array) 자료구조로 만들어요
                {
                  customId: "secinv-off-goahead",
                  label: "끄기",
                  style: "PRIMARY",
                  emoji: '<:allow:1006582759592046702>',
                  async action(i) {
                    await schema.findOneAndDelete({ guildID: interaction.guild.id });
                        const embed = new MessageEmbed()
                        .setTitle('<:allow:1006582759592046702> 보안 초대 링크가 종료되었어요')
                        .setDescription(`보안 링크를 종료한 유저: <@${i.user.id}>`)
                        interaction.deleteReply()
                        return interaction.channel.send({ embeds: [embed] })
                  },
                },
                {
                  customId: "secinv-off-cancel",
                  label: "취소",
                  style: "DANGER",
                  emoji: "<:disallow:1006582767582203976>",
                  async action(i) {
                    const embed = new MessageEmbed()
                        .setTitle(`<:disallow:1006582767582203976> 취소되었어요`)
                        .setColor(require('../../../base/hexcolor').invisible)
                        interaction.deleteReply()
                    return interaction.channel.send({ embeds: [embed] })
                  },
                },
              ];
          
              const row = new MessageActionRow().addComponents(
                // buttons array를 하나씩 읽어서 버튼을 만들게 됩니다
                buttons.map((button) => {
                  return new MessageButton()
                    .setCustomId(button.customId)
                    .setLabel(button.label)
                    .setStyle(button.style)
                    .setEmoji(button.emoji)
                })
              );
            const question_embed = new MessageEmbed()
            .setTitle(`<:next_array:1006582763463381124> 보안 링크 \`${SecInv.link}\`를 끌까요? <:array:1006527855112495114>`)
            .setColor(require('../../../base/hexcolor').invisible)
            const it = await interaction.reply({ embeds: [question_embed], components: [row] })
            
            const filter = (interaction) => {
                return buttons.filter(
                  (button) => button.customId === interaction.customId
                );
              };

            const collector = interaction.channel.createMessageComponentCollector({
                filter,
                time: 60 * 9000, // 몇초동안 반응할 수 있는지, ms단위라서 3초면 3000으로 입력
              });

            collector.on("collect", async (interaction) => {
                // 배열(buttons array)에 있는 동작을 자동으로 읽음
                const button = buttons.find(
                  (button) => button.customId === interaction.customId
                );
                await button.action(interaction);
              });
        } else if (option == 'check') {
            const SecInv = await schema.findOne({ guildID: interaction.guild.id })
            if (!SecInv) {
                const embed = new MessageEmbed()
                .setTitle("<:disallow:1006582767582203976> 이 서버엔 보안 링크가 존재하지 않아요")
                .setColor(require('../../../base/hexcolor').invisible)
                return interaction.reply({ embeds: [embed] })
            }
            const embed = new MessageEmbed()
            .setTitle(`이 서버의 보안 링크는 <:next_array:1006582763463381124>\`${mode.URL}/i/${SecInv.link}\`<:array:1006527855112495114>이에요`)
            .setColor(require('../../../base/hexcolor').invisible)
            return interaction.reply({ embeds: [embed] })
        }
    }
}