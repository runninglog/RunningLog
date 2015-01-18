var logger = require('../utils/logger');

module.exports = function(){
    // Load required packages
    var mongoose = require('mongoose');
    var bcrypt = require('bcrypt-nodejs');

    var validate = require('mongoose-validator');

    // Simple validators
    var usernameValidator = [
        validate({
            validator: 'isLength',
            arguments: [5, 25],
            message: 'Username should be between 5 and 25 characters'
        }),
        validate({
            validator: 'isAlphanumeric',
            passIfEmpty: true,
            message: 'Username should contain alpha-numeric characters only'
        }),
        validate({
            validator: 'isLowercase',
            passIfEmpty: true,
            message: 'Username should contain lowercase characters only'
        })
    ];

    var nameValidator = [
        validate({
            validator: 'isLength',
            arguments: [5, 50],
            message: 'Name should be between 5 and 50 characters'
        })
    ];

    // Define our user schema
    var userSchema = new mongoose.Schema({
        username: {
            validate: usernameValidator,
            type: String,
            required: true,
            trim: true,
            index: {
                unique: true
            },
        },
        // To be updated by bcrypt
        password: {
            type: String,
            required: true,
            trim: true
        },
        // To be updated by bcrypt
        salt: {
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
        },
        name: {
            validate: nameValidator,
            type: String,
            required: true,
            trim: true
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            required: true
        },
        locked: {
            type: Boolean,
            required: true
        }
    });

    // Execute before each user.save() call
    userSchema.pre('save', function(callback) {
        var user = this;

        // Break out if the password hasn't changed
        if (!user.isModified('password')) {
            return callback();
        }

        // Password changed so we need to hash it
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                logger.error('Password salting failed: ' + err);
                return callback(err);
            }

            bcrypt.hash(user.password, salt, null, function(err, hash) {
                if (err) {
                    logger.error('Password hashing failed: ' + err);
                    return callback(err);
                }
                user.password = hash;
                user.salt = salt;
                callback();
            });
        });
    });

    userSchema.methods.verifyPassword = function(password, callback) {
        bcrypt.compare(password, this.password, function(err, isMatch) {
            if (err) {
                // This is actually logged first by the main server code
                logger.warn('Password mismatch: ' + password);
                return callback(err);
            }
            callback(null, isMatch);
        });
    };

    // Return the Mongoose model
    return mongoose.model('users', userSchema);
};
