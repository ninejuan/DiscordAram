const mongoose = require("mongoose")

const d = new mongoose.Schema({
    userid: String,
    wrd: String,
    mean: String,
})
module.exports = mongoose.model("배워", d)