var winston = require('winston');
var fs = require('fs');

winston.emitErrs = true;

var logPath = './log';
if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath, function(err){
        if (err)
            logger.error("Error creating " + logPath + ": " + err);
    });
}

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: logPath + '/server.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};
