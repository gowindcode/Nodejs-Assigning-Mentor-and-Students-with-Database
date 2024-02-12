Dear FSD Team, Please note for signup, login, update, create please use postman and body josn data.
data for signup we can get from studentData.json and mentorData.json and we can use new details.

And URL which is having id aat end point we can use it on browser or postman to get details enter id (student/mentor)

admin create single mentor = ✔
http://localhost:5000/admin/create-mentor

admin create single student = ✔
http://localhost:5000/admin/create-student

admin create bulk students at a time = ✔
http://localhost:5000/admin/create-students/bulk

admin update student data = ✔
http://localhost:5000/admin/student-update

admin update mentor data = ✔
http://localhost:5000/admin/mentor-update

admin get single mentor data using id = ✔
http://localhost:5000/admin/mentor/:id

admin get single student data using id = ✔
http://localhost:5000/admin/student/:id

admin get all mentors details from db  = ✔
http://localhost:5000/admin/all-mentors

admin get all students detalis from db  = ✔
http://localhost:5000/admin/all-students

admin delete student data by id = ✔
http://localhost:5000/admin/delete-student/:id

admin get mentor-not-assigned students data
http://localhost:5000/admin/students-not-having-mentor = ✔

admin assign mentor to students (batch wise mutiple students) = ✔
http://localhost:5000/admin/assign-batch

admin assign student or students to mentor and mentor to student (one student or multiple students using batch name) = ✔ 
http://localhost:5000/admin/assign-batch

admin get student previous mentor assigned details
http://localhost:5000/admin/previous-mentor/:id

admin put /update all students schema = ✔
http://localhost:5000/admin/update-student-schema

admin get all sudents details(if mentor assigned hide students data, only show, mentor not assign students) = ✔
http://localhost:5000/admin/all-students

admin reassign student batch
http://localhost:5000/admin/batch-reassign = ✔

-----------------------------------<><><><><><<<><>>><><><><><>------------------------------

mentor signup = ✔
http://localhost:5000/mentor/signup

mentor login = ✔
http://localhost:5000/mentor/login

mentor get student data (one to one) using student batch following student id & 
mentor get students data for his/her batch = ✔
http://localhost:5000/mentor/assigned-student-details/:id

-----------------------------------<><><><><><<<><>>><><><><><>------------------------------

student signup = ✔
http://localhost:5000/student/signup

student login = ✔
http://localhost:5000/student/login

student request for assign mentor (one to one)
http://localhost:5000/student/request

student get details by using his/her id (like mentor, batch, timing, course) = ✔
http://localhost:5000/student/status/:id

-----------------------------------<><><><><><<<><>>><><><><><>------------------------------


Mentor and Student Assigning with Database

TASK: 
1.	Write API to create Mentor = ✔  (admin can create or mentor can signup)
2.	Write API to create Student = ✔ (admin can create or student can signup)
3.	Write API to Assign a student to Mentor = ✔ (using student batch student assigned to mentor)
❏	Select one mentor and Add multiple Student = ✔ (using student batch students assigned to mentor, multiple students)
❏	A student who has a mentor should not be shown in List = ✔ (admin can get this details)
4.	Write API to Assign or Change Mentor for particular Student = ✔ (admin can make this changes, once request received from student, using batch)
❏	Select One Student and Assign one Mentor = ✔ (admin can assign one mentor for one student)
5.	Write API to show all students for a particular mentor = ✔  (admin can get all students details)
6.	Write an API to show the previously assigned mentor for a particular student. = ✔ (admin can get this details from student batch)

TASK DETAILS:
1.	How to write an API?
●	Create an Express server. = ✔
●	Create an endpoint and write your logic. = ✔
●	Use the API in the front-end for sending data and receiving data to/from the server. = ✔

2. Any specifications and constraints?
Back-End: Node Js = ✔
Database: MongoDB = ✔


Kindly note as per task requirements all end points created, and codes are in seperate files, 
so we can check all details in this file named "NODEJS-ASSIGNING-MENTOR-AND-STUDENTS-WITH-DATABASE".

in this folded we have seperate folders like model, routes, studentData.json and mentorData.json.

kindly note this is github repository link 
https://github.com/gowindcode/Nodejs-Assigning-Mentor-and-Students-with-Database.git

please note this is render deployed link 
https://assigning-mentor-and-students.onrender.com/