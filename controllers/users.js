var logger = require('../utils/logger');

exports.index = function(req, res, next) {
    var usersModel = req.app.models.users;
    usersModel.find(function(err, users) {
        if (err) {
            logger.error('Get all failed: ' + err);
            res.sendStatus(500);
        }
        
        res.json(users);
    });
};

exports.get = function(req, res, next) {
    var usersModel = req.app.models.users;
    usersModel.findById(req.params.id, function(err, user) {
        if (err) {
            logger.error('Get by ID failed: ' + err);
            res.sendStatus(500);
        }

        res.json(user);
    });
};

exports.post = function(req, res, next) {
    var usersModel = req.app.models.users;
    var newUser = new usersModel({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        role: req.body.role
    });

    newUser.save(function(err, user) {
        if (err) {
            logger.error('Post save failed: ' + err);
            res.sendStatus(500);
        }

        res.json(user);
    });
};

exports.put = function(req, res, next) {
    var usersModel = req.app.models.users;
    usersModel.findById(req.params.id, function(err, user) {
        if (err) {
            logger.warn('Record to update not found: ' + req.params.id);
            res.sendStatus(500);
        }

        user.password = req.body.password;
        user.name = req.body.name;
        user.role = req.body.role;

        user.save(function(err) {
            if (err) {
                logger.error(err);
                res.sendStatus(500);
            }

            res.json(user);
        });
    });
};

exports.delete = function(req, res, next) {
    var usersModel = req.app.models.users;
    usersModel.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.sendStatus(500);

        res.sendStatus(200);
    });
};
