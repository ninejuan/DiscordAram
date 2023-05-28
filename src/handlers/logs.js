module.exports = async () => {
	const log4js = require('log4js');
    const config = require('../setting/config')
	const path = require('path');
	log4js.configure(path.join(__dirname, '../setting/log4js.json')); // log4js 설정
	
	const logger = require('log4js').getLogger(`${config.logname} Log`);
	logger.info('✅ | 콘솔 기록')
};