const mongo = require("mongoose")

const account = new mongo.Schema({
    redirect: { type: String },
    clientId: { type: String },
    clientSecret: { type: String }
})

module.exports = mongo.model("API계정", account)