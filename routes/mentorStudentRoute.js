const express = require('express');
const router = express.Router();
const { mentorModel, studentModel } = require('../models/mentorStudentModel.js');

//Creating mentors
router.post('/mentors/create', async (req, res) => {
    try {
        const newMentor = new mentorModel(req.body);

        //Checking mentor already exists or not
        const newEmail = newMentor.email;
        const mentorData = await mentorModel.findOne({ email: newEmail })
        if (mentorData) {
            return res.status(400).send({ message: 'Mentor already exists' });
        }

        //Creating new mentor
        const data = await newMentor.save();
        res.status(201).send({ message: `Mentor ${data} is added` });
    } catch (error) {
        console.log('Internal server error', error);
    }

})

//Creating students
router.post('/students/create', async (req, res) => {
    try {
        let newStudent = new studentModel(req.body);

        //Checking student already exists or not
        const newEmail = newStudent.email;
        let studentData = await studentModel.findOne({ email: newEmail });
        if (studentData) {
            return res.status(400).send({ message: 'student alredy exists' })
        }

        //Creating new student
        const data = await studentModel.create(req.body);
        res.status(201).send({ message: `Student ${data} is added` });

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error:", error });
    }
})


//Assigning student to a mentor
router.put('/mentors/:id', async (req, res) => {
    try {
        const reqMentorId = req.params.id;
        const reqStudentId = req.body;

        //Find student and mentor by ID
        const mentor = await mentorModel.findById(reqMentorId);
        const student = await studentModel.findById(reqStudentId);

        //Checking mentor and student exits or not
        if (!mentor || !student) {
            return res.status(404).send({ message: 'Student or Mentor not found' })
        }

        //Check if student already has a mentor
        if (student.mentorId.length) {
            return res.status(400).send({ message: 'Already Student currently has a mentor' })
        }

        //Assigning student to mentor
        const mentorStudents = mentor.studentsId;
        mentor.studentsId = [...mentorStudents, student._id];
        let data = await mentor.save();

        //Assigning mentor to student
        student.mentorId = mentor._id;
        data += await student.save();
        res.status(200).send({ message: 'Student assigned to mentor successfully', data });
    } catch (error) {
        res.status(500).send({ 'Internal Server Error:': error });
    }
})

//Assign or change a mentor to student
router.put('/students/:id', async (req, res) => {
    try {
        const reqStudentId = req.params.id;
        const reqMentorId = req.body;

        //Find student and mentor by ID
        const mentor = await mentorModel.findById(reqMentorId);
        const student = await studentModel.findById(reqStudentId);

        //Checking mentor and student exits or not
        if (!mentor || !student) {
            return res.status(404).send({ message: 'Student or Mentor not found' })
        }

        //Already has a mentor,check and change it to old mentor
        
        if (student.mentorId) {
            if (student.mentorId === mentor._id.toString()) {
                return res.status(400).send({ message: 'Already this mentor is the current mentor.' });
            }
            else {
                const oldmentors = student.oldMentorId;
                student.oldMentorId = [...oldmentors, student.mentorId];

                //Removing studentId from old mentor's students list
                const oldMentor = await mentorModel.findById(student.mentorId);
                const studentList = oldMentor.studentsId;
                const index = studentList.indexOf(reqStudentId);
                studentList.splice(index,1);
                oldMentor.studentsId = studentList;
                let old = await oldMentor.save();
            }
        }

      
        //Assigning student to mentor
        const mentorStudents = mentor.studentsId;
        mentor.studentsId = [...mentorStudents, student._id];
        let data = 'mentorData: '+await mentor.save();

        //Assigning the Mentor to Student
        student.mentorId = mentor._id;
        data += 'studentData: '+ await student.save();
        res.status(200).send({ message: 'Mentor assigned successfully', data });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error', error });
    }
})

//show all students for a particular mentor
router.get('/mentors/:id', async (req, res) => {
    try {
        const reqMentorId = req.params.id;

        //Find mentor by ID
        const mentor = await mentorModel.findById(reqMentorId);
        if (!mentor) {
            return res.status(404).send({ message: 'Mentor not found' });
        }

        //Getting students 
        const students = await studentModel.find({ mentorId: { $eq: reqMentorId } });
        students ? res.status(200).send(students) : res.status(400).send({ message: 'There is NO student is assigned for the mentor' });

    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error', error });
    }
})

// show the previously assigned mentor for a particular student.
router.get('/students/:id', async (req, res) => {
    try {
        const reqStudentId = req.params.id;
        const student = await studentModel.findById(reqStudentId);

        if (!student) {
            return res.status(404).send({ message: 'Student not found' });
        }

        //If no old mentors
        const oldMentorsId = student.oldMentorId;
        if (!oldMentorsId.length) {
            return res.status(400).send({ message: 'There is no Old mentors' });
        }

        //Shows old mentors details
        let oldMentors = [];
        for (let mentorID of oldMentorsId) {
            oldMentors.push(await mentorModel.findById(mentorID));
        }
        res.status(200).send({ message: 'Retrieved Old mentors', oldMentors });

    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error', error });
    }
})


module.exports = router;