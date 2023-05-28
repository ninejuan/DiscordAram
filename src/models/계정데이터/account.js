const mongo = require("mongoose")

const account = new mongo.Schema({
    id: { type: String },
    password: { type: String },
    email: { type: String }
})

module.exports = mongo.model("API계정", account)