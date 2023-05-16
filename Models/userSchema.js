
import mongoose from "mongoose";
const Schema = mongoose.Schema;
//define the schema (the structure )
const  User = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true, 
        text: true, 
    },
    lastName: {
        type: String,
        required: true, 
       trim: true,
       text: true,
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        text: true,
        lowercase: true  
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        required: true,
        default: 'Super_Admin',
        enum: ['Super_Admin', 'Director', 'Administration Director', 'Administration Assistant', 'Human Ressources', 'Team Manager', 'Software Engineer']  
    },
    building: {
        type: [String],
        enum: ['Front-End', 'Back-End', 'Full-Stack'],
        required: true,
        default: null
    },
    phone: {
        type: String,
        required: true
    },
    avatar: {
         type: String,
         required: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    soldeDays : { 
        type: Number, 
        default: process.env.soldeDaysByMonth
    },
    allDaysOff : { 
        type: Number, 
        default: 0
    },
    daysOffSick : { 
        type: Number, 
        default: 0
    }

},{timestamps:true, versionKey: false});

const user = mongoose.model('users', User);
export default user;