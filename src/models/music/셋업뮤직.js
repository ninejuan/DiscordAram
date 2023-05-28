const mongo = require("mongoose")

const logging = new mongo.Schema({
    GuildID: { type: String },
    ChannelID: { type: String }
})

module.exports = mongo.model("뮤직셋업", logging)
