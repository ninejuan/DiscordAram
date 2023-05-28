const mongo = require("mongoose")

const mod = new mongo.Schema({
    userid: { type: String },
    channelid: { type: String}
})

module.exports = mongo.model("검열제외", mod)