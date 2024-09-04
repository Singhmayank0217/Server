const bcrypt = require("bcrypt");
const FemaleUser = require("../models/FemaleUser");
const Volunteer = require("../models/Volunteer");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

// Sign Up
const signUp = async (req, res) => {
    try {
        const { name, image, age, coNumber, parentsCoNumber, email, password, confirmPassword, accountType, contactNumber, otp } = req.body;


        if (!name || !email || !password || !confirmPassword || !otp || (accountType === 'femaleUser' && (!age || !coNumber || !parentsCoNumber)) || (accountType === 'volunteer' && !contactNumber)) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Validate password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password and Confirm Password do not match',
            });
        }

        // Check if user already exists
        const existingUser = await (accountType === 'femaleUser' ? FemaleUser.findOne({ email }) : Volunteer.findOne({ email }));
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User is already registered',
            });
        }

        // Validate OTP
        const otpResponse = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        if (otpResponse.length === 0 || otp !== otpResponse[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user based on account type
        let user;
        if (accountType === 'femaleUser') {
            user = await FemaleUser.create({
                name,
                image,
                age,
                coNumber,
                parentsCoNumber,
                email,
                password: hashedPassword,
                accountType: 'femaleUser',
            });
        } else if (accountType === 'volunteer') {
            user = await Volunteer.create({
                name,
                contactNumber,
                image,
                email,
                password: hashedPassword,
                accountType: 'volunteer',
            });
        }

        return res.status(200).json({
            success: true,
            user,
            message: 'User registered successfully',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User registration failed. Please try again",
        });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password, accountType } = req.body;


        if (!email || !password || !accountType) {
            return res.status(403).json({
                success: false,
                message: 'Please fill all the required fields',
            });
        }

        const user = await (accountType === 'femaleUser' ? FemaleUser.findOne({ email }) : Volunteer.findOne({ email }));
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not registered. Please sign up first",
            });
        }

        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "20h" });
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: 'Logged in successfully',
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Incorrect password',
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Login failed. Please try again',
        });
    }
};

// Send OTP
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const checkUserPresent = await FemaleUser.findOne({ email }) || await Volunteer.findOne({ email });
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: 'User already registered',
            });
        }

        let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
        while (await OTP.findOne({ otp })) {
            otp = otpGenerator.generate(6, { upperCaseAlphabets: false });
        }

        const otpPayload = { email, otp };
        await OTP.create(otpPayload);

        const otpBody = await OTP.create(otpPayload);
        console.log("OTP Body", otpBody);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otp, // For development only; remove in production
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send OTP. Please try again',
        });
    }
};

// Change Password
const changePassword = async (req, res) => {
    try {
        const userDetails = await FemaleUser.findById(req.user.id) || await Volunteer.findById(req.user.id);
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        if (!await bcrypt.compare(oldPassword, userDetails.password)) {
            return res.status(401).json({ success: false, message: "Incorrect old password" });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(401).json({ success: false, message: "New password and confirm password do not match" });
        }

        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        await (userDetails.accountType === 'femaleUser' ? FemaleUser.findByIdAndUpdate(req.user.id, { password: encryptedPassword }) : Volunteer.findByIdAndUpdate(req.user.id, { password: encryptedPassword }));

        try {                                                          // Send notification email , here passwordUpdated is template of email which is send to user;
            const emailResponse = await mailSender(updatedUserDetails.email, passwordUpdated(updatedUserDetails.email, `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`));
            console.log("Email sent successfully:", emailResponse.response);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }
        return res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Error occurred while updating password:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update password. Please try again",
        });
    }
};

module.exports = { signUp, login, sendOTP, changePassword };
