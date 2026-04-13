import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDatabase(): Promise<void> {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/orders';
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}
