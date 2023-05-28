module.exports = async () => {
    const config = require('../setting/config')
    const logger = require('log4js').getLogger(`${config.logname} MongoDB`);
    console.log('Mongo Handler Loaded')
    console.log(config.database.mongo)
    const mongoose = require("mongoose")
    mongoose.connect(config.database.mongo, {
        useNewUrlParser: true, useUnifiedTopology: true
    }).then(logger.info("✅ | 데이터베이스 연결 완료"))
    logger.info('데이터베이스 연결 취소')
};