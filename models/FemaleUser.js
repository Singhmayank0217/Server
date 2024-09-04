const mongoose = require('mongoose');

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
    locationAllowed: {
        type: Boolean,
        default: false,
      },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('FemaleUser', FemaleUserSchema);

