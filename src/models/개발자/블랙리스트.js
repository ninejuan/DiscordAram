const mongoose = require("mongoose")
// 해당 코드는 자신의 model 파일쪽에 넣어주세요

const b = new mongoose.Schema({
    userid: String,
    date: String
})

const Model = module.exports = mongoose.model("블랙리스트",b)