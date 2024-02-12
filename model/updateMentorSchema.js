const mongoose = require("mongoose");
const MentorModel = require("../model/mentorModel");

// studentData: {type: Array, required: true, default: null}

MentorModel.updateMany({}, {$set: {studentData: []}}, {maxtimeMS: 60000})
.then(result => {
    console.log("Schema reassembled successfully.", result);
})
.catch(err => {
    console.log("Schema update failed.", err);
});


// MentorModel.updateMany({}, {$set: {studentData: []}}, (err, result) => {
//     if(err) {
//         console.log("Error updating Schema.");
//     } else {
//         console.log("Schema reassembled successfully.", result);
//     }
// });
