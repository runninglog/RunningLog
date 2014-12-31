module.exports = function(app) {

    var api = app.controllers.api;

    app.get('/', api.index);
    app.get('/api', api.version);
};
