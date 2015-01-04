var fs = require('fs');

var mongodb_port = process.env.MONGO_PORT_27017_TCP_PORT || '27017';
var mongodb_addr = process.env.MONGO_PORT_27017_TCP_ADDR || '127.0.0.1';

module.exports = {
    db: 'mongodb://' + mongodb_addr + ':' + mongodb_port + '/runninglog_prd',
    serverPort: process.env.SERVER_PORT || 8443,
    serverOptions: {
        // Certificates should not be self-signed in production
        key: fs.readFileSync('certs/key.pem'),
        cert: fs.readFileSync('certs/cert.pem')
    }

}
