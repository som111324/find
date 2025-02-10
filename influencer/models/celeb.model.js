const mongoose = require("mongoose");


const celebSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        unique: true,
        required: true,

    },
    password:{
        type: String,
        required: true,
        select: true
    },

    platforms: [
        { 
            platformName:{
        type: [String],
        required: true,
        enum: ["YouTube", "Instagram", "Twitter", "TikTok", "Facebook", "LinkedIn"]
            },
            followerCount: {
                type: Number,
                required:true,
                min: 0 
            },
            profileLink: {
                type: String,
                required: true,
                match:  /^https?:\/\/(www\.)?[a-zA-Z0-9-_.]+/
            },



    }
],
    description:{
        type: String,
        required: true,


    },









});
 
module.exports = mongoose.model("celeb", celebSchema );
