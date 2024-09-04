const mongoose = require('mongoose');

const IncidentReportSchema = new Schema({
    alertMessage: {
        type: Schema.Types.ObjectId,
        ref: 'AlertMessage',
        required: true,
    },
    resolved: {
        type: Boolean,
        default: false,
    },
    incidentDetails: {
        type: String,
        required: true,
    },
    resolvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Volunteer',
    },
    resolvedAt: {
        type: Date,
    },
});

module.exports = mongoose.model('IncidentReport', IncidentReportSchema);
