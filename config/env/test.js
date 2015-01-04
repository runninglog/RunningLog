var mongodb_port = process.env.MONGO_PORT_27017_TCP_PORT || '27017';
var mongodb_addr = process.env.MONGO_PORT_27017_TCP_ADDR || '127.0.0.1';

module.exports = {
    db: 'mongodb://' + mongodb_addr + ':' + mongodb_port + '/runninglog_tst'
}
