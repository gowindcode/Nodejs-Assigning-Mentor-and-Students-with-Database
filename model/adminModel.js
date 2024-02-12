const mongoose = require("mongoose");

// schema for admin to create mentor / stuent/ assign-mentor/assign-student

const adminSchema = mongoose.Schema(
  {
    mentorId: { type: Number, required: true },
    menterName: { type: String, required: true },
    mentorEmail: { type: String, required: true },
    mentorPhone: { type: Number, required: true },
    studentId: { type: Number, required: true },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    studentPhone: { type: Number, required: true },
    oneStudent: { type: Array, required: true },
    allStudents: { type: Array, required: true },
    allMentors: { type: Array, required: true },
    batches: { type: Array, required: true },
    timing: { type: String, required: true },
    courses: { type: Array, required: true },
  },
  { timestamps: true }
);

const adminModel = mongoose.model("admin", adminSchema);
module.exports = adminModel;
