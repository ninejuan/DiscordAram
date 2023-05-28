const mongo = require("mongoose")

const apme = new mongo.Schema({
    GuildID: { type: String}
})

module.exports = mongo.model("앞메검열", apme)