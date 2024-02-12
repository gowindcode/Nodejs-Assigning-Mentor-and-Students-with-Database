const express = require("express");
const router = express.Router();
const StudentModel = require("../model/studentModel");
const { StudentLogin } = require("../model/loginSchema");
const RequestModel = require("../model/requestModel");

//student create account via signup...  http://localhost:5000/student/signup
// one  at a time

router.post("/signup", async (req, res) => {
  try {
    console.log("signup", req.body);
    const existingStudent = await StudentModel.findOne(
      { studentId: req.body.studentId } && {
          studentEmail: req.body.studentEmail,
        } && { studentPhone: req.body.studentPhone }
    );

    if (existingStudent) {
      console.log("Student ID already used:", req.body.studentId);
      console.log("Student Email already used:", req.body.studentEmail);
      console.log("Student Phone Number already used:", req.body.studentPhone);
      res.send({ message: "Student already exists." });
    } else {
      const newStudent = new StudentModel({ ...req.body, verified: true });
      console.log("Login request received, please wait we are validating...");
      await newStudent.save();
      console.log("Student signup successful.");
      res.send({ message: "Student Sign up successful.", newStudent });
    }
  } catch (error) {
    console.error("Signup failed:", error);
    res.send({ message: "Signup failed, Please enter correct details." });
    res.status(500).send({ message: "Server error", error });
  }
});

//student login   via postman  http://localhost:5000/student/login

router.post("/login", async (req, res) => {
  try {
    console.log("Login request body:", req.body);

    // Save the login details to the database
    const loginDetails = new StudentLogin({ ...req.body, verified: true });
    console.log("Login request received, please wait we are validating...");
    await loginDetails.save();

    // Get the student details from the database based on the provided student email
    const studentDetails = await StudentModel.findOne({
      studentEmail: req.body.studentEmail,
      verified: true,
    });

    // Check if studentDetails is found our records and student email matches with the login email condition check
    if (
      studentDetails &&
      loginDetails.studentEmail === studentDetails.studentEmail
    ) {
      console.log("Student found.");
      console.log("Student signup Email:", studentDetails.studentEmail);
      console.log("Student login Email:", loginDetails.studentEmail);

      res.send({ message: "Student login successful", loginDetails });
    } else {
      console.log("Student not found or email does not match");
      res.send({ message: "Student Login failed", studentDetails: null });
    }
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//student can get details about his/her via id
//here for get details we have student used id
// http://localhost:5000/student/status/:id

router.get("/status/:id", async (req, res) => {
  try {
    console.log("Student status request triggered:", req.body);

    const studentDetails = await StudentModel.findOne({
      studentId: req.params.id,
    });

    if (studentDetails) {
      console.log("Student Details:", studentDetails);
      res
        .status(200)
        .send({
          message: "Student details:",
          id: studentDetails.studentId,
          name: studentDetails.studentName,
          email: studentDetails.studentEmail,
          phone: studentDetails.studentPhone,
          timing: studentDetails.timing,
          batch: studentDetails.batch,
          course: studentDetails.course,
        });
    } else {
      console.log("Status request Failed");
      res.status(400).send({ message: "Data not found", studentDetails });
    }
  } catch (error) {
    console.log("Server connection error.");
    res.status(500).json({ error: "Internal/External Server Error" });
  }
});

//request sent to admin to update or change timing, batch, course, like wise, this data stored in database for record purpose
//student can make many request, but admin have full and final authority for assign batch change, course, change, mentor change, timing change.

router.post("/request", async (req, res) => {
  try {
    console.log("Student request body:", req.body);

    // Save the request details to the database
    const requestDetails = new RequestModel({ ...req.body, verified: false });
    console.log("Request form received, please wait we are validating...");
    await requestDetails.save();

    // Get the student details from the database based on the provided student id
    const studentDetails = await StudentModel.findOne({
      studentId: req.body.studentId,
      batch: req.body.batch,
      mentor: req.body.mentor,
      verified: true,
    });

    if (studentDetails) {
      console.log("Student found.");
      console.log("Student Existing Id:", studentDetails.studentId);

      console.log("Student request Id:", requestDetails.studentId);
      console.log("Student present Batch request:", requestDetails.batch);
      console.log("Student present mentor:", requestDetails.mentor);

      if (
        requestDetails.studentId === studentDetails.studentId &&
        requestDetails.batch === studentDetails.batch &&
        requestDetails.mentor === studentDetails.mentor
      ) {
        console.log("Student request matches with student's records");

        await res
          .status(200)
          .send({
            message: "Student Request form successfully submitted",
            requestDetails,
          });
      } else {
        console.log("Student request does not match with student's records");
        await res
          .status(403)
          .send({
            message: "Student request does not match with student's records",
            studentDetails: null,
          });
      }
    } else {
      console.log("Student not found or details do not match in our records");
      await res
        .status(404)
        .send({ message: "Student request failed", studentDetails: null });
    }
  } catch (error) {
    console.error("Request form submission failed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
