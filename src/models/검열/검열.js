const mongo = require("mongoose")

const mod = new mongo.Schema({
    userid: { type: String },
    guildid: { type: String}
})

module.exports = mongo.model("검열", mod)