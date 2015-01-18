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
        if (!user) {
            logger.warn('Record not found: ' + req.params.id);
        }

        if (!err) {
            res.json(user);
        } else {
            // It's easier to just call the same endpoint for both IDs and actual usernames... right?
            logger.error('Get by ID failed, trying as username: ' + err);
            userModel.findOne({username: req.params.id}, function onFind(err, user) {
                if (!user) {
                    logger.warn('Record not found: ' + req.params.id);
                    res.sendStatus(404);
                }

                if (!err) {
                    res.json(user);
                } else {
                    logger.error('Get by username failed: ' + err);
                    res.send(Status500, err);
                }
            });
        }
    });
};

exports.post = function(req, res, next) {
    var usersModel = req.app.models.users;
    var newUser = new usersModel({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        role: req.body.role,
        locked: req.body.locked
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
            res.sendStatus(404);
        }

        user.password = req.body.password;
        user.name = req.body.name;
        user.role = req.body.role;
        user.locked = req.body.locked;

        var date = new Date();
        user.updated = date;

        user.save(function(err) {
            if (err) {
                logger.warn('Conflict, record exists? ' + err);
                res.sendStatus(409);
            }

            res.json(user);
        });
    });
};

exports.delete = function(req, res, next) {
    var usersModel = req.app.models.users;
    usersModel.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            logger.error('Post removal failed: ' + err);
            res.sendStatus(500);
        }

        res.sendStatus(204);
    });
};
