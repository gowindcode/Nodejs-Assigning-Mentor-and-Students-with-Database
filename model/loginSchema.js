const mongoose = require("mongoose");

const mtLogin = mongoose.Schema(
  {
    mentorId: { type: Number, required: true },
    mentorEmail: { type: String, required: true },
    verified: { type: Boolean, required: true },
    role: {
      type: String,
      required: true,
      default: "mentor",
      enum: ["mentor", "admin"],
    },
  },
  { timestamps: true }
);

const stLogin = mongoose.Schema(
  {
    studentId: { type: Number, required: true },
    studentEmail: { type: String, required: true },
    verified: { type: Boolean, required: true },
    role: {
      type: String,
      required: true,
      default: "student",
      enum: ["student", "admin"],
    },
  },
  { timestamps: true }
);

const MentorLogin = mongoose.model("mentor-login", mtLogin);
const StudentLogin = mongoose.model("student-logins", stLogin);

module.exports = {
  MentorLogin: MentorLogin,
  StudentLogin: StudentLogin,
};
