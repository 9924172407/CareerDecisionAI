const mongoose = require('mongoose');

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('Database connected...');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw new Error(error);
  }
};

connectToDatabase();

module.exports = mongoose.connection;
