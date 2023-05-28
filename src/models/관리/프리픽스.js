const mongo = require("mongoose")

const mod = new mongo.Schema({
    guildid: { type: String },
    prefix: { type: String }
})

module.exports = mongo.model("서버프리픽스", mod)