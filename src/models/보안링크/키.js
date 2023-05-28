const mongo = require("mongoose")

const skey = new mongo.Schema({
    ip: { type: String, required: true },
    key: { type: String, required: true }
})

module.exports = mongo.model("임시가입키", skey)