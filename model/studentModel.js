const mongoose = require("mongoose")

const studentSchema = mongoose.Schema(

    //signup
    {   
        studentId: {type: Number, required: true},
        studentName: {type: String, required: true},
        studentEmail: {type: String, required: true},
        studentPhone: {type: Number, required: true},
        batch: {type: String, required: true},
        timing: {type: String, required: true},
        course: {type: String, required: true},
        batchFS: {type: String, required: false, default: null},
        batchLS: {type: String, required: false, default: null}, 
        mentor: {type: String, required: true, default: null},
        newMentor: {type: String, required: false, default: null},
        verified: {type: Boolean, required: true},
        role: {type: String, required: true, default: "student", enum:["student", "admin"]}
    }, {timestamps: true}
  )

const StudentModel = mongoose.model("student", studentSchema);
module.exports = StudentModel

  //  batchFS: {type: String, required: true, default: null},
  //  batchLS: {type: String, required: true, default: null}, 
  //  mentor: {type: String, required: true, default: null},
  //  newMentor: {type: String, required: true, default: null},