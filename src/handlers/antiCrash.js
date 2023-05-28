module.exports = () => {
    const config = require('../setting/config')
    const logger = require('log4js').getLogger(`${config.logname} Error Log`);
    process.on('unhandledRejection', (reason, p) => {
        logger.info(' [antiCrash] :: 처리되지 않은 거부/캐치');
        logger.info(reason, p);
    });
    process.on("uncaughtException", (err, origin) => {
        logger.info(' [antiCrash] :: 포착되지 않은 예외/캐치');
        logger.error(err, origin);
    })
    process.on('uncaughtExceptionMonitor', (err, origin) => {
        logger.info(' [antiCrash] :: 캡처되지 않은 예외/캐치(MONITOR)');
        logger.error(err, origin);
    });
    process.on('multipleResolves', (type, promise, reason) => {
        logger.info(' [antiCrash] :: 다중 해결');
        //  logger.info(type, promise, reason);
    });
}