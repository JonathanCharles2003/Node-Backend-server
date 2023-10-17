const mongoose = require('mongoose');
const Schema = mongoose.Schema;//A schema is like a blueprint for defining the structure of documents in a MongoDB collection

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String
});

module.exports = mongoose.model('User', userSchema);
//This line exports the schema as a model named 'User'