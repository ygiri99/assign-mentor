require('dotenv').config();
const express = require('express');
const db = require('./DB/dbConnection');
const router = require('./routes/mentorStudentRoute');

const app = express();
app.use(express.json());


db();
app.use(router);


const PORT = process.env.PORT || 8001;

app.listen(PORT, () => console.log('App is running at Port:', PORT));