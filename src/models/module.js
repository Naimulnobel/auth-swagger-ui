const mongoose = require('mongoose');
const moduleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'

    }
}, {
    timestamps: true
})
const Module = mongoose.model('Module', moduleSchema)
module.exports = Module