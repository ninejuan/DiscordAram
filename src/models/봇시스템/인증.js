const mongo = require("mongoose")

const logging = new mongo.Schema({
    GuildID: { type: String },
    RoleID: { type: String }
})

module.exports = mongo.model("인증세팅", logging)
