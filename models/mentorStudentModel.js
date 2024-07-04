const mongoose = require('mongoose');
const validator = require('validator');

//mentor model
const mentorSchema = new mongoose.Schema({
    name:{
        type:String,
        requred:true,
        trim: true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        validate:(value)=> validator.isEmail(value)
    },
    mobile:{
        type:String,
        trim:true,
        default:'000-000-0000'
    },
    course:{
        type:String,
        trim:true
    },
    studentsId:{
        type:Array,
        default:[]
    }
})

const mentorModel = mongoose.model('mentor',mentorSchema);

//student model
const studentSchema = new mongoose.Schema({
    name:{
        type:String,
        requred:true,
        trim: true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        validate:(value)=> validator.isEmail(value)
    },
    mobile:{
        type:String,
        trim:true,
        default:'000-000-0000'
    },
    course:{
        type:String,
        trim:true
    },
    mentorId:{
        type:String,
        default:''
    },
    oldMentorId:{
        type:Array,
        default:[]
    }
})

const studentModel = mongoose.model('students',studentSchema);

module.exports = {mentorModel,studentModel};