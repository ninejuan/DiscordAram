const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    name: "역할정보",
    description: "역할정보를 확인해요.",
    data: new SlashCommandBuilder()
        .setName("역할정보")
        .setDescription("역할정보를 확인해요.")
        .addRoleOption(op =>
            op.setName("역할")
                .setDescription("역할을 선택해주세요.")
                .setRequired(true)),

    /**
    *
    * @param {import('discord.js').CommandInteraction} interaction
    */
    async run(interaction) {
        const role = interaction.options.getRole(`역할`)
        const permissions = {
            "VIEW_CHANNEL": "채널 보기",
            "MANAGE_CHANNELS": "채널 관리하기",
            "MANAGE_ROLES": "역할 관리하기",
            "MANAGE_EMOJIS_AND_STICKERS": "이모티콘 및 스티커 관리",
            "VIEW_AUDIT_LOG": "감사 로그 보기",
            "MANAGE_WEBHOOKS": "웹후크 관리하기",
            "MANAGE_GUILD": "서버 관리하기",
            "CREATE_INSTANT_INVITE": "초대 코드 만들기",
            "CHANGE_NICKNAME": "별명 변경하기",
            "MANAGE_NICKNAMES": "별명 관리하기",
            "KICK_MEMBERS": "멤버 추방하기",
            "BAN_MEMBERS": "멤버 차단하기",
            "SEND_MESSAGES": "메시지 보내기",
            "SEND_MESSAGES_IN_THREADS": "스레드에서 메시지 보내기",
            "CREATE_PUBLIC_THREADS": "공개 스레드 만들기",
            "CREATE_PRIVATE_THREADS": "비공개 스레드 만들기",
            "EMBED_LINKS": "링크 첨부",
            "ATTACH_FILES": "파일 첨부",
            "ADD_REACTIONS": "반응 추가하기",
            "USE_EXTERNAL_EMOJIS": "외부 이모티콘 사용",
            "USE_EXTERNAL_STICKERS": "외부 스티커 사용",
            "MENTION_EVERYONE": "@everyone, @here, 모든 역할 멘션하기",
            "MANAGE_MESSAGES": "메시지 관리",
            "MANAGE_THREADS": "스레드 관리하기",
            "READ_MESSAGE_HISTORY": "메시지 기록 보기",
            "SEND_TTS_MESSAGES": "텍스트 음성 변환 메시지 전송",
            "USE_APPLICATION_COMMANDS": "애플리케이션 명령어 사용",
            "CONNECT": "연결",
            "SPEAK": "말하기",
            "STREAM": "영상",
            "USE_VAD": "음성 감지 사용",
            "PRIORITY_SPEAKER": "우선 발언권",
            "MUTE_MEMBERS": "멤버들의 마이크 음소거하기",
            "DEAFEN_MEMBERS": "멤버들의 헤드셋 음소거하기",
            "MOVE_MEMBERS": "멤버 이동",
            "ADMINISTRATOR": "관리자",
        }
        const rolePermissions = role.permissions.toArray();
        const finalPermissions = [];
        for (const permission in permissions) {
            if (rolePermissions.includes(permission)) finalPermissions.push(`<a:okcheck:977576443410268190> ${permissions[permission]}`);
            else finalPermissions.push(`<a:error:977576443301232680> ${permissions[permission]}`);
        }
        const position = `${interaction.guild.roles.cache.size - role.position} 순위`;
        const embed = new MessageEmbed()
            .setTitle(`[ ${role.name} ] 역할 정보`)
            .setColor(`2F3136`)
            .setThumbnail(interaction.guild.iconURL)
            .addField('역할 이름', `<@&${role.id}>`, true)
            .addField('역할 아이디', `\`${role.id}\``, true)
            .addField('역할 위치', `${position}`, true)
            .addField('역할 권한', `\`\`\`css\n${finalPermissions.join('\n')}\`\`\``)
            .setTimestamp()
            .setColor("ff69b4")
            .setFooter(`${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL())
        interaction.reply({ embeds: [embed] })
    }
}
