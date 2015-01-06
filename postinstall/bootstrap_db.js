var mongoose = require('mongoose');

var config = require('config')
var logger = require('../utils/logger');
var usersModel = require('../models/users')();

var connect = function () {
    var options = { server: { socketOptions: { keepAlive: 1 } } };
    mongoose.connect(config.db, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnect', function() {
    logger.info('Disconnected to database');
});
mongoose.connection.once('open', function() {
    logger.info('Connected to database');
});

var adminUser = new usersModel({
    username: 'admin',
    //FIXME We should not save a default password, but create the user locked
    password: 'admin',
    name: 'RunningLog Admin',
    role: 'admin'
});

adminUser.save(function(err, user) {
    if (err) {
        logger.error('Error creating admin :' + err);
        process.exit(1);
    }

    logger.info('Admin user created');
    process.exit();
});
