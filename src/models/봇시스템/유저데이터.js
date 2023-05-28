const mongoose = require("mongoose")
// 해당 코드는 자신의 model 파일쪽에 넣어주세요.

const join = new mongoose.Schema({
    userid: String,
    date: String,
    badges: Array,
})

const Model = module.exports = mongoose.model("가입목록",join)