// Winston logging support
//var log = require('../log')(module);

exports.index = function(req, res, next) {
    var RaceModel = req.app.models.Race;
    RaceModel.find(function(err, races) {
        if (!err) {
            res.json(races);
        } else {
            logger.error('Get all failed: ' + err);
            res.send(err);
        }
    });
};

exports.get = function(req, res, next) {
    var RaceModel = req.app.models.Race;
    RaceModel.findById(req.params.race_id, function(err, race) {
        if (!race) {
            logger.warn('Record not found: ' + req.params.race_id);
            res.json(404);
        }

        if (!err) {
            res.json(race);
        } else {
            logger.error('Get by ID failed: ' + err);
            res.send(err);
        }
    });
};

exports.post = function(req, res, next) {
    var RaceModel = req.app.models.Race;
    var newRace = new RaceModel({
        name: req.body.name,
        city: req.body.city,
        distance: req.body.distance,
    });

    newRace.save(function(err, race) {
        if (!err) {
            res.json(race);
        } else {
            logger.error('Post save failed: ' + err);
            res.send(err);
        }
    });
};

exports.put = function(req, res, next) {
    var RaceModel = req.app.models.Race;
    RaceModel.findById(req.params.race_id, function(err, race) {
        if (!race) {
            logger.warn('Record to update not found: ' + req.params.race_id);
            res.json(404);
        }

        race.name = req.body.name;
        race.city = req.body.city;
        race.distance = req.body.distance;

        race.save(function(err) {
            if (!err) {
                res.json(race);
            } else {
                logger.warn('Conflict, record exists? ' + err);
                res.send(err);
            }
        });
    });
};

exports.delete = function(req, res, next) {
    var RaceModel = req.app.models.Race;
    RaceModel.findById(req.params.race_id, function(err, race) {
        if (!race) {
            log.warn('Record for removal not found: ' + req.params.race_id);
            res.json(404);
        } else {
            user.remove(function(err) {
                if (!err) {
                    res.send(204);
                } else {
                    log.error('Post removal failed: ' + err);
                    res.send(err);
                }
            });
        }
    });
};
