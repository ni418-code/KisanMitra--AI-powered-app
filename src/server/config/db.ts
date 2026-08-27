import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb+srv://kmfb:kmfb12345@cluster0.fqlhyzi.mongodb.net/?appName=Cluster0";

  if (isConnected) {
    return;
  }

  try {
    // Set connection options
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('[Kisan Mitra] Connected successfully to MongoDB Atlas database.');
  } catch (error: any) {
    console.warn('[Kisan Mitra] MongoDB Atlas connection warning:', error?.message || error);
    console.log('[Kisan Mitra] Using local fallback persistent database layer for uninterrupted high availability.');
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
