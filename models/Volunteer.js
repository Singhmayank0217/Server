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
});


module.exports = mongoose.model('Volunteer', VolunteerSchema);

