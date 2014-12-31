module.exports = function(app) {

    var races = app.controllers.races;

    // Lists
    app.get('/api/races', races.index);
    app.get('/api/races/:id', races.get);

    // Modifies
    app.post('/api/races', races.post);
    app.put('/api/races/:id', races.put);

    // Removes
    app.delete('/api/races/:id', races.delete);
};
