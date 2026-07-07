const { string } = require("joi");
const mongoose = require("mongoose");

const hostRequestSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true

    },
    fullName:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    apartmentType:{
        type:String,
        enum:["Apartment","Villa","House","Room"],
        required:true
    },
    city:String,
    country:String,

    status:{
        type:String,
        enum:["pending","approved","rejected"],
        default:"pending"
    }
},{timestamps:true});

module.exports = mongoose.model("HostRequest",hostRequestSchema);