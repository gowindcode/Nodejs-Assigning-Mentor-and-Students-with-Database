const express = require("express");
const StudentModel = require("../model/studentModel");
const MentorModel = require("../model/mentorModel");
const RequestModel = require("../model/requestModel");
const router = express.Router();

//create new mentor by admin (single admin) , here we don't need to create bulk mentors. so we have not used that logic

router.post("/create-mentor", async (req, res) => {
  try {
    console.log("create-mentor", req.body);

    const newMentor = new MentorModel({ ...req.body, verified: true });
    await newMentor.save();
    console.log("New mentor created successfull.");
    res.send({ message: "New mentor created successfull.", newMentor });
  } catch (error) {
    console.error("mentor create failed:", error);
    res.send({
      message: "mentor create failed, Please enter correct details.",
    });
  }
});

//create new student by admin only one student at a time (single student)

router.post("/create-student", async (req, res) => {
  try {
    console.log("create-mentor:", req.body);
    //check if student ID/Email/Phone already stored in database
    const existingStudent = await StudentModel.findOne({
      studentId: req.body.studentId,
      studentEmail: req.body.studentEmail,
      studentPhone: req.body.studentPhone,
    });
    if (existingStudent) {
      console.log(
        "Student ID/Email/Phone already in data list...Please use another ID/email/phone number..."
      );
      res.send({ message: "Student ID/Email/Phone already in data list." });
    } else {
      //create new student
      const newStudent = new StudentModel({ ...req.body, verified: true });
      await newStudent.save();
      res.send({ message: "Student data creted successfully.", newStudent });
    }
  } catch (error) {
    res.status(400).send({ message: "create new student failed.✖" });
  }
});

// Create bulk students at a single time by admin (multiple students),
//if student already exists, system not allowing to add

router.post("/create-students/bulk", async (req, res) => {
  try {
    console.log("create-students/bulk", req.body);

    const bulkStudents = [];

    // Iterate over each array of students in the request body
    for (const batch of req.body) {
      // Iterate over each student object in the batch
      for (const studentData of batch) {
        const existingStudent = await StudentModel.findOne({
          studentId: studentData.studentId,
          studentEmail: studentData.studentEmail,
          studentPhone: studentData.studentPhone,
        });

        if (existingStudent) {
          console.log("Student ID already used:", studentData.studentId);
          console.log("Student Email already used:", studentData.studentEmail);
          console.log(
            "Student Phone Number already used:",
            studentData.studentPhone
          );
          // Log a message when the student already exists
          console.log("Student data already added:", existingStudent);
        } else {
          const newStudent = new StudentModel({
            ...studentData,
            verified: true,
          });
          console.log(
            "Bulk student data upload request received from admin, please wait few seconds..."
          );
          await newStudent.save();
          console.log("Admin created student data successfully:");
          bulkStudents.push(newStudent); // This is only for added data details send to server
        }
      }
    }

    // Send success response
    res
      .status(200)
      .send({
        message: "Bunch of students data successfully uploaded by admin.",
        bulkStudents,
      });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

// admin can delete mentor data and student data from data base using id
//using  http://localhost:5000/admin/delete-student via postman
// router.post('/delete-student/:id', async (req, res) => {
//     try {
//         console.log("Delete attempt by admin:", req.body);

//         const deleteStudent = await StudentModel.findOneAndDelete({ studentId: req.params.id });

//         if (deleteStudent) {
//             console.log("Student data deleted successfully.");
//             console.log("Deleted details:", deleteStudent);
//             res.status(200).send({ message: "Student data deleted successfully.", deleteStudent });
//         } else {
//             console.log("Could not delete student data this time, try again!");
//             res.status(404).send({ message: "data not found" });
//         }
//     } catch (error) {
//         console.error("Process Failed");
//         res.status(500).send({ message: "server error" });
//     }
// });

//another method to delete student data by using student id http://localhost:5000/admin/delete-student/:id   via postman

router.delete("/delete-student/:id", async (req, res) => {
  try {
    const deleteStudent = await StudentModel.findOneAndDelete({
      studentId: req.params.id,
    });

    if (deleteStudent) {
      console.log("Student data deleted successfully.");
      console.log("Deleted details:", deleteStudent);
      res
        .status(200)
        .send({ message: "Student data deleted successfully.", deleteStudent });
    } else {
      console.log("Could not delete student data. Data not found.");
      res.status(404).send({ message: "Data not found" });
    }
  } catch (error) {
    console.error("Process Failed:", error);
    res.status(500).send({ message: "Server error" });
  }
});

//admin get all mentors data using  http://localhost:5000/admin/all-mentors
router.get("/all-mentors", async (req, res) => {
  try {
    const allMentors = await MentorModel.find(req.body);
    console.log("All mentors data successfully fetched from database.");

    const response = {
      message: "All mentor details fetched successfully.",
      totalMentors: allMentors.length,
      allMentors: allMentors,
    };
    res.status(200).send(response);
    console.log("Total mentors:", allMentors.length);
  } catch (error) {
    console.log("Server connection failed.✖");
    res.status(500).send({ message: "Servor error", error });
  }
});

// admin get mentor details by using his/her id http://localhost:5000/mentor/:id
router.get("/mentor/:id", async (req, res) => {
  try {
    const mentor = await MentorModel.findOne({ mentorId: req.params.id });
    if (mentor) {
      console.log("Mentor data successfully fetched from database.");
      res.status(200);
      res.send({ message: "Mentor details fetched successfully:", mentor });
    } else {
      console.log("Data not found.");
      res.status(404).send({ message: "Data not found." });
    }
  } catch (error) {
    console.log("Server connection failed.✖");
    res.status(500).send({ message: "Servor error", error });
  }
});

//admin get single student details by id using http://localhost:5000/admin/student/:id

router.get("/student/:id", async (req, res) => {
  try {
    const student = await StudentModel.findOne({ studentId: req.params.id });
    if (student) {
      console.log("Student details successfully fetched from database.");
      res.status(200);
      res.send({ message: "Student details fetched successfully:", student });
    } else {
      console.log("Data not found.");
      res.status(404).send({ message: "Data not found" });
    }
  } catch (error) {
    console.log("Server connection failed.✖");
    res.status(500).send({ message: "Servor error", error });
  }
});

//admin get all students data using  http://localhost:5000/admin/all-students
router.get("/all-students", async (req, res) => {
  try {
    const allStudents = await StudentModel.find(req.body);
    if (allStudents) {
      console.log("All students data successfully fetched from database.");
      const response = {
        message: "All mentor details fetched successfully.",
        totalStudents: allStudents.length,
        allStudents: allStudents,
      };
      res.status(200).send(response);
      console.log("Total mentors:", allStudents.length);
      //too many students, so we have tried to get details from server, it will take some time,
    } else {
      res.status(404).send({ message: "Data not found." });
    }
  } catch (error) {
    console.log("Server connection failed.✖");
    res.status(500).send({ message: "Servor error", error });
  }
});

//update all mentors details for structure schema using http://localhost:5000/admin/update-mentors
//admin can update the mentor schema => student data which meant students assigned for perticular mentor
router.put("/update-mentors", async (req, res) => {
  try {
    // Update all mentors with the updated studentData
    const result = await MentorModel.updateMany(
      {},
      { $set: { studentData: [] } }
    );

    if (result) {
      console.log("Mentor schema updated successfully.", result);
      res
        .status(200)
        .json({ message: "Mentor schema updated successfully.", result });
    } else {
      console.log("Failed to update mentor schema. Result:", result);
      res
        .status(400)
        .json({ message: "Failed to update mentor schema.", error });
    }
  } catch (error) {
    console.log("Server Error:", error);
    res.status(500).json({ message: "Server accessing failed/Error", error });
  }
});

//update students schema all student details for structure re-assembling
// http://localhost:5000/admin/update-student-schema
//admin can update the student schema => mentor which meant mentor assigned for perticular student
router.put("/update-student-schema", async (req, res) => {
  try {
    // Update all helps to insert schema for update mentor details, if supposed we need to add new data or schame we can use the below
    const result = await StudentModel.updateMany(
      {},
      {
        $set: {
          batchFS: null,
          batchLS: null,
          mentor: null,
          newMentor: null,
        },
      }
    );

    //if supposed we need to update new details in many students, this will help.
    // const result = await StudentModel.updateMany();

    if (result) {
      console.log("Students schema updated successfully.", result);
      res
        .status(200)
        .send({ message: "Students schema updated successfully.", result });
    } else {
      console.log("Failed to update students schema. Result:", result);
      res
        .status(400)
        .json({ message: "Failed to update students schema.", error });
    }
  } catch (error) {
    console.log("Server Error:", error);
    res.status(500).json({ message: "Server accessing failed/Error", error });
  }
});

//select one mentor add multiple students - works well
//assign one mentor to multiple students, match batch details wise.

// const MAX_CAPACITY_PER_MENTOR = process.env.MAX_CAPACITY_PER_MENTOR || 20;

// router.post('/assign-batch', async (req, res) => {
//     try {
//         console.log("Request to assign students to mentors received");

//         // const batch = "B51 WD1 ENGLISH";
//         const batch = req.body.batch;

//         // Find all students with the specified batch
//         const students = await StudentModel.find({ batch: batch });

//         // Find mentors with the specified batch
//         const mentors = await MentorModel.find({ batches: batch });

//         const addedStudents = [];

//         for (const student of students) {
//             // Check if the student already has a mentor assigned
//             if (!student.mentor) {
//                 for (const mentor of mentors) {
//                     // Check if the mentor has available slots for students
//                     if (mentor.studentData.length < MAX_CAPACITY_PER_MENTOR) {
//                         // Assign the mentor's name to the student
//                         student.mentor = mentor.mentorName;
//                         // Add the student to the mentor's studentData
//                         mentor.studentData.push(student);
//                         // Save changes for both student and mentor
//                         await Promise.all([student.save(), mentor.save()]);
//                         addedStudents.push(student);
//                         console.log("Student assigned to mentor successfully.", student);
//                         break; // Exit the loop after assigning a mentor to the student
//                     }
//                 }
//             }
//         }

//         if (addedStudents.length > 0) {
//             res.status(200).json({
//                 message: "Students assigned to mentors successfully",
//                 addedStudents: addedStudents
//             });
//         } else {
//             res.status(403).json({ message: "Students are already assigned to mentors." });
//         }
//     } catch (error) {
//         console.error("Error assigning students to mentors:", error);
//         res.status(500).json({ message: "Server Error" });
//     }
// });

const MAX_CAPACITY_PER_MENTOR = process.env.MAX_CAPACITY_PER_MENTOR || 20;

router.post("/assign-batch", async (req, res) => {
  try {
    console.log("Request to assign students to mentors received");

    const { batch } = req.body;

    if (!batch) {
      return res
        .status(400)
        .json({ message: "Batch name is required in the request body." });
    }

    // Find all students with the specified batch
    const students = await StudentModel.find({ batch: batch });

    // Find mentors with the specified batch
    const mentors = await MentorModel.find({ batches: batch });

    const addedStudents = [];

    for (const student of students) {
      // Check if the student already has a mentor assigned
      if (!student.mentor) {
        for (const mentor of mentors) {
          // Check if the mentor has available slots for students
          if (mentor.studentData.length < MAX_CAPACITY_PER_MENTOR) {
            // Assign the mentor's name to the student
            student.mentor = mentor.mentorName;
            // Add the student to the mentor's studentData
            mentor.studentData.push(student);
            // Save changes for both student and mentor
            await Promise.all([student.save(), mentor.save()]);
            addedStudents.push(student);
            console.log("Student assigned to mentor successfully.", student);
            break; // Exit the loop after assigning a mentor to the student
          }
        }
      }
    }

    if (addedStudents.length > 0) {
      res.status(200).json({
        message: "Students assigned to mentors successfully",
        addedStudents: addedStudents,
      });
    } else {
      res
        .status(403)
        .json({ message: "Students are already assigned to mentors." });
    }
  } catch (error) {
    console.error("Error assigning students to mentors:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//A student who has a mentor should not be shown in List

//Write an API to show the previously assigned mentor for a particular student. = ✔ (admin can get this details from student batch)
//using this method we need to get details, but input josn data must be placed in postman

//Using student id to find previous mentor
//http://localhost:5000/admin/previous-mentor/:id

router.get("/previous-mentor/:id", async (req, res) => {
  try {
    console.log("Previous mentor details request triggered:", req.body);

    const mentorDetails = await StudentModel.findOne({
      studentId: req.params.id,
    });

    if (mentorDetails) {
      if (
        mentorDetails.newMentor === null ||
        mentorDetails.newMentor === mentorDetails.mentor
      ) {
        console.log(
          "Student not changed batch/mentor. Present mentor is:",
          mentorDetails.mentor
        );
        res
          .status(200)
          .json({
            message: `Student not changed batch/mentor. Present mentor is: ${mentorDetails.mentor}`,
          });
      } else {
        const mentorDetailsName = mentorDetails.mentor;
        console.log("Previous mentor details:", mentorDetailsName);
        res.status(200).json({ previousMentorName: mentorDetailsName });
      }
    } else {
      console.log("No details found for the provided student ID.");
      res
        .status(404)
        .json({ message: "No details found for this student ID." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error.", error });
  }
});

// based on student request , admin change student batch

router.post("/batch-reassign", async (req, res) => {
  try {
    const { studentId, newBatchName } = req.body;

    if (!studentId || !newBatchName) {
      return res
        .status(400)
        .json({
          message:
            "Both studentId and newBatchName are required in the request body.",
        });
    }

    // Find the student by studentId
    const student = await StudentModel.findOne({ studentId });

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Keep the current mentor name
    const currentMentor = student.mentor;

    // Update batchFS to newBatchName
    student.batchFS = newBatchName;

    // Find a mentor associated with the new batch
    const newMentor = await MentorModel.findOne({ batches: newBatchName });

    if (newMentor) {
      student.newMentor = newMentor.mentorName;
    } else {
      // If no mentor is found for the new batch, set newMentor to null
      student.newMentor = null;
    }

    await student.save();

    res
      .status(200)
      .json({
        message: "Batch reassignment successful.",
        updatedStudent: student,
      });
  } catch (error) {
    console.error("Error reassigning batch:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//students not having mentor

router.get("/students-not-having-mentor", async (req, res) => {
  try {
    console.log("Request received to find students without mentor.");

    // Find students who do not have a mentor assigned
    const studentsWithoutMentors = await StudentModel.find({
      mentor: { $eq: null },
    });
    console.log(
      `Totally ${studentsWithoutMentors.length} students, not having mentor.`
    );

    const response = {
      message: "Students without mentor retrieved successfully",
      studentsWithoutMentorsTotal: studentsWithoutMentors.length,
      studentsWithoutMentors: studentsWithoutMentors,
    };
    res.status(200).json(response);
  } catch (error) {
    console.error("Error finding students without mentor:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// update student data like batch change, mentor change, timing change, http://localhost:5000/admin/student-update
// update student one student at a time
router.put("/student-update", async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      studentEmail,
      studentPhone,
      batch,
      timing,
      course,
    } = req.body;

    //this search can find particular student and update
    const updateStudent = await StudentModel.findOneAndUpdate(
      { studentId: studentId },
      { studentName, studentEmail, studentPhone, batch, timing, course },
      { new: true }
    );

    if (updateStudent) {
      console.log("Student data updated successfully.");
      console.log("Deleted details:", updateStudent);
      res
        .status(200)
        .send({ message: "Student data deleted successfully.", updateStudent });
    } else {
      console.log("Could not update student data. Data not found.");
      res.status(404).send({ message: "Data not found" });
    }
  } catch (error) {
    console.error("Process Failed:", error);
    res.status(500).send({ message: "Server error" });
  }
});

// update mentor data (single, we can update one mentor at  a time)
router.put("/mentor-update", async (req, res) => {
  try {
    const {
      mentorId,
      mentorName,
      mentorEmail,
      mentorPhone,
      batches,
      timing,
      course,
      studentData,
    } = req.body;

    //this search can find particular mentor and update
    const updateMentor = await MentorModel.findOneAndUpdate(
      { mentorId: mentorId },
      {
        mentorId,
        mentorName,
        mentorEmail,
        mentorPhone,
        batches,
        timing,
        course,
        studentData,
      },
      { new: true }
    );

    if (updateMentor) {
      console.log("Mentor data updated successfully.");
      console.log("Deleted details:", updateMentor);
      res
        .status(200)
        .send({ message: "Mentor data deleted successfully.", updateMentor });
    } else {
      console.log("Could not update mantor data. Data not found.");
      res.status(404).send({ message: "Data not found" });
    }
  } catch (error) {
    console.error("Process Failed:", error);
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;
