module.exports = function(app) {

    var users = app.controllers.users;

    // Lists
    app.get('/api/users', users.index);
    app.get('/api/users/:id', users.get);

    // Modifies
    app.post('/api/users', users.post);
    app.put('/api/users/:id', users.put);

    // Removes
    app.delete('/api/users/:id', users.delete);
};
