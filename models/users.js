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
            unique: true,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        created: {
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
        }
    });

    // Execute before each user.save() call
    userSchema.pre('save', function(callback) {
        var user = this;

        // Break out if the password hasn't changed
        if (!user.isModified('password')) return callback();

        // Password changed so we need to hash it
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return callback(err);

            bcrypt.hash(user.password, salt, null, function(err, hash) {
                if (err) return callback(err);
                user.password = hash;
                callback();
            });
        });
    });

    // Return the Mongoose model
    return mongoose.model('users', userSchema);
};
