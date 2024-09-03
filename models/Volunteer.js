const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

