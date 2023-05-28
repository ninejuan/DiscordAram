const mongo = require("mongoose")

const logging = new mongo.Schema({
    GuildID: { type: String },
    ChannelID: { type: String }
})

module.exports = mongo.model("로그채널", logging)
// const { Schema, model } = require('mongoose')
// module.exports = model(
//     "modlogs",
//     new Schema({
//         Guild: String,
//         Channel: String,
//     })
// )