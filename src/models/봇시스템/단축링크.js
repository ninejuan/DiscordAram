const mongo = require("mongoose")

const surl = new mongo.Schema({
    code: { type: String, required: true },
    origin: { type: String, required: true }
})

module.exports = mongo.model("단축링크", surl)