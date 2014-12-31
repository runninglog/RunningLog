module.exports = function(){
    // Load required packages
    var mongoose = require('mongoose');

    // Define our race schema
    var raceSchema   = new mongoose.Schema({
        name: String,
        city: String,
        distance: Number
    });

    // Return the Mongoose model
    return mongoose.model('races', raceSchema);
};
