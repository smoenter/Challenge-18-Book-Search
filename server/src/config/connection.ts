import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';
    console.log('Connecting to MongoDB with URI', MONGODB_URI);
    await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 60000, // Increase timeout to 60 seconds
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

export default connectDB;
