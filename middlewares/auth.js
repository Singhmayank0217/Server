const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");



exports.auth = async (req, res, next) => {
    try{
        //extract token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        if(!token){                                             
            return res.status(401).json({
                success:false,
                message:'TOken is missing',
            });
        }

        try{                                                                   
            const decode =  jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(err) {                       
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();
    }
    catch(error) {  
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}

//isSFemale
exports.isFemale = async (req, res, next) => {
 try{
        if(req.user.accountType !== "femaleUser"){       
            return res.status(401).json({              
                success:false,
                message:'This is a protected route for female only',
            });
        }
        next();
 }
 catch(error) {
    return res.status(500).json({
        success:false,
        message:'User role cannot be verified, please try again'
    })
 }
}

//isVolunteer
exports.isVolunteer = async (req, res, next) => {
    try{
           if(req.user.accountType !== "volunteer") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for Volunteer only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
   }

