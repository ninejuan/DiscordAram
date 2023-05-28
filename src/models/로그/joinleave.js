const mongo = require("mongoose")

const logging = new mongo.Schema({
    GuildID: { type: String },
    ChannelID: { type: String },
    WelcomeMessage: { type: String },
    ByeMessage: { type: String }
})

module.exports = mongo.model("입퇴장채널", logging)
