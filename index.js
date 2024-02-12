const express = require("express");
const dotenv = require("dotenv");
dotenv.config()
const mongoose = require("mongoose");
const cors = require("cors");
const adminRoute = require("./routes/admin");
const mentorRoute = require("./routes/mentor");
const studentRoute = require("./routes/student");
// const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;
// const PORT = 5000;

app.use(express.json());
// app.use(express.static("public"));
app.use(express.static("public"));
app.use(cors());

//end point admin/ , /mentor, /student

app.use('/admin', adminRoute);
app.use('/mentor', mentorRoute);
app.use('/student', studentRoute);

//server home page, user can see the message "Welcome to Assigning mentor and student database portal."

app.get('/', (req, res) => {
    try{

        res.send( "Welcome to Assigning mentor👨‍⚖️ and student🧑 database portal.")

    } catch(error) {
      res.status(400).send({message: "Server is not --✖-- connected."})
    }
})

// for server start and connect

mongoose.connect(process.env.MONGO_URL)
.then(() => {

    console.log("Mongoose database connected successfully ✔.");
    app.listen( PORT, () => {
        console.log(`Server listening PORT:${PORT}`);
    })
})
.catch((error) => {
    console.log("Error to connect Mongoose Database:", error);
})







// -----------------------------------------------------------------------------------
// for local server connect PORT

// app.listen(PORT, () => {

//     try{
//         console.log(`Server is successfully listening at PORT: ${PORT}.`)
//     } catch (error) {
//         console.log("Server listening failed... Please check your network or restart code.")
//     }

// })