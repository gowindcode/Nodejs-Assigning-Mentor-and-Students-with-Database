const mongoose = require("mongoose")

const signupSchema = mongoose.Schema(

    //mentor signup
    {   
        mentorId: {type: Number, required: true},
        mentorName: {type: String, required: true},
        mentorEmail: {type: String, required: true},
        mentorPhone: {type: Number, required: true},
        batches: {type: Array, required: true},
        timing: {type: Array, required: true},
        course: {type: Array, required: true},
        studentData: {type: Array, required: true, default: null},
        verified: {type: Boolean, required: true},
        role: {type: String, required: true, default: "mentor", enum: ["mentor", "admin"]},
    },
  
    {timestamps: true}

    );

const MentorModel = mongoose.model("mentor", signupSchema);
module.exports = MentorModel;
