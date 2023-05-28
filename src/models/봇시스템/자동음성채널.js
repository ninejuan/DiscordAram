const mongo = require("mongoose")

const autovoice = new mongo.Schema({
    GuildID: { type: String }
})

module.exports = mongo.model("자동음성", autovoice)