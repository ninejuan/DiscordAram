const mongo = require("mongoose")

const mod = new mongo.Schema({
    userid: { type: String },
    count: { type: String }
})

module.exports = mongo.model("검열횟수", mod)