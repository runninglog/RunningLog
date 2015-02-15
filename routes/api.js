module.exports = function(app) {

    var api = app.controllers.api;

    app.get('/', api.index);

    if (process.env.NODE_ENV !== 'production') {
        app.get('/api', api.documentation);
    }
};
