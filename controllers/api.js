exports.index = function(req, res, next) {
    // Gracefully accepts requests on site root
    res.sendStatus(200);
};

exports.documentation = function(req, res, next) {
    res.json(req.app._router.stack);
};
