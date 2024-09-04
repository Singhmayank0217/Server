const mongoose = require('mongoose');
const Volunteer = require('../models/Volunteer');
const FemaleUser = require('../models/FemaleUser');
const AlertMessage = require('../models/AlertMessage');
const geolib = require('geolib'); 

const calculateDistance = (coord1, coord2) => {
    return geolib.getDistance(coord1, coord2);
};

exports.handleAlert = async (req, res) => {
    try {
        const { femaleUserId, latitude, longitude } = req.body;

        // Validate required fields
        if (!femaleUserId || !latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: "Female user ID, latitude, and longitude are required",
            });
        }

        // Fetch the female user from the database
        const femaleUser = await FemaleUser.findById(femaleUserId);
        if (!femaleUser) {
            return res.status(404).json({
                success: false,
                message: "Female user not found",
            });
        }

        femaleUser.location = { latitude, longitude };
        await femaleUser.save();

        const volunteers = await Volunteer.find();
        const nearbyVolunteers = volunteers.filter(volunteer => {
            const distance = calculateDistance(
                { latitude, longitude },
                { latitude: volunteer.location.latitude, longitude: volunteer.location.longitude }
            );
            return distance <= 2000;
        });

        // Create an alert message in the database
        const alertMessage = await AlertMessage.create({
            femaleUser: femaleUser._id,
            victimDetails: {
                name: femaleUser.name,
                age: femaleUser.age,
                image: femaleUser.image,
            },
            location: {
                latitude,
                longitude,
            },
            notifiedVolunteers: nearbyVolunteers.map(volunteer => volunteer._id),
        });

        for (const volunteer of nearbyVolunteers) {
            console.log(`Notifying volunteer ${volunteer.name} at ${volunteer.contactNumber}`);
            // Add your notification logic here
        }

        return res.status(200).json({
            success: true,
            message: "Alert sent to nearby volunteers",
            alertMessage,
            notifiedVolunteers: nearbyVolunteers,
        });
    } catch (error) {
        console.error("Error handling alert:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while handling the alert",
            error: error.message,
        });
    }
};
