module.exports = function(app) {
    var passport = require('passport');
    var isAuthenticated = passport.authenticate('basic', {session: false});
    
    var users = app.controllers.users;

    // Lists
    app.get('/api/users', users.index);
    app.get('/api/users/:id', users.get);

    // Modifies
    app.post('/api/users', isAuthenticated, users.post);
    app.put('/api/users/:id', isAuthenticated, users.put);

    // Removes
    app.delete('/api/users/:id', isAuthenticated, users.delete);
};
