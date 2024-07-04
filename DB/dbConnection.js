const mongoose = require('mongoose');

const db = async() => {
    try {
        await mongoose.connect(process.env.MongoDB_URL);
        console.log('Server connected to DB');
    } catch (error) {
        console.log('Error while connecting DB',error);
    }
}

module.exports = db;