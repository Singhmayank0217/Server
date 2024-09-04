const mongoose = require('mongoose');

const VolunteerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    accountType: {
        type: String,
        enum: ['volunteer'],
        default: 'volunteer',
        required: true,
    },
});


module.exports = mongoose.model('Volunteer', VolunteerSchema);

