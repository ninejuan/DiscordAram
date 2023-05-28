const mongoose = require("mongoose")

const secinv = new mongoose.Schema({
    guildID: String,
    link: String,
    type: String
})

const Model = module.exports = mongoose.model("보안링크", secinv)