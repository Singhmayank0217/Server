const mongoose = require('mongoose');
const { type } = require('os');

const FemaleUserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    coNumber: {
        type: String,
        required: true,
    },
    parentsCoNumber: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    },
    locationAllowed: {
        type: Boolean,
        default: false,
    },
    accountType: {
        type: String,
        enum: ['femaleUser'],
        default: 'femaleUser',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('FemaleUser', FemaleUserSchema);

