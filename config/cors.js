module.exports = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:9000");
    res.header('Access-Control-Allow-Headers', "Origin, Authorization, Accept, Content-Type, Content-Length, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, UPDATE, PATCH, HEAD, DELETE, OPTIONS");

    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
};
