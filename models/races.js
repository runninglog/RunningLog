module.exports = function(){
    // Load required packages
    var mongoose = require('mongoose');

    // Define our race schema
    var raceSchema   = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        date: {
            type: Date,
            required: true
        },
        distance: {
            type: Number,
            required: true,
            trim: true
        },
        venue: {
            type: String,
            required: true,
            trim: true
        },
 
        // All fields from here below should be
        // understood as a "extra form" or optional info
        website: {
            type: String,
            required: false
        },
        poster: {
            type: String,
            required: false
        },
        created: {
            type: Date,
            default: Date.now,
            required: false
        },
        updated: {
            type: Date,
            default: Date.now,
            required: false
        }
    });

    // Return the Mongoose model
    return mongoose.model('races', raceSchema);
};
