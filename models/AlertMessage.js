const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AlertMessageSchema = new Schema({
    femaleUser: {
        type: Schema.Types.ObjectId,
        ref: 'FemaleUser',
        required: true,
    },

    victimDetails: {
        name: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
    },
    location: {
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    },
    notifiedVolunteers: [{
        type: Schema.Types.ObjectId,
        ref: 'Volunteer',
        required: true,
      }],
});

module.exports = mongoose.model('AlertMessage', AlertMessageSchema);

