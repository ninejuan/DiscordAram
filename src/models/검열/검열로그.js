const mongo = require("mongoose")

const mod = new mongo.Schema({
    userid: { type: String },
    guildid: { type: String },
    channelid: { type: String }
})

module.exports = mongo.model("검열로그", mod)