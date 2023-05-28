const client = require('../../base/client')
const config = require('../../setting/config')
const {MessageEmbed}= require('discord.js')

module.exports = {
    id: "select",
    async run(interaction) {
        let choice = interaction.values
        if (choice == 'chat_mod') {
            const embed = new MessageEmbed()
                .setTitle("🛠️ 💬채팅💬 관리 명령어🛠️")
                .addFields(
                    { name: "/검열 서버 { 켜기 / 끄기 }", value: `검열기의 작동 여부를 설정해요!` },
                    { name: "/검열 설정 { 켜기 / 끄기 } { 채널 }", value: `검열기가 검열하지 않을 채널을 설정해요!` },
                    { name: "/검열 조회 { 유저 }", value: `선택한 유저의 검열 횟수를 조회해요!` },
                    { name: "/검열 로그 { 켜기 / 끄기 } { 채널 }", value: "검열 로깅 여부를 선택해요!" },
                    { name: "/로깅 설정 { 켜기 / 끄기 } { 채널 }", value: "종합 로깅 시스템 작동 여부를 설정해요!" },
                    { name: "/채팅청소 { 개수 } { 유저(선택) }", value: "채팅을 청소합니다! 원하는 유저의 채팅만 삭제할 수 있어요!" }
                )
                .setColor(0xff69b4)
                .setTimestamp()
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setFooter("채팅 관리 명령어!")
            interaction.reply({ embeds: [embed] })
        } else if (choice == 'server_mod') {
            const embed = new MessageEmbed()
                .setTitle("🛠️서버 관리 명령어🛠️")
                .addFields(
                    { name: "/슬로우 { 시간(초) }", value: "입력한만큼 명령어를 입력한 채널에 슬로우를 걸어요!" },
                    { name: "/유저관리 { 유저 } { 밴 / 킥 } { 사유 }", value: "유저를 추방 or 차단해요!" },
                    { name: "/입퇴장알림 설정 { 켜기 / 끄기 } { 채널 }", value: "입력한 채널에 유저 입장 & 퇴장 알림을 보내요!" },
                    { name: "/타임아웃 { 유저 } { 시간 }", value: "지정한 유저를 입력한만큼 타임아웃 시켜요!" },
                    { name: "/티켓", value: "사용한 채널에 문의용 티켓을 열 수 있는 메세지를 보내요!" },
                    { name: "/채널초기화", value: "입력한 채널의 채팅을 모두 삭제해요!" },
                    { name: "/닉네임관리 { 유저 } { 바꿀 닉네임 }", value: "선택한 유저를 작성한 닉네임으로 바꿔요!" }
                )
                .setColor(0xff69b4)
                .setTimestamp()
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setFooter("서버 관리 명령어!")
            interaction.reply({ embeds: [embed] })
        } else if (choice == 'music') {
            const embed = new MessageEmbed()
                .setTitle("🎵음악 명령어🎵")
                .addFields(
                    { name: "아람뮤직 볼륨 { 1~100 }", value: "설정한 숫자만큼 볼륨을 조절해요!" },
                    { name: "아람뮤직 재생중", value: "재생중인 음악의 정보를 보여줘요!" }
                )
                .setColor(0xff69b4)
                .setTimestamp()
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setFooter("음악 명령어!")
            interaction.reply({ embeds: [embed] })
        } else if (choice == 'util') {
            const embed = new MessageEmbed()
                .setTitle("♻️유저가 사용 가능한 명령어♻️")
                .addFields(
                    { name: "/계산기", value: "버튼으로 이루어진 계산기를 소환해요!" },
                    { name: "/단축링크 { 주소 }", value: "주어진 링크를 단축시켜요!" },
                    { name: "/랜덤소수 { 최대값 }", value: "1부터 최대값까지의 수 중 랜덤한 소수를 뽑아요!!" },
                    { name: "/랜덤숫자 { 최대값 }", value: "1부터 최대값까지의 수 중 랜덤한 정수를 뽑아요!" },
                    { name: "/마크서버 { 서버 주소 }", value: "마인크래프트 서버의 정보를 가져와요!" },
                    { name: "/맞춤법검사 { 문구 }", value: "작성한 문구의 맞춤법을 검사해요!" },
                    { name: "/번역 { 언어 } { 문구 }", value: "작성한 문구를 선택한 언어로 번역해요!" },
                    { name: "/스네이크", value: "뱀 게임을 해요!" },
                    { name: "/역할정보 { 역할 }", value: "선택한 역할의 권한 정보를 확인해요!" },
                    { name: "/영어이름 { 이름 }", value: "자신의 이름을 영어로 번역해요!" },
                    { name: "/유튜브", value: "유튜브 투게더를 사용해요!" },
                    { name: "/주사위", value: "주사위를 굴려요!" },
                    { name: "/코로나 { 지역 }", value: "선택한 지역의 코로나19 정보를 가져와요!" },
                    { name: "/타이머 { 옵션 } { 시간 }", value: "타이머를 시작해요!" },
                    { name: "/한강물", value: "현재 한강의 물 온도를 측정해요!" }
                )
                .setColor(0xff69b4)
                .setTimestamp()
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setFooter("유저 명령어!")
            interaction.reply({ embeds: [embed] })
        } else if (choice == 'qna') {
            const embed = new MessageEmbed()
                .setTitle("📱질의응답 명령어📱")
                .addFields(
                    { name: "/문의 { 내용 }", value: "봇 개발자에게 문의해요!" }
                )
                .setColor(0xff69b4)
                .setTimestamp()
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setFooter("문의 명령어!")
            interaction.reply({ embeds: [embed] })
        }
    },
};