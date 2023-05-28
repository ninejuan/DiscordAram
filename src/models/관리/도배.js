const mongo = require("mongoose")

const dobe = new mongo.Schema({
    GuildID: { type: String}
})

module.exports = mongo.model("도배", dobe)