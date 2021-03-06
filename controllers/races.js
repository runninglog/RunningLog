var logger = require('../utils/logger');

exports.index = function(req, res, next) {
    var racesModel = req.app.models.races;
    racesModel.find(function(err, races) {
        if (err) {
            logger.error('Get all failed: ' + err);
            res.sendStatus(500);
        }
        
        res.json(races);
    });
};

exports.get = function(req, res, next) {
    var racesModel = req.app.models.races;
    racesModel.findById(req.params.id, function(err, race) {
        if (!race) {
            logger.warn('Record not found: ' + req.params.id);
        }

        if (err) {
            logger.error('Get by ID failed: ' + err);
            res.sendStatus(500);
        }

        res.json(race);
    });
};

exports.post = function(req, res, next) {
    var racesModel = req.app.models.races;
    var newRace = new racesModel({
        name: req.body.name,
        city: req.body.city,
        date: req.body.date,
        venue: req.body.venue,
        distance: req.body.distance
    });

    newRace.save(function(err, race) {
        if (err) {
            logger.error('Post save failed: ' + err);
            res.sendStatus(500);
        }

        res.json(race);
    });
};

exports.put = function(req, res, next) {
    var racesModel = req.app.models.races;
    racesModel.findById(req.params.id, function(err, race) {
        if (err) {
            logger.warn('Record to update not found: ' + req.params.id);
            res.sendStatus(404);
        }

        race.name = req.body.name;
        race.city = req.body.city;
        race.date = req.body.date;
        race.venue = req.body.venue;
        race.distance = req.body.distance;

        race.save(function(err) {
            if (err) {
                logger.warn('Conflict, record exists? ' + err);
                res.sendStatus(409);
            }

            res.json(race);
        });
    });
};

exports.delete = function(req, res, next) {
    var racesModel = req.app.models.races;
    racesModel.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            logger.error('Post removal failed: ' + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(204);
        }
    });
};
