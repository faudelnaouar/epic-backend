const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        //required: false
        default: "123456"
    },
    userType: {
        type: String,
        //j
        default: "admin"
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});


const User = mongoose.model('User', UserSchema);

module.exports = User;