const express = require("express");
const MentorModel = require("../model/mentorModel");
const { MentorLogin } = require("../model/loginSchema");
const StudentModel = require("../model/studentModel");
const router = express.Router();

// mentor signup = ✔
//and used conditions to avoid overwrite same admin in our database
//http://localhost:5000/mentor/signup

router.post("/signup", async (req, res) => {
  try {
    console.log("signup", req.body);
    const existingMentor = await MentorModel.findOne({
      $or: [
        { mentorId: req.body.mentorId },
        { mentorEmail: req.body.mentorEmail },
        { mentorPhone: req.body.mentorPhone },
      ],
    });

    if (existingMentor) {
      console.log("Mentor ID already used:", req.body.mentorId);
      console.log("Mentor Email already used:", req.body.mentorEmail);
      console.log("Mentor Phone Number already used:", req.body.mentorPhone);
      res.send({ message: "Mentor already exists." });
    } else {
      const newMentor = new MentorModel({ ...req.body, verified: true });
      console.log("Login request received, please wait we are validating...");
      await newMentor.save();
      console.log("Mentor signup successful.");
      res.send({ message: "Mentor Sign up successful.", newMentor });
    }
  } catch (error) {
    console.error("Signup failed:", error);
    res.send({ message: "Signup failed, Please enter correct details." });
    res.status(500).send({ message: "Server error", error });
  }
});

//mentor login = ✔
// mentor login , for task purpose we have not used local storage and passport, so for signup and login we have two different schema
//if the login data matches with signup data, like mentorId, mentorEmail , we receive the message successfull signup from server... if not error message with details
//this will get the login data's, how many times user logged.
//http://localhost:5000/mentor/login

router.post("/login", async (req, res) => {
  try {
    console.log("Login request body:", req.body);

    // Save the login details to the database
    const loginDetails = new MentorLogin({ ...req.body, verified: true });
    console.log("Login request received, please wait we are validating...");
    await loginDetails.save();

    // Get the mentor details from the database based on the provided mentor email
    const mentorDetails = await MentorModel.findOne({
      mentorEmail: req.body.mentorEmail,
      verified: true,
    });

    // Check if mentorDetails is found our records and mentor email matches with the login email condition check
    if (
      mentorDetails &&
      loginDetails.mentorEmail === mentorDetails.mentorEmail
    ) {
      console.log("Mentor found.");
      console.log("Mentor signup Email:", mentorDetails.mentorEmail);
      console.log("Mentor login Email:", loginDetails.mentorEmail);
      console.log("Email verification and login successful.");
      res.send({ message: "Mentor login successful", loginDetails });
    } else {
      console.log("Mentor not found or email does not match");
      res.send({ message: "Mentor Login failed", mentorDetails: null });
    }
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//mentor get students data for his/her batch = ✔
//id must be mentor id (in our project we have 9 mentors already in our db, if we need to add more mentor, please refer studentData.json)
// mentor  using his/her id to get assigned students details http://localhost:5000/mentor/assigned-student-details/:id
//we have reduced to show student details like name, batch, timing, course and number of students assigned in his/her batch.

router.get("/assigned-student-details/:id", async (req, res) => {
  try {
    const mentor = await MentorModel.findOne({ mentorId: req.params.id });

    if (mentor) {
      console.log("Mentor retrieved batch students details successfully.");

      // Destructure mentor object to get each student's name, batch, timing, course
      const studentDetails = mentor.studentData.map((student) => ({
        studentName: student.studentName,
        batch: student.batch,
        timing: student.timing,
        course: student.course,
      }));

      // Send response now
      res.status(200).json({
        message: "Student details fetched successfully:",
        studentDetails,
        totalStudents: studentDetails.length,
      });
    } else {
      console.log("Mentor not found.");
      res.status(404).json({ message: "Mentor not found." });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
