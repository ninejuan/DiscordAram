const mongoose = require("mongoose")

const cnfcpr = new mongoose.Schema({
    count: { type: Number },
    guildid: String,
    userid: String,
    date: String
})

const Model = module.exports = mongoose.model("출석체크", cnfcpr)