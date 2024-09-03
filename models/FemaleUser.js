const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    email: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('FemaleUser', FemaleUserSchema);

