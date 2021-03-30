const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nameFile: {
        type: String,
        required: false
    },
    emailUser: {
        type: String,
        required: false
    },
    
    size: {
        type: Number,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const File = mongoose.model('File', UserSchema);

module.exports = File;