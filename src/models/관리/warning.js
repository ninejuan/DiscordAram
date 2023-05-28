const mongo = require('mongoose')

const words = new mongo.Schema({
    serverid: {type:String},
    userid: {type:String},
    number: {type:Number},
})

module.exports = mongo.model("관리경고", words)