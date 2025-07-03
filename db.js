require('dotenv').config();
const mongoose = require('mongoose');

const mongouri = process.env.MONGO_URI;

const contomongo = () => {
  mongoose.connect(mongouri)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));
};

module.exports = contomongo;