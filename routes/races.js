module.exports = function(app) {
    var passport = require('passport');
    var isAuthenticated = passport.authenticate('basic', {session: false});

    var races = app.controllers.races;

    // Lists
    app.get('/api/races', races.index);
    app.get('/api/races/:id', races.get);

    // Modifies
    app.post('/api/races', isAuthenticated, races.post);
    app.put('/api/races/:id', isAuthenticated, races.put);

    // Removes
    app.delete('/api/races/:id', isAuthenticated, races.delete);
};
