const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    oroginalName: {
        type: String,
        required: false
    },
    emailUser: {
        type: String,
        required: false
    },
    fileName: {
        type: String,
        required: false
    },
    userId: {
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