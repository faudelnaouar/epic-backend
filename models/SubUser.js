const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        default: "123456"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const SubUser = mongoose.model('SubUser', UserSchema);

module.exports = SubUser;