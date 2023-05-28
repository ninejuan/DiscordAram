const mongo = require("mongoose")

const atev = new mongo.Schema({
    GuildID: { type: String}
})

module.exports = mongo.model("안티에블", atev)